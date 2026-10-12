"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useMemo, useState, useTransition } from "react";
import { ArrowDown, RotateCcw, Search, X } from "lucide-react";
import { ARTICLE_TYPES, UNIVERSE_SLUGS, type ArticleSummary, type ArticleType, type UniverseSlug } from "@/types/content";
import { ARTICLE_TYPE_LABELS, UNIVERSES } from "@/data/universes";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Burst } from "@/components/ui/Decor";
import { normalize } from "@/lib/text";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PAGE = 9;
type Sort = "recent" | "populaire";

function parse<T extends string>(value: string | null, allowed: readonly T[]): T | "all" {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : "all";
}

/**
 * Explorateur d'actualités : filtres (univers, type), tri, mots-clés et
 * chargement progressif. L'état est reflété dans l'URL (partageable, et
 * conservé au retour arrière).
 */
export function NewsExplorer({ articles }: { articles: ArticleSummary[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const universe = parse<UniverseSlug>(params.get("univers"), UNIVERSE_SLUGS);
  const type = parse<ArticleType>(params.get("type"), ARTICLE_TYPES);
  const sort: Sort = params.get("tri") === "populaire" ? "populaire" : "recent";
  const urlQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [visible, setVisible] = useState(PAGE);

  const update = (next: Record<string, string | null>) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v || v === "all" || (k === "tri" && v === "recent")) sp.delete(k);
      else sp.set(k, v);
    }
    setVisible(PAGE);
    const qs = sp.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const filtered = useMemo(() => {
    const tokens = normalize(urlQuery).split(" ").filter((t) => t.length > 1);
    const list = articles.filter((a) => {
      if (universe !== "all" && a.universe !== universe) return false;
      if (type !== "all" && a.type !== type) return false;
      if (tokens.length) {
        const hay = normalize(`${a.title} ${a.excerpt} ${a.tags.join(" ")}`);
        return tokens.every((t) => hay.includes(t));
      }
      return true;
    });
    return sort === "populaire" ? [...list].sort((x, y) => y.popularity - x.popularity) : list;
  }, [articles, universe, type, sort, urlQuery]);

  const shown = filtered.slice(0, visible);
  const hasFilters = universe !== "all" || type !== "all" || urlQuery !== "";

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: articles.length };
    for (const a of articles) c[a.universe] = (c[a.universe] ?? 0) + 1;
    return c;
  }, [articles]);

  return (
    <div>
      {/* ── Barre de filtres ── */}
      <div className="border-[3px] border-ink bg-paper p-4 shadow-pop sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <form
            role="search"
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: query.trim() || null });
            }}
          >
            <label htmlFor="news-q" className="sr-only">
              Filtrer par mots-clés
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2" aria-hidden />
            <input
              id="news-q"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value === "" && urlQuery) update({ q: null });
              }}
              onBlur={() => query.trim() !== urlQuery && update({ q: query.trim() || null })}
              placeholder="Mots-clés : manga, IMAX, grading…"
              className="h-12 w-full border-[3px] border-ink bg-paper pr-24 pl-11 font-semibold outline-none focus:shadow-[4px_4px_0_0_var(--color-pink)]"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-1.5 h-9 -translate-y-1/2 border-2 border-ink bg-yellow px-3 text-sm font-bold transition-transform active:scale-95"
            >
              Filtrer
            </button>
          </form>

          <div role="radiogroup" aria-label="Trier les articles" className="flex shrink-0 border-[3px] border-ink">
            {(["recent", "populaire"] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={sort === s}
                onClick={() => update({ tri: s })}
                className="relative h-11 px-4 text-sm font-bold"
              >
                {sort === s && (
                  <m.span layoutId="sort-pill" className="absolute inset-0 bg-ink" transition={SPRING.snappy} />
                )}
                <span className={cn("relative transition-colors", sort === s ? "text-paper" : "text-ink")}>
                  {s === "recent" ? "Plus récents" : "Plus populaires"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="font-mono text-[11px] font-bold tracking-[0.25em] text-muted uppercase">Univers</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {[{ slug: "all", name: "Tous" }, ...UNIVERSES].map((u) => {
              const active = universe === u.slug;
              return (
                <button
                  key={u.slug}
                  type="button"
                  aria-pressed={active}
                  data-universe={u.slug === "all" ? undefined : u.slug}
                  onClick={() => update({ univers: u.slug })}
                  className="relative isolate inline-flex h-10 items-center gap-1.5 border-2 border-ink px-3 text-sm font-bold transition-transform duration-200 ease-[var(--ease-pop)] hover:-translate-y-0.5"
                >
                  {active && (
                    <m.span
                      layoutId="universe-pill"
                      className={cn("absolute inset-0 -z-10", u.slug === "all" ? "bg-ink" : "bg-u")}
                      transition={SPRING.snappy}
                    />
                  )}
                  <span className={cn(active && (u.slug === "all" ? "text-paper" : "text-u-fg"))}>{u.name}</span>
                  <span className={cn("font-mono text-[11px] opacity-60", active && (u.slug === "all" ? "text-paper" : "text-u-fg"))}>
                    {counts[u.slug] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="font-mono text-[11px] font-bold tracking-[0.25em] text-muted uppercase">Format</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["all", ...ARTICLE_TYPES] as const).map((t) => {
              const active = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={active}
                  onClick={() => update({ type: t })}
                  className={cn(
                    "h-9 border-2 border-ink px-3 text-sm font-semibold transition-[transform,background-color] duration-200",
                    active ? "-rotate-2 bg-yellow" : "bg-paper hover:bg-paper-2",
                  )}
                >
                  {t === "all" ? "Tous les formats" : ARTICLE_TYPE_LABELS[t]}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* ── Résumé des résultats ── */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="font-mono text-sm font-bold">
          {filtered.length} article{filtered.length > 1 ? "s" : ""}
          {urlQuery && <> pour « {urlQuery} »</>}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              update({ univers: null, type: null, q: null });
            }}
            className="group inline-flex items-center gap-1.5 text-sm font-bold underline decoration-pink decoration-2 underline-offset-4"
          >
            <RotateCcw className="size-4 transition-transform duration-500 group-hover:-rotate-180" aria-hidden />
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* ── Grille animée ── */}
      {filtered.length > 0 ? (
        <m.ul layout className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((a, i) => (
              <m.li
                key={a.slug}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { ...SPRING.snappy, delay: Math.min(i % PAGE, 8) * 0.03 } }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
              >
                <ArticleCard article={a} className="h-full" sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 92vw" />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      ) : (
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING.bouncy}
          className="mt-8 flex flex-col items-center border-[3px] border-dashed border-ink px-6 py-14 text-center"
        >
          <Burst className="size-32 font-comic text-3xl" fill="var(--color-pink)" spin>
            Oups !
          </Burst>
          <p className="display mt-6 text-4xl sm:text-5xl">Aucun article trouvé</p>
          <p className="mt-3 max-w-md text-muted">
            Aucun contenu ne correspond à cette combinaison de filtres. Essayez un autre univers, un autre format ou d&apos;autres mots-clés.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              update({ univers: null, type: null, q: null });
            }}
            className="mt-6 inline-flex h-12 items-center gap-2 border-[3px] border-ink bg-yellow px-5 font-bold shadow-pop-sm transition-transform hover:-translate-y-0.5"
          >
            <X className="size-4" aria-hidden /> Effacer les filtres
          </button>
        </m.div>
      )}

      {visible < filtered.length && (
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="font-mono text-xs text-muted">
            {shown.length} sur {filtered.length} affichés
          </p>
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE)}
            className="group inline-flex h-14 items-center gap-2 border-[3px] border-ink bg-ink px-7 text-lg font-bold text-paper shadow-[5px_5px_0_0_var(--color-yellow)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-pop)] hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--color-yellow)] active:translate-y-1 active:shadow-none"
          >
            Charger plus d&apos;articles
            <ArrowDown className="size-5 transition-transform duration-300 group-hover:translate-y-1" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
