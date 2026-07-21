import { describe, expect, it } from "vitest";
import { describeR2Error, isR2StoragePath } from "@/lib/storage/r2";

describe("identificação do armazenamento das fotos", () => {
  it("reconhece caminhos do R2", () => {
    expect(isR2StoragePath("r2:evento/photos/foto.jpg")).toBe(true);
  });

  it("mantém caminhos antigos do Supabase", () => {
    expect(isR2StoragePath("evento/foto.jpg")).toBe(false);
  });
});

describe("diagnóstico seguro do R2", () => {
  it("explica credencial inválida sem revelar valores", () => {
    expect(describeR2Error({ name: "SignatureDoesNotMatch" })).toContain("credenciais");
  });

  it("explica bucket inexistente", () => {
    expect(describeR2Error({ name: "NoSuchBucket", $metadata: { httpStatusCode: 404 } })).toContain("bucket");
  });
});
