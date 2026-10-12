import Link from "next/link";
import type { ArticleSummary } from "@/types/content";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/Reveal";
import { Sticker } from "@/components/ui/Badges";

const FAN = ["xl:-rotate-6 xl:translate-y-6", "xl:-rotate-2", "xl:rotate-2", "xl:rotate-6 xl:translate-y-6"];

/**
 * Cartes à collectionner & objets collectors : les articles deviennent des
 * cartes holographiques déployées en éventail, inclinables à la souris.
 */
export function CollectorsSection({ items }: { items: ArticleSummary[] }) {
  return (
    <section aria-labelledby="collectors-title" data-universe="collectors" className="relative overflow-hidden py-24">
      <div aria-hidden className="holo animate-holo absolute inset-x-0 top-0 h-3 border-b-[3px] border-ink" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="halftone halftone-fade absolute -bottom-10 -left-10 size-[30rem] text-orange [--dot-gap:13px] [--fade-dir:45deg]" />
      </div>

      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="collectors-title"
          number="07"
          kicker="Cartes, figurines & objets rares"
          title="Collectors"
          intro="Pokémon, One Piece, Lorcana, figurines et grading : les guides pour collectionner malin."
          numberClassName="[--stroke:var(--color-paper-3)]"
          link={{ href: "/univers/collectors", label: "Univers collectors" }}
        />

        <div className="relative mt-16">
          <Reveal className="pointer-events-none absolute -top-10 left-1/2 z-30 -translate-x-1/2" rotate={-20} scale={0.6} y={0}>
            <Sticker tone="pink" rotate={-8}>
              Survole les cartes !
            </Sticker>
          </Reveal>
          <RevealGroup className="mx-auto grid max-w-3xl gap-10 sm:grid-cols-2 xl:max-w-none xl:grid-cols-4 xl:gap-6" step={0.1}>
            {items.slice(0, 4).map((a, i) => (
              <RevealItem
                key={a.slug}
                className={`transition-transform duration-500 ease-[var(--ease-expo)] hover:z-20 xl:hover:translate-y-0 xl:hover:rotate-0 ${FAN[i]}`}
                variants={{
                  hidden: { opacity: 0, y: 80, rotate: 12 },
                  show: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 160, damping: 16 } },
                }}
              >
                <ArticleCard article={a} variant="trading" index={i + 1} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <p className="mt-14 text-center text-sm text-muted">
          Les cartes et figurines visibles sur les photos illustrent nos articles : ce ne sont pas des visuels officiels.{" "}
          <Link href="/a-propos#images" className="font-semibold underline">
            En savoir plus
          </Link>
        </p>
      </div>
    </section>
  );
}
