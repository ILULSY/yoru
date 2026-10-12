import { cache } from "react";
import type { Article, ArticleSummary, TocEntry, UniverseSlug } from "@/types/content";
import { getMedia } from "@/data/media";
import { stripInline } from "@/lib/text";
import { localSource } from "./sources/local";
import type { ContentSource } from "./sources/types";

/**
 * Dépôt de contenu : l'unique point d'accès des pages aux articles.
 * Les pages ne savent pas d'où viennent les données (fichiers, Supabase, CMS).
 */

async function resolveSource(): Promise<ContentSource> {
  if (process.env.CONTENT_SOURCE === "supabase") {
    const { supabaseSource } = await import("./sources/supabase");
    return supabaseSource;
  }
  return localSource;
}

const byDateDesc = (a: Article, b: Article) => b.publishedAt.localeCompare(a.publishedAt);

export const getAllArticles = cache(async (): Promise<Article[]> => {
  const source = await resolveSource();
  const list = await source.listArticles();
  return [...list].sort(byDateDesc);
});

export async function getArticle(slug: string): Promise<Article | undefined> {
  return (await getAllArticles()).find((a) => a.slug === slug);
}

export function readingMinutes(article: Article): number {
  const words = article.body
    .map((b) => {
      switch (b.type) {
        case "list":
          return b.items.join(" ");
        case "verdict":
          return [b.text, ...b.pros, ...b.cons].join(" ");
        case "image":
          return b.caption ?? "";
        default:
          return b.text;
      }
    })
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function toSummary(a: Article): ArticleSummary {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    universe: a.universe,
    type: a.type,
    tags: a.tags,
    cover: getMedia(a.cover, a.title),
    publishedAt: a.publishedAt,
    popularity: a.popularity,
    readingMinutes: readingMinutes(a),
    demo: a.demo,
    rating: a.rating,
    featured: a.featured,
  };
}

export const getSummaries = cache(async (): Promise<ArticleSummary[]> => {
  return (await getAllArticles()).map(toSummary);
});

export async function getByUniverse(universe: UniverseSlug): Promise<ArticleSummary[]> {
  return (await getSummaries()).filter((a) => a.universe === universe);
}

export async function getFeatured(): Promise<ArticleSummary> {
  const all = await getSummaries();
  return all.find((a) => a.featured) ?? all[0]!;
}

export async function getPopular(limit = 8): Promise<ArticleSummary[]> {
  return [...(await getSummaries())].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export async function getLatest(limit = 6, exclude: string[] = []): Promise<ArticleSummary[]> {
  return (await getSummaries()).filter((a) => !exclude.includes(a.slug)).slice(0, limit);
}

/** Articles similaires : même univers et tags partagés, puis popularité. */
export async function getRelated(article: Article, limit = 3): Promise<ArticleSummary[]> {
  const all = await getSummaries();
  const tags = new Set(article.tags.map((t) => t.toLowerCase()));
  return all
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({
      a,
      score:
        (a.universe === article.universe ? 3 : 0) +
        a.tags.filter((t) => tags.has(t.toLowerCase())).length * 2 +
        a.popularity / 100000,
    }))
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);
}

/** Article précédent (plus ancien) et suivant (plus récent) dans l'ordre chronologique. */
export async function getPrevNext(slug: string) {
  const all = await getSummaries();
  const i = all.findIndex((a) => a.slug === slug);
  return { newer: i > 0 ? all[i - 1] : undefined, older: i >= 0 ? all[i + 1] : undefined };
}

export function getToc(article: Article): TocEntry[] {
  return article.body.flatMap((b) => (b.type === "h2" ? [{ id: b.id, text: stripInline(b.text) }] : []));
}

/** Texte brut de l'article, utilisé pour l'indexation de la recherche. */
export function plainText(article: Article): string {
  return stripInline(
    article.body
      .map((b) => {
        if (b.type === "list") return b.items.join(" ");
        if (b.type === "verdict") return b.text;
        if (b.type === "image") return b.caption ?? "";
        return b.text;
      })
      .join(" "),
  );
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const counts = new Map<string, number>();
  for (const a of await getAllArticles()) for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
}
