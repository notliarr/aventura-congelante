import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/data", () => ({
  getPublicPhotos: vi.fn(async () => [{ publicUrl: "https://example.r2.dev/evento/foto.jpg" }]),
}));

import { GET } from "@/app/tv/route";

describe("modo compatível com Smart TV", () => {
  it("entrega HTML independente do runtime moderno", async () => {
    const response = await GET(new Request("https://aventuracongelante.vercel.app/tv?intervalo=12"));
    const html = await response.text();
    const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];

    expect(response.headers.get("content-type")).toContain("text/html");
    expect(html).toContain("Modo Smart TV");
    expect(html).toContain("https://example.r2.dev/evento/foto.jpg");
    expect(html).not.toContain("/_next/");
    expect(script).toBeTruthy();
    expect(() => new Function(script ?? "")).not.toThrow();
  });
});
