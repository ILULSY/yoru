import type { Availability, Currency, Product, ProductBadge, ProductCategory, ProductStatus, VisualKind } from "@/types/shop";
import { isoToZurichInput, salePriceFromPercent, zurichInputToIso } from "@/lib/shop/pricing";

/**
 * Brouillon de fiche produit tel qu'il est saisi dans l'espace édition
 * (montants et nombres en texte). `draftToProduct` le convertit en produit,
 * validé ensuite côté serveur par lib/shop/schema.ts.
 */
export interface ProductDraft {
  slug: string;
  name: string;
  status: ProductStatus;
  category: ProductCategory;
  type: string;
  /** "" = sans licence (marque YORU, accessoires). */
  license: string;
  character: string;
  price: string;
  currency: Currency;
  compareAtPrice: string;
  /** Solde : remise en % ou prix soldé, dates à l'heure suisse (champs datetime-local). */
  saleEnabled: boolean;
  saleMode: "percent" | "price";
  salePercent: string;
  salePrice: string;
  saleStartsAt: string;
  saleEndsAt: string;
  availability: Availability;
  stock: string;
  releaseDate: string;
  image: { src: string; width: number; height: number; alt: string } | null;
  visual: VisualKind;
  badges: ProductBadge[];
  description: string;
  details: [string, string][];
  /** Mots-clés séparés par des virgules. */
  tags: string;
  popularity: string;
  addedAt: string;
  demo: boolean;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function emptyDraft(): ProductDraft {
  return {
    slug: "",
    name: "",
    status: "draft",
    category: "cartes",
    type: "",
    license: "",
    character: "",
    price: "",
    currency: "CHF",
    compareAtPrice: "",
    saleEnabled: false,
    saleMode: "percent",
    salePercent: "20",
    salePrice: "",
    saleStartsAt: "",
    saleEndsAt: "",
    availability: "in_stock",
    stock: "",
    releaseDate: "",
    image: null,
    visual: "booster",
    badges: [],
    description: "",
    details: [],
    tags: "",
    popularity: "100",
    addedAt: today(),
    demo: false,
  };
}

const money = (cents: number | undefined) => (cents === undefined ? "" : (cents / 100).toFixed(2).replace(".", ","));

export function productToDraft(p: Product): ProductDraft {
  return {
    slug: p.slug,
    name: p.name,
    status: p.status,
    category: p.category,
    type: p.type,
    license: p.license ?? "",
    character: p.character ?? "",
    price: money(p.price),
    currency: p.currency ?? "EUR",
    compareAtPrice: money(p.compareAtPrice),
    saleEnabled: Boolean(p.sale),
    saleMode: p.sale ? "price" : "percent",
    salePercent: p.sale ? String(Math.round((1 - p.sale.price / p.price) * 100)) : "20",
    salePrice: money(p.sale?.price),
    saleStartsAt: isoToZurichInput(p.sale?.startsAt),
    saleEndsAt: isoToZurichInput(p.sale?.endsAt),
    availability: p.availability,
    stock: String(p.stock),
    releaseDate: p.releaseDate ?? "",
    image: p.image ? { ...p.image } : null,
    visual: p.visual,
    badges: [...p.badges],
    description: p.description,
    details: p.details.map(([a, b]) => [a, b]),
    tags: p.tags.join(", "),
    popularity: String(p.popularity),
    addedAt: p.addedAt,
    demo: p.demo,
  };
}

/** "6,95" ou "6.95" → 695 centimes ; NaN si la saisie n'est pas un montant. */
export function parseMoney(input: string): number {
  const s = input.replace(/\s|\u00a0/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return Number.NaN;
  return Math.round(Number.parseFloat(s) * 100);
}

function parseIntStrict(input: string): number {
  const s = input.trim();
  return /^\d+$/.test(s) ? Number.parseInt(s, 10) : Number.NaN;
}

const opt = (s: string) => (s.trim() ? s.trim() : undefined);

/** Prix soldé saisi (en % ou en montant), NaN si la saisie est invalide. */
export function draftSalePrice(d: ProductDraft): number {
  const regular = parseMoney(d.price);
  if (d.saleMode === "price") return parseMoney(d.salePrice);
  const pct = Number(d.salePercent.replace(",", "."));
  if (!Number.isFinite(regular) || !Number.isFinite(pct) || pct <= 0 || pct >= 100) return Number.NaN;
  return salePriceFromPercent(regular, pct, d.currency);
}

export function draftToProduct(d: ProductDraft, updatedAt: string): Product {
  return {
    slug: d.slug.trim(),
    name: d.name.trim(),
    status: d.status,
    category: d.category,
    type: d.type.trim(),
    license: d.license || null,
    character: opt(d.character),
    price: parseMoney(d.price),
    currency: d.currency,
    compareAtPrice: d.compareAtPrice.trim() ? parseMoney(d.compareAtPrice) : undefined,
    sale: d.saleEnabled
      ? {
          price: draftSalePrice(d),
          startsAt: zurichInputToIso(d.saleStartsAt) || undefined,
          endsAt: zurichInputToIso(d.saleEndsAt) || undefined,
        }
      : undefined,
    availability: d.availability,
    stock: parseIntStrict(d.stock),
    releaseDate: opt(d.releaseDate),
    image: d.image ? { ...d.image, alt: d.image.alt.trim() } : undefined,
    visual: d.visual,
    badges: d.badges,
    description: d.description.trim(),
    details: d.details.map(([a, b]) => [a.trim(), b.trim()] as [string, string]).filter(([a, b]) => a || b),
    tags: d.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    popularity: d.popularity.trim() ? parseIntStrict(d.popularity) : 0,
    addedAt: d.addedAt,
    demo: d.demo,
    updatedAt,
  };
}

/** Adresse (slug) proposée à partir du nom : « Booster Pokémon 30th » → booster-pokemon-30th. */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
