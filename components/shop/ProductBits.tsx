import type { Product } from "@/types/shop";
import { availabilityLabel, BADGE_LABELS } from "@/lib/shop/format";
import { Money } from "@/components/shop/Money";
import { cn } from "@/lib/utils";

/**
 * Prix TTC dans la devise choisie (€ ou CHF), avec l'équivalent dans l'autre
 * devise en dessous et le prix barré éventuel.
 */
export function Price({
  product,
  className,
  size = "md",
}: {
  product: Pick<Product, "price" | "compareAtPrice" | "currency">;
  className?: string;
  size?: "md" | "lg";
}) {
  const from = product.currency ?? "EUR";
  return (
    <div className={className}>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <Money amount={product.price} from={from} className={cn("font-display leading-none", size === "lg" ? "text-5xl" : "text-2xl")} />
        {product.compareAtPrice && (
          <span className="text-sm text-muted line-through">
            <span className="sr-only">au lieu de </span>
            <Money amount={product.compareAtPrice} from={from} />
          </span>
        )}
        <span className="sr-only">TTC</span>
      </p>
      <p className={cn("mt-1 font-mono text-muted", size === "lg" ? "text-sm" : "text-[11px]")}>
        soit <Money amount={product.price} from={from} alt />
      </p>
    </div>
  );
}

const TONES = {
  ok: "bg-lime",
  low: "bg-orange",
  pre: "bg-cyan",
  out: "bg-paper-3 text-muted",
};

export function StockBadge({ product, className }: { product: Pick<Product, "availability" | "stock" | "releaseDate">; className?: string }) {
  const { label, tone } = availabilityLabel(product);
  return (
    <span className={cn("inline-flex items-center gap-1.5 border-2 border-ink px-2 py-0.5 font-mono text-[11px] font-bold tracking-wide", TONES[tone], className)}>
      <span className={cn("size-2 rounded-full bg-ink", tone === "low" && "animate-blink")} aria-hidden />
      {label}
    </span>
  );
}

export function ProductBadges({ product, className }: { product: Pick<Product, "badges">; className?: string }) {
  if (!product.badges.length) return null;
  return (
    <span className={cn("flex flex-wrap gap-1.5", className)}>
      {product.badges.map((b) => (
        <span
          key={b}
          className={cn(
            "border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase",
            b === "nouveau" && "bg-yellow",
            b === "exclusif" && "bg-pink",
            b === "edition-limitee" && "bg-violet text-paper",
            b === "best-seller" && "bg-ink text-paper",
          )}
        >
          {BADGE_LABELS[b]}
        </span>
      ))}
    </span>
  );
}
