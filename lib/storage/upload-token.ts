import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";

const payloadSchema = z.object({
  eventId: z.string().uuid(),
  frameId: z.string().uuid().nullable(),
  width: z.number().int().min(320).max(3840),
  height: z.number().int().min(320).max(3840),
  fileSize: z.number().int().min(1).max(12 * 1024 * 1024),
  mimeType: z.enum(["image/jpeg", "image/webp"]),
  storagePath: z.string().startsWith("r2:").max(1000),
  publicUrl: z.string().url().max(2000),
  expiresAt: z.number().int(),
});

export type PhotoUploadPayload = z.infer<typeof payloadSchema>;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!value) throw new Error("ADMIN_SESSION_SECRET não configurado.");
  return value;
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(`photo-upload:${value}`).digest("base64url");
}

export function signPhotoUpload(payload: PhotoUploadPayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signature(encoded)}`;
}

export function verifyPhotoUpload(token: string) {
  const [encoded, provided, extra] = token.split(".");
  if (!encoded || !provided || extra) return null;
  const expected = Buffer.from(signature(encoded));
  const actual = Buffer.from(provided);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const parsed = payloadSchema.safeParse(JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")));
    if (!parsed.success || parsed.data.expiresAt < Date.now()) return null;
    return parsed.data;
  } catch {
    return null;
  }
}
