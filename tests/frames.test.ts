import { describe, expect, it } from "vitest";
import { availableFrames } from "@/lib/frames";
import type { Frame } from "@/types";
const base = { eventId: "e", previewUrl: "", storagePath: "", aspectRatio: "4:5", createdAt: "" } as const;
describe("seleção de molduras", () => { it("remove inativas e respeita a ordem", () => { const frames = [{...base,id:"b",name:"B",displayOrder:2,isActive:true},{...base,id:"x",name:"X",displayOrder:0,isActive:false},{...base,id:"a",name:"A",displayOrder:1,isActive:true}] as Frame[]; expect(availableFrames(frames).map(item => item.id)).toEqual(["a","b"]); }); });
