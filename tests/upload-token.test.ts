import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { signPhotoUpload, verifyPhotoUpload, type PhotoUploadPayload } from "@/lib/storage/upload-token";

const originalSecret = process.env.ADMIN_SESSION_SECRET;
const payload: PhotoUploadPayload = {
  eventId: "00000000-0000-4000-8000-000000000001",
  frameId: null,
  width: 2160,
  height: 3840,
  fileSize: 2_000_000,
  mimeType: "image/jpeg",
  storagePath: "r2:event/photos/photo.jpg",
  publicUrl: "https://example.r2.dev/event/photos/photo.jpg",
  expiresAt: Date.now() + 60_000,
};

describe("token temporário de upload", () => {
  beforeEach(() => { process.env.ADMIN_SESSION_SECRET = "segredo-de-teste-comprido"; });
  afterEach(() => {
    if (originalSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = originalSecret;
  });

  it("aceita um token íntegro", () => {
    expect(verifyPhotoUpload(signPhotoUpload(payload))).toEqual(payload);
  });

  it("rejeita adulteração", () => {
    const token = signPhotoUpload(payload);
    expect(verifyPhotoUpload(`${token.slice(0, -1)}x`)).toBeNull();
  });

  it("rejeita token expirado", () => {
    const token = signPhotoUpload({ ...payload, expiresAt: Date.now() - 1 });
    expect(verifyPhotoUpload(token)).toBeNull();
  });
});
