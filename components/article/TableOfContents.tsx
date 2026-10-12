"use client";

import { AnimatePresence, m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronDown, ListOrdered } from "lucide-react";
import type { TocEntry } from "@/types/content";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Sommaire avec suivi de lecture : la section en cours est surlignée
 * (indicateur animé) et un cadran indique la progression.
 * Sur mobile, il se replie dans un panneau.
 */
export function TableOfContents({ entries, targetId }: { entries: TocEntry[]; targetId: string }) {
  const [active, setActive] = useState<string | null>(entries[0]?.id ?? null);
  const [open, setOpen] = useState(false);
  const [pct, setPct] = useState(0);
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 200, damping: 30 });

  // Progression de lecture du corps de l'article (et non de toute la page).
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const v = Math.min(1, Math.max(0, (vh * 0.3 - r.top) / Math.max(1, r.height - vh * 0.4)));
      raw.set(v);
      setPct(Math.round(v * 100));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId, raw]);

  useEffect(() => {
    const headings = entries.map((e) => document.getElementById(e.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    const io = new IntersectionObserver(
      (items) => {
        const visible = items.filter((i) => i.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [entries]);

  const list = (
    <ol className="relative space-y-1 border-l-[3px] border-ink/15">
      {entries.map((e, i) => {
        const isActive = active === e.id;
        return (
          <li key={e.id} className="relative">
            {isActive && (
              <m.span layoutId="toc-indicator" className="absolute top-0 -left-[3px] h-full w-[3px] bg-u" transition={SPRING.snappy} aria-hidden />
            )}
            <a
              href={`#${e.id}`}
              onClick={() => setOpen(false)}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block py-1.5 pl-4 text-[0.95rem] leading-snug transition-[color,transform] duration-200",
                isActive ? "translate-x-1 font-bold text-ink" : "text-muted hover:translate-x-1 hover:text-ink",
              )}
            >
              <span className="mr-2 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
              {e.text}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <nav aria-label="Sommaire de l'article">
      {/* Mobile : panneau repliable */}
      <div className="border-[3px] border-ink bg-paper lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 font-bold"
        >
          <span className="flex items-center gap-2">
            <ListOrdered className="size-5" aria-hidden /> Sommaire
            <span className="font-mono text-xs font-normal text-muted">· lu à {pct} %</span>
          </span>
          <ChevronDown className={cn("size-5 transition-transform duration-300", open && "rotate-180")} aria-hidden />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t-2 border-ink/15 px-4 py-3">{list}</div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bureau : colonne collante */}
      <div className="hidden lg:block">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 36 36" className="size-10 -rotate-90" aria-hidden>
            <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-paper-3)" strokeWidth="4" />
            <m.circle cx="18" cy="18" r="15" fill="none" stroke="var(--u)" strokeWidth="4" style={{ pathLength: progress }} />
          </svg>
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase">Sommaire</p>
            <p className="font-mono text-xs text-muted">Lu à {pct} %</p>
          </div>
        </div>
        <div className="mt-4">{list}</div>
      </div>
    </nav>
  );
}
