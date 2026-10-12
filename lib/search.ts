import "server-only";
import type { UniverseSlug } from "@/types/content";
import { getAllArticles, plainText, toSummary } from "@/lib/content";
import { UNIVERSE_MAP, UNIVERSES } from "@/data/universes";
import { normalize } from "@/lib/text";
import { getProducts } from "@/lib/shop/catalog";
import { licenseOf } from "@/data/shop/licenses";
import { priceFields } from "@/lib/shop/pricing";
import { runSearch, type IndexEntry, type SearchIndex, type SearchResponse } from "@/lib/search-core";

export type { ProductHit, SearchResponse } from "@/lib/search-core";

/** Index de recherche : articles (texte normalisé), vocabulaire pour les suggestions, produits publiés. */
export async function buildSearchIndex(): Promise<SearchIndex> {
  const [articles, products] = await Promise.all([getAllArticles(), getProducts()]);
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
  return {
    entries,
    vocabulary: [...vocab],
    products: products.map((p) => {
      const lic = licenseOf(p.license);
      return {
        ...priceFields(p),
        slug: p.slug,
        name: p.name,
        hay: normalize(`${p.name} ${p.type} ${p.tags.join(" ")} ${lic.name} ${lic.short} ${p.character ?? ""}`),
        popularity: p.popularity,
        license: lic.name,
        color: lic.color,
        ink: lic.ink,
      };
    }),
  };
}

let indexPromise: Promise<SearchIndex> | null = null;

function getIndex() {
  // En développement, on reconstruit l'index pour refléter les modifications de contenu.
  if (process.env.NODE_ENV !== "production") return buildSearchIndex();
  indexPromise ??= buildSearchIndex();
  return indexPromise;
}

export async function searchArticles(rawQuery: string, opts: { universe?: UniverseSlug; limit?: number } = {}): Promise<SearchResponse> {
  return runSearch(await getIndex(), rawQuery, opts);
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
