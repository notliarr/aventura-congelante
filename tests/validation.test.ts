import { describe, expect, it } from "vitest";
import { photoMetadataSchema, validateImageFile } from "@/lib/validation";

describe("validação de imagens", () => {
  it("aceita JPEG de foto", () => expect(validateImageFile({ type: "image/jpeg", size: 2000 }).valid).toBe(true));
  it("rejeita SVG", () => expect(validateImageFile({ type: "image/svg+xml", size: 2000 }).valid).toBe(false));
  it("aceita somente PNG em molduras", () => expect(validateImageFile({ type: "image/png", size: 2000 }, "frame").valid).toBe(true));
});

describe("metadados da foto", () => {
  it("aceita foto sem moldura", () => {
    const result = photoMetadataSchema.safeParse({
      eventId: "00000000-0000-4000-8000-000000000001",
      width: 1215,
      height: 2160,
    });
    expect(result.success).toBe(true);
  });

  it("aceita upload vertical em alta qualidade", () => {
    const result = photoMetadataSchema.safeParse({
      eventId: "00000000-0000-4000-8000-000000000001",
      width: 2160,
      height: 3840,
    });
    expect(result.success).toBe(true);
  });
});
