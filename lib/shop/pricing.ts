import type { Currency, Product } from "@/types/shop";

/**
 * Prix effectif d'un produit à un instant donné (soldes compris).
 * Module sans dépendance serveur : utilisé par les pages, le panier, la
 * recherche et le paiement, pour que tous affichent et facturent le même prix.
 */

export type PriceFields = Pick<Product, "price" | "currency" | "compareAtPrice" | "sale">;

export type SaleStatus = "none" | "scheduled" | "active" | "ended";

export function saleStatus(p: Pick<Product, "sale">, now: number): SaleStatus {
  const s = p.sale;
  if (!s) return "none";
  if (s.startsAt && Date.parse(s.startsAt) > now) return "scheduled";
  if (s.endsAt && Date.parse(s.endsAt) <= now) return "ended";
  return "active";
}

export interface Pricing {
  /** Prix à payer, en centimes, dans la devise du produit. */
  price: number;
  /** Prix barré (prix normal pendant un solde, ou prix barré manuel). */
  struck?: number;
  /** Remise arrondie, en %. */
  percent?: number;
  /** Fin du solde en cours (ISO). */
  endsAt?: string;
  onSale: boolean;
}

export function currentPricing(p: PriceFields, now: number): Pricing {
  if (p.sale && saleStatus(p, now) === "active") {
    const struck = Math.max(p.price, p.compareAtPrice ?? 0);
    return { price: p.sale.price, struck, percent: discount(p.sale.price, struck), endsAt: p.sale.endsAt, onSale: true };
  }
  if (p.compareAtPrice && p.compareAtPrice > p.price) {
    return { price: p.price, struck: p.compareAtPrice, percent: discount(p.price, p.compareAtPrice), onSale: false };
  }
  return { price: p.price, onSale: false };
}

const discount = (price: number, struck: number) => Math.round((1 - price / struck) * 100);

/** Arrondi d'usage : 5 centimes en francs suisses, 1 centime en euros. */
export function roundPrice(cents: number, currency: Currency): number {
  return currency === "CHF" ? Math.round(cents / 5) * 5 : Math.round(cents);
}

/** Prix soldé à partir d'une remise en % (arrondi selon la devise). */
export function salePriceFromPercent(price: number, percent: number, currency: Currency): number {
  return roundPrice(price * (1 - percent / 100), currency);
}

/** Champs de prix seuls, à transmettre aux composants client (évite d'envoyer toute la fiche). */
export function priceFields(p: PriceFields): PriceFields {
  return { price: p.price, currency: p.currency, compareAtPrice: p.compareAtPrice, sale: p.sale };
}

/* ── Dates des soldes, à l'heure de Suisse (identique à la France) ── */

const TZ = "Europe/Zurich";
const PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function zurichParts(ms: number) {
  const get = (type: string) => Number(PARTS.formatToParts(new Date(ms)).find((p) => p.type === type)?.value ?? 0);
  return { y: get("year"), m: get("month"), d: get("day"), h: get("hour"), mi: get("minute"), s: get("second") };
}

function zurichOffset(ms: number): number {
  const p = zurichParts(ms);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - Math.floor(ms / 1000) * 1000;
}

/** « 2026-11-27T00:00 » (heure suisse, champ datetime-local) → ISO UTC ; "" si vide ou invalide. */
export function zurichInputToIso(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!m) return "";
  const guess = Date.UTC(+m[1]!, +m[2]! - 1, +m[3]!, +m[4]!, +m[5]!);
  let ms = guess - zurichOffset(guess);
  const second = zurichOffset(ms);
  if (guess - second !== ms) ms = guess - second;
  return new Date(ms).toISOString();
}

/** ISO → valeur de champ datetime-local à l'heure suisse (même résultat sur le serveur et dans le navigateur). */
export function isoToZurichInput(iso: string | undefined): string {
  if (!iso || Number.isNaN(Date.parse(iso))) return "";
  const p = zurichParts(Date.parse(iso));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.y}-${pad(p.m)}-${pad(p.d)}T${pad(p.h)}:${pad(p.mi)}`;
}

const SALE_DATE = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

/** « 27 novembre à 23:59 » */
export function formatSaleDate(iso: string): string {
  return SALE_DATE.format(new Date(iso));
}
