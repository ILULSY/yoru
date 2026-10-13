import type { Product } from "@/types/shop";
import { StoreError } from "@/lib/shop/store/types";

/**
 * Modifications du catalogue (liste brute lue dans le stockage), partagées par
 * le stockage fichier (serveur) et l'espace édition en ligne (GitHub). Les
 * fiches invalides éventuelles sont conservées telles quelles.
 */

const slugOf = (p: unknown) => (p as { slug?: unknown } | null)?.slug;

export function upsertProduct(list: unknown[], product: Product, { previousSlug, expectedUpdatedAt }: { previousSlug?: string; expectedUpdatedAt?: string }) {
  const at = (slug: string) => list.findIndex((p) => slugOf(p) === slug);
  if (previousSlug) {
    const i = at(previousSlug);
    if (i < 0) throw new StoreError("Ce produit n'existe plus : il a peut-être été supprimé entre-temps.", "not_found");
    const current = list[i] as { updatedAt?: string };
    if (expectedUpdatedAt && current.updatedAt !== expectedUpdatedAt) {
      throw new StoreError(
        "Ce produit a été modifié entre-temps (dans un autre onglet ?). Rechargez la page pour repartir de la dernière version.",
        "conflict",
      );
    }
    if (product.slug !== previousSlug && at(product.slug) >= 0) {
      throw new StoreError("Un autre produit utilise déjà cette adresse.", "exists");
    }
    list[i] = product;
  } else {
    if (at(product.slug) >= 0) throw new StoreError("Un produit utilise déjà cette adresse.", "exists");
    list.push(product);
  }
}

export function removeProduct(list: unknown[], slug: string) {
  const i = list.findIndex((p) => slugOf(p) === slug);
  if (i < 0) throw new StoreError("Ce produit n'existe plus.", "not_found");
  list.splice(i, 1);
}
