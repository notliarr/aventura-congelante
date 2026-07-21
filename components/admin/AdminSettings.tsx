"use client";

import { ImagePlus, LoaderCircle, Save } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import type { EventConfig } from "@/types";
import { Button } from "../ui/Button";

export function AdminSettings({ event, onRefresh }: { event: EventConfig; onRefresh: () => void }) {
  const [form, setForm] = useState(event);
  const [busy, setBusy] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const field = (key: keyof EventConfig, value: string | number | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);

    if (response.ok) {
      toast.success("Configurações salvas.");
      onRefresh();
    } else {
      toast.error((await response.json()).error);
    }
  }

  async function uploadCover(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const body = new FormData();
    body.append("eventId", form.id);
    body.append("file", file);
    const response = await fetch("/api/admin/cover", { method: "POST", body });
    const result = await response.json();
    setUploadingCover(false);
    event.target.value = "";

    if (response.ok) {
      field("coverImageUrl", result.url);
      toast.success("Imagem de capa atualizada.");
      onRefresh();
    } else {
      toast.error(result.error || "Não foi possível enviar a imagem.");
    }
  }

  return (
    <form onSubmit={submit} className="w-full min-w-0 max-w-3xl space-y-5 rounded-3xl border bg-white p-4 sm:p-6">
      <div className="grid min-w-0 gap-5 sm:grid-cols-2">
        <Field label="Nome da aniversariante">
          <input value={form.birthdayPersonName} onChange={(event) => field("birthdayPersonName", event.target.value)} required maxLength={80} className="h-12 w-full min-w-0 rounded-xl border px-3" />
        </Field>
        <Field label="Idade">
          <input type="number" min={1} max={120} value={form.age} onChange={(event) => field("age", Number(event.target.value))} required className="h-12 w-full min-w-0 rounded-xl border px-3" />
        </Field>
      </div>
      <Field label="Mensagem de boas-vindas">
        <textarea value={form.welcomeMessage} onChange={(event) => field("welcomeMessage", event.target.value)} required maxLength={500} rows={4} className="w-full min-w-0 rounded-xl border p-3" />
      </Field>
      <div className="min-w-0">
        <span className="mb-2 block font-bold">Imagem de capa</span>
        <div className="grid min-w-0 gap-4 rounded-2xl border bg-[#f5fbfd] p-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border bg-[#dff5ff] sm:w-44">
            <Image src={form.coverImageUrl || "/placeholders/ice-castle.svg"} alt="Prévia da imagem de capa" fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <label className={`ice-button ice-secondary w-full cursor-pointer justify-center sm:w-fit ${uploadingCover ? "pointer-events-none opacity-60" : ""}`}>
              {uploadingCover ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
              {uploadingCover ? "Enviando…" : "Escolher imagem"}
              <input type="file" accept="image/jpeg,image/webp" onChange={uploadCover} disabled={uploadingCover} className="sr-only" />
            </label>
            <p className="mt-2 text-sm text-[#43647a]">JPG ou WebP, até 4 MB. Prefira uma foto horizontal.</p>
          </div>
        </div>
      </div>
      <Toggle label="Galeria pública ativa" help="Permite acesso a /galeria e ao slideshow." checked={form.galleryEnabled} onChange={(checked) => field("galleryEnabled", checked)} />
      <Toggle label="Aprovação manual" help="Novas fotos aguardam aprovação antes de aparecer." checked={form.galleryModerationEnabled} onChange={(checked) => field("galleryModerationEnabled", checked)} />
      <Button type="submit" disabled={busy || uploadingCover} className="w-full sm:w-auto">
        <Save className="size-4" /> {busy ? "Salvando…" : "Salvar configurações"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block min-w-0"><span className="mb-2 block font-bold">{label}</span>{children}</label>;
}

function Toggle({ label, help, checked, onChange }: { label: string; help: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-w-0 min-h-12 items-start gap-3 sm:items-center">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 size-5 shrink-0 sm:mt-0" />
      <span className="min-w-0"><strong>{label}</strong><small className="block text-[#43647a]">{help}</small></span>
    </label>
  );
}
