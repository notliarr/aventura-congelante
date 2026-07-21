"use client";
import Image from "next/image";
import Link from "next/link";
import { Camera, Images, ImageUp, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { EventConfig } from "@/types";
import { Button } from "./ui/Button";

export function WelcomeScreen({ event, onStart, onUpload, onPrivacy }: { event: EventConfig; onStart: () => void; onUpload: (file: File) => void; onPrivacy: () => void }) {
  return <main id="conteudo" className="relative z-10 mx-auto flex min-h-dvh max-w-6xl items-center px-4 py-8 safe-top safe-bottom">
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass grid w-full overflow-hidden rounded-[2.25rem] lg:grid-cols-[1.05fr_.95fr]">
      <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#3d9bc6]/20 bg-white/60 px-4 py-2 text-sm font-bold uppercase tracking-[.16em]"><Sparkles className="size-4"/> Fotocabine encantada</div>
        <p className="text-sm font-bold uppercase tracking-[.2em] text-[#07567f]">{event.age} anos de magia</p>
        <h1 className="display mt-2 text-4xl leading-[1.08] sm:text-6xl">Uma aventura congelante com <span className="text-[#087bb5]">{event.birthdayPersonName}</span></h1>
        <p className="mt-5 max-w-xl whitespace-pre-line text-lg leading-8 text-[#183f5d]">{event.welcomeMessage}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2"><Button onClick={onStart} className="w-full"><Camera className="size-5"/> Tirar foto agora</Button><label className="ice-button ice-secondary w-full cursor-pointer"><ImageUp className="size-5"/> Escolher uma foto<input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(file); event.currentTarget.value = ""; }}/></label>{event.galleryEnabled && <Link href="/galeria" className="ice-button ice-secondary w-full sm:col-span-2"><Images className="size-5"/> Ver galeria</Link>}</div>
        <p className="mt-5 text-sm leading-6 text-[#37576c]">Tire uma foto ou escolha uma da galeria, aplique sua moldura e compartilhe pelo celular.</p>
        <button onClick={onPrivacy} className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold underline decoration-[#168fc5]/40 underline-offset-4"><ShieldCheck className="size-4"/> Como cuidamos da sua foto</button>
      </div>
      <div className="relative min-h-[20rem] overflow-hidden bg-[#a8dcf2] lg:min-h-[42rem]"><Image src={event.coverImageUrl || "/placeholders/ice-castle.svg"} alt="Castelo de gelo ilustrado do evento" fill priority className="object-cover"/><div className="absolute inset-5 rounded-[1.7rem] border border-white/60 shadow-[inset_0_0_40px_rgba(255,255,255,.5)]" /></div>
    </motion.section>
  </main>;
}
