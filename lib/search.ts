import type { ArticleSummary, UniverseSlug } from "@/types/content";
import { getAllArticles, plainText, toSummary } from "@/lib/content";
import { UNIVERSE_MAP, UNIVERSES } from "@/data/universes";
import { levenshtein, normalize } from "@/lib/text";
import { getProducts } from "@/lib/shop/catalog";
import { licenseOf } from "@/data/shop/licenses";
import { currentPricing } from "@/lib/shop/pricing";


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

async function searchProducts(tokens: string[], limit: number): Promise<ProductHit[]> {
  if (!tokens.length) return [];
  return (await getProducts())
    .map((p) => {
      const lic = licenseOf(p.license);
      const hay = normalize(`${p.name} ${p.type} ${p.tags.join(" ")} ${lic.name} ${lic.short} ${p.character ?? ""}`);
      return { p, lic, ok: tokens.every((t) => hay.includes(t)) };
    })
    .filter((x) => x.ok)
    .sort((a, b) => b.p.popularity - a.p.popularity)
    .slice(0, limit)
    .map(({ p, lic }) => ({ slug: p.slug, name: p.name, price: currentPricing(p, Date.now()).price, currency: p.currency ?? "EUR", license: lic.name, color: lic.color, ink: lic.ink }));
}

interface IndexEntry {
  summary: ArticleSummary;
  title: string;
  tags: string;
  universe: string;
  lead: string;
  body: string;
}

let indexPromise: Promise<{ entries: IndexEntry[]; vocabulary: string[] }> | null = null;

async function buildIndex() {
  const articles = await getAllArticles();
  const vocab = new Set<string>();
  const entries = articles.map((a) => {
    const u = UNIVERSE_MAP[a.universe];
    const entry: IndexEntry = {
      summary: toSummary(a),
      title: normalize(a.title),
      tags: normalize(a.tags.join(" ")),
      universe: normalize(`${u.name} ${u.short} ${u.keywords.join(" ")}`),
      lead: normalize(`${a.subtitle} ${a.excerpt}`),
      body: normalize(plainText(a)),
    };
    for (const w of `${entry.title} ${entry.tags} ${entry.universe}`.split(" ")) if (w.length > 3) vocab.add(w);
    return entry;
  });
  return { entries, vocabulary: [...vocab] };
}

function getIndex() {
  // En développement, on reconstruit l'index pour refléter les modifications de contenu.
  if (process.env.NODE_ENV !== "production") return buildIndex();
  indexPromise ??= buildIndex();
  return indexPromise;
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

export async function searchArticles(
  rawQuery: string,
  opts: { universe?: UniverseSlug; limit?: number } = {},
): Promise<SearchResponse> {
  const query = rawQuery.trim().slice(0, 80);
  const tokens = normalize(query)
    .split(" ")
    .filter((t) => t.length > 1 && !STOP.has(t));
  const { entries, vocabulary } = await getIndex();
  const pool = opts.universe ? entries.filter((e) => e.summary.universe === opts.universe) : entries;

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
        for (const w of vocabulary) {
          const d = levenshtein(t, w);
          if (d > 0 && d <= (t.length > 5 ? 2 : 1) && (!best || d < best.d)) best = { w, d };
        }
        return best?.w;
      })
      .filter((w): w is string => Boolean(w));
    didYouMean = [...new Set(didYouMean)].slice(0, 3);
  }

  const results = matches.slice(0, opts.limit ?? 30).map((m) => m.e.summary);
  const products = await searchProducts(tokens, (opts.limit ?? 30) <= 6 ? 3 : 8);
  return { query, results, total: matches.length, approximate, didYouMean, products };
}

/** Suggestions affichées quand le champ de recherche est vide. */
export const SEARCH_SUGGESTIONS = [
  "One Piece",
  "Ghibli",
  "grading",
  "metroidvania",
  "Spider-Verse",
  "kaiju",
  "cosplay",
  "clavier mécanique",
];

export const SEARCHABLE_UNIVERSES = UNIVERSES.map((u) => ({ slug: u.slug, name: u.name }));
