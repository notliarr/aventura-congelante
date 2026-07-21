"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { EventConfig, Frame } from "@/types";
import { CameraPermission } from "./camera/CameraPermission";
import { CameraView, type CapturedPhoto } from "./camera/CameraView";
import { FrameSelector } from "./FrameSelector";
import { PhotoPreview } from "./PhotoPreview";
import { PrivacyModal } from "./PrivacyModal";
import { SnowBackground } from "./SnowBackground";
import { UploadPhotoEditor } from "./UploadPhotoEditor";
import { Modal } from "./ui/Modal";
import { WelcomeScreen } from "./WelcomeScreen";

type Step = "welcome" | "frames" | "permission" | "camera" | "upload-editor" | "preview";
type CaptureMode = "camera" | "upload";

export function PhotoBooth({ event, frames }: { event: EventConfig; frames: Frame[] }) {
  const [step, setStep] = useState<Step>("welcome");
  const [frame, setFrame] = useState<Frame | null | undefined>(undefined);
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  const [mode, setMode] = useState<CaptureMode>("camera");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [help, setHelp] = useState(false);
  const [inApp, setInApp] = useState(false);

  useEffect(() => { setInApp(/Instagram|FBAN|FBAV/i.test(navigator.userAgent)); }, []);

  function home() {
    if (photo) URL.revokeObjectURL(photo.url);
    setPhoto(null);
    setUploadFile(null);
    setMode("camera");
    setFrame(undefined);
    setStep("welcome");
  }

  function startCamera() {
    setMode("camera");
    setUploadFile(null);
    setFrame(undefined);
    setStep("frames");
  }

  function startUpload(file: File) {
    const supported = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(file.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
    if (!supported) return toast.error("Escolha uma foto JPEG, PNG, WebP ou HEIC.");
    if (!file.size || file.size > 30 * 1024 * 1024) return toast.error("A foto precisa ter no máximo 30 MB.");
    setMode("upload");
    setUploadFile(file);
    setFrame(undefined);
    setStep("frames");
  }

  function receivePhoto(value: CapturedPhoto) {
    if (photo) URL.revokeObjectURL(photo.url);
    setPhoto(value);
    setStep("preview");
  }

  return <><SnowBackground/>{inApp && <div className="fixed inset-x-3 top-[max(.75rem,env(safe-area-inset-top))] z-50 rounded-2xl bg-[#082f55] px-4 py-3 text-center text-sm font-semibold text-white shadow-xl">Para uma melhor experiência, abra esta página no Safari ou Chrome.</div>}{step === "welcome" && <WelcomeScreen event={event} onStart={startCamera} onUpload={startUpload} onPrivacy={() => setPrivacy(true)}/>} {step === "frames" && <FrameSelector frames={frames} selected={frame} onSelect={setFrame} uploadMode={mode === "upload"} onContinue={() => setStep(mode === "upload" ? "upload-editor" : "permission")} onBack={home}/>} {step === "permission" && <CameraPermission consent={consent} onConsent={setConsent} onAllow={() => setStep("camera")} onBack={() => setStep("frames")} onHelp={() => setHelp(true)}/>} {step === "camera" && frame !== undefined && <CameraView frame={frame} onBack={() => setStep("frames")} onCaptured={receivePhoto}/>} {step === "upload-editor" && uploadFile && frame !== undefined && <UploadPhotoEditor file={uploadFile} frame={frame} onBack={() => setStep("frames")} onReady={receivePhoto}/>} {step === "preview" && frame !== undefined && photo && <PhotoPreview photo={photo} eventId={event.id} frame={frame} onRetake={() => setStep(mode === "upload" ? "upload-editor" : "camera")} onFrames={() => setStep("frames")} onHome={home}/>}<PrivacyModal open={privacy} onClose={() => setPrivacy(false)}/><Modal open={help} onClose={() => setHelp(false)} title="Ajuda com a câmera"><ol className="list-decimal space-y-3 pl-5 leading-7"><li>Abra o link no Safari (iPhone) ou Chrome (Android).</li><li>Toque no ícone ao lado do endereço e permita a câmera.</li><li>Se a permissão foi negada, abra as configurações do navegador e libere o acesso para este site.</li><li>O acesso à câmera exige HTTPS; em produção a Vercel já fornece conexão segura.</li></ol></Modal></>;
}
