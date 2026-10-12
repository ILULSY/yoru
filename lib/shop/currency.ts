import type { Currency, Product } from "@/types/shop";

/**
 * Conversion EUR ⇄ CHF.
 * Chaque produit a un prix de référence dans UNE devise (champ `currency`) ;
 * l'autre est calculée au taux de référence de la Banque centrale européenne.
 * Arrondis : au centime pour l'euro, aux 5 centimes pour le franc suisse
 * (arrondi usuel des prix en Suisse).
 */

export interface Rates {
  /** Nombre de CHF pour 1 EUR. */
  CHF: number;
  /** Date de publication du taux (AAAA-MM-JJ). */
  date: string;
  /** « BCE » si le taux du jour a été récupéré, « secours » sinon. */
  source: "BCE" | "secours";
}

/** Taux de secours (BCE du 9 octobre 2026) si la BCE ne répond pas. */
export const FALLBACK_RATES: Rates = { CHF: 0.9313, date: "2026-10-09", source: "secours" };

const roundTo5 = (cents: number) => Math.round(cents / 5) * 5;

export function convert(cents: number, from: Currency, to: Currency, rates: Rates): number {
  if (from === to) return cents;
  return from === "EUR" ? roundTo5(cents * rates.CHF) : Math.round(cents / rates.CHF);
}

export function priceIn(p: Pick<Product, "price" | "currency">, to: Currency, rates: Rates): number {
  return convert(p.price, p.currency ?? "EUR", to, rates);
}

export function compareAtIn(p: Pick<Product, "compareAtPrice" | "currency">, to: Currency, rates: Rates): number | undefined {
  return p.compareAtPrice === undefined ? undefined : convert(p.compareAtPrice, p.currency ?? "EUR", to, rates);
}

const FORMATTERS: Record<Currency, Intl.NumberFormat> = {
  EUR: new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }),
  CHF: new Intl.NumberFormat("fr-FR", { style: "currency", currency: "CHF" }),
};

/** 695, "CHF" → « 6,95 CHF » ; 746, "EUR" → « 7,46 € » */
export function formatMoney(cents: number, currency: Currency): string {
  return FORMATTERS[currency].format(cents / 100);
}

export const CURRENCY_LABELS: Record<Currency, { short: string; name: string }> = {
  EUR: { short: "€", name: "Euro" },
  CHF: { short: "CHF", name: "Franc suisse" },
};
