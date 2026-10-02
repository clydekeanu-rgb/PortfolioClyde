/// <reference lib="webworker" />

import { AutoModel, Tensor, env } from "@huggingface/transformers";

declare const self: DedicatedWorkerGlobalScope;

// Pin exact model and commit SHA verified with MIT license
const MODEL_ID = "studioludens/birefnet-lite-512";
const REVISION = "4a3c40c36c94093cc1e724d9ea428b8fa4b57dc7";

// Force remote fetch from HF Hub and avoid local filesystem calls
env.allowLocalModels = false;

// Standardize single thread in WASM to guarantee compatibility across devices
// without requiring cross-origin isolation (SharedArrayBuffer) headers
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.numThreads = 1;
}

let modelInstance: any = null;
let currentDevice: "webgpu" | "wasm" = "webgpu";
let currentDtype: "fp16" | "fp32" = "fp16";

async function loadModel(
  device: "webgpu" | "wasm" = "webgpu",
  dtype: "fp16" | "fp32" = "fp16"
) {
  self.postMessage({
    type: "STATUS",
    status: `Loading model weights (${device.toUpperCase()}, ${dtype})...`,
  });

  return await AutoModel.from_pretrained(MODEL_ID, {
    revision: REVISION,
    dtype,
    device,
    progress_callback: (data: any) => {
      if (data.status === "progress") {
        self.postMessage({
          type: "PROGRESS",
          progress:
            typeof data.progress === "number"
              ? Math.round(data.progress)
              : undefined,
          loaded: data.loaded,
          total: data.total,
          file: data.file,
        });
      }
    },
  });
}

async function getOrInitModel() {
  if (modelInstance) {
    return modelInstance;
  }

  // Attempt 1: WebGPU fp16 (fastest, smallest memory footprint)
  try {
    currentDevice = "webgpu";
    currentDtype = "fp16";
    modelInstance = await loadModel("webgpu", "fp16");
    return modelInstance;
  } catch (gpuError) {
    console.warn("WebGPU (fp16) failed to initialize, trying WASM (fp16)...", gpuError);
  }

  // Attempt 2: WASM fp16
  try {
    currentDevice = "wasm";
    currentDtype = "fp16";
    modelInstance = await loadModel("wasm", "fp16");
    return modelInstance;
  } catch (wasmFp16Error) {
    console.warn("WASM (fp16) failed to initialize, trying WASM (fp32)...", wasmFp16Error);
  }

  // Attempt 3: WASM fp32 (universal fallback)
  try {
    currentDevice = "wasm";
    currentDtype = "fp32";
    modelInstance = await loadModel("wasm", "fp32");
    return modelInstance;
  } catch (wasmFp32Error) {
    console.error("All in-browser inference backends failed:", wasmFp32Error);
    throw new Error(
      "Your device cannot run this AI model in-browser due to memory or WebAssembly constraints."
    );
  }
}

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === "LOAD_MODEL") {
    try {
      await getOrInitModel();
      self.postMessage({
        type: "MODEL_READY",
        device: currentDevice,
        dtype: currentDtype,
      });
    } catch (err: any) {
      self.postMessage({
        type: "ERROR",
        message: err?.message || "Failed to initialize AI model.",
      });
    }
    return;
  }

  if (type === "PROCESS") {
    try {
      const model = await getOrInitModel();

      self.postMessage({
        type: "STATUS",
        status: "Processing image...",
      });

      const { rgbBuffer } = payload;
      const rgbData = new Uint8ClampedArray(rgbBuffer);

      const numPixels = 512 * 512;
      const floatData = new Float32Array(3 * numPixels);
      const mean = [0.485, 0.456, 0.406];
      const std = [0.229, 0.224, 0.225];

      // Format input as NCHW with ImageNet normalization
      for (let i = 0; i < numPixels; i++) {
        const r = rgbData[i * 4] / 255.0;
        const g = rgbData[i * 4 + 1] / 255.0;
        const b = rgbData[i * 4 + 2] / 255.0;

        floatData[i] = (r - mean[0]) / std[0];
        floatData[numPixels + i] = (g - mean[1]) / std[1];
        floatData[2 * numPixels + i] = (b - mean[2]) / std[2];
      }

      const inputTensor = new Tensor("float32", floatData, [1, 3, 512, 512]);

      let output: any;
      try {
        output = await model({ input_image: inputTensor });
      } catch (inferErr) {
        if (currentDevice === "webgpu") {
          console.warn("WebGPU inference failed, retrying on WASM fallback...", inferErr);
          currentDevice = "wasm";
          modelInstance = await loadModel("wasm", currentDtype);
          output = await modelInstance({ input_image: inputTensor });
        } else {
          throw inferErr;
        }
      }

      const logits =
        output.logits || output.output || Object.values(output)[0];
      const logitsData = logits.data as Float32Array;

      // Apply numerically stable sigmoid
      const mask = new Float32Array(numPixels);
      for (let i = 0; i < numPixels; i++) {
        const val = logitsData[i];
        if (val >= 0) {
          const z = Math.exp(-val);
          mask[i] = 1 / (1 + z);
        } else {
          const z = Math.exp(val);
          mask[i] = z / (1 + z);
        }
      }

      // Transfer the mask buffer back with zero copy
      self.postMessage(
        {
          type: "PROCESS_COMPLETE",
          maskBuffer: mask.buffer,
          device: currentDevice,
          dtype: currentDtype,
        },
        [mask.buffer]
      );
    } catch (err: any) {
      console.error("Worker processing error:", err);
      self.postMessage({
        type: "ERROR",
        message: err?.message || "An error occurred during background removal.",
      });
    }
  }
};
