import { PhotoBooth } from "@/components/PhotoBooth";
import { getEventAndFrames } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function HomePage() { const data = await getEventAndFrames(); return <PhotoBooth {...data}/>; }
