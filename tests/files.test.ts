import { describe, expect, it } from "vitest";
import { photoFilename } from "@/lib/files";
describe("nome do arquivo", () => { it("inclui data e identificador", () => { expect(photoFilename(new Date("2026-07-28T12:00:00Z"), "a8f31c")).toBe("aniversario-gelo-2026-07-28-a8f31c.jpg"); }); });
