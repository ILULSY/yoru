"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Search, X } from "lucide-react";
import type { ArticleSummary, UniverseSlug } from "@/types/content";
import { UNIVERSES } from "@/data/universes";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Money } from "@/components/shop/Money";
import { Burst } from "@/components/ui/Decor";
import { useDebounced } from "@/lib/hooks";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { searchSite } from "@/lib/search-client";

interface Data {
  query: string;
  results: ArticleSummary[];
  total: number;
  approximate: boolean;
  didYouMean: string[];
  products: { slug: string; name: string; price: number; currency: "EUR" | "CHF"; license: string; color: string; ink: string }[];
}

type Status = "idle" | "loading" | "done" | "error";

/** Recherche interactive : résultats en direct, filtre par univers, suggestions. */
export function SearchClient({
  initialQuery,
  initialUniverse,
  initial,
  suggestions,
  popular,
}: {
  initialQuery: string;
  initialUniverse: UniverseSlug | "all";
  initial: Data | null;
  suggestions: string[];
  popular: ArticleSummary[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initialQuery);
  const [universe, setUniverse] = useState<UniverseSlug | "all">(initialUniverse);
  // Dernière réponse reçue, identifiée par (univers, requête) ; le serveur fournit la première.
  const [last, setLast] = useState<{ key: string; data?: Data; error?: boolean } | null>(
    initial ? { key: `${initialUniverse}|${initialQuery.trim()}`, data: initial } : null,
  );
  const debounced = useDebounced(q.trim(), 220);
  const first = useRef(true);

  useEffect(() => {
    // Le premier rendu utilise les résultats calculés côté serveur (s'il y en a).
    if (first.current) {
      first.current = false;
      if (initial || !debounced) return;
    }
    const sp = new URLSearchParams();
    if (debounced) sp.set("q", debounced);
    if (universe !== "all") sp.set("univers", universe);
    router.replace(sp.size ? `${pathname}?${sp}` : pathname, { scroll: false });

    if (debounced.length < 2) return;
    const key = `${universe}|${debounced}`;
    const ctrl = new AbortController();
    searchSite(debounced, { limit: 30, universe: universe === "all" ? undefined : universe, signal: ctrl.signal })
      .then((d) => setLast({ key, data: d }))
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") setLast({ key, error: true });
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `initial` ne sert qu'au premier rendu
  }, [debounced, universe, pathname, router]);

  // Statut dérivé de la saisie courante et de la dernière réponse.
  const currentKey = `${universe}|${q.trim()}`;
  const status: Status =
    q.trim().length < 2 ? "idle" : last?.key !== currentKey ? "loading" : last?.error ? "error" : "done";
  const data = status === "idle" ? null : (last?.data ?? null);

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <label htmlFor="search-page-input" className="sr-only">
          Rechercher sur YORU
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-5 size-7 -translate-y-1/2" strokeWidth={2.8} aria-hidden />
        <input
          id="search-page-input"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Un titre, un studio, une carte…"
          autoComplete="off"
          autoFocus={!initialQuery}
          className="h-20 w-full border-[4px] border-ink bg-paper pr-16 pl-16 text-xl font-bold shadow-pop-lg outline-none transition-shadow focus:shadow-[9px_9px_0_0_var(--color-pink)] sm:text-2xl"
        />
        <span className="absolute top-1/2 right-5 -translate-y-1/2">
          {status === "loading" ? (
            <LoaderCircle className="size-6 animate-spin" aria-label="Recherche en cours" />
          ) : q ? (
            <button type="button" onClick={() => setQ("")} aria-label="Effacer la recherche" className="grid size-9 place-items-center transition-transform hover:rotate-90">
              <X className="size-6" aria-hidden />
            </button>
          ) : null}
        </span>
      </form>

      <div className="mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Filtrer par univers">
        {[{ slug: "all" as const, name: "Tous les univers" }, ...UNIVERSES].map((u) => {
          const active = universe === u.slug;
          return (
            <button
              key={u.slug}
              type="button"
              role="radio"
              aria-checked={active}
              data-universe={u.slug === "all" ? undefined : u.slug}
              onClick={() => setUniverse(u.slug)}
              className="relative isolate h-10 border-2 border-ink px-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
            >
              {active && (
                <m.span layoutId="search-universe" className={cn("absolute inset-0 -z-10", u.slug === "all" ? "bg-ink" : "bg-u")} transition={SPRING.snappy} />
              )}
              <span className={cn(active && (u.slug === "all" ? "text-paper" : "text-u-fg"))}>{u.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10" aria-live="polite" aria-busy={status === "loading"}>
        {status === "idle" && (
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="font-mono text-xs font-bold tracking-[0.25em] uppercase">Idées de recherche</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <m.button
                  key={s}
                  type="button"
                  onClick={() => setQ(s)}
                  initial={{ opacity: 0, y: 12, rotate: -4 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, transition: { ...SPRING.bouncy, delay: i * 0.04 } }}
                  className="border-[3px] border-ink bg-yellow px-4 py-2 font-bold shadow-pop-sm transition-transform hover:-rotate-2"
                >
                  {s}
                </m.button>
              ))}
            </div>
            <p className="mt-12 font-mono text-xs font-bold tracking-[0.25em] uppercase">Les plus lus en ce moment</p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((a) => (
                <ArticleCard key={a.slug} article={a} className="h-full" sizes="(min-width: 1024px) 22vw, 45vw" />
              ))}
            </div>
          </m.div>
        )}

        {status === "error" && (
          <p role="alert" className="border-[3px] border-ink bg-pink p-5 font-semibold">
            La recherche est momentanément indisponible. Réessayez dans un instant.
          </p>
        )}

        {status === "loading" && !data && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton aspect-[4/5]" />
            ))}
          </div>
        )}

        {data && status !== "idle" && status !== "error" && (
          <div className={cn("transition-opacity", status === "loading" && "opacity-50")}>
            <p className="font-mono text-sm font-bold">
              {data.total} résultat{data.total > 1 ? "s" : ""} pour « {data.query} »
              {universe !== "all" && <> dans {UNIVERSES.find((u) => u.slug === universe)?.name}</>}
            </p>
            {data.approximate && (
              <p className="mt-2 text-sm text-muted">Aucun article ne contient tous vos mots : voici les résultats les plus proches.</p>
            )}
            {data.didYouMean.length > 0 && (
              <p className="mt-2">
                Vouliez-vous dire{" "}
                {data.didYouMean.map((w, i) => (
                  <span key={w}>
                    <button type="button" onClick={() => setQ(w)} className="font-bold underline decoration-pink decoration-[3px] underline-offset-2">
                      {w}
                    </button>
                    {i < data.didYouMean.length - 1 ? ", " : ""}
                  </span>
                ))}{" "}
                ?
              </p>
            )}

            {data.products.length > 0 && (
              <div className="mt-6 border-[3px] border-ink bg-paper-2 p-4">
                <p className="font-mono text-xs font-bold tracking-[0.25em] uppercase">Dans la boutique</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {data.products.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/boutique/produit/${p.slug}`}
                        className="inline-flex items-center gap-2 border-2 border-ink bg-paper px-3 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 hover:-rotate-1"
                      >
                        <span className="size-3 rounded-full border border-ink" style={{ background: p.color }} aria-hidden />
                        {p.name}
                        <Money amount={p.price} from={p.currency} className="font-mono text-xs" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.results.length > 0 ? (
              <m.ul layout className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {data.results.map((a, i) => (
                    <m.li
                      key={a.slug}
                      layout
                      initial={{ opacity: 0, y: 24, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1, transition: { ...SPRING.snappy, delay: Math.min(i, 8) * 0.035 } }}
                      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
                    >
                      <ArticleCard article={a} className="h-full" sizes="(min-width: 1024px) 30vw, 45vw" />
                    </m.li>
                  ))}
                </AnimatePresence>
              </m.ul>
            ) : (
              <m.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 flex flex-col items-center border-[3px] border-dashed border-ink px-6 py-14 text-center"
              >
                <Burst className="size-28 font-comic text-2xl" fill="var(--color-cyan)" spin>
                  Zut !
                </Burst>
                <p className="display mt-6 text-4xl">Aucun résultat</p>
                <p className="mt-2 max-w-md text-muted">
                  Essayez un terme plus général, vérifiez l&apos;orthographe ou retirez le filtre d&apos;univers.
                </p>
                {universe !== "all" && (
                  <button type="button" onClick={() => setUniverse("all")} className="mt-5 border-[3px] border-ink bg-yellow px-4 py-2 font-bold">
                    Chercher dans tous les univers
                  </button>
                )}
              </m.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
