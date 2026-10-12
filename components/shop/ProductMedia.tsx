import Image from "next/image";
import type { Product } from "@/types/shop";
import { licenseOf } from "@/data/shop/licenses";
import { ProductVisual } from "@/components/shop/ProductVisual";
import { cn } from "@/lib/utils";

/**
 * Média d'un produit : la photo détourée posée sur le fond pop de sa licence
 * (rayons + trame, ombre décalée qui épouse la découpe), ou, à défaut, le
 * visuel d'illustration SVG.
 */
export function ProductMedia({
  product,
  sizes = "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 46vw",
  priority,
  idSuffix,
  className,
  compact,
}: {
  product: Pick<Product, "slug" | "visual" | "license" | "character" | "name" | "image">;
  sizes?: string;
  priority?: boolean;
  idSuffix?: string;
  className?: string;
  /** Vignettes (panier) : marges et ombre réduites. */
  compact?: boolean;
}) {
  if (!product.image) {
    return <ProductVisual product={product} priorityLabel={idSuffix} className={className} />;
  }
  const lic = licenseOf(product.license);
  const dark = lic.color === "#111114";
  return (
    <div className={cn("relative aspect-square size-full overflow-hidden", className)} style={{ background: lic.color }}>
      <div
        aria-hidden
        className="rays absolute inset-0 [--ray-y:58%]"
        style={{ "--line": dark ? "rgba(248,245,239,0.12)" : "rgba(17,17,20,0.1)" } as React.CSSProperties}
      />
      <div aria-hidden className="halftone halftone-fade absolute inset-0 opacity-25 [--dot-gap:12px] [--fade-dir:180deg]" style={{ color: dark ? "#F8F5EF" : "#111114" }} />
      <div aria-hidden className={cn("absolute inset-x-[18%] rounded-[50%] bg-ink/25 blur-[2px]", compact ? "bottom-[5%] h-[5%]" : "bottom-[6%] h-[6%]")} />
      <Image
        src={product.image.src}
        alt={product.image.alt}
        fill
        sizes={sizes}
        preload={priority}
        loading={priority ? "eager" : "lazy"}
        className={cn(
          "object-contain",
          compact
            ? "p-[8%] drop-shadow-[3px_3px_0_#111114]"
            : "p-[9%] pb-[11%] drop-shadow-[8px_8px_0_#111114]",
        )}
      />
    </div>
  );
}
