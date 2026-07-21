import { describe, expect, it } from "vitest";
import { getShareStrategy } from "@/lib/share";
describe("compartilhamento", () => { it("usa menu nativo com arquivos", () => expect(getShareStrategy({ share: true, canShareFiles: true })).toBe("native")); it("faz download sem suporte", () => expect(getShareStrategy({ share: false })).toBe("download")); it("faz download se arquivo não puder ser compartilhado", () => expect(getShareStrategy({ share: true, canShareFiles: false })).toBe("download")); });
