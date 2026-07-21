import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
const eventIdSchema = z.string().uuid();
const MAX_COVER_SIZE = 4 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  const client = createServiceClient();
  if (!client) return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  const eventId = eventIdSchema.safeParse(form.get("eventId"));

  if (!eventId.success) return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "Selecione uma imagem." }, { status: 400 });

  const extension = allowedTypes.get(file.type);
  if (!extension) return NextResponse.json({ error: "Use uma imagem JPG ou WebP." }, { status: 400 });
  if (file.size <= 0 || file.size > MAX_COVER_SIZE) {
    return NextResponse.json({ error: "A imagem deve ter no máximo 4 MB." }, { status: 400 });
  }

  const { data: currentEvent } = await client
    .from("events")
    .select("cover_image_url")
    .eq("id", eventId.data)
    .maybeSingle();

  if (!currentEvent) return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });

  const path = `${eventId.data}/covers/${randomUUID()}.${extension}`;
  const { error: uploadError } = await client.storage
    .from("event-photos")
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });

  if (uploadError) return NextResponse.json({ error: "Não foi possível enviar a imagem." }, { status: 502 });

  const { data: publicData } = client.storage.from("event-photos").getPublicUrl(path);
  const { error: updateError } = await client
    .from("events")
    .update({ cover_image_url: publicData.publicUrl })
    .eq("id", eventId.data);

  if (updateError) {
    await client.storage.from("event-photos").remove([path]);
    return NextResponse.json({ error: "A imagem foi enviada, mas não foi possível salvar a capa." }, { status: 500 });
  }

  const marker = "/storage/v1/object/public/event-photos/";
  const previousUrl = String(currentEvent.cover_image_url ?? "");
  const markerIndex = previousUrl.indexOf(marker);
  if (markerIndex >= 0) {
    const previousPath = decodeURIComponent(previousUrl.slice(markerIndex + marker.length));
    if (previousPath.startsWith(`${eventId.data}/covers/`)) {
      await client.storage.from("event-photos").remove([previousPath]);
    }
  }

  return NextResponse.json({ url: publicData.publicUrl });
}
