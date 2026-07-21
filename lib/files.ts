export function randomId() {
  return globalThis.crypto.randomUUID().replaceAll("-", "").slice(0, 10);
}

export function photoFilename(date = new Date(), id = randomId()) {
  return `aniversario-gelo-${date.toISOString().slice(0, 10)}-${id}.jpg`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
