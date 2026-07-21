"use client";
import Image from "next/image";
import { CheckCircle2, Home, Images, RotateCcw, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { Frame } from "@/types";
import type { CapturedPhoto } from "./camera/CameraView";
import { Button } from "./ui/Button";
import { DownloadButton } from "./DownloadButton";
import { ShareButton } from "./ShareButton";
import { UploadProgress } from "./UploadProgress";

export function PhotoPreview({ photo, eventId, frame, onRetake, onFrames, onHome }: { photo: CapturedPhoto; eventId: string; frame: Frame; onRetake: () => void; onFrames: () => void; onHome: () => void }) {
  const [progress, setProgress] = useState(0); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false);
  function save() {
    if (saving || saved) return; setSaving(true); setProgress(1);
    const body = new FormData(); body.append("file", photo.blob, "photo.jpg"); body.append("eventId", eventId); body.append("frameId", frame.id); body.append("width", String(photo.width)); body.append("height", String(photo.height));
    const request = new XMLHttpRequest(); request.open("POST", "/api/photos"); request.upload.onprogress = event => { if (event.lengthComputable) setProgress(Math.max(1, Math.round(event.loaded / event.total * 95))); }; request.onload = () => { setSaving(false); if (request.status >= 200 && request.status < 300) { setProgress(100); setSaved(true); toast.success("Foto salva na galeria!"); } else toast.error(JSON.parse(request.responseText || "{}").error || "O envio falhou. Sua foto continua aqui para tentar novamente."); }; request.onerror = () => { setSaving(false); toast.error("Sem conexão para salvar. Você ainda pode baixar ou tentar novamente."); }; request.send(body);
  }
  return <main id="conteudo" className="relative z-10 mx-auto grid min-h-dvh max-w-5xl items-center gap-6 p-4 safe-top safe-bottom lg:grid-cols-[1fr_.82fr]"><section className="glass rounded-[2rem] p-3"><div className={`relative mx-auto max-h-[78dvh] overflow-hidden rounded-[1.5rem] bg-[#9ed7ed] ${frame.aspectRatio === "1:1" ? "aspect-square" : frame.aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-[4/5]"}`}><Image src={photo.url} alt="Sua fotografia pronta com a moldura" fill unoptimized className="object-contain"/></div></section><section className="glass rounded-[2rem] p-6 sm:p-8"><p className="text-sm font-bold uppercase tracking-[.16em] text-[#07567f]">Passo 3 de 3</p><h1 className="display mt-2 text-3xl">Seu momento ficou mágico</h1><p className="mt-3 leading-7 text-[#31536b]">Confira a foto. Você pode salvá-la na galeria do evento, baixar ou abrir o menu nativo de compartilhamento.</p>{saving && <div className="my-6"><UploadProgress progress={progress}/></div>}{saved ? <div className="my-6 flex items-center gap-3 rounded-2xl bg-[#dff8ef] p-4 font-bold text-[#146044]"><CheckCircle2/> Foto salva com sucesso</div> : <Button onClick={save} disabled={saving} className="mt-6 w-full"><Save className="size-5"/> {saving ? "Salvando…" : "Gostei, salvar"}</Button>}<div className="mt-3 grid gap-3 sm:grid-cols-2"><DownloadButton blob={photo.blob} className="w-full"/><ShareButton blob={photo.blob} className="w-full"/><Button variant="secondary" onClick={onRetake} className="w-full"><RotateCcw className="size-5"/> Tirar novamente</Button><Button variant="secondary" onClick={onFrames} className="w-full"><Images className="size-5"/> Outra moldura</Button></div><button onClick={onHome} className="mx-auto mt-5 flex min-h-11 items-center gap-2 font-bold underline underline-offset-4"><Home className="size-4"/> Voltar ao início</button>{saved && <Link href="/galeria" className="mt-3 block text-center text-sm font-bold text-[#07567f]">Ver na galeria pública</Link>}</section></main>;
}
