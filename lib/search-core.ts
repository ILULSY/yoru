import type { ArticleSummary, UniverseSlug } from "@/types/content";
import { levenshtein, normalize } from "@/lib/text";
import { currentPricing, type PriceFields } from "@/lib/shop/pricing";

/**
 * Moteur de recherche sans dépendance serveur. L'index est construit par
 * lib/search.ts ; la recherche tourne sur le serveur (/api/search) ou, pour la
 * version statique du site (GitHub Pages), dans le navigateur à partir de
 * /search-index.json.
 */

export interface ProductHit {
  slug: string;
  name: string;
  price: number;
  currency: "EUR" | "CHF";
  license: string;
  color: string;
  ink: string;
}

export interface SearchResponse {
  query: string;
  results: ArticleSummary[];
  total: number;
  /** true si aucun résultat ne contient tous les mots : on affiche des résultats partiels. */
  approximate: boolean;
  /** Suggestions de correction (« Vouliez-vous dire… »). */
  didYouMean: string[];
  /** Produits de la boutique correspondants. */
  products: ProductHit[];
}

export interface IndexEntry {
  summary: ArticleSummary;
  title: string;
  tags: string;
  universe: string;
  lead: string;
  body: string;
}

export interface ProductEntry extends PriceFields {
  slug: string;
  name: string;
  /** Texte normalisé dans lequel on cherche. */
  hay: string;
  popularity: number;
  license: string;
  color: string;
  ink: string;
}

export interface SearchIndex {
  entries: IndexEntry[];
  vocabulary: string[];
  products: ProductEntry[];
}

const wordStart = (hay: string, token: string) => hay.startsWith(token) || hay.includes(` ${token}`);

function scoreToken(e: IndexEntry, t: string): number {
  let s = 0;
  if (wordStart(e.title, t)) s += 10;
  else if (e.title.includes(t)) s += 5;
  if (wordStart(e.tags, t)) s += 8;
  if (wordStart(e.universe, t)) s += 6;
  if (wordStart(e.lead, t)) s += 4;
  if (wordStart(e.body, t)) s += Math.min(4, e.body.split(` ${t}`).length - 1 || 1);
  return s;
}

const STOP = new Set(["le", "la", "les", "de", "des", "du", "un", "une", "et", "en", "a", "au", "aux", "l", "d", "pour", "sur"]);

function searchProducts(products: ProductEntry[], tokens: string[], limit: number, now: number): ProductHit[] {
  if (!tokens.length) return [];
  return products
    .filter((p) => tokens.every((t) => p.hay.includes(t)))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      price: currentPricing(p, now).price,
      currency: p.currency ?? "EUR",
      license: p.license,
      color: p.color,
      ink: p.ink,
    }));
}

export function runSearch(
  index: SearchIndex,
  rawQuery: string,
  opts: { universe?: UniverseSlug; limit?: number } = {},
  now = Date.now(),
): SearchResponse {
  const query = rawQuery.trim().slice(0, 80);
  const tokens = normalize(query)
    .split(" ")
    .filter((t) => t.length > 1 && !STOP.has(t));
  const pool = opts.universe ? index.entries.filter((e) => e.summary.universe === opts.universe) : index.entries;

  if (!tokens.length) {
    return { query, results: [], total: 0, approximate: false, didYouMean: [], products: [] };
  }

  const scored = pool.map((e) => {
    const perToken = tokens.map((t) => scoreToken(e, t));
    return {
      e,
      all: perToken.every((s) => s > 0),
      score: perToken.reduce((a, b) => a + b, 0) + e.summary.popularity / 1e6,
    };
  });

  let matches = scored.filter((s) => s.all);
  let approximate = false;
  if (!matches.length) {
    matches = scored.filter((s) => s.score >= 1);
    approximate = matches.length > 0;
  }
  matches.sort((a, b) => b.score - a.score);

  let didYouMean: string[] = [];
  if (!matches.length || approximate) {
    didYouMean = tokens
      .map((t) => {
        let best: { w: string; d: number } | null = null;
        for (const w of index.vocabulary) {
          const d = levenshtein(t, w);
          if (d > 0 && d <= (t.length > 5 ? 2 : 1) && (!best || d < best.d)) best = { w, d };
        }
        return best?.w;
      })
      .filter((w): w is string => Boolean(w));
    didYouMean = [...new Set(didYouMean)].slice(0, 3);
  }

  const results = matches.slice(0, opts.limit ?? 30).map((m) => m.e.summary);
  const products = searchProducts(index.products, tokens, (opts.limit ?? 30) <= 6 ? 3 : 8, now);
  return { query, results, total: matches.length, approximate, didYouMean, products };
}
