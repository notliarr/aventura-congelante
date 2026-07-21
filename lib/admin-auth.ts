import { createHash, timingSafeEqual } from "crypto";
export const ADMIN_COOKIE = "aventura_admin";
export function adminToken() { const password = process.env.ADMIN_PASSWORD ?? ""; const secret = process.env.ADMIN_SESSION_SECRET ?? ""; return createHash("sha256").update(`${password}:${secret}`).digest("hex"); }
export function validPassword(value: string) { const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? ""); const actual = Buffer.from(value); return expected.length > 0 && expected.length === actual.length && timingSafeEqual(expected, actual); }
export function validToken(value?: string) { const expected = Buffer.from(adminToken()); const actual = Buffer.from(value ?? ""); return actual.length === expected.length && timingSafeEqual(expected, actual); }
