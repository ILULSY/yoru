import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/recherche", "/favoris", "/panier", "/boutique/merci"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
