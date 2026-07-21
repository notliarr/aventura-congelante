"use client";
import { Download } from "lucide-react";
import { downloadBlob, photoFilename } from "@/lib/files";
import { Button } from "./ui/Button";
export function DownloadButton({ blob, className = "" }: { blob: Blob; className?: string }) { return <Button variant="secondary" className={className} onClick={() => downloadBlob(blob, photoFilename())}><Download className="size-5"/> Baixar foto</Button>; }
