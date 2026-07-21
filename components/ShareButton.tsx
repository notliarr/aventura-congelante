"use client";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { downloadBlob, photoFilename } from "@/lib/files";
import { Button } from "./ui/Button";
import { getShareStrategy } from "@/lib/share";

export async function sharePhoto(blob: Blob) {
  const file = new File([blob], photoFilename(), { type: blob.type || "image/jpeg" });
  const strategy = getShareStrategy({ share: Boolean(navigator.share), canShareFiles: navigator.canShare ? navigator.canShare({ files: [file] }) : undefined });
  if (strategy === "native" && navigator.share) { await navigator.share({ title: "Minha foto em Uma Aventura Congelante", text: "Um momento mágico da festa!", files: [file] }); return "shared" as const; }
  downloadBlob(blob, file.name); return "downloaded" as const;
}
export function ShareButton({ blob, className = "" }: { blob: Blob; className?: string }) { return <Button variant="secondary" className={className} onClick={async () => { try { const result = await sharePhoto(blob); if (result === "downloaded") toast.info("A foto foi baixada. Agora você pode publicá-la no Instagram ou enviá-la pelo WhatsApp."); } catch (cause) { if (!(cause instanceof DOMException && cause.name === "AbortError")) toast.error("Não foi possível compartilhar agora. Tente baixar a foto."); } }}><Share2 className="size-5"/> Compartilhar</Button>; }
