"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/types/shop";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { useCart } from "@/lib/stores/cart";
import { isPurchasable } from "@/lib/shop/format";
import { SHOP } from "@/lib/shop/config";

/** Choix de la quantité + ajout au panier (fiche produit). */
export function BuyBox({ product }: { product: Product }) {
  const { lines } = useCart();
  const inCart = lines.find((l) => l.slug === product.slug)?.qty ?? 0;
  const max = Math.max(1, Math.min(product.stock, SHOP.maxQtyPerItem) - inCart);
  const [qty, setQty] = useState(1);
  const value = Math.min(qty, max);
  const available = isPurchasable(product);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {available && (
        <div className="inline-flex h-14 items-center border-[3px] border-ink bg-paper" role="group" aria-label="Quantité">
          <button type="button" className="grid size-12 place-items-center hover:bg-yellow disabled:opacity-40" onClick={() => setQty(Math.max(1, value - 1))} disabled={value <= 1} aria-label="Diminuer la quantité">
            <Minus className="size-4" aria-hidden />
          </button>
          <output className="min-w-10 text-center font-mono text-lg font-bold" aria-live="polite">
            {value}
          </output>
          <button type="button" className="grid size-12 place-items-center hover:bg-yellow disabled:opacity-40" onClick={() => setQty(Math.min(max, value + 1))} disabled={value >= max} aria-label="Augmenter la quantité">
            <Plus className="size-4" aria-hidden />
          </button>
        </div>
      )}
      <AddToCartButton product={product} qty={value} size="lg" className="flex-1" />
      {inCart > 0 && <p className="w-full font-mono text-xs text-muted">Déjà {inCart} dans votre panier.</p>}
    </div>
  );
}
