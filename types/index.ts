export type AspectRatio = "4:5" | "1:1" | "9:16";

export interface EventConfig {
  id: string;
  name: string;
  birthdayPersonName: string;
  age: number;
  welcomeMessage: string;
  coverImageUrl: string;
  slug: string;
  galleryEnabled: boolean;
  galleryModerationEnabled: boolean;
}

export interface Frame {
  id: string;
  eventId: string;
  name: string;
  previewUrl: string;
  storagePath: string;
  aspectRatio: AspectRatio;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface Photo {
  id: string;
  eventId: string;
  frameId: string | null;
  storagePath: string;
  publicUrl: string;
  createdAt: string;
  status: "pending" | "approved" | "hidden";
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  frame?: { name: string } | null;
}
