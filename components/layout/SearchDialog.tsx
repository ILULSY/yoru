"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useId, useState } from "react";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import type { ArticleSummary } from "@/types/content";
import { UNIVERSES } from "@/data/universes";
import { SmartImage } from "@/components/ui/SmartImage";
import { UniverseBadge } from "@/components/ui/Badges";
import { Money } from "@/components/shop/Money";
import { useDebounced, useFocusTrap, useScrollLock } from "@/lib/hooks";
import { EASE, SPRING } from "@/lib/motion";
import { frTypo } from "@/lib/text";
import { searchSite } from "@/lib/search-client";
import { cn } from "@/lib/utils";

const SUGGESTIONS = ["One Piece", "Ghibli", "grading", "metroidvania", "Spider-Verse", "kaiju"];

interface Response {
  results: ArticleSummary[];
  total: number;
  approximate: boolean;
  didYouMean: string[];
  products: { slug: string; name: string; price: number; currency: "EUR" | "CHF"; license: string; color: string; ink: string }[];
}

type Status = "idle" | "loading" | "done" | "error";

/** Recherche instantanée (⌘K) : résultats en direct, navigation au clavier. */
export function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const ref = useFocusTrap<HTMLDivElement>(true, onClose);
  useScrollLock(true);
  const [q, setQ] = useState("");
  const query = useDebounced(q.trim(), 180);
  // Dernière réponse reçue, associée à la requête qui l'a produite.
  const [last, setLast] = useState<{ query: string; data?: Response; error?: boolean } | null>(null);
  const [active, setActive] = useState(0);
  const listId = useId();

  useEffect(() => {
    if (query.length < 2) return;
    const ctrl = new AbortController();
    searchSite(query, { limit: 6, signal: ctrl.signal })
      .then((d) => {
        setLast({ query, data: d });
        setActive(0);
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") setLast({ query, error: true });
      });
    return () => ctrl.abort();
  }, [query]);

  // Statut dérivé : pas d'état à synchroniser.
  const status: Status =
    q.trim().length < 2 ? "idle" : last?.query !== q.trim() ? "loading" : last?.error ? "error" : "done";
  const data = status === "idle" ? null : (last?.data ?? null);
  const results = data?.results ?? [];
  const goAll = () => router.push(`/recherche?q=${encodeURIComponent(q.trim())}`);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active];
      if (hit) router.push(`/articles/${hit.slug}`);
      else if (q.trim().length >= 2) goAll();
    }
  };

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Recherche" className="fixed inset-0 z-[70] flex justify-center px-3 pt-[8vh] sm:px-6">
      <m.div
        className="absolute inset-0 bg-ink/80"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        aria-hidden
      />
      <m.div
        className="relative flex max-h-[80vh] w-full max-w-2xl flex-col border-[4px] border-ink bg-paper shadow-[10px_10px_0_0_var(--color-pink)]"
        initial={{ opacity: 0, y: -40, scale: 0.96, rotate: -1 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.18, ease: EASE.snap } }}
        transition={SPRING.snappy}
      >
        <div className="flex items-center gap-3 border-b-[3px] border-ink px-4">
          <m.span
            animate={status === "loading" ? { rotate: [0, -15, 15, 0] } : { rotate: 0 }}
            transition={status === "loading" ? { repeat: Infinity, duration: 0.6 } : undefined}
            className="grid place-items-center"
          >
            <Search className="size-6" strokeWidth={2.8} aria-hidden />
          </m.span>
          <label htmlFor="search-dialog-input" className="sr-only">
            Rechercher un article
          </label>
          <input
            id="search-dialog-input"
            data-autofocus
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Un film, un manga, une carte…"
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            className="h-16 min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none placeholder:text-muted/70 sm:text-xl"
          />
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center border-2 border-ink transition-transform hover:rotate-90"
            aria-label="Fermer la recherche"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4" aria-live="polite">
          {status === "idle" && (
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-mono text-xs tracking-[0.25em] text-muted uppercase">Suggestions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <m.button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                    className="border-2 border-ink bg-yellow px-3 py-1.5 text-sm font-bold transition-transform hover:-rotate-3 active:scale-95"
                  >
                    {s}
                  </m.button>
                ))}
              </div>
              <p className="mt-6 font-mono text-xs tracking-[0.25em] text-muted uppercase">Explorer un univers</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {UNIVERSES.map((u) => (
                  <Link
                    key={u.slug}
                    href={`/univers/${u.slug}`}
                    onClick={onClose}
                    data-universe={u.slug}
                    className="border-2 border-ink bg-u px-2 py-2 text-sm font-bold text-u-fg transition-transform hover:-translate-y-0.5"
                  >
                    {u.name}
                  </Link>
                ))}
              </div>
            </m.div>
          )}

          {status === "loading" && !data && (
            <ul className="space-y-3" aria-label="Chargement des résultats">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex gap-3">
                  <div className="skeleton size-16 shrink-0 border-2 border-ink/10" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="skeleton h-3 w-20" />
                    <div className="skeleton h-4 w-4/5" />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {status === "error" && (
            <p className="border-[3px] border-ink bg-pink p-4 font-semibold">
              La recherche est momentanément indisponible. Réessayez dans un instant.
            </p>
          )}

          {(status === "done" || (status === "loading" && data)) && data && (
            <>
              {results.length > 0 || data.products.length > 0 ? (
                <>
                  {results.length > 0 && data.approximate && (
                    <p className="mb-3 text-sm text-muted">Aucun article ne contient tous les mots : voici les plus proches.</p>
                  )}
                  <ul id={listId} role="listbox" aria-label="Résultats" className={cn("space-y-1", status === "loading" && "opacity-60")}>
                    <AnimatePresence initial={false}>
                      {results.map((a, i) => (
                        <m.li
                          key={a.slug}
                          id={`${listId}-${i}`}
                          role="option"
                          aria-selected={i === active}
                          layout
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0, transition: { delay: i * 0.03 } }}
                          exit={{ opacity: 0 }}
                        >
                          <Link
                            href={`/articles/${a.slug}`}
                            onMouseEnter={() => setActive(i)}
                            tabIndex={-1}
                            className={cn(
                              "relative flex items-center gap-3 border-2 p-2 transition-colors",
                              i === active ? "border-ink bg-yellow" : "border-transparent",
                            )}
                          >
                            <span className="relative size-14 shrink-0 overflow-hidden border-2 border-ink">
                              <SmartImage asset={a.cover} sizes="56px" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <UniverseBadge universe={a.universe} />
                              <span className="mt-1 block truncate font-bold">{frTypo(a.title)}</span>
                            </span>
                            {i === active && <CornerDownLeft className="mr-1 size-4 shrink-0" aria-hidden />}
                          </Link>
                        </m.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  {data.products.length > 0 && (
                    <div className="mt-4 border-t-2 border-ink/10 pt-3">
                      <p className="font-mono text-xs tracking-[0.25em] text-muted uppercase">Dans la boutique</p>
                      <ul className="mt-2 space-y-1">
                        {data.products.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={`/boutique/produit/${p.slug}`}
                              onClick={onClose}
                              className="flex items-center gap-3 border-2 border-transparent p-2 transition-colors hover:border-ink hover:bg-yellow"
                            >
                              <span className="grid size-10 shrink-0 place-items-center border-2 border-ink font-display text-xs" style={{ background: p.color, color: p.ink }} aria-hidden>
                                {p.license.slice(0, 3).toUpperCase()}
                              </span>
                              <span className="min-w-0 flex-1 truncate font-bold">{p.name}</span>
                              <Money amount={p.price} from={p.currency} className="font-mono text-sm font-bold" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="display text-4xl">Aucun résultat</p>
                  <p className="mt-2 text-muted">Rien ne correspond à « {query} ».</p>
                  {data.didYouMean.length > 0 && (
                    <p className="mt-3">
                      Vouliez-vous dire{" "}
                      {data.didYouMean.map((w, i) => (
                        <span key={w}>
                          <button type="button" onClick={() => setQ(w)} className="font-bold underline decoration-pink decoration-[3px]">
                            {w}
                          </button>
                          {i < data.didYouMean.length - 1 ? ", " : ""}
                        </span>
                      ))}{" "}
                      ?
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {q.trim().length >= 2 && (
          <div className="flex items-center justify-between gap-3 border-t-[3px] border-ink bg-paper-2 px-4 py-3 text-sm">
            <span className="hidden font-mono text-xs text-muted sm:inline">↑ ↓ pour naviguer · Entrée pour ouvrir</span>
            <button type="button" onClick={goAll} className="group ml-auto inline-flex items-center gap-1.5 font-bold">
              {data ? `Voir les ${data.total} résultat${data.total > 1 ? "s" : ""}` : "Voir tous les résultats"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
          </div>
        )}
      </m.div>
    </div>
  );
}
