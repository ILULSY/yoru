import type { ArticleSummary } from "@/types/content";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/Scroll";
import { HudCorners } from "@/components/ui/Decor";

/**
 * Jeux vidéo : écran noir, grille de pixels, interface façon HUD,
 * articles présentés comme des cartouches de niveaux.
 */
export function GamingSection({ items }: { items: ArticleSummary[] }) {
  const hiScore = items.reduce((s, a) => s + a.popularity, 0);
  return (
    <section
      aria-labelledby="gaming-title"
      data-universe="jeux-video"
      data-surface="ink"
      className="relative overflow-hidden bg-ink py-24 text-paper"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="pixels absolute inset-0 opacity-[0.08] [--line:var(--color-cyan)] [--px:22px]" />
        <div className="absolute -top-40 left-1/3 size-[40rem] rounded-full bg-violet/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div className="relative p-6 text-u sm:p-10">
          <HudCorners />
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs font-bold tracking-[0.25em] uppercase">
            <span>Player 1</span>
            <span className="animate-blink">▶ Press start</span>
            <span>
              Hi-score <CountUp to={hiScore} className="text-paper" />
            </span>
          </div>
          <SectionHeading
            id="gaming-title"
            number="05"
            kicker="Level select"
            title="Jeux vidéo"
            intro="Indés, rétro, arcade et consoles portables : sélectionne ton niveau."
            className="mt-10 text-paper"
            numberClassName="[--stroke:rgba(0,229,255,0.25)]"
            titleClassName="text-pop [--pop-1:var(--color-violet)] [--pop-2:var(--color-cyan)]"
            link={{ href: "/univers/jeux-video", label: "Univers jeux vidéo" }}
          />
        </div>

        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" step={0.1}>
          {items.slice(0, 4).map((a, i) => (
            <RevealItem
              key={a.slug}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 18 } },
              }}
            >
              <ArticleCard article={a} variant="cartridge" index={i + 1} className="h-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
