"use client";

import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { HeartOff, Trash, X } from "lucide-react";
import type { ArticleSummary } from "@/types/content";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Burst } from "@/components/ui/Decor";
import { buttonClasses } from "@/components/ui/Button";
import { useFavorites, useHydrated } from "@/lib/stores/favorites";
import { useToast } from "@/components/ui/Toaster";
import { SPRING } from "@/lib/motion";

/** Liste des favoris enregistrés sur cet appareil. */
export function FavoritesClient({ articles }: { articles: ArticleSummary[] }) {
  const { favorites, remove, clear } = useFavorites();
  const hydrated = useHydrated();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);

  if (!hydrated) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Chargement des favoris">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton aspect-[4/5]" />
        ))}
      </div>
    );
  }

  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const items = favorites.map((f) => bySlug.get(f.slug)).filter((a): a is ArticleSummary => Boolean(a));
  const missing = favorites.filter((f) => !bySlug.has(f.slug));

  if (!items.length) {
    return (
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING.soft}
        className="flex flex-col items-center border-[3px] border-dashed border-ink px-6 py-16 text-center"
      >
        <Burst className="size-36 font-comic text-3xl" fill="var(--color-pink)" spin>
          <HeartOff className="mx-auto size-10" aria-hidden />
        </Burst>
        <h2 className="display mt-6 text-5xl">Aucun favori… pour l&apos;instant</h2>
        <p className="mt-3 max-w-md text-muted">
          Touchez le cœur sur n&apos;importe quel article pour le retrouver ici, même plus tard.
        </p>
        <Link href="/actualites" className={buttonClasses("ink", "lg", "mt-8")}>
          Parcourir les actus
        </Link>
      </m.div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-sm font-bold" aria-live="polite">
          {items.length} article{items.length > 1 ? "s" : ""} sauvegardé{items.length > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {confirm ? (
              <m.div key="confirm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <span className="text-sm font-semibold">Tout effacer ?</span>
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    setConfirm(false);
                    toast({ tone: "info", title: "Favoris effacés" });
                  }}
                  className="h-10 border-[3px] border-ink bg-pink px-3 text-sm font-bold"
                >
                  Oui, effacer
                </button>
                <button type="button" onClick={() => setConfirm(false)} className="h-10 border-[3px] border-ink px-3 text-sm font-bold">
                  Annuler
                </button>
              </m.div>
            ) : (
              <m.button
                key="clear"
                type="button"
                onClick={() => setConfirm(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex h-10 items-center gap-2 border-[3px] border-ink px-3 text-sm font-bold transition-colors hover:bg-pink"
              >
                <Trash className="size-4" aria-hidden /> Tout effacer
              </m.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {missing.length > 0 && (
        <p className="mt-4 border-2 border-ink bg-paper-2 p-3 text-sm">
          {missing.length} favori{missing.length > 1 ? "s pointent" : " pointe"} vers un article qui n&apos;existe plus.{" "}
          <button type="button" className="font-bold underline" onClick={() => missing.forEach((f) => remove(f.slug))}>
            Nettoyer
          </button>
        </p>
      )}

      <m.ul layout className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((a, i) => (
            <m.li
              key={a.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { ...SPRING.snappy, delay: Math.min(i, 8) * 0.04 } }}
              exit={{ opacity: 0, scale: 0.8, rotate: -6, transition: { duration: 0.25 } }}
              className="relative"
            >
              <ArticleCard article={a} className="h-full" noFavorite sizes="(min-width: 1024px) 30vw, 45vw" />
              <button
                type="button"
                onClick={() => {
                  remove(a.slug);
                  toast({ tone: "info", title: "Retiré de vos favoris" });
                }}
                aria-label={`Retirer « ${a.title} » des favoris`}
                className="absolute top-3 right-3 z-10 grid size-10 place-items-center border-[3px] border-ink bg-pink transition-transform hover:rotate-90 active:scale-90"
              >
                <X className="size-5" strokeWidth={3} aria-hidden />
              </button>
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
    </div>
  );
}
