import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Photos produit stockées dans Supabase Storage (PRODUCTS_SOURCE=supabase).
const supabaseHost = (() => {
  try {
    return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).host : null;
  } catch {
    return null;
  }
})();

/**
 * Content-Security-Policy appliquée en production.
 * - Les images distantes proviennent du CDN Unsplash (et de Supabase Storage si configuré).
 * - 'unsafe-inline' reste nécessaire pour les scripts d'hydratation de Next.js
 *   et le petit script anti-flash (préférences d'animation). Pour aller plus
 *   loin, passez à une CSP à nonce via `proxy.ts` (voir README).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://images.unsplash.com${supabaseHost ? ` https://${supabaseHost}` : ""}`,
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Les photos Unsplash passent par un loader dédié (CDN imgix d'Unsplash),
    // ce motif sert de garde-fou si l'optimiseur Next est utilisé.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(supabaseHost ? [{ protocol: "https" as const, hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] : []),
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75, 85],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
