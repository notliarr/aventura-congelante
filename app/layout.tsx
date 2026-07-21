import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Uma Aventura Congelante | Fotocabine", template: "%s | Uma Aventura Congelante" },
  description: "Fotocabine digital para registrar e compartilhar momentos mágicos.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Fotocabine", statusBarStyle: "black-translucent" },
  icons: { icon: "/icons/icon.svg", apple: "/icons/icon.svg" }
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#dff5ff", viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>
    <a href="#conteudo" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 focus:translate-y-0">Pular para o conteúdo</a>
    {children}<Toaster richColors position="top-center" /><ServiceWorkerRegistration />
  </body></html>;
}
