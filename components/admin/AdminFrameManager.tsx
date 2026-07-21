"use client";

import { ArrowDown, ArrowUp, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import type { Frame } from "@/types";
import { Button } from "../ui/Button";

export function AdminFrameManager({
  eventId,
  frames,
  onRefresh,
}: {
  eventId: string;
  frames: Frame[];
  onRefresh: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function update(item: Frame, values: object) {
    const response = await fetch(`/api/admin/frames/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) onRefresh();
    else toast.error("Falha ao atualizar moldura.");
  }

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    form.append("eventId", eventId);
    const response = await fetch("/api/admin/frames", { method: "POST", body: form });
    setBusy(false);

    if (response.ok) {
      toast.success("Moldura adicionada.");
      event.currentTarget.reset();
      onRefresh();
    } else {
      toast.error((await response.json()).error);
    }
  }

  return (
    <div className="grid w-full min-w-0 gap-6 lg:grid-cols-[1fr_.72fr]">
      <div className="min-w-0 space-y-3">
        {frames.map((item, index) => (
          <article
            key={item.id}
            className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-3 rounded-2xl border bg-white p-3 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
          >
            <div className="relative size-[4.5rem] overflow-hidden rounded-xl bg-[#dff5ff] sm:size-20">
              <Image src={item.previewUrl} alt={item.name} fill className="object-contain" />
            </div>
            <div className="min-w-0 self-center">
              <strong className="block truncate">{item.name}</strong>
              <span className="text-sm">
                {item.aspectRatio} · {item.isActive ? "Ativa" : "Inativa"}
              </span>
            </div>
            <div className="col-span-2 flex min-w-0 items-center justify-end gap-2 border-t border-[#d7e6ed] pt-3 sm:col-span-1 sm:border-0 sm:pt-0">
              <button
                type="button"
                onClick={() => update(item, { displayOrder: Math.max(0, item.displayOrder - 1) })}
                disabled={index === 0}
                className="grid size-10 shrink-0 place-items-center rounded-full border disabled:opacity-40"
                aria-label="Mover para cima"
              >
                <ArrowUp className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => update(item, { displayOrder: item.displayOrder + 1 })}
                disabled={index === frames.length - 1}
                className="grid size-10 shrink-0 place-items-center rounded-full border disabled:opacity-40"
                aria-label="Mover para baixo"
              >
                <ArrowDown className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => update(item, { isActive: !item.isActive })}
                className="min-h-10 min-w-0 flex-1 rounded-full border px-3 text-sm font-bold sm:flex-none"
              >
                {item.isActive ? "Desativar" : "Ativar"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <form onSubmit={upload} className="h-fit w-full min-w-0 rounded-3xl border bg-white p-4 sm:p-5">
        <h3 className="display text-2xl">Nova moldura</h3>
        <label className="mt-4 block font-bold" htmlFor="frame-name">Nome</label>
        <input id="frame-name" name="name" required maxLength={80} className="mt-2 h-12 w-full min-w-0 rounded-xl border px-3" />
        <label className="mt-4 block font-bold" htmlFor="ratio">Proporção</label>
        <select id="ratio" name="aspectRatio" className="mt-2 h-12 w-full min-w-0 rounded-xl border px-3">
          <option>4:5</option><option>1:1</option><option>9:16</option>
        </select>
        <label className="mt-4 block font-bold" htmlFor="frame-file">PNG transparente (até 8 MB)</label>
        <input id="frame-file" name="file" type="file" accept="image/png" required className="mt-2 block w-full min-w-0 rounded-xl border p-3 text-sm" />
        <Button type="submit" disabled={busy} className="mt-5 w-full">
          <Upload className="size-4" /> {busy ? "Enviando…" : "Enviar moldura"}
        </Button>
      </form>
    </div>
  );
}
