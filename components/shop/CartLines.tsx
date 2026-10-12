"use client";

import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { Info, LoaderCircle, Lock, Minus, Plus, Trash } from "lucide-react";
import type { CartLine, CartProduct } from "@/types/shop";
import { useCatalog, useShopNow } from "@/components/shop/CatalogProvider";
import { currentPricing } from "@/lib/shop/pricing";
import { ProductMedia } from "@/components/shop/ProductMedia";
import { useCart } from "@/lib/stores/cart";
import { isPurchasable } from "@/lib/shop/format";
import { SHOP, shippingFor } from "@/lib/shop/config";
import { formatMoney, priceIn } from "@/lib/shop/currency";
import { useCurrency, useRates } from "@/lib/stores/currency";
import { CurrencyToggle, Money, RateNote } from "@/components/shop/Money";
import { useCheckout } from "@/components/shop/useCheckout";
import { SPRING } from "@/lib/motion";
import { STATIC_SITE } from "@/lib/static-site";
import { cn } from "@/lib/utils";

/** Lignes du panier associées à leur produit (les produits retirés du catalogue sont ignorés). */
export function resolveLines(lines: CartLine[], catalog: Map<string, CartProduct>) {
  return lines
    .map((l) => ({ line: l, product: catalog.get(l.slug) }))
    .filter((x): x is { line: CartLine; product: CartProduct } => Boolean(x.product));
}

/** Quantité ± accessible. */
export function QtyStepper({ product, qty, compact }: { product: CartProduct; qty: number; compact?: boolean }) {
  const { setQty } = useCart();
  const max = Math.min(product.stock, SHOP.maxQtyPerItem);
  const btn = cn("grid place-items-center transition-colors hover:bg-yellow disabled:opacity-40", compact ? "size-8" : "size-10");
  return (
    <div className="inline-flex items-center border-[3px] border-ink bg-paper" role="group" aria-label={`Quantité de ${product.name}`}>
      <button type="button" className={btn} onClick={() => setQty(product.slug, qty - 1)} aria-label="Retirer un exemplaire">
        <Minus className="size-4" aria-hidden />
      </button>
      <m.span key={qty} initial={{ scale: 1.4 }} animate={{ scale: 1 }} transition={SPRING.bouncy} className="min-w-8 text-center font-mono font-bold" aria-live="polite">
        {qty}
      </m.span>
      <button type="button" className={btn} onClick={() => setQty(product.slug, qty + 1)} disabled={qty >= max} aria-label="Ajouter un exemplaire">
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function CartItems({ compact, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const { lines, remove } = useCart();
  const catalog = useCatalog();
  const now = useShopNow();
  const items = resolveLines(lines, catalog);
  return (
    <ul className="divide-y-2 divide-ink/15">
      <AnimatePresence initial={false}>
        {items.map(({ line, product }) => {
          const unavailable = !isPurchasable(product);
          const pricing = currentPricing(product, now);
          return (
            <m.li
              key={product.slug}
              layout
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40, height: 0, transition: { duration: 0.25 } }}
              transition={SPRING.snappy}
              className="flex gap-3 py-4"
            >
              <Link
                href={`/boutique/produit/${product.slug}`}
                onClick={onNavigate}
                className={cn("shrink-0 overflow-hidden border-[3px] border-ink", compact ? "size-20" : "size-24 sm:size-28")}
              >
                <ProductMedia product={product} idSuffix="cart" sizes="112px" compact />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/boutique/produit/${product.slug}`} onClick={onNavigate} className="leading-snug font-bold hover:underline">
                    {product.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(product.slug)}
                    className="grid size-8 shrink-0 place-items-center transition-colors hover:bg-pink"
                    aria-label={`Retirer ${product.name} du panier`}
                  >
                    <Trash className="size-4" aria-hidden />
                  </button>
                </div>
                <p className="font-mono text-xs text-muted">
                  <Money amount={pricing.price} from={product.currency ?? "EUR"} /> l&apos;unité{pricing.onSale && " · soldé"}{product.availability === "preorder" && " · précommande"}
                </p>
                {unavailable && <p className="mt-1 text-xs font-bold text-[#b0005a]">Ce produit n&apos;est plus disponible.</p>}
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <QtyStepper product={product} qty={line.qty} compact={compact} />
                  <Money amount={pricing.price * line.qty} from={product.currency ?? "EUR"} className="font-display text-xl" />
                </div>
              </div>
            </m.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

/** Récapitulatif, progression vers la livraison offerte et bouton de paiement. */
export function CartSummary({ className }: { className?: string }) {
  const { lines } = useCart();
  const { checkout, pending, error } = useCheckout();
  const catalog = useCatalog();
  const items = resolveLines(lines, catalog);
  const currency = useCurrency();
  const rates = useRates();
  const now = useShopNow();
  // Totaux recalculés dans la devise choisie (le serveur refait le même calcul au paiement).
  const subtotal = items.reduce((s, { line, product }) => s + priceIn(product, currency, rates, now) * line.qty, 0);
  const shipping = shippingFor(subtotal, currency);
  const freeFrom = SHOP.shipping[currency].freeFrom;
  const remaining = Math.max(0, freeFrom - subtotal);
  const progress = Math.min(1, subtotal / freeFrom);
  const fmt = (c: number) => formatMoney(c, currency);
  const blocked = items.some(({ product }) => !isPurchasable(product));

  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold">Payer en</span>
        <CurrencyToggle size="sm" />
      </div>
      <div className="border-[3px] border-ink bg-paper-2 p-3" aria-live="polite">
        <p className="text-sm font-semibold">
          {remaining > 0 ? (
            <>
              Plus que <strong>{fmt(remaining)}</strong> pour la livraison offerte !
            </>
          ) : (
            <>🎉 Livraison offerte !</>
          )}
        </p>
        <div className="mt-2 h-3 border-2 border-ink bg-paper" aria-hidden>
          <m.div className="h-full origin-left bg-[linear-gradient(90deg,var(--color-pink),var(--color-yellow))]" animate={{ scaleX: progress }} transition={SPRING.soft} />
        </div>
      </div>

      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt>Sous-total</dt>
          <dd className="font-mono font-bold">{fmt(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Livraison</dt>
          <dd className="font-mono font-bold">{shipping === 0 ? "Offerte" : fmt(shipping)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t-[3px] border-ink pt-2 text-base">
          <dt className="font-extrabold">Total TTC</dt>
          <dd className="font-display text-3xl">{fmt(subtotal + shipping)}</dd>
        </div>
      </dl>

      <AnimatePresence>
        {error && (
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className={cn("mt-4 flex gap-2 border-[3px] border-ink p-3 text-sm font-semibold", error.status === "not_configured" ? "bg-yellow" : "bg-pink")}
          >
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <p>{error.message}</p>
              {error.issues && (
                <ul className="mt-1 list-disc pl-4 font-normal">
                  {error.issues.map((i) => (
                    <li key={i.slug}>{i.message}</li>
                  ))}
                </ul>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => checkout(lines, currency)}
        disabled={STATIC_SITE || pending || !items.length || blocked}
        className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 border-[3px] border-ink bg-ink text-lg font-bold text-paper shadow-[5px_5px_0_0_var(--color-pink)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-pop)] hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--color-pink)] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : <Lock className="size-5" aria-hidden />}
        {STATIC_SITE ? "Paiement indisponible" : pending ? "Connexion au paiement…" : "Passer au paiement"}
      </button>
      {STATIC_SITE && (
        <p className="mt-2 border-2 border-ink bg-yellow p-2 text-center text-sm font-semibold">
          Cette version du site est une vitrine : les commandes en ligne ne sont pas encore ouvertes et aucun paiement n&apos;est
          possible.
        </p>
      )}
      <p className="mt-2 text-center text-xs text-muted">
        Paiement sécurisé par Stripe, en {currency === "CHF" ? "francs suisses" : "euros"}. Prix TTC.{" "}
        <Link href="/cgv" className="underline">Conditions générales de vente</Link>
      </p>
      <RateNote className="mt-1 text-center" />
    </div>
  );
}
