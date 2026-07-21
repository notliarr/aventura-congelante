import { z } from "zod";

export const MAX_PHOTO_SIZE = 12 * 1024 * 1024;
export const MAX_FRAME_SIZE = 8 * 1024 * 1024;

export const photoMetadataSchema = z.object({
  eventId: z.string().uuid(),
  frameId: z.string().uuid().optional(),
  width: z.coerce.number().int().min(320).max(2160),
  height: z.coerce.number().int().min(320).max(2160)
});

export const settingsSchema = z.object({
  birthdayPersonName: z.string().trim().min(1).max(80),
  age: z.coerce.number().int().min(1).max(120),
  welcomeMessage: z.string().trim().min(10).max(500),
  coverImageUrl: z.string().trim().max(1000),
  galleryEnabled: z.boolean(),
  galleryModerationEnabled: z.boolean()
});

export function validateImageFile(file: Pick<File, "type" | "size">, kind: "photo" | "frame" = "photo") {
  const allowed = kind === "frame" ? ["image/png"] : ["image/jpeg", "image/webp"];
  const max = kind === "frame" ? MAX_FRAME_SIZE : MAX_PHOTO_SIZE;
  return { valid: allowed.includes(file.type) && file.size > 0 && file.size <= max, reason: !allowed.includes(file.type) ? "Formato de imagem não permitido." : file.size > max ? "O arquivo excede o limite permitido." : "Arquivo vazio." };
}
