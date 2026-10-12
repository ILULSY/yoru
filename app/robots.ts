import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Généré au build (indispensable pour la version statique du site).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/recherche", "/favoris", "/panier", "/boutique/merci"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
