/**
 * QR Code Frame Compositor
 * Combines rendered QR canvas with customizable frames, labels, and borders.
 */

export type FramePreset =
  | "none"
  | "border"
  | "rounded"
  | "badge-bottom"
  | "badge-top";

export interface FrameOptions {
  preset: FramePreset;
  text: string;
  frameColor: string;
  textColor: string;
  backgroundColor: string;
  transparentBg: boolean;
}

export const INITIAL_FRAME_OPTIONS: FrameOptions = {
  preset: "none",
  text: "SCAN ME",
  frameColor: "#15171c",
  textColor: "#eceef2",
  backgroundColor: "#0e0f12",
  transparentBg: false,
};

/**
 * Composites the rendered QR code canvas into a framed design at full output resolution.
 */
export async function compositeFramedQr(
  qrCanvas: HTMLCanvasElement,
  frameOptions: FrameOptions,
  targetSize: number
): Promise<HTMLCanvasElement> {
  const { preset, text, frameColor, textColor, backgroundColor, transparentBg } =
    frameOptions;

  if (preset === "none") {
    // Return standard canvas resized to targetSize
    const outCanvas = document.createElement("canvas");
    outCanvas.width = targetSize;
    outCanvas.height = targetSize;
    const ctx = outCanvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(qrCanvas, 0, 0, targetSize, targetSize);
    return outCanvas;
  }

  const outCanvas = document.createElement("canvas");
  const ctx = outCanvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const padding = Math.round(targetSize * 0.08);

  if (preset === "border") {
    const totalW = targetSize + padding * 2;
    const totalH = targetSize + padding * 2;
    outCanvas.width = totalW;
    outCanvas.height = totalH;

    // Background
    if (!transparentBg) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, totalW, totalH);
    }

    // Border
    const borderWidth = Math.max(2, Math.round(targetSize * 0.015));
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = frameColor;
    ctx.strokeRect(
      borderWidth / 2,
      borderWidth / 2,
      totalW - borderWidth,
      totalH - borderWidth
    );

    // QR Code
    ctx.drawImage(qrCanvas, padding, padding, targetSize, targetSize);
    return outCanvas;
  }

  if (preset === "rounded") {
    const totalW = targetSize + padding * 2;
    const totalH = targetSize + padding * 2;
    outCanvas.width = totalW;
    outCanvas.height = totalH;

    const cornerRadius = Math.round(targetSize * 0.06);

    // Rounded background card
    if (!transparentBg) {
      ctx.fillStyle = backgroundColor;
      roundRect(ctx, 0, 0, totalW, totalH, cornerRadius);
      ctx.fill();
    }

    // Border
    const borderWidth = Math.max(2, Math.round(targetSize * 0.015));
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = frameColor;
    roundRect(
      ctx,
      borderWidth / 2,
      borderWidth / 2,
      totalW - borderWidth,
      totalH - borderWidth,
      cornerRadius
    );
    ctx.stroke();

    // QR Code
    ctx.drawImage(qrCanvas, padding, padding, targetSize, targetSize);
    return outCanvas;
  }

  if (preset === "badge-bottom") {
    const badgeHeight = Math.round(targetSize * 0.16);
    const totalW = targetSize + padding * 2;
    const totalH = targetSize + padding * 2 + badgeHeight;
    outCanvas.width = totalW;
    outCanvas.height = totalH;

    const cornerRadius = Math.round(targetSize * 0.06);

    // Background Card
    if (!transparentBg) {
      ctx.fillStyle = backgroundColor;
      roundRect(ctx, 0, 0, totalW, totalH, cornerRadius);
      ctx.fill();
    }

    // Outer border
    const borderWidth = Math.max(2, Math.round(targetSize * 0.015));
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = frameColor;
    roundRect(
      ctx,
      borderWidth / 2,
      borderWidth / 2,
      totalW - borderWidth,
      totalH - borderWidth,
      cornerRadius
    );
    ctx.stroke();

    // Draw QR Code
    ctx.drawImage(qrCanvas, padding, padding, targetSize, targetSize);

    // Draw Badge at bottom
    if (text) {
      const badgeY = targetSize + padding + Math.round(badgeHeight * 0.15);
      const pillW = totalW - padding * 2;
      const pillH = badgeHeight * 0.7;
      const pillRadius = Math.round(pillH / 2);

      ctx.fillStyle = frameColor;
      roundRect(ctx, padding, badgeY, pillW, pillH, pillRadius);
      ctx.fill();

      // Text
      const fontSize = Math.round(badgeHeight * 0.38);
      ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text.toUpperCase(), totalW / 2, badgeY + pillH / 2);
    }

    return outCanvas;
  }

  if (preset === "badge-top") {
    const badgeHeight = Math.round(targetSize * 0.16);
    const totalW = targetSize + padding * 2;
    const totalH = targetSize + padding * 2 + badgeHeight;
    outCanvas.width = totalW;
    outCanvas.height = totalH;

    const cornerRadius = Math.round(targetSize * 0.06);

    // Background Card
    if (!transparentBg) {
      ctx.fillStyle = backgroundColor;
      roundRect(ctx, 0, 0, totalW, totalH, cornerRadius);
      ctx.fill();
    }

    // Outer border
    const borderWidth = Math.max(2, Math.round(targetSize * 0.015));
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = frameColor;
    roundRect(
      ctx,
      borderWidth / 2,
      borderWidth / 2,
      totalW - borderWidth,
      totalH - borderWidth,
      cornerRadius
    );
    ctx.stroke();

    // Draw Badge at top
    if (text) {
      const badgeY = padding + Math.round(badgeHeight * 0.15);
      const pillW = totalW - padding * 2;
      const pillH = badgeHeight * 0.7;
      const pillRadius = Math.round(pillH / 2);

      ctx.fillStyle = frameColor;
      roundRect(ctx, padding, badgeY, pillW, pillH, pillRadius);
      ctx.fill();

      // Text
      const fontSize = Math.round(badgeHeight * 0.38);
      ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text.toUpperCase(), totalW / 2, badgeY + pillH / 2);
    }

    // Draw QR Code below badge
    ctx.drawImage(
      qrCanvas,
      padding,
      padding + badgeHeight,
      targetSize,
      targetSize
    );

    return outCanvas;
  }

  return qrCanvas;
}

/**
 * Draws rounded rectangle path on canvas 2D context
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
