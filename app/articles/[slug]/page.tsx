import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, PenLine } from "lucide-react";
import { getAllArticles, getArticle, getPrevNext, getRelated, getToc, readingMinutes } from "@/lib/content";
import { getMedia } from "@/data/media";
import { UNIVERSE_MAP, ARTICLE_TYPE_LABELS } from "@/data/universes";
import { getAuthor } from "@/data/authors";
import { absoluteUrl, SITE } from "@/lib/site";
import { formatDate, frTypo } from "@/lib/text";
import { ArticleBody } from "@/components/article/ArticleBody";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ShareButton } from "@/components/article/ShareButton";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { DemoBadge, TypeBadge, UniverseBadge } from "@/components/ui/Badges";
import { SmartImage, PhotoCredit } from "@/components/ui/SmartImage";
import { PATTERN_CLASS } from "@/components/ui/UniverseIcon";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CssSplit } from "@/components/motion/CssSplit";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllArticles()).map((a) => ({ slug: a.slug }));
}

function ogImage(src: string) {
  return src.startsWith("https://images.unsplash.com/") ? `${src}?auto=format&fit=crop&w=1200&h=630&q=75` : src;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Article introuvable" };
  const cover = getMedia(a.cover, a.title);
  const url = `/articles/${a.slug}`;
  return {
    title: a.title,
    description: a.excerpt,
    keywords: a.tags,
    alternates: { canonical: url },
    authors: [{ name: getAuthor(a.author).name }],
    openGraph: {
      type: "article",
      url,
      title: a.title,
      description: a.excerpt,
      publishedTime: a.publishedAt,
      modifiedTime: a.updatedAt ?? a.publishedAt,
      section: UNIVERSE_MAP[a.universe].name,
      tags: a.tags,
      images: [{ url: ogImage(cover.src), width: 1200, height: 630, alt: cover.alt }],
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.excerpt, images: [ogImage(cover.src)] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const u = UNIVERSE_MAP[article.universe];
  const author = getAuthor(article.author);
  const cover = getMedia(article.cover, article.title);
  const toc = getToc(article);
  const minutes = readingMinutes(article);
  const [related, { newer, older }] = await Promise.all([getRelated(article, 3), getPrevNext(article.slug)]);
  const url = absoluteUrl(`/articles/${article.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        image: [ogImage(cover.src)],
        datePublished: article.publishedAt,
        dateModified: article.updatedAt ?? article.publishedAt,
        author: { "@type": "Organization", name: `${author.name} — ${SITE.name}`, url: absoluteUrl("/a-propos") },
        publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        mainEntityOfPage: url,
        articleSection: u.name,
        keywords: article.tags.join(", "),
        inLanguage: "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: u.name, item: absoluteUrl(`/univers/${u.slug}`) },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };

  return (
    <article data-universe={article.universe} className="pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* ── En-tête ── */}
      <header
        data-surface={["series", "manga", "comics"].includes(article.universe) ? "ink" : undefined}
        className="relative isolate overflow-hidden border-b-[4px] border-ink bg-u pb-40 text-u-fg"
      >
        <div aria-hidden className={cn(PATTERN_CLASS[article.universe], "absolute inset-0 -z-10 opacity-[0.12] [--dot:currentColor] [--line:currentColor]")} />
        <div className="mx-auto max-w-[88rem] px-4 pt-8 sm:px-6 lg:px-8">
          <nav aria-label="Fil d'Ariane" className="font-mono text-xs font-bold tracking-wider uppercase">
            <ol className="flex flex-wrap items-center gap-2 opacity-85">
              <li>
                <Link href="/" className="hover:underline">
                  Accueil
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/univers/${u.slug}`} className="hover:underline">
                  {u.name}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="max-w-[16rem] truncate opacity-70">
                {article.title}
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-4xl">
            <div className="rise-in flex flex-wrap items-center gap-2">
              <span className="border-2 border-current px-2 py-0.5 font-mono text-[11px] font-bold tracking-widest uppercase">
                {u.number} · {u.name}
              </span>
              <TypeBadge type={article.type} />
              {article.demo && <DemoBadge />}
            </div>
            <CssSplit
              text={frTypo(article.title)}
              className="mt-5 text-[clamp(2.2rem,5.6vw,4.6rem)] leading-[1.02] font-extrabold tracking-tight"
            />
            <p className="rise-in mt-6 max-w-3xl text-lg leading-relaxed sm:text-xl" style={{ "--d": "0.3s" } as React.CSSProperties}>
              {frTypo(article.subtitle)}
            </p>
            <div
              className="rise-in mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm"
              style={{ "--d": "0.4s" } as React.CSSProperties}
            >
              <span className="inline-flex items-center gap-1.5">
                <PenLine className="size-4" aria-hidden /> {author.name}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4" aria-hidden />
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden /> {minutes} min de lecture
              </span>
            </div>
            <div className="rise-in mt-8 flex flex-wrap gap-3 text-ink" style={{ "--d": "0.5s" } as React.CSSProperties}>
              <FavoriteButton slug={article.slug} title={article.title} variant="full" />
              <ShareButton url={url} title={article.title} />
            </div>
          </div>
        </div>
      </header>

      {/* ── Image principale ── */}
      <div className="mx-auto -mt-32 max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <figure>
          <div className="cover-in relative aspect-[16/10] overflow-hidden border-[4px] border-ink bg-ink shadow-[10px_10px_0_0_var(--color-ink)] sm:aspect-[21/9]">
            <SmartImage asset={cover} sizes="(min-width: 1400px) 1340px, 96vw" priority quality={75} imgClassName="cover-zoom" />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-sm text-muted">
            <span>{cover.alt}</span>
            <PhotoCredit asset={cover} />
          </figcaption>
        </figure>
      </div>

      {/* ── Corps ── */}
      <div className="mx-auto mt-12 grid max-w-[88rem] gap-10 px-4 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14 lg:px-8 xl:grid-cols-[17rem_minmax(0,46rem)_1fr]">
        {toc.length > 2 && (
          <aside className="lg:row-span-2">
            <div className="lg:sticky lg:top-24">
              <TableOfContents entries={toc} targetId="article-body" />
            </div>
          </aside>
        )}

        <div id="article-body" className={cn("min-w-0", toc.length <= 2 && "lg:col-start-2")}>
          {article.demo && (
            <aside className="border-[3px] border-dashed border-ink bg-paper-2 p-4 text-sm leading-relaxed">
              <strong>Contenu de démonstration.</strong> Cet article est un exemple rédigé pour présenter YORU. Il traite de
              sujets réels de façon générale ; vérifiez toute information avant de la citer ou de la publier.
            </aside>
          )}

          <ArticleBody blocks={article.body} />

          <footer className="mt-14 border-t-[4px] border-ink pt-8">
            <p className="font-mono text-xs font-bold tracking-[0.25em] uppercase">Mots-clés</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <li key={t}>
                  <Link
                    href={`/recherche?q=${encodeURIComponent(t)}`}
                    className="inline-block border-2 border-ink px-3 py-1 text-sm font-semibold transition-[transform,background-color] hover:-rotate-2 hover:bg-u hover:text-u-fg"
                  >
                    #{t}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <FavoriteButton slug={article.slug} title={article.title} variant="full" />
              <ShareButton url={url} title={article.title} />
              <UniverseBadge universe={article.universe} link className="ml-auto" />
            </div>
            <p className="mt-6 text-sm text-muted">
              Signé {author.name} ({author.role}) · {ARTICLE_TYPE_LABELS[article.type]} publié le {formatDate(article.publishedAt)}.
            </p>
          </footer>
        </div>
      </div>

      {/* ── Précédent / suivant ── */}
      <nav aria-label="Articles précédent et suivant" className="mx-auto mt-20 grid max-w-[88rem] gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
        {older ? (
          <Link
            href={`/articles/${older.slug}`}
            data-universe={older.universe}
            className="group flex flex-col border-[3px] border-ink bg-paper p-5 transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--u)]"
          >
            <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden /> Article précédent
            </span>
            <span className="mt-2 text-lg leading-snug font-bold">{frTypo(older.title)}</span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link
            href={`/articles/${newer.slug}`}
            data-universe={newer.universe}
            className="group flex flex-col items-end border-[3px] border-ink bg-paper p-5 text-right transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--u)]"
          >
            <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase">
              Article suivant <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
            <span className="mt-2 text-lg leading-snug font-bold">{frTypo(newer.title)}</span>
          </Link>
        )}
      </nav>

      {/* ── Articles similaires ── */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mx-auto mt-20 max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <h2 id="related-title" className="display text-[clamp(2.5rem,6vw,4.5rem)]">
            À lire <span className="text-outline [--stroke:var(--color-ink)]">ensuite</span>
          </h2>
          <RevealGroup className="mt-8 grid gap-6 md:grid-cols-3" step={0.1}>
            {related.map((r) => (
              <RevealItem key={r.slug}>
                <ArticleCard article={r} className="h-full" sizes="(min-width: 768px) 30vw, 92vw" />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}
    </article>
  );
}
