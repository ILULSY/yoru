import "server-only";
import { cache } from "react";
import type { CartProduct, Product, ProductCategory } from "@/types/shop";
import { LICENSES } from "@/data/shop/licenses";
import { getStore } from "@/lib/shop/store";

/**
 * Accès au catalogue pour les pages publiques : seuls les produits publiés
 * sont visibles (les brouillons n'existent que dans l'espace édition).
 * La source (fichier JSON ou Supabase) est choisie dans lib/shop/store.
 */

export const getProducts = cache(async (): Promise<Product[]> => {
  const { products } = await getStore().read();
  return products.filter((p) => p.status === "published");
});

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export { licenseOf as getLicense } from "@/data/shop/licenses";

export async function productsByCategory(category: ProductCategory) {
  return (await getProducts()).filter((p) => p.category === category);
}

export async function productsByLicense(license: string) {
  return (await getProducts()).filter((p) => p.license === license);
}

export async function featuredProducts(limit = 8) {
  return [...(await getProducts())]
    .filter((p) => p.availability !== "out_of_stock")
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export async function relatedProducts(product: Product, limit = 4) {
  return (await getProducts())
    .filter((p) => p.slug !== product.slug)
    .map((p) => ({ p, score: (p.license === product.license ? 3 : 0) + (p.category === product.category ? 2 : 0) + p.popularity / 1000 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

/** Licences effectivement présentes dans le catalogue, avec leur nombre de produits. */
export async function licensesWithCounts() {
  const products = await getProducts();
  return LICENSES.map((l) => ({ ...l, count: products.filter((p) => p.license === l.slug).length })).filter((l) => l.count > 0);
}

/** Catalogue allégé transmis au panier (layout racine). */
export async function getCartCatalog(): Promise<CartProduct[]> {
  return (await getProducts()).map(
    ({ slug, name, category, type, visual, image, license, character, price, currency, availability, stock, demo }) => ({
      slug,
      name,
      category,
      type,
      visual,
      image,
      license,
      character,
      price,
      currency,
      availability,
      stock,
      demo,
    }),
  );
}
