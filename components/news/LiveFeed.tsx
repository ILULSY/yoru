"use client";

import { AnimatePresence, m } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { UniverseSlug } from "@/types/content";
import { UNIVERSE_MAP, UNIVERSES } from "@/data/universes";
import { RelativeTime } from "@/components/news/RelativeTime";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FeedItem {
  id: string;
  title: string;
  url: string;
  date: string | null;
  source: string;
  lang: "fr" | "en";
  universe: UniverseSlug;
}

const STEP = 30;

/** Fil en direct : titres des médias spécialisés, filtrables, liens vers les originaux. */
export function LiveFeed({ items }: { items: FeedItem[] }) {
  const [universe, setUniverse] = useState<UniverseSlug | "all">("all");
  const [lang, setLang] = useState<"all" | "fr" | "en">("all");
  const [visible, setVisible] = useState(STEP);

  const present = useMemo(() => UNIVERSES.filter((u) => items.some((i) => i.universe === u.slug)), [items]);
  const filtered = items.filter((i) => (universe === "all" || i.universe === universe) && (lang === "all" || i.lang === lang));
  const shown = filtered.slice(0, visible);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filtrer par univers">
          {[{ slug: "all" as const, name: "Tout" }, ...present].map((u) => {
            const active = universe === u.slug;
            return (
              <button
                key={u.slug}
                type="button"
                role="radio"
                aria-checked={active}
                data-universe={u.slug === "all" ? undefined : u.slug}
                onClick={() => {
                  setUniverse(u.slug);
                  setVisible(STEP);
                }}
                className="relative isolate h-10 border-2 border-paper/70 px-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
              >
                {active && <m.span layoutId="live-u" className={cn("absolute inset-0 -z-10", u.slug === "all" ? "bg-paper" : "bg-u")} transition={SPRING.snappy} />}
                <span className={cn(active && (u.slug === "all" ? "text-ink" : "text-u-fg"))}>{u.name}</span>
              </button>
            );
          })}
        </div>
        <div className="flex border-2 border-paper/70" role="radiogroup" aria-label="Langue des sources">
          {(["all", "fr", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={lang === l}
              onClick={() => setLang(l)}
              className={cn("h-10 px-3 text-sm font-bold transition-colors", lang === l ? "bg-yellow text-ink" : "hover:bg-paper/10")}
            >
              {l === "all" ? "FR + EN" : l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 font-mono text-xs text-muted-ink" aria-live="polite">
        {filtered.length} titre{filtered.length > 1 ? "s" : ""}
      </p>

      <m.ol layout className="mt-3 divide-y-2 divide-paper/15 border-y-2 border-paper/15">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((it) => (
            <m.li
              key={it.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={SPRING.snappy}
              data-universe={it.universe}
            >
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-1 py-4 transition-colors hover:bg-paper/5 sm:items-center"
              >
                <span className="mt-1.5 size-3 shrink-0 rotate-45 border-2 border-ink bg-u sm:mt-0" aria-hidden />
                <span className="min-w-0">
                  <span className="block leading-snug font-semibold transition-transform duration-300 group-hover:translate-x-1">
                    {it.title}
                    <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 font-mono text-xs text-muted-ink">
                    <span className="font-bold text-paper">{it.source}</span>
                    <span>{UNIVERSE_MAP[it.universe].short}</span>
                    <span className="border border-current px-1 leading-4">{it.lang.toUpperCase()}</span>
                    {it.date && <RelativeTime iso={it.date} />}
                  </span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-u opacity-60 transition-[transform,opacity] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden />
              </a>
            </m.li>
          ))}
        </AnimatePresence>
      </m.ol>

      {filtered.length === 0 && <p className="mt-6 text-muted-ink">Aucun titre pour ce filtre en ce moment.</p>}

      {visible < filtered.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + STEP)}
            className="h-12 border-[3px] border-paper px-6 font-bold transition-colors hover:bg-paper hover:text-ink"
          >
            Afficher plus de titres ({filtered.length - visible})
          </button>
        </div>
      )}
    </div>
  );
}
