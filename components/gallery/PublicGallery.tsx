"use client";
import Image from "next/image";
import Link from "next/link";
import { Camera, Maximize2, RefreshCw, Snowflake } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/types";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export function PublicGallery({ initialPhotos, enabled }: { initialPhotos: Photo[]; enabled: boolean }) {
  const [photos, setPhotos] = useState(initialPhotos); const [selected, setSelected] = useState<Photo | null>(null); const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => { setLoading(true); try { const response = await fetch("/api/gallery", { cache: "no-store" }); if (response.ok) setPhotos((await response.json()).photos); } finally { setLoading(false); } }, []);
  useEffect(() => { const id = setInterval(refresh, 15_000); return () => clearInterval(id); }, [refresh]);
  if (!enabled) return <Empty title="A galeria está em modo privado" text="As fotos continuam protegidas no painel do evento."/>;
  return <main id="conteudo" className="relative z-10 mx-auto min-h-dvh max-w-7xl p-4 safe-top safe-bottom"><header className="glass mb-6 flex flex-col gap-4 rounded-[2rem] p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-[#07567f]">Momentos encantados</p><h1 className="display text-3xl sm:text-5xl">Galeria da festa</h1></div><div className="flex gap-2"><Button variant="secondary" onClick={refresh} disabled={loading}><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`}/> Atualizar</Button><Link href="/" className="ice-button ice-primary"><Camera className="size-4"/> Tirar foto</Link></div></header>{photos.length === 0 ? <Empty title="A primeira foto ainda vai chegar" text="Tire uma foto e inaugure esta galeria mágica."/> : <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">{photos.map(photo => <button key={photo.id} onClick={() => setSelected(photo)} className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-[1.35rem] bg-[#acdcef] shadow-lg"><Image src={photo.publicUrl} alt={`Foto da festa em ${new Date(photo.createdAt).toLocaleString("pt-BR")}`} width={photo.width} height={photo.height} className="h-auto w-full transition duration-300 group-hover:scale-[1.02]"/><span className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-[#082f55]/75 text-white opacity-0 backdrop-blur group-hover:opacity-100"><Maximize2 className="size-4"/></span></button>)}</div>}<Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Momento encantado">{selected && <Image src={selected.publicUrl} alt="Foto ampliada da festa" width={selected.width} height={selected.height} className="mx-auto max-h-[68dvh] w-auto rounded-2xl"/>}</Modal></main>;
}
function Empty({ title, text }: { title: string; text: string }) { return <section className="glass mx-auto mt-16 max-w-lg rounded-[2rem] p-9 text-center"><Snowflake className="mx-auto size-12"/><h2 className="display mt-4 text-3xl">{title}</h2><p className="mt-3 leading-7">{text}</p></section>; }
