"use client";

import { ArrowDown, ArrowUp, EyeOff, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import type { Frame } from "@/types";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

type Confirmation = { action: "deactivate" | "delete"; frame: Frame } | null;

export function AdminFrameManager({
  eventId,
  frames,
  onRefresh,
}: {
  eventId: string;
  frames: Frame[];
  onRefresh: () => void | Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation>(null);

  async function update(item: Frame, values: object, successMessage: string) {
    setPendingId(item.id);
    const response = await fetch(`/api/admin/frames/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setPendingId(null);

    if (response.ok) {
      toast.success(successMessage);
      onRefresh();
    }
    else toast.error("Falha ao atualizar moldura.");
  }

  async function toggle(item: Frame) {
    if (item.isActive) {
      setConfirmation({ action: "deactivate", frame: item });
      return;
    }
    await update(item, { isActive: true }, "Moldura ativada.");
  }

  async function remove(item: Frame) {
    setPendingId(item.id);
    const response = await fetch(`/api/admin/frames/${item.id}`, { method: "DELETE" });
    setPendingId(null);
    if (response.ok) {
      toast.success("Moldura excluída.");
      onRefresh();
    } else {
      toast.error((await response.json()).error || "Falha ao excluir a moldura.");
    }
  }

  async function confirmAction() {
    if (!confirmation) return;
    const { action, frame } = confirmation;
    if (action === "delete") await remove(frame);
    else await update(frame, { isActive: false }, "Moldura desativada.");
    setConfirmation(null);
  }

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    const form = new FormData(formElement);
    form.append("eventId", eventId);
    const response = await fetch("/api/admin/frames", { method: "POST", body: form });
    setBusy(false);

    if (response.ok) {
      toast.success("Moldura adicionada.");
      formElement.reset();
      await onRefresh();
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
                onClick={() => update(item, { displayOrder: Math.max(0, item.displayOrder - 1) }, "Moldura movida para cima.")}
                disabled={index === 0 || pendingId === item.id}
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Mover para cima"
              >
                <ArrowUp className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => update(item, { displayOrder: item.displayOrder + 1 }, "Moldura movida para baixo.")}
                disabled={index === frames.length - 1 || pendingId === item.id}
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Mover para baixo"
              >
                <ArrowDown className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => toggle(item)}
                disabled={pendingId === item.id}
                className="min-h-10 min-w-0 flex-1 cursor-pointer rounded-full border px-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                {item.isActive ? "Desativar" : "Ativar"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmation({ action: "delete", frame: item })}
                disabled={pendingId === item.id}
                className="flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#d98682] px-3 text-sm font-bold text-[#9f2d28] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="size-4" /> Excluir
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

      <Modal
        open={Boolean(confirmation)}
        onClose={() => { if (!pendingId) setConfirmation(null); }}
        title={confirmation?.action === "delete" ? "Excluir moldura" : "Desativar moldura"}
      >
        {confirmation && (
          <div className="text-center sm:text-left">
            <div className={`mx-auto grid size-16 place-items-center rounded-full sm:mx-0 ${confirmation.action === "delete" ? "bg-[#fde8e7] text-[#9f2d28]" : "bg-[#dff5ff] text-[#07567f]"}`}>
              {confirmation.action === "delete" ? <Trash2 className="size-7" /> : <EyeOff className="size-7" />}
            </div>
            <h3 className="display mt-5 text-2xl">{confirmation.frame.name}</h3>
            <p className="mt-2 leading-7 text-[#43647a]">
              {confirmation.action === "delete"
                ? "A moldura e seu arquivo serão excluídos permanentemente. Esta ação não pode ser desfeita."
                : "A moldura deixará de aparecer para os convidados, mas continuará salva e poderá ser ativada novamente."}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setConfirmation(null)} disabled={Boolean(pendingId)} className="w-full sm:w-auto">Cancelar</Button>
              <Button variant={confirmation.action === "delete" ? "danger" : "primary"} onClick={confirmAction} disabled={Boolean(pendingId)} className="w-full sm:w-auto">
                {confirmation.action === "delete" ? <Trash2 className="size-4" /> : <EyeOff className="size-4" />}
                {pendingId ? "Aguarde…" : confirmation.action === "delete" ? "Excluir moldura" : "Desativar moldura"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
