import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getByUniverse } from "@/lib/content";
import { getMedia } from "@/data/media";
import { getUniverse, UNIVERSES, ARTICLE_TYPE_LABELS } from "@/data/universes";
import type { UniverseSlug } from "@/types/content";
import { UniverseHero } from "@/components/sections/UniverseHero";
import { ArticleCard, type CardVariant } from "@/components/ui/ArticleCard";
import { UniverseIcon } from "@/components/ui/UniverseIcon";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TickerBand } from "@/components/sections/TickerBand";

type Props = { params: Promise<{ slug: string }> };

/** Variante de carte qui incarne chaque univers. */
const VARIANT: Record<UniverseSlug, CardVariant> = {
  cinema: "poster",
  series: "default",
  anime: "panel",
  manga: "panel",
  "jeux-video": "cartridge",
  comics: "comic",
  collectors: "trading",
  tech: "default",
};

export function generateStaticParams() {
  return UNIVERSES.map((u) => ({ slug: u.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const u = getUniverse(slug);
  if (!u) return {};
  return {
    title: `${u.name} — ${u.tagline}`,
    description: u.description,
    keywords: u.keywords,
    alternates: { canonical: `/univers/${u.slug}` },
    openGraph: {
      title: `${u.name} · YORU`,
      description: u.description,
      url: `/univers/${u.slug}`,
      images: [{ url: `${getMedia(u.cover).src}?auto=format&fit=crop&w=1200&h=630&q=75`, width: 1200, height: 630 }],
    },
  };
}

export default async function UniversePage({ params }: Props) {
  const { slug } = await params;
  const universe = getUniverse(slug);
  if (!universe) notFound();

  const articles = await getByUniverse(universe.slug);
  const [top, ...others] = [...articles].sort((a, b) => b.popularity - a.popularity);
  const rest = others.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const tags = [...new Set(articles.flatMap((a) => a.tags))].slice(0, 14);
  const formats = [...new Set(articles.map((a) => a.type))];
  const variant = VARIANT[universe.slug];
  const isDark = universe.slug === "jeux-video";

  return (
    <div data-universe={universe.slug}>
      <UniverseHero universe={universe} cover={getMedia(universe.cover)} count={articles.length} />

      <div className={isDark ? "bg-ink pb-24 text-paper" : "pb-24"} data-surface={isDark ? "ink" : undefined}>
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          {top && (
            <section aria-labelledby="u-top" className="pt-16">
              <h2 id="u-top" className="font-mono text-xs font-bold tracking-[0.3em] uppercase">
                ★ Le plus lu de la rubrique
              </h2>
              <Reveal className="mt-5">
                <ArticleCard article={top} variant="overlay" className="h-[24rem] sm:h-[30rem]" headingLevel="h3" />
              </Reveal>
            </section>
          )}

          {rest.length > 0 && (
            <section aria-labelledby="u-all" className="pt-16">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="u-all" className="display text-[clamp(2.5rem,6vw,4.5rem)]">
                  Tous les articles
                </h2>
                <p className="font-mono text-xs tracking-wider uppercase opacity-75">
                  Formats : {formats.map((f) => ARTICLE_TYPE_LABELS[f]).join(" · ")}
                </p>
              </div>
              <RevealGroup
                className={
                  variant === "poster" || variant === "trading"
                    ? "mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                    : "mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
                }
                step={0.08}
              >
                {rest.map((a, i) => (
                  <RevealItem key={a.slug}>
                    <ArticleCard article={a} variant={variant} index={i + 1} className="h-full" />
                  </RevealItem>
                ))}
              </RevealGroup>
            </section>
          )}

          {articles.length === 0 && (
            <p className="mt-16 border-[3px] border-dashed border-current p-8 text-center text-lg">
              Aucun article publié pour l&apos;instant dans cet univers. Revenez bientôt !
            </p>
          )}

          {tags.length > 0 && (
            <section aria-labelledby="u-tags" className="pt-16">
              <h2 id="u-tags" className="font-mono text-xs font-bold tracking-[0.3em] uppercase">
                Explorer par mot-clé
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <li key={t}>
                    <Link
                      href={`/recherche?q=${encodeURIComponent(t)}&univers=${universe.slug}`}
                      className="inline-block border-2 border-current px-3 py-1.5 text-sm font-semibold transition-transform duration-200 ease-[var(--ease-pop)] hover:-translate-y-0.5 hover:rotate-[-3deg]"
                      style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
                    >
                      #{t}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <TickerBand />

      <section aria-labelledby="u-others" className="mx-auto max-w-[88rem] px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <h2 id="u-others" className="display text-[clamp(2.5rem,6vw,4.5rem)]">
          Autres univers
        </h2>
        <RevealGroup as="ul" className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4" step={0.05}>
          {UNIVERSES.filter((u) => u.slug !== universe.slug).map((u) => (
            <RevealItem as="li" key={u.slug}>
              <Link
                href={`/univers/${u.slug}`}
                data-universe={u.slug}
                className="group flex h-28 flex-col justify-between border-[3px] border-ink bg-u p-3 text-u-fg transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:-rotate-1 hover:shadow-pop"
              >
                <span className="flex items-center justify-between font-mono text-xs font-bold">
                  {u.number}
                  <UniverseIcon universe={u.slug} className="size-5 transition-transform duration-500 group-hover:rotate-12" />
                </span>
                <span className="display flex items-end justify-between text-3xl">
                  {u.name}
                  <ArrowUpRight className="size-5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </div>
  );
}
