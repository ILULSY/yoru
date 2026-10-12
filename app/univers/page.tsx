import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { UNIVERSES } from "@/data/universes";
import { getMedia } from "@/data/media";
import { getSummaries } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { SmartImage } from "@/components/ui/SmartImage";
import { UniverseIcon, PATTERN_CLASS } from "@/components/ui/UniverseIcon";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/Interactive";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Les univers",
  description: "Cinéma, séries, anime, manga, jeux vidéo, comics & SF, collectors, geek & tech : les huit univers de YORU.",
  alternates: { canonical: "/univers" },
};

const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-5", "lg:col-span-7", "lg:col-span-12"];

export default async function UniversesPage() {
  const all = await getSummaries();
  return (
    <>
      <PageHero
        kicker="§ 8 mondes, 0 limite"
        title="Les univers"
        intro="Chaque rubrique a sa couleur, sa trame et son caractère. Choisissez votre porte d'entrée."
        tone="yellow"
      />
      <section aria-label="Liste des univers" className="mx-auto max-w-[88rem] px-4 pt-14 pb-24 sm:px-6 lg:px-8">
        <RevealGroup as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-12" step={0.07}>
          {UNIVERSES.map((u, i) => {
            const count = all.filter((a) => a.universe === u.slug).length;
            return (
              <RevealItem as="li" key={u.slug} className={SPANS[i]}>
                <TiltCard max={5} className="h-full">
                  <Link
                    href={`/univers/${u.slug}`}
                    data-universe={u.slug}
                    className="group relative flex h-full min-h-72 flex-col justify-between overflow-hidden border-[4px] border-ink bg-u p-6 text-u-fg shadow-pop transition-shadow duration-300 hover:shadow-pop-lg"
                  >
                    <div className={cn(PATTERN_CLASS[u.slug], "pointer-events-none absolute inset-0 opacity-[0.15] [--dot:currentColor] [--line:currentColor]")} aria-hidden />
                    <div className="absolute top-0 right-0 bottom-0 w-[45%] translate-x-6 overflow-hidden border-l-[4px] border-ink opacity-90 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-0 max-sm:hidden">
                      <SmartImage asset={getMedia(u.cover)} sizes="(min-width: 1024px) 25vw, 45vw" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="relative flex items-center gap-3 font-mono text-xs font-bold tracking-[0.25em] uppercase">
                      <span className="grid size-10 place-items-center border-2 border-current">
                        <UniverseIcon universe={u.slug} className="size-5 transition-transform duration-500 ease-[var(--ease-pop)] group-hover:scale-125 group-hover:rotate-12" />
                      </span>
                      {u.number} · {count} article{count > 1 ? "s" : ""}
                    </div>
                    <div className="relative max-w-[55%] max-sm:max-w-none">
                      <h2 className="display text-[clamp(2.6rem,5vw,4.5rem)]">{u.name}</h2>
                      <p className="mt-2 font-semibold">{u.tagline}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 border-b-[3px] border-current font-bold">
                        Explorer
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>
    </>
  );
}
