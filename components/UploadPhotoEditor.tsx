"use client";

import { ArrowLeft, ImageIcon, Move, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { composeUploadedPhoto } from "@/lib/canvas/compose-upload";
import type { Frame } from "@/types";
import type { CapturedPhoto } from "./camera/CameraView";
import { Button } from "./ui/Button";

export function UploadPhotoEditor({ file, frame, onBack, onReady }: { file: File; frame: Frame | null; onBack: () => void; onReady: (photo: CapturedPhoto) => void }) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const [sourceUrl] = useState(() => URL.createObjectURL(file));
  const drag = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const ratio = frame?.aspectRatio ?? "9:16";

  useEffect(() => () => URL.revokeObjectURL(sourceUrl), [sourceUrl]);

  function pointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y };
  }

  function pointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = drag.current.offsetX + (event.clientX - drag.current.x) / bounds.width;
    const y = drag.current.offsetY + (event.clientY - drag.current.y) / bounds.height;
    setOffset({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  }

  async function finish() {
    setBusy(true);
    try {
      const photo = await composeUploadedPhoto(file, frame?.previewUrl ?? null, ratio, zoom, offset.x, offset.y);
      onReady(photo);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível processar a foto.");
    } finally {
      setBusy(false);
    }
  }

  return <main id="conteudo" className="relative z-10 mx-auto min-h-dvh max-w-5xl p-4 safe-top safe-bottom"><header className="mb-5 flex items-center gap-4"><button onClick={onBack} className="grid size-12 shrink-0 place-items-center rounded-full bg-white/75" aria-label="Voltar às molduras"><ArrowLeft/></button><div><p className="text-sm font-bold uppercase tracking-[.16em] text-[#07567f]">Ajuste a foto</p><h1 className="display text-3xl sm:text-4xl">Enquadre seu momento</h1></div></header><div className="grid gap-5 lg:grid-cols-[1fr_.7fr] lg:items-center"><section className="glass rounded-[2rem] p-3"><div onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={() => { drag.current = null; }} className={`relative mx-auto max-h-[72dvh] touch-none cursor-grab select-none overflow-hidden rounded-[1.5rem] bg-[#9ed7ed] active:cursor-grabbing ${ratio === "1:1" ? "aspect-square" : ratio === "9:16" ? "aspect-[9/16]" : "aspect-[4/5]"}`}><Image src={sourceUrl} alt="Foto escolhida para ajustar" fill unoptimized draggable={false} className="pointer-events-none object-cover will-change-transform" style={{ transform: `translate(${offset.x * 22}%, ${offset.y * 22}%) scale(${zoom})` }}/>{frame && <Image src={frame.previewUrl} alt={`Moldura ${frame.name}`} fill draggable={false} className="pointer-events-none object-fill"/>}<div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-center gap-2 rounded-full bg-[#082f55]/75 px-4 py-2 text-sm font-bold text-white backdrop-blur"><Move className="size-4"/> Arraste para posicionar</div></div></section><aside className="glass rounded-[2rem] p-5 sm:p-7"><div className="flex items-center gap-3"><div className="grid size-12 place-items-center rounded-full bg-[#dff5ff] text-[#07567f]"><ImageIcon/></div><div><strong className="block">{frame?.name ?? "Sem moldura"}</strong><span className="text-sm text-[#43647a]">Formato {ratio} · alta qualidade</span></div></div><label className="mt-7 block font-bold" htmlFor="photo-zoom"><span className="flex items-center gap-2"><ZoomIn className="size-4"/> Zoom</span></label><input id="photo-zoom" type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-3 w-full accent-[#087bb5]"/><button type="button" onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="mt-3 min-h-11 cursor-pointer text-sm font-bold underline underline-offset-4">Centralizar novamente</button><Button onClick={finish} disabled={busy} className="mt-7 w-full">{busy ? "Preparando foto…" : "Conferir resultado"}</Button><p className="mt-3 text-center text-xs leading-5 text-[#43647a]">A foto será exportada em JPEG com até 3840 px e 95% de qualidade.</p></aside></div></main>;
}
