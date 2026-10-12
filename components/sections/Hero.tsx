import { Fragment } from "react";
import { ButtonLink, BtnArrow } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Interactive";
import { CountUp } from "@/components/motion/Scroll";
import { HeroCollage, type CollageItem } from "@/components/sections/HeroCollage";
import { Sparkle, Squiggle } from "@/components/ui/Decor";
import { formatDate } from "@/lib/text";

const WORDS: { w: string; cls?: string }[] = [
  { w: "Collect" },
  { w: "the", cls: "text-outline [--stroke:var(--color-ink)] [--stroke-w:3px]" },
  { w: "night.", cls: "text-violet text-pop [--pop-1:var(--color-ink)] [--pop-2:var(--color-pink)]" },
];

/**
 * Hero de la page d'accueil.
 * Les entrées (mots, boutons) sont en CSS pour s'afficher dès le premier
 * rendu ; la parallaxe et l'interaction du collage sont gérées par Motion.
 */
export function Hero({
  collage,
  stats,
  editionDate,
}: {
  collage: CollageItem[];
  stats: { articles: number; universes: number };
  editionDate: string;
}) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b-[4px] border-ink">
      {/* Décor de fond */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="halftone halftone-fade absolute -top-20 -right-20 size-[38rem] text-pink [--dot-gap:14px] [--fade-dir:225deg]" />
        <div className="stripes absolute -bottom-24 -left-24 h-72 w-[30rem] rotate-12 text-cyan/40 [--stripe:12px]" />
        <div className="absolute top-[18%] left-[46%] hidden size-3 rotate-45 bg-ink lg:block" />
      </div>

      <div className="mx-auto grid max-w-[88rem] items-center gap-10 px-4 pt-10 pb-14 sm:px-6 md:pt-14 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:px-8 lg:pb-16">
        <div className="relative z-10">
          <p className="rise-in flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-bold tracking-[0.25em] uppercase" style={{ "--d": "0s" } as React.CSSProperties}>
            <span className="flex items-center gap-2 border-2 border-ink bg-ink px-2 py-1 text-paper">
              <span lang="ja" className="font-sans text-sm tracking-normal text-violet" aria-hidden>
                夜
              </span>
              Yoru · Le média pop culture
            </span>
            <span>Édition du {formatDate(editionDate)}</span>
          </p>

          <h1
            id="hero-title"
            lang="en"
            className="display mt-6 text-[clamp(4rem,15.5vw,10.5rem)] leading-[0.82] lg:text-[clamp(5rem,9.6vw,10.5rem)]"
          >
            {WORDS.map(({ w, cls }, i) => (
              <Fragment key={w}>
                <span className="word-mask">
                  <span className={`word-rise ${cls ?? ""}`} style={{ "--i": i } as React.CSSProperties}>
                    {w}
                  </span>
                </span>
                {i < WORDS.length - 1 && " "}
              </Fragment>
            ))}
          </h1>

          <div className="relative mt-4 h-5 w-40 text-violet rise-in" style={{ "--d": "0.55s" } as React.CSSProperties} aria-hidden>
            <Squiggle className="h-full w-full" />
          </div>

          <p
            className="rise-in mt-5 max-w-xl text-lg leading-relaxed sm:text-xl"
            style={{ "--d": "0.5s" } as React.CSSProperties}
          >
            Cinéma, séries, anime, manga, jeux vidéo, comics, cartes à collectionner et figurines :
            les actus, les critiques et les dossiers qui font vibrer les passionnés.
          </p>

          <div className="rise-in mt-8 flex flex-wrap items-center gap-4" style={{ "--d": "0.62s" } as React.CSSProperties}>
            <Magnetic>
              <ButtonLink href="/univers" size="lg" variant="ink">
                Explorer les univers <BtnArrow />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/actualites" size="lg" variant="yellow">
                Dernières actus
              </ButtonLink>
            </Magnetic>
          </div>

          <dl className="rise-in mt-10 flex flex-wrap gap-x-8 gap-y-4" style={{ "--d": "0.75s" } as React.CSSProperties}>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">Univers</dt>
              <dd className="display text-4xl">
                <CountUp to={stats.universes} />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">Articles</dt>
              <dd className="display text-4xl">
                <CountUp to={stats.articles} />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">Nuits blanches</dt>
              <dd className="display flex items-center gap-2 text-4xl">
                ∞ <Sparkle className="size-6 animate-spin-slow text-violet" />
              </dd>
            </div>
          </dl>
        </div>

        <HeroCollage items={collage} />
      </div>
    </section>
  );
}
