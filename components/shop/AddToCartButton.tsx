"use client";

import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/shop";
import { useCart, useCartDrawer } from "@/lib/stores/cart";
import { useToast } from "@/components/ui/Toaster";
import { isPurchasable } from "@/lib/shop/format";
import { SHOP } from "@/lib/shop/config";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Ajout au panier : le bouton se transforme en coche, le compteur de
 * l'en-tête rebondit et le tiroir du panier s'ouvre.
 */
export function AddToCartButton({
  product,
  qty = 1,
  size = "md",
  className,
  openDrawer = true,
}: {
  product: Pick<Product, "slug" | "name" | "availability" | "stock">;
  qty?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  openDrawer?: boolean;
}) {
  const { add, lines } = useCart();
  const { setOpen } = useCartDrawer();
  const toast = useToast();
  const [done, setDone] = useState(0);
  const available = isPurchasable(product);
  const inCart = lines.find((l) => l.slug === product.slug)?.qty ?? 0;
  const max = Math.min(product.stock, SHOP.maxQtyPerItem);
  const full = inCart >= max;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!available || full) return;
    const total = add(product.slug, qty, max);
    setDone((d) => d + 1);
    if (openDrawer) setOpen(true);
    else toast({ tone: "success", title: "Ajouté au panier", description: `${product.name} (×${total})` });
  };

  const label = !available
    ? "Indisponible"
    : full
      ? "Quantité max. atteinte"
      : product.availability === "preorder"
        ? "Précommander"
        : "Ajouter au panier";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!available || full}
      aria-label={`${label} : ${product.name}`}
      className={cn(
        "group/add relative inline-flex items-center justify-center gap-2 overflow-hidden border-[3px] border-ink font-bold whitespace-nowrap transition-[transform,box-shadow,background-color] duration-200 ease-[var(--ease-pop)]",
        "bg-ink text-paper shadow-[4px_4px_0_0_var(--color-pink)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-pink)] active:translate-y-1 active:shadow-none",
        "disabled:cursor-not-allowed disabled:bg-paper-3 disabled:text-muted disabled:shadow-none disabled:hover:translate-y-0",
        size === "sm" && "h-10 px-3 text-sm",
        size === "md" && "h-12 px-5",
        size === "lg" && "h-14 px-7 text-lg",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={done}
          className="flex items-center gap-2"
          initial={{ y: done ? 24 : 0, opacity: done ? 0 : 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={SPRING.snappy}
        >
          {done > 0 && available && !full ? (
            <>
              <Check className="size-5" strokeWidth={3} aria-hidden /> Ajouté !
            </>
          ) : (
            <>
              <ShoppingBag className="size-5 transition-transform duration-300 group-hover/add:-rotate-12" aria-hidden />
              {size !== "sm" || !available ? label : "Ajouter"}
            </>
          )}
        </m.span>
      </AnimatePresence>
    </button>
  );
}
