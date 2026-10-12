"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";
import { useCart, useCartDrawer } from "@/lib/stores/cart";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import { CartItems, CartSummary } from "@/components/shop/CartLines";
import { buttonClasses } from "@/components/ui/Button";
import { EASE } from "@/lib/motion";

function Panel({ onClose }: { onClose: () => void }) {
  const ref = useFocusTrap<HTMLDivElement>(true, onClose);
  useScrollLock(true);
  const { count } = useCart();

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Panier" className="fixed inset-0 z-[75] flex justify-end">
      <m.div className="absolute inset-0 bg-ink/70" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden />
      <m.aside
        className="relative flex h-full w-full max-w-md flex-col border-l-[4px] border-ink bg-paper"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%", transition: { duration: 0.28, ease: EASE.snap } }}
        transition={{ duration: 0.45, ease: EASE.expo }}
      >
        <div className="flex items-center justify-between border-b-[3px] border-ink bg-yellow px-5 py-4">
          <h2 className="display flex items-center gap-2 text-3xl">
            <ShoppingBag className="size-6" aria-hidden /> Panier
            <span className="font-mono text-base">({count})</span>
          </h2>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center border-[3px] border-ink bg-paper transition-transform hover:rotate-90" aria-label="Fermer le panier">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="display text-4xl">Panier vide</p>
            <p className="text-muted">Cartes, figurines, produits dérivés : il y a de quoi faire.</p>
            <Link href="/boutique" onClick={onClose} className={buttonClasses("ink", "md")}>
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-5">
              <CartItems compact onNavigate={onClose} />
            </div>
            <div className="border-t-[3px] border-ink px-5 py-4">
              <CartSummary />
              <Link href="/panier" onClick={onClose} className="mt-3 block text-center text-sm font-bold underline decoration-pink decoration-2 underline-offset-4">
                Voir le panier détaillé
              </Link>
            </div>
          </>
        )}
      </m.aside>
    </div>
  );
}

/** Tiroir du panier, monté une fois dans le layout. */
export function CartDrawer() {
  const { open, setOpen } = useCartDrawer();
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return <AnimatePresence>{open && <Panel onClose={() => setOpen(false)} />}</AnimatePresence>;
}
