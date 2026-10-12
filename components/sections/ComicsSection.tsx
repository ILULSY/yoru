import type { ArticleSummary } from "@/types/content";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Burst } from "@/components/ui/Decor";
import { Parallax } from "@/components/motion/Scroll";

/**
 * Comics & super-héros : trame Ben-Day bleue, onomatopée « POW! »,
 * encarts narratifs jaunes et cases inclinées.
 */
export function ComicsSection({ items }: { items: ArticleSummary[] }) {
  const [a, b, c] = items;
  return (
    <section
      aria-labelledby="comics-title"
      data-universe="comics"
      data-surface="ink"
      className="clip-slant-b relative overflow-hidden bg-blue pt-24 pb-36 text-paper [--slant:4vw]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="benday absolute inset-0 opacity-20 [--dot:var(--color-ink)] [--dot-gap:18px]" />
      </div>
      <Parallax speed={-0.25} className="pointer-events-none absolute top-[15rem] right-[36%] z-0 hidden lg:block">
        <Burst className="size-44 rotate-12 font-comic text-5xl text-ink" fill="var(--color-yellow)">
          POW!
        </Burst>
      </Parallax>

      <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="comics-title"
          number="06"
          kicker="Capes, multivers & étoiles"
          title="Comics & super-héros"
          numberClassName="[--stroke:rgba(248,245,239,0.25)]"
          titleClassName="text-pop [--pop-1:var(--color-pink)] [--pop-2:var(--color-ink)]"
          link={{ href: "/univers/comics", label: "Univers comics & SF" }}
        />

        <Reveal className="mt-8 inline-block" rotate={-3}>
          <p className="border-[3px] border-ink bg-yellow px-3 py-1.5 font-comic text-lg tracking-wide text-ink uppercase shadow-pop-sm">
            Pendant ce temps, dans le multivers…
          </p>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-10 md:grid-cols-12" step={0.12}>
          {a && (
            <RevealItem className="md:col-span-7">
              <ArticleCard article={a} variant="comic" sizes="(min-width: 768px) 55vw, 92vw" />
            </RevealItem>
          )}
          <div className="grid gap-10 md:col-span-5">
            {[b, c].filter(Boolean).map((x, i) => (
              <RevealItem key={x!.slug}>
                <div style={{ transform: `rotate(${i ? 1.5 : -1.5}deg)` }}>
                  <ArticleCard article={x!} variant="comic" sizes="(min-width: 768px) 38vw, 92vw" />
                </div>
              </RevealItem>
            ))}
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
