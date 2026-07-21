"use client";
import Image from "next/image";
import Link from "next/link";
import { Camera, Images, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { EventConfig } from "@/types";
import { Button } from "./ui/Button";

export function WelcomeScreen({ event, onStart, onPrivacy }: { event: EventConfig; onStart: () => void; onPrivacy: () => void }) {
  return <main id="conteudo" className="relative z-10 mx-auto flex min-h-dvh max-w-6xl items-center px-4 py-8 safe-top safe-bottom">
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass grid w-full overflow-hidden rounded-[2.25rem] lg:grid-cols-[1.05fr_.95fr]">
      <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#3d9bc6]/20 bg-white/60 px-4 py-2 text-sm font-bold uppercase tracking-[.16em]"><Sparkles className="size-4"/> Fotocabine encantada</div>
        <p className="text-sm font-bold uppercase tracking-[.2em] text-[#07567f]">{event.age} anos de magia</p>
        <h1 className="display mt-2 text-4xl leading-[1.08] sm:text-6xl">Uma aventura congelante com <span className="text-[#087bb5]">{event.birthdayPersonName}</span></h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[#183f5d]">{event.welcomeMessage}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button onClick={onStart} className="w-full sm:w-auto"><Camera className="size-5"/> Começar</Button>{event.galleryEnabled && <Link href="/galeria" className="ice-button ice-secondary w-full sm:w-auto"><Images className="size-5"/> Ver galeria</Link>}</div>
        <p className="mt-5 text-sm leading-6 text-[#37576c]">Escolha uma moldura, tire sua foto e compartilhe pelo menu do seu celular.</p>
        <button onClick={onPrivacy} className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold underline decoration-[#168fc5]/40 underline-offset-4"><ShieldCheck className="size-4"/> Como cuidamos da sua foto</button>
      </div>
      <div className="relative min-h-[20rem] overflow-hidden bg-[#a8dcf2] lg:min-h-[42rem]"><Image src={event.coverImageUrl || "/placeholders/ice-castle.svg"} alt="Castelo de gelo ilustrado do evento" fill priority className="object-cover"/><div className="absolute inset-5 rounded-[1.7rem] border border-white/60 shadow-[inset_0_0_40px_rgba(255,255,255,.5)]" /></div>
    </motion.section>
  </main>;
}
