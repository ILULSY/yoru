import type { Metadata } from "next";
import { Suspense } from "react";
import { getPopular, getSummaries, getFeatured } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { NewsExplorer } from "@/components/news/NewsExplorer";
import { Reveal } from "@/components/motion/Reveal";
import type { ArticleSummary } from "@/types/content";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Toutes les actus YORU : cinéma, séries, anime, manga, jeux vidéo, comics, collectors et tech. Filtrez par univers, format ou mots-clés.",
  alternates: { canonical: "/actualites" },
};

/**
 * Rendu serveur affiché avant l'activation des filtres (et sans JavaScript) :
 * la liste réelle des derniers articles, lisible et indexable.
 */
function ExplorerFallback({ articles }: { articles: ArticleSummary[] }) {
  return (
    <div>
      <div className="skeleton h-48 border-[3px] border-ink/10" aria-hidden />
      <p className="mt-8 font-mono text-sm font-bold">{articles.length} articles</p>
      <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {articles.slice(0, 9).map((a) => (
          <li key={a.slug}>
            <ArticleCard article={a} className="h-full" sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 92vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function NewsPage() {
  const [articles, featured, popular] = await Promise.all([getSummaries(), getFeatured(), getPopular(2)]);
  const highlights = [featured, ...popular.filter((p) => p.slug !== featured.slug)].slice(0, 2);

  return (
    <>
      <PageHero
        kicker="§ Le fil YORU"
        title="Actualités"
        intro="Toutes nos publications, des analyses aux guides pratiques. Filtrez par univers, par format, triez par date ou par popularité."
      />

      <section aria-labelledby="highlights-title" className="mx-auto max-w-[88rem] px-4 pt-14 sm:px-6 lg:px-8">
        <h2 id="highlights-title" className="font-mono text-xs font-bold tracking-[0.3em] uppercase">
          ★ Mis en avant
        </h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {highlights.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.1}>
              <ArticleCard article={a} variant="overlay" className="h-80 sm:h-96" headingLevel="h3" priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-label="Tous les articles" className="mx-auto max-w-[88rem] px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <Suspense fallback={<ExplorerFallback articles={articles} />}>
          <NewsExplorer articles={articles} />
        </Suspense>
      </section>
    </>
  );
}
