import "server-only";
import type { Article, Block } from "@/types/content";
import { validateArticles } from "../schema";
import type { ContentSource } from "./types";

/**
 * Source Supabase (PostgREST), sans dépendance supplémentaire.
 * Schéma et règles RLS : voir supabase/schema.sql.
 *
 * ⚠️ Non testée contre un projet réel dans cette livraison : elle nécessite
 * SUPABASE_URL et SUPABASE_ANON_KEY. La clé « anon » est publique par nature ;
 * la sécurité repose sur la politique RLS qui n'autorise que la lecture des
 * articles publiés. N'utilisez JAMAIS la clé service_role ici.
 */

interface Row {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  universe: Article["universe"];
  type: Article["type"];
  tags: string[];
  cover: string;
  published_at: string;
  updated_at: string | null;
  author: string;
  featured: boolean | null;
  popularity: number | null;
  demo: boolean | null;
  rating: number | null;
  body: Block[];
}

function toArticle(r: Row): Article {
  return {
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle,
    excerpt: r.excerpt,
    universe: r.universe,
    type: r.type,
    tags: r.tags ?? [],
    cover: r.cover,
    publishedAt: r.published_at,
    updatedAt: r.updated_at ?? undefined,
    author: r.author,
    featured: r.featured ?? undefined,
    popularity: r.popularity ?? 0,
    demo: r.demo ?? false,
    rating: r.rating ?? undefined,
    body: r.body,
  };
}

export const supabaseSource: ContentSource = {
  name: "supabase",
  async listArticles() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("[contenu] CONTENT_SOURCE=supabase mais SUPABASE_URL / SUPABASE_ANON_KEY sont absents.");
    }
    const res = await fetch(
      `${url}/rest/v1/articles?select=*&status=eq.published&order=published_at.desc`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: 300, tags: ["articles"] },
      },
    );
    if (!res.ok) throw new Error(`[contenu] Supabase a répondu ${res.status}`);
    const rows = (await res.json()) as Row[];
    return validateArticles(rows.map(toArticle));
  },
};
