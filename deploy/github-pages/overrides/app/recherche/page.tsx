import type { Metadata } from "next";
import { Suspense } from "react";
import { SEARCH_SUGGESTIONS } from "@/lib/search";
import { getPopular } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { SearchFromUrl } from "@/components/news/SearchFromUrl";

/**
 * Page de recherche de la version statique (GitHub Pages) : remplace
 * app/recherche/page.tsx au build. La requête est lue dans le navigateur et la
 * recherche se fait dans /search-index.json.
 */
export const metadata: Metadata = {
  title: "Recherche",
  description: "Recherchez parmi tous les articles YORU : cinéma, séries, anime, manga, jeux vidéo, comics, collectors et tech.",
  alternates: { canonical: "/recherche" },
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  const popular = await getPopular(4);
  return (
    <>
      <PageHero kicker="§ Trouver" title="Recherche" intro="Titres, studios, licences, mots-clés : tapez, les résultats arrivent en direct." tone="pink" />
      <section className="mx-auto max-w-[88rem] px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <SearchFromUrl suggestions={SEARCH_SUGGESTIONS} popular={popular} />
        </Suspense>
      </section>
    </>
  );
}
