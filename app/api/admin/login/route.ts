import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, adminToken, validPassword } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";
export async function POST(request: Request) { const ip = request.headers.get("x-forwarded-for") ?? "local"; if (!rateLimit(`admin:${ip}`, 8, 15 * 60_000)) return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 }); const body = z.object({ password: z.string().max(256) }).safeParse(await request.json()); if (!body.success || !validPassword(body.data.password)) return NextResponse.json({ error: "Senha incorreta." }, { status: 401 }); const response = NextResponse.json({ ok: true }); response.cookies.set(ADMIN_COOKIE, adminToken(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 8 * 60 * 60, path: "/" }); return response; }
