import Link from "next/link";
import type { ArticleSummary } from "@/types/content";
import { UNIVERSE_MAP } from "@/data/universes";
import { SmartImage, PhotoCredit } from "@/components/ui/SmartImage";
import { ButtonLink, BtnArrow } from "@/components/ui/Button";
import { TypeBadge, UniverseBadge } from "@/components/ui/Badges";
import { Burst } from "@/components/ui/Decor";
import { ImageReveal, Reveal, SplitTitle } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Scroll";
import { formatDate, frTypo } from "@/lib/text";

/**
 * « À la une » : mise en page de couverture de magazine, sur fond noir,
 * avec image révélée par un volet et titre XXL.
 */
export function Featured({ article }: { article: ArticleSummary }) {
  const u = UNIVERSE_MAP[article.universe];
  return (
    <section
      aria-labelledby="featured-title"
      data-surface="ink"
      data-universe={article.universe}
      className="clip-slant-t relative mt-24 overflow-hidden bg-ink pt-28 pb-24 text-paper [--slant:5vw]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="halftone absolute inset-0 opacity-[0.07] [--dot-gap:10px]" />
        <p className="display text-outline absolute top-10 -left-4 text-[clamp(6rem,22vw,22rem)] leading-none whitespace-nowrap [--stroke:rgba(248,245,239,0.12)]">
          À la une
        </p>
      </div>

      <div className="relative mx-auto grid max-w-[88rem] gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="relative lg:col-span-7">
          <Parallax speed={0.06}>
            <ImageReveal className="aspect-[4/3] border-[4px] border-paper shadow-[12px_12px_0_0_var(--u)] lg:aspect-[5/4]">
              <SmartImage asset={article.cover} sizes="(min-width: 1024px) 55vw, 95vw" quality={75} />
            </ImageReveal>
          </Parallax>
          <div className="mt-3">
            <PhotoCredit asset={article.cover} className="text-muted-ink" />
          </div>
          <div className="absolute -top-8 -right-2 sm:-right-6">
            <Reveal rotate={-30} scale={0.5} y={0} delay={0.4}>
              <Burst className="size-28 font-comic text-xl leading-none text-ink sm:size-36 sm:text-2xl" spin>
                Le
                <br />
                dossier
              </Burst>
            </Reveal>
          </div>
        </div>

        <div className="flex flex-col justify-center lg:col-span-5">
          <Reveal className="flex flex-wrap items-center gap-2">
            <span className="border-2 border-paper bg-yellow px-2 py-0.5 font-mono text-xs font-bold tracking-widest text-ink uppercase">
              ★ À la une
            </span>
            <UniverseBadge universe={article.universe} link />
            <TypeBadge type={article.type} />
          </Reveal>
          <SplitTitle
            as="h2"
            id="featured-title"
            text={frTypo(article.title)}
            className="mt-5 text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] font-extrabold tracking-tight"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-paper/80">{frTypo(article.excerpt)}</p>
            <p className="mt-5 font-mono text-xs tracking-widest text-muted-ink uppercase">
              {u.name} · {formatDate(article.publishedAt)} · {article.readingMinutes} min de lecture
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href={`/articles/${article.slug}`} variant="yellow" size="lg">
                Lire le dossier <BtnArrow />
              </ButtonLink>
              <Link
                href={`/univers/${u.slug}`}
                className="font-bold underline decoration-u decoration-[3px] underline-offset-4 transition-colors hover:text-u"
              >
                Plus de {u.name.toLowerCase()}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
