"use client";

import Link from "next/link";
import { m } from "motion/react";
import { X } from "lucide-react";
import { UNIVERSES } from "@/data/universes";
import { UniverseIcon } from "@/components/ui/UniverseIcon";
import { MotionToggle } from "@/components/layout/MotionToggle";
import { CurrencyToggle } from "@/components/shop/Money";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import { EASE, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/news", label: "News" },
  { href: "/actualites", label: "Articles" },
  { href: "/univers", label: "Univers" },
  { href: "/boutique", label: "Boutique" },
  { href: "/panier", label: "Panier" },
  { href: "/favoris", label: "Favoris" },
  { href: "/recherche", label: "Recherche" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

const STRIPES = ["bg-pink", "bg-yellow", "bg-cyan", "bg-violet"];

/** Menu mobile plein écran : bandes colorées en cascade puis liens XXL. */
export function MobileMenu({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  const ref = useFocusTrap<HTMLDivElement>(true, onClose);
  useScrollLock(true);

  return (
    <m.div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-surface="ink"
      className="fixed inset-0 z-[60] overflow-y-auto text-paper lg:hidden"
      initial="closed"
      animate="open"
      exit="closed"
    >
      {/* Volets de couleur qui balaient l'écran */}
      <div className="pointer-events-none fixed inset-0 flex flex-col" aria-hidden>
        {STRIPES.map((c, i) => (
          <m.div
            key={c}
            className={cn("flex-1 origin-top", c)}
            variants={{
              closed: { scaleY: 0, transition: { duration: 0.25, ease: EASE.snap, delay: (STRIPES.length - i) * 0.03 } },
              open: { scaleY: [0, 1, 1], transition: { duration: 0.5, ease: EASE.snap, delay: i * 0.04 } },
            }}
          />
        ))}
      </div>
      <m.div
        className="fixed inset-0 bg-ink"
        aria-hidden
        variants={{
          closed: { opacity: 0, transition: { duration: 0.2 } },
          open: { opacity: 1, transition: { duration: 0.2, delay: 0.28 } },
        }}
      />

      <m.div
        className="relative flex min-h-full flex-col px-5 pt-4 pb-8"
        variants={{
          closed: { opacity: 0, transition: { duration: 0.15 } },
          open: { opacity: 1, transition: { delay: 0.3, staggerChildren: 0.05, delayChildren: 0.32 } },
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.3em] text-muted-ink uppercase">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="grid size-12 place-items-center border-[3px] border-paper bg-pink text-ink transition-transform active:scale-90"
            aria-label="Fermer le menu"
          >
            <X className="size-6" strokeWidth={3} aria-hidden />
          </button>
        </div>

        <nav aria-label="Navigation mobile" className="mt-6">
          <ul className="space-y-1">
            {LINKS.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <m.li
                  key={l.href}
                  variants={{ closed: { opacity: 0, x: -40 }, open: { opacity: 1, x: 0, transition: SPRING.snappy } }}
                >
                  <Link
                    href={l.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "display flex items-center gap-3 py-1 text-[clamp(2.75rem,13vw,4.5rem)] transition-colors active:text-yellow",
                      active ? "text-yellow" : "text-paper",
                    )}
                  >
                    {l.label}
                    {active && <span className="size-3 rotate-45 bg-pink" aria-hidden />}
                  </Link>
                </m.li>
              );
            })}
          </ul>
        </nav>

        <m.div variants={{ closed: { opacity: 0, y: 20 }, open: { opacity: 1, y: 0 } }} className="mt-8">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-ink uppercase">Univers</p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {UNIVERSES.map((u) => (
              <li key={u.slug}>
                <Link
                  href={`/univers/${u.slug}`}
                  onClick={onClose}
                  data-universe={u.slug}
                  className="flex min-h-12 items-center gap-2 border-2 border-paper bg-u px-3 py-2 font-bold text-u-fg active:scale-95"
                >
                  <UniverseIcon universe={u.slug} className="size-4 shrink-0" />
                  {u.name}
                </Link>
              </li>
            ))}
          </ul>
        </m.div>

        <m.div variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }} className="mt-8 flex flex-wrap items-center gap-6">
          <MotionToggle />
          <span className="flex items-center gap-3 text-sm font-semibold">
            Devise <CurrencyToggle tone="ink" />
          </span>
        </m.div>
      </m.div>
    </m.div>
  );
}
