import { describe, expect, it } from "vitest";
import { isR2StoragePath } from "@/lib/storage/r2";

describe("identificação do armazenamento das fotos", () => {
  it("reconhece caminhos do R2", () => {
    expect(isR2StoragePath("r2:evento/photos/foto.jpg")).toBe(true);
  });

  it("mantém caminhos antigos do Supabase", () => {
    expect(isR2StoragePath("evento/foto.jpg")).toBe(false);
  });
});
