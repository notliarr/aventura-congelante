import { describe, expect, it } from "vitest";
import { validateImageFile } from "@/lib/validation";
describe("validação de imagens", () => { it("aceita JPEG de foto", () => expect(validateImageFile({ type: "image/jpeg", size: 2000 }).valid).toBe(true)); it("rejeita SVG", () => expect(validateImageFile({ type: "image/svg+xml", size: 2000 }).valid).toBe(false)); it("aceita somente PNG em molduras", () => expect(validateImageFile({ type: "image/png", size: 2000 }, "frame").valid).toBe(true)); });
