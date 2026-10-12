import Link from "next/link";
import type { ArticleSummary } from "@/types/content";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Scroll";
import { formatShortDate, frTypo } from "@/lib/text";

function FilmStrip({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`film-perf h-7 border-y-[3px] border-ink bg-ink [--perf:var(--color-yellow)] ${className ?? ""}`} />
  );
}

/**
 * Cinéma & séries : fond jaune « projecteur », rayons qui tournent,
 * affiches inclinées et un programme TV pour les séries.
 */
export function ScreensSection({ cinema, series }: { cinema: ArticleSummary[]; series: ArticleSummary[] }) {
  return (
    <section aria-labelledby="screens-title" data-universe="cinema" className="relative mt-24 overflow-hidden bg-yellow text-ink">
      <FilmStrip />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="rays absolute top-1/2 left-1/2 size-[180vmax] -translate-1/2 animate-spin-slow opacity-[0.09] [--ray-x:50%] [--ray-y:50%] [--line:var(--color-ink)] [animation-duration:90s]" />
      </div>

      <div className="relative mx-auto max-w-[88rem] px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          id="screens-title"
          number="03"
          kicker="Salle obscure & petit écran"
          title="Cinéma & séries"
          intro="Blockbusters, kaiju, salles premium et séries animées : les écrans qui nous font vibrer."
          numberClassName="[--stroke:rgba(17,17,20,0.2)]"
          link={{ href: "/univers/cinema", label: "Univers cinéma" }}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <RevealGroup className="grid gap-6 sm:grid-cols-3 lg:col-span-8" step={0.12}>
            {cinema.slice(0, 3).map((a, i) => (
              <RevealItem key={a.slug} className={i === 1 ? "sm:mt-14" : i === 2 ? "sm:mt-6" : ""}>
                <div style={{ transform: `rotate(${[-2, 1.5, -1][i]}deg)` }}>
                  <ArticleCard article={a} variant="poster" sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 90vw" />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <div data-universe="series" className="relative lg:col-span-4">
            <Parallax speed={0.05}>
              <Reveal x={40} y={0} className="border-[4px] border-ink bg-u text-u-fg shadow-pop-lg">
                <div className="scanlines flex items-center justify-between border-b-[4px] border-ink px-4 py-3 [--line:rgba(0,0,0,0.18)]">
                  <h3 className="display text-4xl">Ce soir, séries</h3>
                  <span className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-widest uppercase">
                    <span className="size-2.5 animate-blink rounded-full bg-pink" aria-hidden /> En direct
                  </span>
                </div>
                <ol className="divide-y-2 divide-paper/25">
                  {series.slice(0, 3).map((a, i) => (
                    <li key={a.slug}>
                      <Link href={`/articles/${a.slug}`} className="group flex gap-4 px-4 py-4 transition-colors hover:bg-ink/25">
                        <span className="w-16 shrink-0 font-mono text-sm font-bold text-yellow">
                          S01E0{i + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block leading-snug font-bold transition-transform duration-300 group-hover:translate-x-1">
                            {frTypo(a.title)}
                          </span>
                          <span className="mt-1 block font-mono text-xs opacity-70">
                            {formatShortDate(a.publishedAt)} · {a.readingMinutes} min
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/univers/series"
                  className="block border-t-[4px] border-ink bg-ink px-4 py-3 text-center font-bold text-paper transition-colors hover:bg-pink hover:text-ink"
                >
                  Tout le programme séries →
                </Link>
              </Reveal>
            </Parallax>
          </div>
        </div>
      </div>
      <FilmStrip />
    </section>
  );
}
