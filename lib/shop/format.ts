import type { Availability, Product } from "@/types/shop";

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

export function availabilityLabel(p: Pick<Product, "availability" | "stock" | "releaseDate">): {
  label: string;
  tone: "ok" | "low" | "pre" | "out";
} {
  const map: Record<Availability, () => { label: string; tone: "ok" | "low" | "pre" | "out" }> = {
    in_stock: () =>
      p.stock <= 5 ? { label: `Plus que ${p.stock} en stock`, tone: "low" } : { label: "En stock", tone: "ok" },
    preorder: () => ({
      label: p.releaseDate ? `Précommande — sortie le ${dateFmt.format(new Date(p.releaseDate))}` : "Précommande",
      tone: "pre",
    }),
    out_of_stock: () => ({ label: "Rupture de stock", tone: "out" }),
  };
  return map[p.availability]();
}

export function isPurchasable(p: Pick<Product, "availability" | "stock">): boolean {
  return p.availability !== "out_of_stock" && p.stock > 0;
}

export const BADGE_LABELS = {
  nouveau: "Nouveau",
  exclusif: "Exclusif YORU",
  "edition-limitee": "Édition limitée",
  "best-seller": "Best-seller",
} as const;
