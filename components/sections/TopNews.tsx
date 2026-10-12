import type { ArticleSummary } from "@/types/content";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Sticker } from "@/components/ui/Badges";

/** « L'actu qui compte » : un grand article et une liste numérotée. */
export function TopNews({ articles }: { articles: ArticleSummary[] }) {
  const [lead, ...rest] = articles;
  if (!lead) return null;
  return (
    <section aria-labelledby="top-news-title" className="relative mx-auto max-w-[88rem] px-4 pt-20 sm:px-6 lg:px-8">
      <SectionHeading
        id="top-news-title"
        number="02"
        kicker="Le magazine"
        title="L'actu qui compte"
        numberClassName="[--stroke:var(--color-paper-3)]"
        link={{ href: "/actualites", label: "Tous les articles" }}
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <Reveal className="relative lg:col-span-7" y={40}>
          <ArticleCard article={lead} variant="overlay" className="h-[26rem] sm:h-[32rem] lg:h-full lg:min-h-[34rem]" headingLevel="h3" />
          <div className="pointer-events-none absolute -top-5 -right-3 z-20 sm:-right-5">
            <Sticker tone="yellow" rotate={8}>
              À chaud !
            </Sticker>
          </div>
        </Reveal>

        <RevealGroup as="ol" className="divide-y-[3px] divide-ink border-y-[3px] border-ink lg:col-span-5" step={0.09}>
          {rest.slice(0, 4).map((a, i) => (
            <RevealItem as="li" key={a.slug}>
              <ArticleCard article={a} variant="row" index={i + 2} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
