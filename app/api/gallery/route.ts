import { NextResponse } from "next/server";
import { getEventAndFrames, getPublicPhotos } from "@/lib/data";
export async function GET() { const [{ event }, photos] = await Promise.all([getEventAndFrames(), getPublicPhotos()]); if (!event.galleryEnabled) return NextResponse.json({ enabled: false, photos: [] }); return NextResponse.json({ enabled: true, photos }, { headers: { "Cache-Control": "no-store" } }); }
