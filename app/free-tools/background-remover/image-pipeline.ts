/**
 * Client-side image processing pipeline for in-browser background removal.
 * Handles downscaling protection (<= 4096px), HEIC conversion, 512x512 inference resizing,
 * high-res bilinear mask upscaling, edge softening, and PNG alpha compositing.
 */

export interface PreparedImage {
  sourceCanvas: HTMLCanvasElement;
  displayUrl: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  input512Rgb: Uint8ClampedArray;
}

/**
 * Converts HEIC/HEIF photos to a decodable Blob if browser cannot natively decode it.
 */
export async function normalizeImageFile(file: File): Promise<Blob> {
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name);

  if (!isHeic) {
    return file;
  }

  // Check if browser natively decodes HEIC (e.g. Safari)
  if (typeof createImageBitmap !== "undefined") {
    try {
      const testBitmap = await createImageBitmap(file);
      testBitmap.close();
      return file;
    } catch {
      // Native decode failed, fall back to heic2any
    }
  }

  try {
    const heic2any = (await import("heic2any")).default;
    const result = await heic2any({
      blob: file,
      toType: "image/png",
      quality: 1,
    });
    return Array.isArray(result) ? result[0] : result;
  } catch (err) {
    console.error("HEIC conversion failed:", err);
    throw new Error(
      "Unable to convert HEIC photo. Please convert to JPG/PNG or try another image."
    );
  }
}

/**
 * Loads image blob, caps dimension to 4096px to protect mobile Safari memory,
 * and extracts 512x512 input pixels for the neural network.
 */
export async function prepareImageForRemoval(blob: Blob): Promise<PreparedImage> {
  const objectUrl = URL.createObjectURL(blob);

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image format."));
    image.src = objectUrl;
  });

  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  // Maximum dimension cap: 4096px (protects phone memory and Safari canvas limit)
  const MAX_DIM = 4096;
  let targetW = origW;
  let targetH = origH;

  if (Math.max(origW, origH) > MAX_DIM) {
    const scale = MAX_DIM / Math.max(origW, origH);
    targetW = Math.round(origW * scale);
    targetH = Math.round(origH * scale);
  }

  // Draw capped full-resolution source canvas
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = targetW;
  sourceCanvas.height = targetH;
  const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sourceCtx) {
    throw new Error("Unable to create canvas context.");
  }
  sourceCtx.drawImage(img, 0, 0, targetW, targetH);

  // Resize down to 512x512 specifically for BiRefNet model input
  const canvas512 = document.createElement("canvas");
  canvas512.width = 512;
  canvas512.height = 512;
  const ctx512 = canvas512.getContext("2d", { willReadFrequently: true });
  if (!ctx512) {
    throw new Error("Unable to create 512x512 processing canvas.");
  }
  ctx512.drawImage(sourceCanvas, 0, 0, 512, 512);
  const input512Data = ctx512.getImageData(0, 0, 512, 512);

  // Free temporary 512 canvas
  canvas512.width = 0;
  canvas512.height = 0;

  return {
    sourceCanvas,
    displayUrl: objectUrl,
    width: targetW,
    height: targetH,
    originalWidth: origW,
    originalHeight: origH,
    input512Rgb: input512Data.data,
  };
}

/**
 * Takes the 512x512 float mask from the worker, smoothly upscales it to the original
 * image dimensions, applies edge softening to eliminate jaggies, and composites the alpha
 * channel onto the full-resolution source image.
 */
export async function applyMaskAndExportPng(
  sourceCanvas: HTMLCanvasElement,
  maskBuffer: ArrayBuffer
): Promise<{ blob: Blob; url: string }> {
  const targetW = sourceCanvas.width;
  const targetH = sourceCanvas.height;

  // 1. Create 512x512 canvas from the predicted mask
  const maskCanvas512 = document.createElement("canvas");
  maskCanvas512.width = 512;
  maskCanvas512.height = 512;
  const maskCtx512 = maskCanvas512.getContext("2d");
  if (!maskCtx512) throw new Error("Canvas context creation failed.");

  const maskImgData512 = maskCtx512.createImageData(512, 512);
  const maskFloats = new Float32Array(maskBuffer);

  for (let i = 0; i < 512 * 512; i++) {
    const alphaVal = Math.round(maskFloats[i] * 255);
    const pixelIndex = i * 4;
    maskImgData512.data[pixelIndex] = 255;
    maskImgData512.data[pixelIndex + 1] = 255;
    maskImgData512.data[pixelIndex + 2] = 255;
    maskImgData512.data[pixelIndex + 3] = alphaVal;
  }
  maskCtx512.putImageData(maskImgData512, 0, 0);

  // 2. Upscale mask smoothly to target dimensions via bilinear interpolation
  const maskCanvasFull = document.createElement("canvas");
  maskCanvasFull.width = targetW;
  maskCanvasFull.height = targetH;
  const maskCtxFull = maskCanvasFull.getContext("2d", { willReadFrequently: true });
  if (!maskCtxFull) throw new Error("Full mask context creation failed.");

  maskCtxFull.imageSmoothingEnabled = true;
  maskCtxFull.imageSmoothingQuality = "high";
  maskCtxFull.drawImage(maskCanvas512, 0, 0, targetW, targetH);

  // 3. Extract upscaled alpha mask data
  const upscaledMaskData = maskCtxFull.getImageData(0, 0, targetW, targetH).data;

  // Free intermediate 512 canvas
  maskCanvas512.width = 0;
  maskCanvas512.height = 0;

  // 4. Retrieve full-resolution original image pixels
  const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sourceCtx) throw new Error("Source context unavailable.");
  const origData = sourceCtx.getImageData(0, 0, targetW, targetH);

  const totalPixels = targetW * targetH;
  const rawAlpha = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    rawAlpha[i] = upscaledMaskData[i * 4 + 3];
  }

  // Free upscaled mask canvas
  maskCanvasFull.width = 0;
  maskCanvasFull.height = 0;

  // 5. Edge softening pass on transitional pixels to avoid harsh stair-stepping
  const finalAlpha = new Uint8Array(totalPixels);
  for (let y = 0; y < targetH; y++) {
    const rowOffset = y * targetW;
    for (let x = 0; x < targetW; x++) {
      const idx = rowOffset + x;
      const a = rawAlpha[idx];

      // Definite background
      if (a <= 4) {
        finalAlpha[idx] = 0;
      }
      // Definite foreground
      else if (a >= 251) {
        finalAlpha[idx] = 255;
      }
      // Edge transition zone: apply 4-neighborhood antialiasing smoothing
      else {
        let sum = a * 2;
        let count = 2;
        if (x > 0) {
          sum += rawAlpha[idx - 1];
          count++;
        }
        if (x < targetW - 1) {
          sum += rawAlpha[idx + 1];
          count++;
        }
        if (y > 0) {
          sum += rawAlpha[idx - targetW];
          count++;
        }
        if (y < targetH - 1) {
          sum += rawAlpha[idx + targetW];
          count++;
        }
        finalAlpha[idx] = Math.round(sum / count);
      }
    }
  }

  // 6. Inject the refined alpha channel into original full-resolution ImageData
  for (let i = 0; i < totalPixels; i++) {
    origData.data[i * 4 + 3] = finalAlpha[i];
  }

  // 7. Render result and export transparent PNG Blob
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = targetW;
  exportCanvas.height = targetH;
  const exportCtx = exportCanvas.getContext("2d");
  if (!exportCtx) throw new Error("Export canvas unavailable.");
  exportCtx.putImageData(origData, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    exportCanvas.toBlob((b) => {
      if (b) {
        resolve(b);
      } else {
        reject(
          new Error(
            "iOS Safari memory limit reached during export. Please try a smaller photo."
          )
        );
      }
    }, "image/png");
  });

  // Free export canvas
  exportCanvas.width = 0;
  exportCanvas.height = 0;

  const url = URL.createObjectURL(blob);
  return { blob, url };
}
