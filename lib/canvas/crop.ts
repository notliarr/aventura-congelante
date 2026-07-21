export interface CoverCrop { sx: number; sy: number; sw: number; sh: number }

export function calculateCoverCrop(sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number): CoverCrop {
  if ([sourceWidth, sourceHeight, targetWidth, targetHeight].some((value) => value <= 0)) throw new Error("As dimensões devem ser positivas.");
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;
  if (sourceRatio > targetRatio) {
    const sw = sourceHeight * targetRatio;
    return { sx: (sourceWidth - sw) / 2, sy: 0, sw, sh: sourceHeight };
  }
  const sh = sourceWidth / targetRatio;
  return { sx: 0, sy: (sourceHeight - sh) / 2, sw: sourceWidth, sh };
}

export function ratioDimensions(ratio: "4:5" | "1:1" | "9:16", maxSide = 2160) {
  const [w, h] = ratio.split(":").map(Number);
  return w >= h ? { width: maxSide, height: Math.round(maxSide * h / w) } : { width: Math.round(maxSide * w / h), height: maxSide };
}
