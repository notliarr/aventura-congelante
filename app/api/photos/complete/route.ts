import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { deletePhotoFromR2, describeR2Error, getR2PhotoMetadata, isR2Configured } from "@/lib/storage/r2";
import { verifyPhotoUpload } from "@/lib/storage/upload-token";
import { createServiceClient } from "@/lib/supabase/server";

const requestSchema = z.object({ token: z.string().min(20).max(10_000) });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`photo-complete:${ip}`, 20, 60_000)) return NextResponse.json({ error: "Muitas fotos em pouco tempo. Aguarde um minuto." }, { status: 429 });
  if (!isR2Configured()) return NextResponse.json({ error: "O Cloudflare R2 não está configurado." }, { status: 503 });
  const client = createServiceClient();
  if (!client) return NextResponse.json({ error: "O banco de dados ainda não foi configurado." }, { status: 503 });

  const body = requestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Confirmação de upload inválida." }, { status: 400 });
  const payload = verifyPhotoUpload(body.data.token);
  if (!payload) return NextResponse.json({ error: "O envio expirou ou não é válido. Tente salvar novamente." }, { status: 400 });

  try {
    const uploaded = await getR2PhotoMetadata(payload.storagePath);
    if (uploaded.size !== payload.fileSize || uploaded.contentType !== payload.mimeType) {
      await deletePhotoFromR2(payload.storagePath).catch(() => undefined);
      return NextResponse.json({ error: "O arquivo recebido não corresponde à foto confirmada." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: describeR2Error(error) }, { status: 502 });
  }

  const { data: event } = await client.from("events").select("gallery_moderation_enabled").eq("id", payload.eventId).maybeSingle();
  if (!event) {
    await deletePhotoFromR2(payload.storagePath).catch(() => undefined);
    return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
  }

  const { data: existing } = await client.from("photos").select("id,status").eq("storage_path", payload.storagePath).maybeSingle();
  if (existing) return NextResponse.json(existing, { status: 200 });

  const { data: photo, error } = await client.from("photos").insert({
    event_id: payload.eventId,
    frame_id: payload.frameId,
    storage_path: payload.storagePath,
    public_url: payload.publicUrl,
    status: event.gallery_moderation_enabled ? "pending" : "approved",
    width: payload.width,
    height: payload.height,
    file_size: payload.fileSize,
    mime_type: payload.mimeType,
  }).select("id,status").single();

  if (error) {
    const { data: concurrent } = await client.from("photos").select("id,status").eq("storage_path", payload.storagePath).maybeSingle();
    if (concurrent) return NextResponse.json(concurrent, { status: 200 });
    await deletePhotoFromR2(payload.storagePath).catch(() => undefined);
    return NextResponse.json({ error: "Não foi possível registrar a foto. Confira se a migração de alta qualidade foi executada no Supabase." }, { status: 502 });
  }
  return NextResponse.json(photo, { status: 201 });
}
