import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Version statique pour GitHub Pages (STATIC_EXPORT=1, voir deploy/github-pages) :
 * export HTML, servi dans un sous-dossier (PAGES_BASE_PATH, ex. /yoru), sans
 * serveur ni optimiseur d'images.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = isStaticExport ? (process.env.PAGES_BASE_PATH ?? "") : "";

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
  ...(isStaticExport ? { output: "export" as const, basePath, trailingSlash: true } : {}),
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: isStaticExport ? "1" : "",
    NEXT_PUBLIC_BASE_PATH: basePath,
    // Construit par GitHub Actions : chaque enregistrement de l'espace édition en ligne republie le site.
    NEXT_PUBLIC_PAGES_AUTOPUBLISH: isStaticExport && process.env.GITHUB_ACTIONS === "true" ? "1" : "",
  },
  // Le catalogue est lu à l'exécution (pages régénérées, recherche, paiement) : il doit
  // accompagner le code sur les hébergements serverless (Vercel).
  outputFileTracingIncludes: {
    "/": ["./data/shop/catalog.json"],
    "/**": ["./data/shop/catalog.json"],
  },
  images: {
    // Les photos Unsplash passent par un loader dédié (CDN imgix d'Unsplash),
    // ce motif sert de garde-fou si l'optimiseur Next est utilisé.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(supabaseHost ? [{ protocol: "https" as const, hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] : []),
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75, 85],
    ...(isStaticExport ? { loader: "custom" as const, loaderFile: "./lib/image-loader.ts" } : {}),
  },
  // Les en-têtes HTTP ne s'appliquent pas à un export statique (GitHub Pages ne permet pas de les définir).
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
