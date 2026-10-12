import { z } from "zod";
import { ARTICLE_TYPES, UNIVERSE_SLUGS, type Article } from "@/types/content";
import { isMediaRef } from "@/data/media";

/**
 * Schéma de validation des articles. Il s'applique quelle que soit la source
 * (fichiers locaux, Supabase, CMS) : un contenu invalide est rejeté avec un
 * message explicite plutôt que de casser une page en production.
 */

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug : minuscules, chiffres et tirets uniquement");

const mediaKey = z.string().refine(isMediaRef, {
  message: "image inconnue (clé de data/media.ts, chemin /images/… ou URL https)",
});

const block = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string().min(1) }),
  z.object({ type: z.literal("h2"), id: slug, text: z.string().min(1) }),
  z.object({ type: z.literal("h3"), text: z.string().min(1) }),
  z.object({ type: z.literal("quote"), text: z.string().min(1), cite: z.string().optional() }),
  z.object({ type: z.literal("list"), ordered: z.boolean().optional(), items: z.array(z.string().min(1)).min(1) }),
  z.object({ type: z.literal("image"), image: mediaKey, caption: z.string().optional() }),
  z.object({
    type: z.literal("callout"),
    tone: z.enum(["info", "tip", "warning"]),
    title: z.string().optional(),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("verdict"),
    score: z.number().min(0).max(10),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    text: z.string(),
  }),
]);

export const articleSchema = z.object({
  slug,
  title: z.string().min(10).max(140),
  subtitle: z.string().min(20),
  excerpt: z.string().min(20).max(220),
  universe: z.enum(UNIVERSE_SLUGS),
  type: z.enum(ARTICLE_TYPES),
  tags: z.array(z.string().min(1)).min(1).max(8),
  cover: mediaKey,
  publishedAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }).optional(),
  author: z.string().min(1),
  featured: z.boolean().optional(),
  popularity: z.number().int().nonnegative(),
  demo: z.boolean(),
  rating: z.number().min(0).max(10).optional(),
  body: z.array(block).min(1),
});

/** Valide une liste d'articles et vérifie les contraintes globales. */
export function validateArticles(input: unknown[]): Article[] {
  const errors: string[] = [];
  const articles: Article[] = [];

  input.forEach((raw, i) => {
    const res = articleSchema.safeParse(raw);
    if (!res.success) {
      const name = (raw as { slug?: string })?.slug ?? `#${i}`;
      errors.push(
        `Article "${name}" :\n` +
          res.error.issues.map((iss) => `  - ${iss.path.join(".")} → ${iss.message}`).join("\n"),
      );
    } else {
      articles.push(res.data as Article);
    }
  });

  const slugs = new Set<string>();
  for (const a of articles) {
    if (slugs.has(a.slug)) errors.push(`Slug en double : "${a.slug}"`);
    slugs.add(a.slug);
    const ids = a.body.filter((b) => b.type === "h2").map((b) => b.id);
    if (new Set(ids).size !== ids.length) errors.push(`Ancres h2 en double dans "${a.slug}"`);
  }

  // Liens internes vers des articles inexistants
  for (const a of articles) {
    const text = JSON.stringify(a.body);
    for (const m of text.matchAll(/\]\(\/articles\/([a-z0-9-]+)\)/g)) {
      if (!slugs.has(m[1]!)) errors.push(`Lien interne cassé dans "${a.slug}" → /articles/${m[1]}`);
    }
  }

  if (errors.length) {
    throw new Error(`[contenu] ${errors.length} problème(s) détecté(s) :\n\n${errors.join("\n\n")}`);
  }
  return articles;
}
