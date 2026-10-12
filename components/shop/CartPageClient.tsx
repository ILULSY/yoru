"use client";

import Link from "next/link";
import { m } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/stores/favorites";
import { CartItems, CartSummary } from "@/components/shop/CartLines";
import { buttonClasses } from "@/components/ui/Button";
import { Burst } from "@/components/ui/Decor";
import { SPRING } from "@/lib/motion";

export function CartPageClient() {
  const { count, clear } = useCart();
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div className="skeleton h-72" aria-busy="true" aria-label="Chargement du panier" />;
  }

  if (count === 0) {
    return (
      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={SPRING.soft} className="flex flex-col items-center border-[3px] border-dashed border-ink px-6 py-16 text-center">
        <Burst className="size-32" fill="var(--color-yellow)" spin>
          <ShoppingBag className="mx-auto size-10" aria-hidden />
        </Burst>
        <h2 className="display mt-6 text-5xl">Votre panier est vide</h2>
        <p className="mt-3 max-w-md text-muted">Boosters, figurines, peluches… La boutique n&apos;attend que vous.</p>
        <Link href="/boutique" className={buttonClasses("ink", "lg", "mt-8")}>
          Aller à la boutique
        </Link>
      </m.div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
      <section aria-label="Articles du panier" className="border-[3px] border-ink bg-paper px-5">
        <CartItems />
        <div className="flex justify-between border-t-2 border-ink/15 py-4 text-sm">
          <Link href="/boutique" className="font-bold underline decoration-pink decoration-2 underline-offset-4">
            ← Continuer mes achats
          </Link>
          <button type="button" onClick={clear} className="font-semibold text-muted hover:text-ink hover:underline">
            Vider le panier
          </button>
        </div>
      </section>
      <aside aria-label="Récapitulatif" className="lg:sticky lg:top-24 lg:self-start">
        <div className="border-[4px] border-ink bg-paper p-5 shadow-pop-lg">
          <h2 className="display text-3xl">Récapitulatif</h2>
          <CartSummary className="mt-4" />
        </div>
      </aside>
    </div>
  );
}
