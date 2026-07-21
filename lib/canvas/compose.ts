import { calculateCoverCrop, ratioDimensions } from "./crop";
import type { AspectRatio } from "@/types";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar a moldura."));
    image.src = src;
  });
}

export async function composePhoto(video: HTMLVideoElement, frameUrl: string | null, ratio: AspectRatio, mirrored: boolean) {
  const size = ratioDimensions(ratio);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Seu navegador não oferece suporte ao processamento da foto.");
  const crop = calculateCoverCrop(video.videoWidth, video.videoHeight, size.width, size.height);
  context.save();
  if (mirrored) { context.translate(size.width, 0); context.scale(-1, 1); }
  context.drawImage(video, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, size.width, size.height);
  context.restore();
  if (frameUrl) {
    const frame = await loadImage(frameUrl);
    context.drawImage(frame, 0, 0, size.width, size.height);
  }
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  if (!blob) throw new Error("Não foi possível gerar a fotografia.");
  return { blob, url: URL.createObjectURL(blob), width: size.width, height: size.height };
}
