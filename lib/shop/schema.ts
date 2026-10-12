import { z } from "zod";
import {
  AVAILABILITIES,
  CURRENCIES,
  PRODUCT_BADGES,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  VISUAL_KINDS,
  type Product,
  type VisualKind,
} from "@/types/shop";
import { LICENSE_MAP } from "@/data/shop/licenses";

/**
 * Règles d'un produit du catalogue, partagées par la lecture du stockage et
 * l'espace édition (messages en français, affichés tels quels dans le formulaire).
 */

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Fichiers du site, photos envoyées depuis l'espace édition, ou Supabase Storage. */
export function isAllowedImageSrc(src: string): boolean {
  if (/^\/images\/shop\/[a-z0-9-]+\.(webp|png|jpg|avif)$/.test(src)) return true;
  if (/^\/media\/shop\/[a-z0-9-]+\.webp$/.test(src)) return true;
  const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
  if (base && src.startsWith(`${base}/storage/v1/object/public/`)) {
    return /^[a-z0-9_-]+\/[a-z0-9-]+\.webp$/.test(src.slice(`${base}/storage/v1/object/public/`.length));
  }
  return false;
}

const text = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, { error: `${label} : ${min} caractères minimum.` })
    .max(max, { error: `${label} : ${max} caractères maximum.` });

const cents = (label: string) =>
  z
    .number({ error: `${label} : montant invalide.` })
    .int({ error: `${label} : montant invalide.` })
    .positive({ error: `${label} : doit être supérieur à 0.` })
    .max(1_000_000, { error: `${label} : 10 000 maximum.` });

const visualKeys = Object.keys(VISUAL_KINDS) as [VisualKind, ...VisualKind[]];

export const productSchema = z
  .object({
    slug: z
      .string()
      .max(80, { error: "Adresse : 80 caractères maximum." })
      .regex(SLUG_RE, { error: "Adresse : minuscules, chiffres et tirets uniquement (ex. booster-op-17)." }),
    name: text(3, 120, "Nom"),
    status: z.enum(PRODUCT_STATUSES),
    category: z.enum(PRODUCT_CATEGORIES, { error: "Catégorie inconnue." }),
    type: text(2, 60, "Type"),
    license: z
      .string()
      .nullable()
      .refine((l) => l === null || l in LICENSE_MAP, { error: "Licence inconnue." }),
    character: text(1, 60, "Personnage").optional(),
    price: cents("Prix"),
    currency: z.enum(CURRENCIES).optional(),
    compareAtPrice: cents("Prix barré").optional(),
    availability: z.enum(AVAILABILITIES, { error: "Disponibilité inconnue." }),
    stock: z
      .number({ error: "Stock : nombre invalide." })
      .int({ error: "Stock : nombre entier attendu." })
      .nonnegative({ error: "Stock : 0 minimum." })
      .max(100_000, { error: "Stock : 100 000 maximum." }),
    releaseDate: z.string().regex(DAY_RE, { error: "Date de sortie invalide." }).optional(),
    image: z
      .object({
        src: z.string().refine(isAllowedImageSrc, { error: "Photo : adresse non autorisée." }),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        alt: text(10, 200, "Description de la photo"),
      })
      .optional(),
    visual: z.enum(visualKeys, { error: "Visuel d'illustration inconnu." }),
    badges: z.array(z.enum(PRODUCT_BADGES)).max(PRODUCT_BADGES.length),
    description: text(20, 2000, "Description"),
    details: z
      .array(z.tuple([text(1, 40, "Caractéristique"), text(1, 160, "Valeur")]))
      .max(12, { error: "12 caractéristiques maximum." }),
    tags: z.array(text(1, 30, "Mot-clé")).max(15, { error: "15 mots-clés maximum." }),
    popularity: z.number().int().nonnegative().max(1_000_000),
    addedAt: z.string().regex(DAY_RE, { error: "Date d'ajout invalide." }),
    demo: z.boolean(),
    updatedAt: z.string(),
  })
  .superRefine((p, ctx) => {
    if (p.compareAtPrice !== undefined && p.compareAtPrice <= p.price) {
      ctx.addIssue({ code: "custom", path: ["compareAtPrice"], message: "Le prix barré doit être supérieur au prix de vente." });
    }
    if (p.availability === "out_of_stock" && p.stock > 0) {
      ctx.addIssue({ code: "custom", path: ["stock"], message: "En rupture : mettez le stock à 0, ou choisissez « En stock »." });
    }
    if (p.availability === "in_stock" && p.stock === 0) {
      ctx.addIssue({ code: "custom", path: ["stock"], message: "Stock à 0 : indiquez une quantité, ou choisissez « Rupture de stock »." });
    }
    if (p.availability === "preorder" && !p.releaseDate) {
      ctx.addIssue({ code: "custom", path: ["releaseDate"], message: "Précommande : indiquez la date de sortie prévue." });
    }
  });

export type ProductIssues = Partial<Record<string, string>>;

/** Erreurs de validation regroupées par champ (premier message de chaque champ). */
export function issuesByField(error: z.ZodError): ProductIssues {
  const out: ProductIssues = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/**
 * Valide une liste de produits lue dans le stockage. Les entrées invalides ou
 * en double sont écartées (et signalées) plutôt que de casser toute la boutique.
 */
export function validateCatalog(raw: unknown[]): { products: Product[]; problems: string[] } {
  const products: Product[] = [];
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    const res = productSchema.safeParse(item);
    const slug = typeof (item as { slug?: unknown })?.slug === "string" ? (item as { slug: string }).slug : "(sans adresse)";
    if (!res.success) {
      problems.push(`${slug} : ${res.error.issues.map((i) => `${i.path.join(".") || "produit"} — ${i.message}`).join(" ; ")}`);
      continue;
    }
    if (seen.has(res.data.slug)) {
      problems.push(`${slug} : adresse en double, seule la première fiche est conservée.`);
      continue;
    }
    seen.add(res.data.slug);
    products.push(res.data as Product);
  }
  return { products, problems };
}
