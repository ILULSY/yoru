"use client";

import { createContext, useContext, useMemo } from "react";
import type { CartProduct } from "@/types/shop";

const CatalogContext = createContext<Map<string, CartProduct>>(new Map());

/**
 * Catalogue allégé (nom, prix, stock, visuel) transmis par le layout pour
 * afficher le panier sur toutes les pages. Les prix restent recalculés par le
 * serveur au moment du paiement.
 */
export function CatalogProvider({ products, children }: { products: CartProduct[]; children: React.ReactNode }) {
  const map = useMemo(() => new Map(products.map((p) => [p.slug, p])), [products]);
  return <CatalogContext.Provider value={map}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
