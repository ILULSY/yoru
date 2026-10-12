import Link from "next/link";
import { Clock } from "lucide-react";
import type { ArticleSummary } from "@/types/content";
import { UNIVERSE_MAP } from "@/data/universes";
import { SmartImage } from "@/components/ui/SmartImage";
import { DemoBadge, TypeBadge, UniverseBadge } from "@/components/ui/Badges";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { TiltCard } from "@/components/motion/Interactive";
import { formatDate, formatShortDate, frTypo } from "@/lib/text";
import { cn } from "@/lib/utils";

export type CardVariant =
  | "default"
  | "poster"
  | "panel"
  | "cartridge"
  | "comic"
  | "trading"
  | "row"
  | "compact"
  | "overlay";

interface Props {
  article: ArticleSummary;
  variant?: CardVariant;
  className?: string;
  /** Numéro affiché (classements, listes). */
  index?: number;
  priority?: boolean;
  sizes?: string;
  headingLevel?: "h2" | "h3";
  /** Masque le bouton favori (ex. listes très compactes). */
  noFavorite?: boolean;
}

export function Meta({ article, className, light }: { article: ArticleSummary; className?: string; light?: boolean }) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs",
        light ? "text-muted-ink" : "text-muted",
        className,
      )}
    >
      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3.5" aria-hidden />
        {article.readingMinutes} min
      </span>
      {article.demo && <DemoBadge />}
    </p>
  );
}

function Title({ article, className, as: H = "h3" }: { article: ArticleSummary; className?: string; as?: "h2" | "h3" }) {
  return <H className={className}>{frTypo(article.title)}</H>;
}

/**
 * Lien bloc couvrant toute la carte. Les effets de survol vivent à
 * l'intérieur du lien : la zone cliquable reste toujours entière.
 */
function CardLink({ article, className, children }: { article: ArticleSummary; className?: string; children: React.ReactNode }) {
  return (
    <Link href={`/articles/${article.slug}`} className={cn("block h-full", className)}>
      {children}
    </Link>
  );
}

export function ArticleCard({
  article,
  variant = "default",
  className,
  index,
  priority,
  sizes,
  headingLevel = "h3",
  noFavorite,
}: Props) {
  const u = UNIVERSE_MAP[article.universe];
  const fav = (cls: string) =>
    noFavorite ? null : <FavoriteButton slug={article.slug} title={article.title} className={cls} />;

  switch (variant) {
    /* ─── Affiche de cinéma ─── */
    case "poster":
      return (
        <article data-universe={article.universe} className={cn("group relative", className)}>
          <CardLink article={article}>
            <div className="relative aspect-[2/3] overflow-hidden border-[3px] border-ink bg-ink shadow-pop transition-[transform,box-shadow] duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-2 group-hover:shadow-pop-lg">
              <SmartImage
                asset={article.cover}
                sizes={sizes ?? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"}
                priority={priority}
                imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" aria-hidden />
              <div
                className="rays absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 [--line:var(--u)] group-hover:opacity-40"
                aria-hidden
              />
              <div className="absolute top-3 left-3">
                <TypeBadge type={article.type} />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 text-paper sm:p-5">
                <Title
                  as={headingLevel}
                  article={article}
                  className="display line-clamp-4 text-[clamp(1.35rem,1.9vw,1.85rem)] leading-[0.95] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-1"
                />
                <p className="mt-3 border-t border-paper/40 pt-2 font-mono text-[10px] leading-relaxed tracking-[0.2em] text-paper/80 uppercase">
                  {u.name} · {formatShortDate(article.publishedAt)} · {article.readingMinutes} min
                </p>
              </div>
            </div>
          </CardLink>
          {fav("absolute top-3 right-3 size-10")}
        </article>
      );

    /* ─── Case de manga ─── */
    case "panel":
      return (
        <article data-universe={article.universe} className={cn("group relative", className)}>
          <CardLink article={article} className="flex flex-col border-[4px] border-ink bg-paper">
            <div className="relative min-h-48 flex-1 overflow-hidden border-b-[4px] border-ink">
              <SmartImage
                asset={article.cover}
                sizes={sizes ?? "(min-width: 1024px) 40vw, 90vw"}
                imgClassName="grayscale contrast-125 transition-[filter,transform] duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="tone absolute inset-0 opacity-25 mix-blend-multiply [--dot:var(--color-ink)]" aria-hidden />
              {index !== undefined && (
                <span className="absolute bottom-2 left-2 grid size-10 place-items-center rounded-full border-[3px] border-ink bg-paper font-display text-xl">
                  {index}
                </span>
              )}
            </div>
            <div className="p-4">
              <span className="mb-2 inline-flex flex-wrap gap-1.5">
                <UniverseBadge universe={article.universe} />
                <TypeBadge type={article.type} />
              </span>
              <Title
                as={headingLevel}
                article={article}
                className="text-xl leading-tight font-extrabold transition-transform duration-300 group-hover:translate-x-1"
              />
              <Meta article={article} className="mt-2" />
            </div>
          </CardLink>
          {fav("absolute top-2 right-2 size-10")}
        </article>
      );

    /* ─── Cartouche de jeu vidéo ─── */
    case "cartridge":
      return (
        <article data-universe={article.universe} data-surface="ink" className={cn("group relative", className)}>
          <CardLink
            article={article}
            className="flex flex-col overflow-hidden rounded-t-xl border-[3px] border-u bg-ink-2 text-paper transition-transform duration-300 ease-[var(--ease-pop)] group-hover:-translate-y-1.5"
          >
            <div className="flex items-center justify-between border-b-[3px] border-u px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] text-u uppercase">
              <span>Lvl {String(index ?? 1).padStart(2, "0")}</span>
              <span className="flex gap-1" aria-hidden>
                <span className="size-2 bg-u" />
                <span className="size-2 bg-u/50" />
                <span className="size-2 bg-u/25" />
              </span>
            </div>
            <div className="relative aspect-video overflow-hidden">
              <SmartImage
                asset={article.cover}
                sizes={sizes ?? "(min-width: 1024px) 30vw, 90vw"}
                imgClassName="transition-transform duration-700 group-hover:scale-110"
              />
              <div className="scanlines absolute inset-0 opacity-30 [--line:rgba(0,0,0,.6)]" aria-hidden />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <Title as={headingLevel} article={article} className="text-lg leading-snug font-bold" />
              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-ink uppercase">
                  <span>XP lecture</span>
                  <span>{article.readingMinutes} min</span>
                </div>
                <div className="mt-1 h-2 border border-u/60 bg-ink" aria-hidden>
                  <div
                    className="h-full origin-left scale-x-[0.35] bg-u transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100"
                    style={{ width: `${Math.min(100, article.readingMinutes * 14)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardLink>
          {fav("absolute top-10 right-2 size-10")}
        </article>
      );

    /* ─── Case de comics avec encart narratif ─── */
    case "comic":
      return (
        <article data-universe={article.universe} className={cn("group relative", className)}>
          <CardLink article={article}>
            <div className="relative aspect-[4/3] overflow-hidden border-[4px] border-ink bg-ink shadow-pop transition-transform duration-500 ease-[var(--ease-pop)] group-hover:-rotate-1 group-hover:scale-[1.02]">
              <SmartImage
                asset={article.cover}
                sizes={sizes ?? "(min-width: 1024px) 45vw, 90vw"}
                priority={priority}
                imgClassName="transition-transform duration-700 group-hover:scale-110"
              />
              <div className="benday absolute inset-0 opacity-20 mix-blend-screen [--dot:var(--color-yellow)]" aria-hidden />
              <p className="absolute top-3 left-3 max-w-[70%] border-[3px] border-ink bg-yellow px-2 py-1 font-comic text-sm tracking-wide text-ink uppercase shadow-pop-sm">
                {u.name} · {formatShortDate(article.publishedAt)}
              </p>
            </div>
            <div className="relative z-[1] mr-2 -mt-8 ml-4 border-[3px] border-ink bg-paper p-4 text-ink shadow-pop transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-1 sm:ml-8">
              <TypeBadge type={article.type} className="mb-2" />
              <Title as={headingLevel} article={article} className="text-xl leading-tight font-extrabold" />
              <p className="mt-2 line-clamp-2 text-sm text-muted">{frTypo(article.excerpt)}</p>
            </div>
          </CardLink>
          {fav("absolute top-3 right-3 size-10")}
        </article>
      );

    /* ─── Carte à collectionner holographique ─── */
    case "trading": {
      const stars = Math.min(5, Math.max(1, Math.round(article.popularity / 9000)));
      return (
        <TiltCard holo className={cn("group h-full", className)}>
          <article data-universe={article.universe} className="relative h-full">
            <CardLink article={article} className="rounded-2xl border-[4px] border-ink bg-yellow p-2.5 text-ink shadow-pop">
              <div className="flex h-full flex-col rounded-xl border-[3px] border-ink bg-u p-2">
                <div className="flex items-center justify-between gap-2 px-1 pb-1.5">
                  <span className="font-mono text-[10px] font-bold tracking-widest uppercase">{u.short}</span>
                  <span className="font-display text-sm">
                    {article.readingMinutes * 10} <span className="text-[10px]">PV</span>
                  </span>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border-[3px] border-ink">
                  <SmartImage asset={article.cover} sizes={sizes ?? "(min-width: 1024px) 24vw, 80vw"} />
                </div>
                <div className="mt-2 flex flex-1 flex-col rounded-md border-2 border-ink bg-paper p-2.5">
                  <Title as={headingLevel} article={article} className="text-base leading-snug font-extrabold" />
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{frTypo(article.excerpt)}</p>
                  <div className="mt-auto flex items-center justify-between pt-2 font-mono text-[10px] tracking-wider uppercase">
                    <span>
                      <span className="sr-only">Popularité {stars} sur 5</span>
                      <span aria-hidden>
                        {"★".repeat(stars)}
                        {"☆".repeat(5 - stars)}
                      </span>
                    </span>
                    <span>N° {String(index ?? 1).padStart(3, "0")}</span>
                  </div>
                </div>
              </div>
            </CardLink>
            {fav("absolute -top-3 right-1 size-10 sm:-right-3")}
          </article>
        </TiltCard>
      );
    }

    /* ─── Ligne numérotée (classements) ─── */
    case "row":
      return (
        <article data-universe={article.universe} className={cn("group relative", className)}>
          <CardLink article={article} className="flex items-center gap-4 py-4">
            {index !== undefined && (
              <span
                aria-hidden
                className="text-outline w-14 shrink-0 text-center font-display text-5xl leading-none transition-colors duration-300 [--stroke:var(--color-ink)] group-hover:text-u sm:w-16 sm:text-6xl"
              >
                {String(index).padStart(2, "0")}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <UniverseBadge universe={article.universe} className="mb-1.5" />
              <Title
                as={headingLevel}
                article={article}
                className="text-lg leading-snug font-bold transition-transform duration-300 ease-[var(--ease-expo)] group-hover:translate-x-1.5"
              />
              <Meta article={article} className="mt-1" />
            </div>
            <div className="relative hidden size-20 shrink-0 overflow-hidden border-[3px] border-ink transition-transform duration-300 ease-[var(--ease-pop)] group-hover:rotate-3 xs:block">
              <SmartImage asset={article.cover} sizes="80px" />
            </div>
          </CardLink>
        </article>
      );

    /* ─── Compact (suggestions, résultats) ─── */
    case "compact":
      return (
        <article data-universe={article.universe} className={cn("group relative", className)}>
          <CardLink article={article} className="flex gap-3 pr-12">
            <div className="relative aspect-square w-20 shrink-0 overflow-hidden border-[3px] border-ink sm:w-24">
              <SmartImage asset={article.cover} sizes="96px" imgClassName="transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-1.5">
                <UniverseBadge universe={article.universe} />
                <TypeBadge type={article.type} />
              </div>
              <Title
                as={headingLevel}
                article={article}
                className="mt-1.5 leading-snug font-bold decoration-u decoration-[3px] underline-offset-2 group-hover:underline"
              />
              <Meta article={article} className="mt-1" />
            </div>
          </CardLink>
          {fav("absolute top-0 right-0 size-10")}
        </article>
      );

    /* ─── Image pleine avec titre en surimpression ─── */
    case "overlay":
      return (
        <article data-universe={article.universe} data-surface="ink" className={cn("group relative", className)}>
          <CardLink article={article} className="relative isolate overflow-hidden border-[3px] border-ink bg-ink text-paper">
            <SmartImage
              asset={article.cover}
              sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
              priority={priority}
              imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/0" aria-hidden />
            <div className="relative flex h-full flex-col justify-end p-5 sm:p-7">
              <div className="mb-3 flex flex-wrap gap-1.5">
                <UniverseBadge universe={article.universe} />
                <TypeBadge type={article.type} />
              </div>
              <Title
                as={headingLevel}
                article={article}
                className="max-w-2xl text-2xl leading-tight font-extrabold transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-1 sm:text-3xl"
              />
              <Meta article={article} light className="mt-3" />
            </div>
          </CardLink>
          {fav("absolute top-3 right-3 size-10")}
        </article>
      );

    /* ─── Carte standard ─── */
    default:
      return (
        <article data-universe={article.universe} className={cn("group relative", className)}>
          <CardLink
            article={article}
            className="flex flex-col border-[3px] border-ink bg-paper text-ink transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)] group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[8px_8px_0_0_var(--u)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b-[3px] border-ink">
              <SmartImage
                asset={article.cover}
                sizes={sizes ?? "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"}
                priority={priority}
                imgClassName="transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.07]"
              />
              <div
                className="absolute bottom-0 left-0 h-1.5 w-full origin-left scale-x-0 bg-u transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100"
                aria-hidden
              />
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                <UniverseBadge universe={article.universe} />
                <TypeBadge type={article.type} />
              </div>
              <Title
                as={headingLevel}
                article={article}
                className="text-xl leading-tight font-extrabold transition-transform duration-300 ease-[var(--ease-expo)] group-hover:translate-x-1"
              />
              <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-muted">{frTypo(article.excerpt)}</p>
              <Meta article={article} className="mt-auto pt-4" />
            </div>
          </CardLink>
          {fav("absolute top-3 right-3 size-10")}
        </article>
      );
  }
}
