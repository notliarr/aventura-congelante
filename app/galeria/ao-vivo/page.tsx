import { LiveSlideshow } from "@/components/gallery/LiveSlideshow";
import { getPublicPhotos } from "@/lib/data";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function LivePage({ searchParams }: { searchParams: Promise<{ intervalo?: string; modo?: string }> }) { const { intervalo, modo } = await searchParams; const parsed = Number(intervalo ?? 8); const seconds = Number.isFinite(parsed) ? Math.min(60, Math.max(3, parsed)) : 8; const userAgent = (await headers()).get("user-agent") ?? ""; const smartTv = /SmartTV|SMART-TV|Tizen|Web0S|webOS|NetCast|HbbTV|Viera|BRAVIA|AFT[A-Z]|CrKey/i.test(userAgent); if (smartTv && modo !== "moderno") redirect(`/tv?intervalo=${seconds}`); return <LiveSlideshow initialPhotos={await getPublicPhotos(150)} initialInterval={seconds}/>; }
