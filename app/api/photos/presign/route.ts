import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { createPresignedPhotoUpload, describeR2Error, isR2Configured } from "@/lib/storage/r2";
import { signPhotoUpload } from "@/lib/storage/upload-token";
import { createServiceClient } from "@/lib/supabase/server";
import { MAX_PHOTO_SIZE } from "@/lib/validation";

const requestSchema = z.object({
  eventId: z.string().uuid(),
  frameId: z.string().uuid().nullable().optional(),
  width: z.number().int().min(320).max(3840),
  height: z.number().int().min(320).max(3840),
  fileSize: z.number().int().min(1).max(MAX_PHOTO_SIZE),
  mimeType: z.enum(["image/jpeg", "image/webp"]),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`photo-presign:${ip}`, 12, 60_000)) return NextResponse.json({ error: "Muitas fotos em pouco tempo. Aguarde um minuto." }, { status: 429 });
  if (!isR2Configured()) return NextResponse.json({ error: "O envio em alta qualidade exige a configuração do Cloudflare R2." }, { status: 503 });
  const client = createServiceClient();
  if (!client) return NextResponse.json({ error: "O banco de dados ainda não foi configurado." }, { status: 503 });

  const body = requestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Os dados da foto são inválidos." }, { status: 400 });
  const [{ data: event }, frameResult] = await Promise.all([
    client.from("events").select("id").eq("id", body.data.eventId).maybeSingle(),
    body.data.frameId ? client.from("frames").select("id").eq("id", body.data.frameId).eq("event_id", body.data.eventId).eq("is_active", true).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  if (!event) return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
  if (body.data.frameId && !frameResult.data) return NextResponse.json({ error: "A moldura selecionada não está disponível." }, { status: 400 });

  const extension = body.data.mimeType === "image/webp" ? "webp" : "jpg";
  const key = `${body.data.eventId}/photos/${randomUUID()}.${extension}`;
  try {
    const stored = await createPresignedPhotoUpload(key, body.data.mimeType);
    const token = signPhotoUpload({
      ...body.data,
      frameId: body.data.frameId ?? null,
      storagePath: stored.storagePath,
      publicUrl: stored.publicUrl,
      expiresAt: Date.now() + 10 * 60_000,
    });
    return NextResponse.json({ uploadUrl: stored.uploadUrl, token });
  } catch (error) {
    return NextResponse.json({ error: describeR2Error(error) }, { status: 502 });
  }
}
