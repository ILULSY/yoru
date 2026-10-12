"use client";

import Link from "next/link";
import { m } from "motion/react";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { UNIVERSES } from "@/data/universes";
import { UniverseIcon, PATTERN_CLASS } from "@/components/ui/UniverseIcon";
import { EASE, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Méga-menu des univers : 8 tuiles colorées qui « tombent » en cascade. */
export function MegaMenu({ onClose, onPointerEnter }: { onClose: () => void; onPointerEnter: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) => {
      const header = ref.current?.closest("header");
      if (header && !header.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [onClose]);

  return (
    <m.div
      ref={ref}
      id="mega-menu"
      data-surface="ink"
      onPointerEnter={onPointerEnter}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.25, ease: EASE.snap } }}
      transition={{ duration: 0.45, ease: EASE.expo }}
      className="absolute inset-x-0 top-full hidden border-b-[3px] border-ink bg-ink text-paper lg:block"
    >
      <div className="mx-auto grid max-w-[88rem] grid-cols-[1fr_3fr] gap-8 px-8 py-8">
        <div className="flex flex-col justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-muted-ink uppercase">Choisis ton univers</p>
            <p className="display mt-3 text-6xl text-yellow">8 mondes.<br />0 limite.</p>
          </div>
          <Link
            href="/univers"
            className="group mt-6 inline-flex items-center gap-2 font-bold text-paper underline decoration-pink decoration-[3px] underline-offset-4"
          >
            Tous les univers
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
          </Link>
        </div>
        <m.ul
          className="grid grid-cols-4 gap-3"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.08 } } }}
        >
          {UNIVERSES.map((u, i) => (
            <m.li
              key={u.slug}
              variants={{
                hidden: { opacity: 0, y: -24, rotate: i % 2 ? 4 : -4 },
                show: { opacity: 1, y: 0, rotate: 0, transition: SPRING.bouncy },
              }}
            >
              <Link
                href={`/univers/${u.slug}`}
                data-universe={u.slug}
                onClick={onClose}
                className="group relative flex h-32 flex-col justify-between overflow-hidden border-[3px] border-paper bg-u p-3 text-u-fg transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:-rotate-2"
              >
                <span
                  aria-hidden
                  className={cn(
                    PATTERN_CLASS[u.slug],
                    "absolute inset-0 opacity-0 transition-opacity duration-300 [--dot:currentColor] [--line:currentColor] group-hover:opacity-20",
                  )}
                />
                <span className="relative flex items-start justify-between">
                  <span className="font-mono text-xs font-bold">{u.number}</span>
                  <UniverseIcon
                    universe={u.slug}
                    className="size-6 transition-transform duration-500 ease-[var(--ease-pop)] group-hover:scale-125 group-hover:rotate-12"
                  />
                </span>
                <span className="relative">
                  <span className="display block text-3xl">{u.name}</span>
                  <span className="mt-1 block truncate text-xs font-medium opacity-80">{u.tagline}</span>
                </span>
              </Link>
            </m.li>
          ))}
        </m.ul>
      </div>
    </m.div>
  );
}
