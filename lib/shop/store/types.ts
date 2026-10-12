import type { Product } from "@/types/shop";

export interface StoreHealth {
  /** Les modifications peuvent être enregistrées. */
  writable: boolean;
  /** Explication affichée dans l'espace édition (stockage indisponible, configuration manquante…). */
  message?: string;
}

export interface CatalogSnapshot {
  products: Product[];
  /** Fiches écartées car invalides (édition manuelle du stockage). */
  problems: string[];
}

export class StoreError extends Error {
  constructor(
    message: string,
    readonly code: "conflict" | "not_found" | "exists" | "readonly" | "unavailable",
  ) {
    super(message);
  }
}

/**
 * Stockage du catalogue. Deux implémentations : fichier JSON (serveur Node avec
 * disque inscriptible) et Supabase (hébergement serverless).
 */
export interface ProductStore {
  kind: "file" | "supabase";
  /** Libellé lisible de l'emplacement des données. */
  label: string;
  /** Lecture pour les pages publiques (peut être mise en cache). */
  read(): Promise<CatalogSnapshot>;
  /** Lecture sans cache, pour l'espace édition. */
  readFresh(): Promise<CatalogSnapshot>;
  /**
   * Crée ou remplace un produit.
   * - `previousSlug` : adresse actuelle si on modifie (permet de la changer) ;
   * - `expectedUpdatedAt` : refuse l'écriture si la fiche a changé entre-temps.
   */
  save(product: Product, opts: { previousSlug?: string; expectedUpdatedAt?: string }): Promise<void>;
  remove(slug: string): Promise<void>;
  /** Enregistre une photo (WebP) et renvoie son adresse publique. */
  saveImage(data: Buffer, name: string): Promise<string>;
  health(): Promise<StoreHealth>;
}
