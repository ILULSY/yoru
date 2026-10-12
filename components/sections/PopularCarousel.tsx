"use client";

import Link from "next/link";
import { m, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import type { ArticleSummary } from "@/types/content";
import { UNIVERSE_MAP } from "@/data/universes";
import { SmartImage } from "@/components/ui/SmartImage";
import { UniverseBadge } from "@/components/ui/Badges";
import { useCalm } from "@/lib/stores/motion-pref";
import { formatCount, frTypo } from "@/lib/text";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Slide({ a, rank }: { a: ArticleSummary; rank: number }) {
  const u = UNIVERSE_MAP[a.universe];
  return (
    <article data-universe={a.universe} className="group relative w-[78vw] shrink-0 snap-start xs:w-[20rem] lg:w-[24rem]">
      <span
        aria-hidden
        className="text-outline pointer-events-none absolute -top-14 -left-3 z-10 font-display text-[8rem] leading-none transition-colors duration-300 [--stroke:var(--color-paper)] [--stroke-w:3px] group-hover:text-u lg:text-[10rem]"
      >
        {rank}
      </span>
      <Link href={`/articles/${a.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden border-[4px] border-paper bg-ink transition-transform duration-500 ease-[var(--ease-pop)] group-hover:-translate-y-2 group-hover:-rotate-1">
          <SmartImage asset={a.cover} sizes="(min-width: 1024px) 24rem, 78vw" imgClassName="transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <UniverseBadge universe={a.universe} />
            <h3 className="mt-2 text-xl leading-tight font-extrabold text-paper">{frTypo(a.title)}</h3>
            <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-paper/75">
              <Flame className="size-3.5 text-u" aria-hidden />
              {formatCount(a.popularity)} lectures (démo) · {u.short}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

/**
 * « Le top » : sur grand écran, la section est épinglée et les cartes
 * défilent horizontalement au rythme du scroll vertical. Sur mobile et en
 * mode animations réduites : simple carrousel horizontal à glisser,
 * avec boutons précédent / suivant.
 */
export function PopularCarousel({ items }: { items: ArticleSummary[] }) {
  const calm = useCalm();
  const [pinned, setPinned] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPinned(mq.matches && !calm);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [calm]);

  useIsoLayoutEffect(() => {
    if (!pinned || !trackRef.current) return;
    const el = trackRef.current;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 64));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(smooth, [0, 1], [0, 1]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 420), behavior: calm ? "auto" : "smooth" });
  };

  const header = (
    <div className="mx-auto flex max-w-[88rem] flex-wrap items-end justify-between gap-6 px-4 sm:px-6 lg:px-8">
      <div>
        <p className="font-mono text-xs font-bold tracking-[0.3em] text-yellow uppercase">§ 09 — Les plus lus</p>
        <h2 id="popular-title" className="display mt-3 text-[clamp(2.9rem,8.5vw,7rem)] text-paper">
          Le top <span className="text-pink">de la semaine</span>
        </h2>
        <p className="mt-2 text-sm text-muted-ink">Classement de démonstration, basé sur des statistiques fictives.</p>
      </div>
      {!pinned && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="grid size-12 place-items-center border-[3px] border-paper text-paper transition-transform hover:-translate-x-0.5 active:scale-90"
            aria-label="Articles précédents"
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="grid size-12 place-items-center border-[3px] border-paper bg-paper text-ink transition-transform hover:translate-x-0.5 active:scale-90"
            aria-label="Articles suivants"
          >
            <ChevronRight className="size-6" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );

  if (!pinned) {
    return (
      <section ref={sectionRef} aria-labelledby="popular-title" data-surface="ink" className="relative bg-ink py-20">
        {header}
        <div
          ref={scrollerRef}
          className="mt-16 flex snap-x snap-mandatory gap-8 overflow-x-auto overscroll-x-contain px-4 pt-12 pb-6 [scrollbar-width:thin] sm:px-6 lg:px-8"
          tabIndex={0}
          aria-label="Carrousel des articles les plus lus"
        >
          {items.map((a, i) => (
            <Slide key={a.slug} a={a} rank={i + 1} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="popular-title"
      data-surface="ink"
      className="relative bg-ink"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {header}
        <m.div
          ref={trackRef}
          style={{ x }}
          className={cn("mt-20 flex w-max gap-12 pr-16 pl-8 will-change-transform")}
          onFocusCapture={(e) => {
            // Clavier : amène la carte ciblée dans le champ en ajustant le défilement vertical.
            const slides = [...(trackRef.current?.children ?? [])];
            const i = slides.findIndex((s) => s.contains(e.target as Node));
            const section = sectionRef.current;
            if (i < 0 || !section || slides.length < 2) return;
            const top = section.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: top + (i / (slides.length - 1)) * distance, behavior: "auto" });
          }}
        >
          {items.map((a, i) => (
            <Slide key={a.slug} a={a} rank={i + 1} />
          ))}
        </m.div>
        <div className="mx-auto mt-10 h-1.5 w-full max-w-[88rem] px-8" aria-hidden>
          <div className="h-full bg-paper/15">
            <m.div className="h-full origin-left bg-yellow" style={{ scaleX: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}
