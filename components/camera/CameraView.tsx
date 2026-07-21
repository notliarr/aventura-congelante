"use client";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Frame } from "@/types";
import { composePhoto } from "@/lib/canvas/compose";
import { Button } from "../ui/Button";
import { CameraControls } from "./CameraControls";

export interface CapturedPhoto { blob: Blob; url: string; width: number; height: number }
export function CameraView({ frame, onCaptured, onBack }: { frame: Frame; onCaptured: (photo: CapturedPhoto) => void; onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<"user" | "environment">("environment");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  const stop = useCallback(() => { streamRef.current?.getTracks().forEach(track => track.stop()); streamRef.current = null; }, []);
  const start = useCallback(async (mode: "user" | "environment") => {
    stop(); setReady(false); setError("");
    if (!navigator.mediaDevices?.getUserMedia) { setError("Este navegador não oferece acesso à câmera. Abra a página no Safari ou Chrome."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: mode }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); setReady(true); }
    } catch (cause) {
      const denied = cause instanceof DOMException && (cause.name === "NotAllowedError" || cause.name === "PermissionDeniedError");
      setError(denied ? "A permissão da câmera foi negada. Libere-a nas configurações do navegador e tente novamente." : "Não foi possível abrir a câmera. Verifique se outro aplicativo está usando-a e tente novamente.");
    }
  }, [stop]);
  useEffect(() => { void start(facing); return stop; }, [facing, start, stop]);
  async function capture() { if (!videoRef.current || !ready || busy) return; setBusy(true); try { const photo = await composePhoto(videoRef.current, frame.previewUrl, frame.aspectRatio, facing === "user"); stop(); onCaptured(photo); } catch (cause) { setError(cause instanceof Error ? cause.message : "Falha ao processar a foto."); } finally { setBusy(false); } }

  if (error) return <main id="conteudo" className="relative z-10 grid min-h-dvh place-items-center p-4"><section className="glass max-w-lg rounded-[2rem] p-7 text-center"><AlertTriangle className="mx-auto size-12 text-[#9f2d28]"/><h1 className="display mt-4 text-3xl">A câmera não abriu</h1><p className="mt-3 leading-7">{error}</p><div className="mt-6 flex flex-col gap-3"><Button onClick={() => start(facing)}>Tentar novamente</Button><Button variant="secondary" onClick={onBack}>Escolher outra moldura</Button></div></section></main>;
  return <main id="conteudo" className="relative z-10 grid min-h-dvh place-items-center overflow-hidden bg-[#001b2f]"><div className={`relative max-h-dvh w-full max-w-[min(100vw,760px)] overflow-hidden ${frame.aspectRatio === "1:1" ? "aspect-square" : frame.aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-[4/5]"}`}><video ref={videoRef} muted playsInline className={`absolute inset-0 size-full object-cover ${facing === "user" ? "-scale-x-100" : ""}`}/><Image src={frame.previewUrl} alt="Moldura selecionada sobre a câmera" fill priority className="pointer-events-none z-10 object-fill"/>{!ready && <div className="absolute inset-0 z-20 grid place-items-center bg-[#052c49] text-white"><div className="text-center"><span className="mx-auto block size-10 animate-spin rounded-full border-4 border-white border-t-transparent"/><p className="mt-4">Preparando a câmera…</p></div></div>}<CameraControls onCapture={capture} onSwitch={() => setFacing(value => value === "user" ? "environment" : "user")} onBack={() => { stop(); onBack(); }} busy={busy}/></div></main>;
}
