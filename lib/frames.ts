import type { Frame } from "@/types";
export function availableFrames(frames: Frame[]) { return [...frames].filter(frame => frame.isActive).sort((a,b) => a.displayOrder - b.displayOrder); }
