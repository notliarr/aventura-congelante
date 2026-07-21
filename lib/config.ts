import type { EventConfig, Frame } from "@/types";

export const demoEvent: EventConfig = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "Uma Aventura Congelante da Liz",
  birthdayPersonName: "Luna",
  age: 6,
  welcomeMessage: "Bem-vindo à nossa aventura congelante! Escolha sua moldura, registre este momento especial e compartilhe sua foto.",
  coverImageUrl: "/placeholders/ice-castle.svg",
  slug: process.env.EVENT_SLUG ?? "aventura-congelante",
  galleryEnabled: true,
  galleryModerationEnabled: true
};

const createdAt = "2026-07-21T12:00:00.000Z";
export const demoFrames: Frame[] = [
  ["10000000-0000-4000-8000-000000000001", "Neve Encantada", "/frames/neve-encantada.svg", "4:5"],
  ["10000000-0000-4000-8000-000000000002", "Cristais de Gelo", "/frames/cristais-de-gelo.svg", "1:1"],
  ["10000000-0000-4000-8000-000000000003", "Aurora Azul", "/frames/aurora-azul.svg", "9:16"],
  ["10000000-0000-4000-8000-000000000004", "Princesa do Inverno", "/frames/princesa-do-inverno.svg", "4:5"]
].map(([id, name, previewUrl, aspectRatio], displayOrder) => ({
  id, eventId: demoEvent.id, name, previewUrl, storagePath: previewUrl,
  aspectRatio: aspectRatio as Frame["aspectRatio"], displayOrder, isActive: true, createdAt
}));

export const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
