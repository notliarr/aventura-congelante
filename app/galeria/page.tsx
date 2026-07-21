import type { Metadata } from "next";
import { PublicGallery } from "@/components/gallery/PublicGallery";
import { SnowBackground } from "@/components/SnowBackground";
import { getEventAndFrames, getPublicPhotos } from "@/lib/data";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Galeria" };
export default async function GalleryPage() { const [{ event }, photos] = await Promise.all([getEventAndFrames(), getPublicPhotos()]); return <><SnowBackground/><PublicGallery initialPhotos={photos} enabled={event.galleryEnabled}/></>; }
