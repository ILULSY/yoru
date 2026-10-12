import type { UniverseSlug } from "@/types/content";
import { runSearch, type SearchIndex, type SearchResponse } from "@/lib/search-core";
import { STATIC_SITE, withBase } from "@/lib/static-site";

let indexPromise: Promise<SearchIndex> | null = null;

function loadIndex(): Promise<SearchIndex> {
  indexPromise ??= fetch(withBase("/search-index.json"))
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<SearchIndex>;
    })
    .catch((e: unknown) => {
      indexPromise = null;
      throw e;
    });
  return indexPromise;
}

/**
 * Recherche depuis le navigateur : via /api/search (version complète) ou, sur
 * la version statique, dans l'index téléchargé une fois (/search-index.json).
 */
export async function searchSite(
  query: string,
  { limit, universe, signal }: { limit: number; universe?: UniverseSlug; signal?: AbortSignal },
): Promise<SearchResponse> {
  if (STATIC_SITE) {
    const index = await loadIndex();
    if (signal?.aborted) throw new DOMException("Recherche annulée", "AbortError");
    return runSearch(index, query, { limit, universe });
  }
  const params = new URLSearchParams({ q: query, limit: String(limit), ...(universe ? { univers: universe } : {}) });
  const res = await fetch(`/api/search?${params}`, { signal });
  if (!res.ok) throw new Error(String(res.status));
  return (await res.json()) as SearchResponse;
}
