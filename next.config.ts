import type { NextConfig } from "next";

const r2PublicPattern = (() => {
  const value = process.env.R2_PUBLIC_URL?.trim().replace(/\/+$/, "");
  if (!value) return null;
  try { return new URL(`${value}/**`); } catch { return null; }
})();

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      ...(r2PublicPattern ? [r2PublicPattern] : []),
    ]
  },
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(self), geolocation=(), microphone=()" }
      ]
    }];
  }
};

export default nextConfig;
