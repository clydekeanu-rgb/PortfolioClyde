/**
 * Contrast & Luminance Analysis for QR Scannability
 * Follows WCAG 2.1 relative luminance and contrast ratio guidelines.
 */

export function hexToRgb(hex: string): [number, number, number] | null {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (cleanHex.length !== 6) return null;

  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return null;

  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return [r, g, b];
}

export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrastRatio(fgHex: string, bgHex: string): number {
  const fgRgb = hexToRgb(fgHex) || [0, 0, 0];
  const bgRgb = hexToRgb(bgHex) || [255, 255, 255];

  const l1 = getRelativeLuminance(...fgRgb);
  const l2 = getRelativeLuminance(...bgRgb);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function isColorInverted(fgHex: string, bgHex: string): boolean {
  const fgRgb = hexToRgb(fgHex) || [0, 0, 0];
  const bgRgb = hexToRgb(bgHex) || [255, 255, 255];

  const lFg = getRelativeLuminance(...fgRgb);
  const lBg = getRelativeLuminance(...bgRgb);

  // Foreground is lighter than background
  return lFg > lBg;
}

export interface ContrastAudit {
  ratio: number;
  isInverted: boolean;
  isSufficient: boolean;
  warning?: string;
}

export function auditColors(fgHex: string, bgHex: string, transparentBg: boolean): ContrastAudit {
  const effectiveBg = transparentBg ? "#ffffff" : bgHex;
  const ratio = calculateContrastRatio(fgHex, effectiveBg);
  const isInverted = isColorInverted(fgHex, effectiveBg);

  let warning: string | undefined;

  if (isInverted) {
    warning = "Inverted colors (light code on dark background) often fail on standard smartphone cameras.";
  } else if (ratio < 3.0) {
    warning = `Low contrast (${ratio.toFixed(1)}:1). Smartphone cameras require high contrast to scan reliably.`;
  } else if (ratio < 4.5) {
    warning = `Moderate contrast (${ratio.toFixed(1)}:1). Recommended minimum is 4.5:1 for optimal scanning in dim lighting.`;
  }

  return {
    ratio,
    isInverted,
    isSufficient: ratio >= 3.5 && !isInverted,
    warning,
  };
}
