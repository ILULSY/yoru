import Link from "next/link";
import { ArrowUpRight, Info, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/types/shop";
import { Money } from "@/components/shop/Money";
import { SHOP } from "@/lib/shop/config";
import { ProductCard } from "@/components/shop/ProductCard";
import { cn } from "@/lib/utils";

/** Avertissement honnête : catalogue fictif tant que le vrai n'est pas branché. */
export function ShopDemoNotice({ className }: { className?: string }) {
  return (
    <p className={cn("flex gap-3 border-[3px] border-dashed border-ink bg-paper-2 p-4 text-sm leading-relaxed", className)}>
      <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
      <span>
        <strong>Boutique de démonstration.</strong> Les prix et les stocks sont fictifs, comme la plupart des produits, dont les
        visuels sont des illustrations générées. Aucune commande réelle n&apos;est possible tant que le paiement et un vrai catalogue (produits officiels sous
        licence) ne sont pas configurés.
      </span>
    </p>
  );
}

/** Bandeau des engagements (livraison, retours, paiement). */
export function ShopPerks({ className }: { className?: string }) {
  const free = { EUR: SHOP.shipping.EUR.freeFrom, CHF: SHOP.shipping.CHF.freeFrom };
  const flat = { EUR: SHOP.shipping.EUR.flat, CHF: SHOP.shipping.CHF.flat };
  const perks: { icon: typeof Truck; title: React.ReactNode; text: React.ReactNode }[] = [
    {
      icon: Truck,
      title: (
        <>
          Livraison offerte dès <Money values={free} />
        </>
      ),
      text: (
        <>
          Sinon <Money values={flat} /> · {SHOP.deliveryEstimate}
        </>
      ),
    },
    { icon: RotateCcw, title: "14 jours pour changer d'avis", text: "Droit de rétractation (conditions dans les CGV)" },
    { icon: ShieldCheck, title: "Paiement sécurisé en € ou en CHF", text: "Carte bancaire via Stripe, aucune donnée bancaire stockée chez nous" },
  ];
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-3", className)}>
      {perks.map((p, i) => (
        <li key={i} className="flex gap-3 border-[3px] border-ink bg-paper p-4">
          <p.icon className="size-6 shrink-0" aria-hidden />
          <span>
            <span className="block font-bold leading-snug">{p.title}</span>
            <span className="mt-0.5 block text-sm text-muted">{p.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Grille statique de produits (rendu serveur, sans filtres). */
export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {products.map((p) => (
        <li key={p.slug}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}

export function ShopLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5 font-bold underline decoration-pink decoration-[3px] underline-offset-4">
      {children}
      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
    </Link>
  );
}
