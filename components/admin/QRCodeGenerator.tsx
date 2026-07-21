"use client";

import QRCode from "qrcode";
import { Download, Printer, QrCode } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/Button";

export function QRCodeGenerator() {
  const [url, setUrl] = useState("");
  const [qrImage, setQrImage] = useState("");

  useEffect(() => {
    const target = process.env.NEXT_PUBLIC_SITE_URL || location.origin;
    setUrl(target);
    QRCode.toDataURL(target, {
        width: 640,
        margin: 3,
        color: { dark: "#082f55", light: "#ffffff" },
        errorCorrectionLevel: "H",
      })
      .then(setQrImage)
      .catch(() => toast.error("Falha ao gerar QR Code."));
  }, []);

  function download() {
    const anchor = document.createElement("a");
    anchor.href = qrImage;
    anchor.download = "qr-code-aventura-congelante.png";
    anchor.click();
  }

  return (
    <section className="grid w-full min-w-0 gap-4 sm:gap-6 lg:grid-cols-[.7fr_1fr]">
      <div className="w-full min-w-0 rounded-3xl border bg-white p-4 text-center sm:p-5">
        <div className="mx-auto aspect-square w-full max-w-sm overflow-hidden bg-white">
          {qrImage ? (
            <Image
              src={qrImage}
              alt="QR Code para acessar o evento"
              width={640}
              height={640}
              unoptimized
              className="block size-full object-contain"
            />
          ) : (
            <div className="size-full animate-pulse bg-[#eef9fd]" aria-label="Gerando QR Code" />
          )}
        </div>
        <p className="mt-3 font-bold">Escaneie, tire sua foto e compartilhe.</p>
      </div>

      <div className="w-full min-w-0 rounded-3xl border bg-white p-4 sm:p-6">
        <QrCode className="size-10" />
        <h3 className="display mt-3 text-3xl">QR Code do evento</h3>
        <p className="mt-3 max-w-full break-all rounded-xl bg-[#eef9fd] p-3 font-mono text-sm">{url}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={download} disabled={!qrImage}><Download className="size-4" /> Baixar PNG</Button>
          <Button variant="secondary" onClick={() => window.print()}><Printer className="size-4" /> Imprimir</Button>
        </div>
      </div>
    </section>
  );
}
