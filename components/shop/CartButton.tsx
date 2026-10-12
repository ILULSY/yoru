"use client";

import { AnimatePresence, m } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useCart, useCartDrawer } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/stores/favorites";
import { SPRING } from "@/lib/motion";

/** Bouton panier de l'en-tête : ouvre le tiroir, le compteur rebondit à chaque ajout. */
export function CartButton() {
  const { count } = useCart();
  const { setOpen } = useCartDrawer();
  const hydrated = useHydrated();
  const n = hydrated ? count : 0;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group/c relative grid size-11 place-items-center border-[3px] border-ink bg-yellow transition-[transform,box-shadow] duration-200 ease-[var(--ease-pop)] hover:-translate-y-0.5 hover:rotate-6 hover:shadow-pop-sm"
      aria-label={`Panier${n ? ` (${n} article${n > 1 ? "s" : ""})` : " (vide)"}`}
    >
      <m.span key={n} initial={n ? { rotate: -20, scale: 1.25 } : false} animate={{ rotate: 0, scale: 1 }} transition={SPRING.bouncy} className="grid place-items-center">
        <ShoppingBag className="size-5" strokeWidth={2.6} aria-hidden />
      </m.span>
      <AnimatePresence>
        {n > 0 && (
          <m.span
            key={n}
            initial={{ scale: 0, y: 6 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            transition={SPRING.bouncy}
            className="absolute -top-2.5 -right-2.5 grid min-w-6 place-items-center rounded-full border-2 border-ink bg-pink px-1 font-mono text-[11px] leading-5 font-bold"
            aria-hidden
          >
            {n}
          </m.span>
        )}
      </AnimatePresence>
    </button>
  );
}
