import { calculateCoverCrop, ratioDimensions } from "./crop";
import type { AspectRatio } from "@/types";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível abrir esta imagem. Tente uma foto em JPEG, PNG ou WebP."));
    image.src = src;
  });
}

export async function composeUploadedPhoto(file: File, frameUrl: string | null, ratio: AspectRatio, zoom: number, offsetX: number, offsetY: number) {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const source = await loadImage(sourceUrl);
    const size = ratioDimensions(ratio, 3840);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Seu navegador não oferece suporte ao processamento da foto.");

    const base = calculateCoverCrop(source.naturalWidth, source.naturalHeight, size.width, size.height);
    const safeZoom = Math.min(3, Math.max(1, zoom));
    const cropWidth = base.sw / safeZoom;
    const cropHeight = base.sh / safeZoom;
    const travelX = Math.max(0, source.naturalWidth - cropWidth) / 2;
    const travelY = Math.max(0, source.naturalHeight - cropHeight) / 2;
    const centerX = source.naturalWidth / 2 - Math.max(-1, Math.min(1, offsetX)) * travelX;
    const centerY = source.naturalHeight / 2 - Math.max(-1, Math.min(1, offsetY)) * travelY;
    const sx = Math.max(0, Math.min(source.naturalWidth - cropWidth, centerX - cropWidth / 2));
    const sy = Math.max(0, Math.min(source.naturalHeight - cropHeight, centerY - cropHeight / 2));
    context.drawImage(source, sx, sy, cropWidth, cropHeight, 0, 0, size.width, size.height);

    if (frameUrl) {
      const frame = await loadImage(frameUrl);
      context.drawImage(frame, 0, 0, size.width, size.height);
    }

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
    if (!blob) throw new Error("Não foi possível gerar a fotografia.");
    if (blob.size > 12 * 1024 * 1024) throw new Error("A foto final ultrapassou 12 MB. Reduza o zoom ou escolha outra imagem.");
    return { blob, url: URL.createObjectURL(blob), width: size.width, height: size.height, highQuality: true as const };
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}
