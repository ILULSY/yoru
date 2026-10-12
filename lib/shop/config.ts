import type { Currency } from "@/types/shop";

/**
 * Paramètres commerciaux de la boutique (à adapter à votre activité réelle).
 * Montants en centimes, TTC, fixés séparément pour chaque devise.
 */
export const SHOP = {
  /** Frais de port forfaitaires et seuil de livraison offerte, par devise. */
  shipping: {
    EUR: { flat: 490, freeFrom: 4900 },
    CHF: { flat: 590, freeFrom: 5000 },
  } satisfies Record<Currency, { flat: number; freeFrom: number }>,
  /** Quantité maximale par produit et par commande. */
  maxQtyPerItem: 10,
  /** Pays de livraison autorisés au paiement (codes ISO). */
  shippingCountries: ["FR", "BE", "LU", "CH", "MC"],
  /** Délai indicatif affiché sur les fiches produit. */
  deliveryEstimate: "2 à 4 jours ouvrés en France métropolitaine et en Suisse",
} as const;

export function shippingFor(subtotal: number, currency: Currency): number {
  const s = SHOP.shipping[currency];
  return subtotal === 0 || subtotal >= s.freeFrom ? 0 : s.flat;
}
