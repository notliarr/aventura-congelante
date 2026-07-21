import { LiveSlideshow } from "@/components/gallery/LiveSlideshow";
import { getPublicPhotos } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function LivePage({ searchParams }: { searchParams: Promise<{ intervalo?: string }> }) { const { intervalo } = await searchParams; const parsed = Number(intervalo ?? 8); const seconds = Number.isFinite(parsed) ? Math.min(60, Math.max(3, parsed)) : 8; return <LiveSlideshow initialPhotos={await getPublicPhotos(150)} initialInterval={seconds}/>; }
