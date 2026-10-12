import type { Metadata } from "next";
import { UNIVERSE_SLUGS, type UniverseSlug } from "@/types/content";
import { searchArticles, SEARCH_SUGGESTIONS } from "@/lib/search";
import { getPopular } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { SearchClient } from "@/components/news/SearchClient";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  return {
    title: query ? `Recherche : ${query}` : "Recherche",
    description: "Recherchez parmi tous les articles YORU : cinéma, séries, anime, manga, jeux vidéo, comics, collectors et tech.",
    alternates: { canonical: "/recherche" },
    // Les pages de résultats ne doivent pas être indexées.
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const u = typeof sp.univers === "string" && (UNIVERSE_SLUGS as readonly string[]).includes(sp.univers) ? (sp.univers as UniverseSlug) : "all";
  const [initial, popular] = await Promise.all([
    q.trim().length >= 2 ? searchArticles(q, { universe: u === "all" ? undefined : u, limit: 30 }) : Promise.resolve(null),
    getPopular(4),
  ]);

  return (
    <>
      <PageHero kicker="§ Trouver" title="Recherche" intro="Titres, studios, licences, mots-clés : tapez, les résultats arrivent en direct." tone="pink" />
      <section className="mx-auto max-w-[88rem] px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <SearchClient initialQuery={q} initialUniverse={u} initial={initial} suggestions={SEARCH_SUGGESTIONS} popular={popular} />
      </section>
    </>
  );
}
