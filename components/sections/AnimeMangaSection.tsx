import Link from "next/link";
import type { ArticleSummary } from "@/types/content";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Scroll";
import { DrawnArrow } from "@/components/ui/Decor";

/**
 * Anime & manga : fond rose et lignes de vitesse, articles disposés comme
 * une planche de manga (cases irrégulières, lecture de droite à gauche).
 */
export function AnimeMangaSection({ anime, manga }: { anime: ArticleSummary[]; manga: ArticleSummary[] }) {
  // Planche : on alterne manga et anime pour composer la page.
  const panels = [manga[0], anime[0], manga[1], anime[1], manga[2]].filter(Boolean) as ArticleSummary[];
  return (
    <section aria-labelledby="anime-title" data-universe="anime" className="relative overflow-hidden bg-pink py-24 text-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="speedlines absolute inset-0 opacity-[0.18] [--line:var(--color-ink)]" />
      </div>
      <Parallax speed={0.35} className="pointer-events-none absolute top-[15rem] right-[2%] z-0 hidden md:block">
        <span aria-hidden className="display text-outline block rotate-12 text-[10rem] leading-none [--stroke:var(--color-ink)] [--stroke-w:4px]">
          ドン!
        </span>
      </Parallax>

      <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="anime-title"
          number="04"
          kicker="アニメ・マンガ"
          title="Anime & manga"
          intro="Studios, mangakas, cosplay et adaptations : une planche entière consacrée au Japon."
          numberClassName="[--stroke:rgba(17,17,20,0.25)]"
          link={{ href: "/univers/manga", label: "Univers manga" }}
        />

        <Reveal className="mt-10 flex items-center justify-end gap-2 font-comic text-xl" x={30} y={0}>
          <span>Lecture de droite à gauche</span>
          <DrawnArrow className="h-10 w-16 -scale-x-100" />
        </Reveal>

        <RevealGroup
          className="mt-4 grid auto-rows-[minmax(15rem,auto)] gap-4 border-[5px] border-ink bg-ink p-4 [direction:rtl] md:grid-cols-6"
          step={0.1}
        >
          {panels.map((a, i) => {
            const span = ["md:col-span-4 md:row-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-3", "md:col-span-3"][i];
            return (
              <RevealItem key={a.slug} className={`[direction:ltr] ${span}`}>
                <ArticleCard article={a} variant="panel" index={i + 1} className="h-full" headingLevel="h3" />
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal className="mt-8 flex justify-center" delay={0.2}>
          <Link
            href="/articles/cosplay-reussir-sa-premiere-convention"
            className="bubble block max-w-md px-6 py-4 text-center font-comic text-xl leading-snug transition-transform duration-300 ease-[var(--ease-pop)] [--bubble-bg:var(--color-paper)] [--tail-x:45%] hover:-rotate-2 hover:scale-105"
          >
            Envie de cosplay ? Notre guide de la première convention t&apos;attend !
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
