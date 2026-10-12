"use client";

import { useSearchParams } from "next/navigation";
import { UNIVERSE_SLUGS, type ArticleSummary, type UniverseSlug } from "@/types/content";
import { SearchClient } from "@/components/news/SearchClient";

/**
 * Recherche lue depuis l'adresse (?q=…&univers=…) dans le navigateur, pour la
 * version statique du site où la page ne peut pas lire l'adresse au build.
 */
export function SearchFromUrl({ suggestions, popular }: { suggestions: string[]; popular: ArticleSummary[] }) {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").slice(0, 80);
  const u = params.get("univers");
  const universe = u && (UNIVERSE_SLUGS as readonly string[]).includes(u) ? (u as UniverseSlug) : "all";
  return <SearchClient initialQuery={q} initialUniverse={universe} initial={null} suggestions={suggestions} popular={popular} />;
}
