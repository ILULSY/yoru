import Link from "next/link";
import type { Product } from "@/types/shop";
import { CATEGORY_INFO, licenseOf } from "@/data/shop/licenses";
import { ProductMedia } from "@/components/shop/ProductMedia";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { Price, ProductBadges, SaleBadge, StockBadge } from "@/components/shop/ProductBits";
import { priceFields } from "@/lib/shop/pricing";
import { cn } from "@/lib/utils";

/**
 * Carte produit : le visuel s'incline et zoome au survol, l'étiquette de
 * licence glisse, et l'ajout au panier reste accessible sans ouvrir la fiche.
 */
export function ProductCard({ product, className, idSuffix }: { product: Product; className?: string; idSuffix?: string }) {
  const lic = licenseOf(product.license);
  return (
    <article className={cn("group relative flex h-full flex-col border-[3px] border-ink bg-paper", className)}>
      <Link
        href={`/boutique/produit/${product.slug}`}
        className="flex flex-1 flex-col transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)]"
      >
        <div className="relative aspect-square overflow-hidden border-b-[3px] border-ink">
          <div className="size-full transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.07] group-hover:-rotate-2">
            <ProductMedia product={product} idSuffix={idSuffix} />
          </div>
          <ProductBadges product={product} className="absolute top-2 left-2" />
          <SaleBadge product={priceFields(product)} className="absolute top-2 right-2" />
          <span
            className="absolute right-2 bottom-2 translate-y-2 border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            style={{ background: lic.color, color: lic.ink }}
          >
            {lic.name}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="font-mono text-[11px] font-bold tracking-widest text-muted uppercase">
            {CATEGORY_INFO[product.category].short} · {product.type}
          </p>
          <h3 className="mt-1 leading-snug font-extrabold transition-transform duration-300 group-hover:translate-x-1">{product.name}</h3>
          <div className="mt-auto pt-3">
            <Price product={priceFields(product)} />
            <StockBadge product={product} className="mt-2" />
          </div>
        </div>
      </Link>
      <div className="border-t-[3px] border-ink p-3">
        <AddToCartButton product={product} size="sm" className="w-full" />
      </div>
    </article>
  );
}
