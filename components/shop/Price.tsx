"use client";

import { Timer } from "lucide-react";
import { Money } from "@/components/shop/Money";
import { useShopNow } from "@/components/shop/CatalogProvider";
import { currentPricing, formatSaleDate, type PriceFields } from "@/lib/shop/pricing";
import { cn } from "@/lib/utils";

/**
 * Prix TTC dans la devise choisie (€ ou CHF), avec l'équivalent dans l'autre
 * devise en dessous et le prix barré pendant un solde. Composant client : un
 * solde qui commence ou se termine est pris en compte sans régénérer la page.
 * Transmettez `priceFields(produit)`, pas la fiche entière.
 */
export function Price({ product, className, size = "md" }: { product: PriceFields; className?: string; size?: "md" | "lg" }) {
  const pricing = currentPricing(product, useShopNow());
  const from = product.currency ?? "EUR";
  return (
    <div className={className}>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <Money
          amount={pricing.price}
          from={from}
          className={cn("font-display leading-none", size === "lg" ? "text-5xl" : "text-2xl", pricing.onSale && "text-[#c4006b]")}
        />
        {pricing.struck !== undefined && (
          <span className={cn("text-muted line-through", size === "lg" ? "text-lg" : "text-sm")}>
            <span className="sr-only">au lieu de </span>
            <Money amount={pricing.struck} from={from} />
          </span>
        )}
        <span className="sr-only">TTC</span>
      </p>
      <p className={cn("mt-1 font-mono text-muted", size === "lg" ? "text-sm" : "text-[11px]")}>
        soit <Money amount={pricing.price} from={from} alt />
      </p>
    </div>
  );
}

/** Pastille « −20 % » sur la photo du produit, pendant un solde ou avec un prix barré. */
export function SaleBadge({ product, className, size = "md" }: { product: PriceFields; className?: string; size?: "md" | "lg" }) {
  const pricing = currentPricing(product, useShopNow());
  if (!pricing.percent || pricing.percent < 1) return null;
  return (
    <span
      className={cn(
        "inline-flex rotate-6 items-center border-[3px] border-ink bg-[#c4006b] px-2 py-1 font-display leading-none text-paper shadow-pop-sm",
        size === "lg" ? "text-3xl" : "text-lg",
        className,
      )}
    >
      <span className="sr-only">{pricing.onSale ? "En solde : " : "Réduction : "}</span>−{pricing.percent} %
    </span>
  );
}

/** « Solde jusqu'au 30 novembre à 23:59 » (fiche produit). */
export function SaleNote({ product, className }: { product: PriceFields; className?: string }) {
  const pricing = currentPricing(product, useShopNow());
  if (!pricing.onSale) return null;
  return (
    <p className={cn("inline-flex items-center gap-1.5 border-2 border-ink bg-yellow px-2 py-1 text-sm font-bold", className)}>
      <Timer className="size-4" aria-hidden />
      {pricing.endsAt ? `Soldes jusqu'au ${formatSaleDate(pricing.endsAt)}` : "Prix soldé"}
    </p>
  );
}
