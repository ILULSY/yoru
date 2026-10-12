import Link from "next/link";
import type { ArticleSummary } from "@/types/content";
import { UNIVERSE_MAP } from "@/data/universes";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { ScoreDial } from "@/components/ui/ScoreDial";
import { UniverseBadge } from "@/components/ui/Badges";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { formatShortDate, frTypo } from "@/lib/text";

/**
 * Dossiers & critiques : maquette de magazine asymétrique, avec la critique
 * notée, des dossiers façon couvertures numérotées et une colonne de guides.
 */
export function EditorialSection({
  critique,
  dossiers,
  guides,
}: {
  critique?: ArticleSummary;
  dossiers: ArticleSummary[];
  guides: ArticleSummary[];
}) {
  return (
    <section aria-labelledby="editorial-title" className="relative mx-auto max-w-[88rem] px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        id="editorial-title"
        number="10"
        kicker="Lire, comprendre, approfondir"
        title="Dossiers & critiques"
        numberClassName="[--stroke:var(--color-paper-3)]"
        link={{ href: "/actualites?type=dossier", label: "Tous les dossiers" }}
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        {critique && (
          <Reveal className="lg:col-span-5">
            <Link
              href={`/articles/${critique.slug}`}
              data-universe={critique.universe}
              className="group relative block border-[4px] border-ink bg-paper shadow-pop-lg transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:-rotate-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b-[4px] border-ink">
                <SmartImage asset={critique.cover} sizes="(min-width: 1024px) 40vw, 92vw" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute top-3 left-3 border-[3px] border-ink bg-pink px-3 py-1 font-comic text-xl text-ink">La critique</span>
              </div>
              <div className="flex items-start gap-5 p-5">
                {critique.rating !== undefined && <ScoreDial score={critique.rating} size={104} className="-mt-16 shrink-0" />}
                <div className="min-w-0">
                  <UniverseBadge universe={critique.universe} />
                  <h3 className="mt-2 text-2xl leading-tight font-extrabold">{frTypo(critique.title)}</h3>
                  <p className="mt-2 line-clamp-3 text-muted">{frTypo(critique.excerpt)}</p>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        <RevealGroup as="ol" className="grid gap-6 sm:grid-cols-2 lg:col-span-7" step={0.08}>
          {dossiers.slice(0, 4).map((d, i) => {
            const u = UNIVERSE_MAP[d.universe];
            return (
              <RevealItem as="li" key={d.slug}>
                <Link
                  href={`/articles/${d.slug}`}
                  data-universe={d.universe}
                  className="group relative flex h-full flex-col overflow-hidden border-[3px] border-ink bg-u text-u-fg transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:shadow-pop"
                >
                  <div className="flex items-start justify-between p-4">
                    <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase">
                      Dossier n°{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[11px] font-bold">{formatShortDate(d.publishedAt)}</span>
                  </div>
                  <h3 className="display px-4 text-[clamp(1.5rem,2.2vw,2.1rem)] leading-[0.95] transition-transform duration-300 group-hover:translate-x-1">
                    {frTypo(d.title)}
                  </h3>
                  <div className="relative mt-4 h-36 overflow-hidden border-t-[3px] border-ink sm:mt-auto">
                    <SmartImage asset={d.cover} sizes="(min-width: 1024px) 26vw, 92vw" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                    <span className="absolute right-2 bottom-2 border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[11px] font-bold text-ink">
                      {u.short} · {d.readingMinutes} min
                    </span>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>

      <div className="mt-16 border-t-[4px] border-ink pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="display text-5xl">Les guides</h3>
          <Link href="/actualites?type=guide" className="font-bold underline decoration-pink decoration-[3px] underline-offset-4">
            Tous les guides
          </Link>
        </div>
        <RevealGroup className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2" step={0.06}>
          {guides.slice(0, 4).map((g) => (
            <RevealItem key={g.slug}>
              <ArticleCard article={g} variant="compact" />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
