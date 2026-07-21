import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).max(999).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = createServiceClient();
  if (!client) return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  const { id } = await params;
  const { data: current } = await client.from("frames").select("event_id,display_order").eq("id", id).single();
  if (!current) return NextResponse.json({ error: "Moldura não encontrada." }, { status: 404 });

  if (body.data.displayOrder !== undefined && body.data.displayOrder !== current.display_order) {
    const { data: target } = await client.from("frames").select("id").eq("event_id", current.event_id).eq("display_order", body.data.displayOrder).neq("id", id).maybeSingle();
    if (target) await client.from("frames").update({ display_order: current.display_order }).eq("id", target.id);
  }

  const values = {
    ...(body.data.name !== undefined && { name: body.data.name }),
    ...(body.data.isActive !== undefined && { is_active: body.data.isActive }),
    ...(body.data.displayOrder !== undefined && { display_order: body.data.displayOrder }),
  };
  const { error } = await client.from("frames").update(values).eq("id", id);
  return error ? NextResponse.json({ error: "Falha ao atualizar." }, { status: 500 }) : NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = createServiceClient();
  if (!client) return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });
  const { id } = await params;
  const { data: frame } = await client.from("frames").select("storage_path").eq("id", id).maybeSingle();
  if (!frame) return NextResponse.json({ error: "Moldura não encontrada." }, { status: 404 });

  if (!String(frame.storage_path).startsWith("demo/")) {
    const { error: storageError } = await client.storage.from("event-frames").remove([frame.storage_path]);
    if (storageError) return NextResponse.json({ error: "Não foi possível excluir o arquivo da moldura." }, { status: 502 });
  }

  const { error } = await client.from("frames").delete().eq("id", id);
  return error ? NextResponse.json({ error: "Falha ao excluir a moldura." }, { status: 500 }) : NextResponse.json({ ok: true });
}
