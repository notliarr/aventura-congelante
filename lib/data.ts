import { demoEvent, demoFrames } from "./config";
import { createServiceClient } from "./supabase/server";
import type { EventConfig, Frame, Photo } from "@/types";

export async function getEventAndFrames(): Promise<{ event: EventConfig; frames: Frame[] }> {
  const client = createServiceClient();
  if (!client) return { event: demoEvent, frames: demoFrames };
  const slug = process.env.EVENT_SLUG ?? demoEvent.slug;
  const { data: eventRow, error: eventError } = await client.from("events").select("*").eq("slug", slug).maybeSingle();
  if (eventError) throw new Error(`Não foi possível carregar o evento do Supabase: ${eventError.message}`);
  if (!eventRow) throw new Error(`O evento com slug "${slug}" não existe no Supabase. Revise EVENT_SLUG.`);
  const { data: frameRows } = await client.from("frames").select("*").eq("event_id", eventRow.id).eq("is_active", true).order("display_order");
  const event: EventConfig = { id: eventRow.id, name: eventRow.name, birthdayPersonName: eventRow.birthday_person_name, age: eventRow.age, welcomeMessage: eventRow.welcome_message, coverImageUrl: eventRow.cover_image_url, slug: eventRow.slug, galleryEnabled: eventRow.gallery_enabled, galleryModerationEnabled: eventRow.gallery_moderation_enabled };
  const frames: Frame[] = (frameRows ?? []).map(row => ({ id: row.id, eventId: row.event_id, name: row.name, previewUrl: row.preview_url, storagePath: row.storage_path, aspectRatio: row.aspect_ratio, displayOrder: row.display_order, isActive: row.is_active, createdAt: row.created_at }));
  return { event, frames: frames.length ? frames : demoFrames.map(frame => ({ ...frame, eventId: event.id })) };
}

export async function getPublicPhotos(limit = 80): Promise<Photo[]> {
  const client = createServiceClient();
  if (!client) return [];
  const { data } = await client.from("photos").select("*, frame:frames(name)").eq("status", "approved").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []).map(mapPhoto);
}

export function mapPhoto(row: Record<string, unknown>): Photo {
  return {
    id: String(row.id), eventId: String(row.event_id), frameId: row.frame_id ? String(row.frame_id) : null,
    storagePath: String(row.storage_path), publicUrl: String(row.public_url), createdAt: String(row.created_at),
    status: row.status as Photo["status"], width: Number(row.width), height: Number(row.height),
    fileSize: Number(row.file_size), mimeType: String(row.mime_type), frame: row.frame as Photo["frame"]
  };
}
