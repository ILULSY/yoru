/**
 * Modèle de la boutique YORU.
 * Les prix sont exprimés en centimes d'euro, TTC.
 */

export const PRODUCT_CATEGORIES = ["cartes", "figurines", "produits-derives"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

/** Forme du visuel d'illustration généré (components/shop/ProductVisual), avec son libellé. */
export const VISUAL_KINDS = {
  booster: "Booster",
  display: "Display",
  deck: "Deck",
  coffret: "Coffret",
  sleeves: "Pochettes",
  binder: "Classeur",
  figure: "Figurine",
  statue: "Statue",
  plush: "Peluche",
  mug: "Mug",
  tshirt: "T-shirt",
  hoodie: "Sweat",
  poster: "Affiche",
  flag: "Drapeau",
  headband: "Bandeau",
  keychain: "Porte-clés",
  mat: "Tapis de jeu",
  tote: "Tote bag",
} as const;
export type VisualKind = keyof typeof VISUAL_KINDS;

export const CURRENCIES = ["EUR", "CHF"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const AVAILABILITIES = ["in_stock", "preorder", "out_of_stock"] as const;
export type Availability = (typeof AVAILABILITIES)[number];
export const PRODUCT_BADGES = ["nouveau", "exclusif", "edition-limitee", "best-seller"] as const;
export type ProductBadge = (typeof PRODUCT_BADGES)[number];
/** published : visible en boutique ; draft : visible uniquement dans l'espace édition. */
export const PRODUCT_STATUSES = ["draft", "published"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

/** Solde d'un produit. Sans dates, il s'applique jusqu'à ce qu'on le retire. */
export interface ProductSale {
  /** Prix soldé TTC en centimes, dans la devise du produit. */
  price: number;
  startsAt?: string;
  endsAt?: string;
}

export interface License {
  slug: string;
  name: string;
  /** Libellé court (filtres, visuels). */
  short: string;
  /** Rappel factuel sur l'œuvre. */
  about: string;
  /** Couleurs du visuel : fond et texte. */
  color: string;
  ink: string;
}

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  /** Sous-type affiché (« Booster », « Figurine PVC »…). */
  type: string;
  visual: VisualKind;
  /**
   * Photo détourée du produit (fond transparent) : /images/shop (fichiers du site),
   * /media/shop (envoyée depuis l'espace édition) ou Supabase Storage.
   * Si absente, un visuel d'illustration SVG est généré à partir de `visual`.
   */
  image?: { src: string; width: number; height: number; alt: string };
  /** Slug de licence, ou null pour les accessoires et la marque YORU. */
  license: string | null;
  /** Personnage (figurines) : affiché sur la boîte du visuel. */
  character?: string;
  /** Prix TTC en centimes, exprimé dans `currency`. */
  price: number;
  /** Devise de référence du prix (EUR par défaut). L'autre devise est convertie au taux BCE. */
  currency?: Currency;
  /** Prix barré manuel (prix conseillé, ancien prix), dans `currency`. */
  compareAtPrice?: number;
  /**
   * Solde : prix réduit, éventuellement limité dans le temps (dates ISO).
   * `price` reste le prix normal, rétabli automatiquement à la fin du solde.
   */
  sale?: ProductSale;
  availability: Availability;
  stock: number;
  /** Date de sortie prévue (précommandes), ISO. */
  releaseDate?: string;
  badges: ProductBadge[];
  description: string;
  details: [label: string, value: string][];
  tags: string[];
  popularity: number;
  /** Date d'ajout au catalogue, ISO (tri « nouveautés »). */
  addedAt: string;
  /** true = produit de démonstration (non vendable avec une clé de paiement réelle). */
  demo: boolean;
  /** Brouillon (invisible des clients) ou publié. */
  status: ProductStatus;
  /** Dernière modification, ISO (contrôle des modifications concurrentes). */
  updatedAt: string;
}

/** Champs utiles au panier (affiché sur toutes les pages) : pas de description ni de fiche technique. */
export type CartProduct = Pick<
  Product,
  "slug" | "name" | "category" | "type" | "visual" | "image" | "license" | "character" | "price" | "currency" | "compareAtPrice" | "sale" | "availability" | "stock" | "demo"
>;

export interface CartLine {
  slug: string;
  qty: number;
}
