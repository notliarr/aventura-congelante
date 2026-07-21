import { NextResponse } from "next/server";
import { z } from "zod";
import { deletePhotoFromR2, isR2StoragePath } from "@/lib/storage/r2";
import { createServiceClient } from "@/lib/supabase/server";

const schema = z.object({ status: z.enum(["pending", "approved", "hidden"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = createServiceClient();
  if (!client) return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  const { id } = await params;
  const { error } = await client.from("photos").update(body.data).eq("id", id);
  return error ? NextResponse.json({ error: "Falha ao atualizar." }, { status: 500 }) : NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = createServiceClient();
  if (!client) return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });
  const { id } = await params;
  const { data } = await client.from("photos").select("storage_path").eq("id", id).single();
  if (!data) return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });

  try {
    if (isR2StoragePath(data.storage_path)) {
      await deletePhotoFromR2(data.storage_path);
    } else {
      const { error } = await client.storage.from("event-photos").remove([data.storage_path]);
      if (error) throw error;
    }
  } catch {
    return NextResponse.json({ error: "Falha ao excluir o arquivo." }, { status: 502 });
  }

  const { error } = await client.from("photos").delete().eq("id", id);
  return error ? NextResponse.json({ error: "Arquivo excluído, mas o registro não pôde ser removido." }, { status: 500 }) : NextResponse.json({ ok: true });
}
