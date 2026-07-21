import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { deletePhotoFromR2, isR2Configured, uploadPhotoToR2 } from "@/lib/storage/r2";
import { createServiceClient } from "@/lib/supabase/server";
import { photoMetadataSchema, validateImageFile } from "@/lib/validation";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(ip)) return NextResponse.json({ error: "Muitas fotos em pouco tempo. Aguarde um minuto." }, { status: 429 });
  const client = createServiceClient();
  if (!client) return NextResponse.json({ error: "O armazenamento ainda não foi configurado. Você pode baixar a foto." }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Arquivo de imagem ausente." }, { status: 400 });
  const validation = validateImageFile(file);
  if (!validation.valid) return NextResponse.json({ error: validation.reason }, { status: 400 });
  const parsed = photoMetadataSchema.safeParse({ eventId: form.get("eventId"), frameId: form.get("frameId") || undefined, width: form.get("width"), height: form.get("height") });
  if (!parsed.success) return NextResponse.json({ error: "Os dados da foto são inválidos." }, { status: 400 });

  const { data: event } = await client.from("events").select("gallery_moderation_enabled").eq("id", parsed.data.eventId).single();
  if (!event) return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });

  const extension = file.type === "image/webp" ? "webp" : "jpg";
  const key = `${parsed.data.eventId}/photos/${randomUUID()}.${extension}`;
  let stored: { storagePath: string; publicUrl: string };
  try {
    if (isR2Configured()) {
      stored = await uploadPhotoToR2(key, file);
    } else {
      const { error: uploadError } = await client.storage.from("event-photos").upload(key, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
      if (uploadError) throw uploadError;
      const { data: publicData } = client.storage.from("event-photos").getPublicUrl(key);
      stored = { storagePath: key, publicUrl: publicData.publicUrl };
    }
  } catch {
    return NextResponse.json({ error: "Não foi possível enviar a foto. Tente novamente." }, { status: 502 });
  }

  const { data: photo, error: insertError } = await client.from("photos").insert({
    event_id: parsed.data.eventId,
    frame_id: parsed.data.frameId ?? null,
    storage_path: stored.storagePath,
    public_url: stored.publicUrl,
    status: event.gallery_moderation_enabled ? "pending" : "approved",
    width: parsed.data.width,
    height: parsed.data.height,
    file_size: file.size,
    mime_type: file.type,
  }).select("id,status").single();

  if (insertError) {
    if (isR2Configured()) await deletePhotoFromR2(stored.storagePath).catch(() => undefined);
    else await client.storage.from("event-photos").remove([stored.storagePath]);
    return NextResponse.json({ error: "Não foi possível registrar a foto." }, { status: 502 });
  }
  return NextResponse.json(photo, { status: 201 });
}
