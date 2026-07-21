"use client";

import Link from "next/link";
import { Camera, Images, LogOut, QrCode, Settings, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { EventConfig, Frame, Photo } from "@/types";
import { AdminPhotoGrid } from "./AdminPhotoGrid";
import { AdminFrameManager } from "./AdminFrameManager";
import { AdminSettings } from "./AdminSettings";
import { QRCodeGenerator } from "./QRCodeGenerator";

type Tab = "photos" | "frames" | "settings" | "qr";

const tabs: Array<{ key: Tab; label: string; mobileLabel: string; icon: React.ReactNode }> = [
  { key: "photos", label: "Fotos", mobileLabel: "Fotos", icon: <Images /> },
  { key: "frames", label: "Molduras", mobileLabel: "Molduras", icon: <SlidersHorizontal /> },
  { key: "settings", label: "Configurações", mobileLabel: "Ajustes", icon: <Settings /> },
  { key: "qr", label: "QR Code", mobileLabel: "QR Code", icon: <QrCode /> },
];

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("photos");
  const [data, setData] = useState<{
    event: EventConfig;
    frames: Frame[];
    photos: Photo[];
    configured: boolean;
  } | null>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/data", { cache: "no-store" });
    if (response.ok) setData(await response.json());
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (!data) {
    return <main className="grid min-h-dvh place-items-center"><span className="size-12 animate-spin rounded-full border-4 border-[#07567f] border-t-transparent" aria-label="Carregando painel" /></main>;
  }

  const activeTitle = tabs.find(item => item.key === tab)?.label;

  return (
    <main id="conteudo" className="min-h-dvh max-w-full overflow-x-hidden bg-[#f1f9fc] pb-28 md:pb-12">
      <header className="sticky top-0 z-30 w-full border-b bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="display block text-lg leading-tight sm:text-xl">Uma Aventura Congelante</span>
            <span className="hidden text-sm text-[#43647a] sm:block">Painel administrativo</span>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href="/" className="ice-button ice-secondary !min-h-11 !px-3" aria-label="Abrir site"><Camera className="size-4" /><span className="hidden sm:inline">Site</span></Link>
            <form action="/api/admin/logout" method="post"><button className="ice-button ice-secondary !min-h-11 !px-3" aria-label="Sair"><LogOut className="size-4" /><span className="hidden sm:inline">Sair</span></button></form>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full min-w-0 max-w-7xl p-4 sm:p-6">
        <nav className="mb-6 hidden flex-wrap gap-2 md:flex" aria-label="Seções administrativas">
          {tabs.map(item => <button key={item.key} onClick={() => setTab(item.key)} aria-current={tab === item.key ? "page" : undefined} className={`ice-button whitespace-nowrap !min-h-11 ${tab === item.key ? "ice-primary" : "ice-secondary"}`}>{item.icon}{item.label}</button>)}
        </nav>

        {!data.configured && <div role="alert" className="mb-6 rounded-2xl border border-[#d6a514] bg-[#fff8db] p-4 font-semibold">Modo demonstração: configure o Supabase para persistir fotos e alterações.</div>}
        <h1 className="display mb-5 text-3xl sm:text-4xl">{activeTitle}</h1>

        <div className="w-full min-w-0">
          {tab === "photos" && <AdminPhotoGrid photos={data.photos} frames={data.frames} onRefresh={load} />}
          {tab === "frames" && <AdminFrameManager eventId={data.event.id} frames={data.frames} onRefresh={load} />}
          {tab === "settings" && <AdminSettings event={data.event} onRefresh={load} />}
          {tab === "qr" && <QRCodeGenerator />}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 gap-1 border-t border-[#0d6794]/15 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(8,47,85,.12)] backdrop-blur md:hidden" aria-label="Seções administrativas">
        {tabs.map(item => (
          <button key={item.key} onClick={() => setTab(item.key)} aria-current={tab === item.key ? "page" : undefined} className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[.7rem] font-bold transition ${tab === item.key ? "bg-[#07567f] text-white" : "text-[#244c67]"}`}>
            <span className="[&>svg]:size-5">{item.icon}</span>
            <span className="truncate">{item.mobileLabel}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
