"use client";
import { useEffect, useState } from "react";
import type { EventConfig, Frame } from "@/types";
import { SnowBackground } from "./SnowBackground";
import { PrivacyModal } from "./PrivacyModal";
import { WelcomeScreen } from "./WelcomeScreen";
import { FrameSelector } from "./FrameSelector";
import { CameraPermission } from "./camera/CameraPermission";
import { CameraView, type CapturedPhoto } from "./camera/CameraView";
import { PhotoPreview } from "./PhotoPreview";
import { Modal } from "./ui/Modal";

type Step = "welcome" | "frames" | "permission" | "camera" | "preview";
export function PhotoBooth({ event, frames }: { event: EventConfig; frames: Frame[] }) {
  const [step, setStep] = useState<Step>("welcome"); const [frame, setFrame] = useState<Frame | null>(null); const [photo, setPhoto] = useState<CapturedPhoto | null>(null); const [consent, setConsent] = useState(false); const [privacy, setPrivacy] = useState(false); const [help, setHelp] = useState(false); const [inApp, setInApp] = useState(false);
  useEffect(() => { setInApp(/Instagram|FBAN|FBAV/i.test(navigator.userAgent)); }, []);
  function home() { if (photo) URL.revokeObjectURL(photo.url); setPhoto(null); setFrame(null); setStep("welcome"); }
  return <><SnowBackground/>{inApp && <div className="fixed inset-x-3 top-[max(.75rem,env(safe-area-inset-top))] z-50 rounded-2xl bg-[#082f55] px-4 py-3 text-center text-sm font-semibold text-white shadow-xl">Para uma melhor experiência, abra esta página no Safari ou Chrome.</div>}{step === "welcome" && <WelcomeScreen event={event} onStart={() => setStep("frames")} onPrivacy={() => setPrivacy(true)}/>} {step === "frames" && <FrameSelector frames={frames} selected={frame} onSelect={setFrame} onContinue={() => setStep("permission")} onBack={home}/>} {step === "permission" && <CameraPermission consent={consent} onConsent={setConsent} onAllow={() => setStep("camera")} onBack={() => setStep("frames")} onHelp={() => setHelp(true)}/>} {step === "camera" && frame && <CameraView frame={frame} onBack={() => setStep("frames")} onCaptured={value => { setPhoto(value); setStep("preview"); }}/>} {step === "preview" && frame && photo && <PhotoPreview photo={photo} eventId={event.id} frame={frame} onRetake={() => setStep("camera")} onFrames={() => setStep("frames")} onHome={home}/>}<PrivacyModal open={privacy} onClose={() => setPrivacy(false)}/><Modal open={help} onClose={() => setHelp(false)} title="Ajuda com a câmera"><ol className="list-decimal space-y-3 pl-5 leading-7"><li>Abra o link no Safari (iPhone) ou Chrome (Android).</li><li>Toque no ícone ao lado do endereço e permita a câmera.</li><li>Se a permissão foi negada, abra as configurações do navegador e libere o acesso para este site.</li><li>O acesso à câmera exige HTTPS; em produção a Vercel já fornece conexão segura.</li></ol></Modal></>;
}
