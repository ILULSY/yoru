import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { UNIVERSES } from "@/data/universes";
import { absoluteUrl } from "@/lib/site";
import { PRODUCT_CATEGORIES } from "@/types/shop";
import { brandsWithCounts, getProducts, licensesWithCounts } from "@/lib/shop/catalog";

// Généré au build (indispensable pour la version statique du site).
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();
  const latest = articles[0]?.publishedAt ?? new Date().toISOString();

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/news"), changeFrequency: "hourly", priority: 0.9 },
    { url: absoluteUrl("/actualites"), lastModified: latest, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/boutique"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/cgv"), changeFrequency: "yearly", priority: 0.1 },
    { url: absoluteUrl("/univers"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/a-propos"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/mentions-legales"), changeFrequency: "yearly", priority: 0.1 },
    { url: absoluteUrl("/confidentialite"), changeFrequency: "yearly", priority: 0.1 },
  ];

  const universes: MetadataRoute.Sitemap = UNIVERSES.map((u) => ({
    url: absoluteUrl(`/univers/${u.slug}`),
    lastModified: articles.find((a) => a.universe === u.slug)?.publishedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const posts: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absoluteUrl(`/articles/${a.slug}`),
    lastModified: a.updatedAt ?? a.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const shop: MetadataRoute.Sitemap = [
    ...PRODUCT_CATEGORIES.map((c) => ({ url: absoluteUrl(`/boutique/${c}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: absoluteUrl("/boutique/marques"), changeFrequency: "weekly" as const, priority: 0.6 },
    ...(await brandsWithCounts()).map((b) => ({ url: absoluteUrl(`/boutique/marque/${b.slug}`), changeFrequency: "weekly" as const, priority: 0.5 })),
    ...(await licensesWithCounts()).map((l) => ({ url: absoluteUrl(`/boutique/licence/${l.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
    // Les fiches de démonstration (noindex) sont exclues.
    ...(await getProducts())
      .filter((p) => !p.demo)
      .map((p) => ({ url: absoluteUrl(`/boutique/produit/${p.slug}`), changeFrequency: "weekly" as const, priority: 0.5 })),
  ];

  return [...pages, ...universes, ...posts, ...shop];
}
