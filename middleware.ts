import { NextRequest, NextResponse } from "next/server";
async function digest(value: string) { const bytes = new TextEncoder().encode(value); const hash = await crypto.subtle.digest("SHA-256", bytes); return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join(""); }
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/admin/login" || path === "/api/admin/login") return NextResponse.next();
  if (!path.startsWith("/admin") && !path.startsWith("/api/admin")) return NextResponse.next();
  const expected = await digest(`${process.env.ADMIN_PASSWORD ?? ""}:${process.env.ADMIN_SESSION_SECRET ?? ""}`);
  const valid = Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET && request.cookies.get("aventura_admin")?.value === expected);
  if (valid) return NextResponse.next();
  if (path.startsWith("/api/")) return NextResponse.json({ error: "Sessão administrativa inválida." }, { status: 401 });
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
