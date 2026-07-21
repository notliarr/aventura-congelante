"use client";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; if (!dialog) return; if (open && !dialog.open) dialog.showModal(); if (!open && dialog.open) dialog.close(); }, [open]);
  return <dialog ref={ref} onCancel={onClose} onClose={onClose} className="m-auto w-[min(92vw,34rem)] rounded-[2rem] border border-white/80 bg-[#f5fcff] p-0 text-[#082f55] shadow-2xl backdrop:bg-[#03243d]/60">
    <div className="flex items-center justify-between border-b border-[#0d6794]/15 px-6 py-4"><h2 className="display text-xl">{title}</h2><button onClick={onClose} className="grid size-11 place-items-center rounded-full hover:bg-[#dff5ff]" aria-label="Fechar"><X /></button></div>
    <div className="max-h-[72dvh] overflow-y-auto p-6">{children}</div>
  </dialog>;
}
