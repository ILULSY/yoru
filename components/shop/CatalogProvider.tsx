"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { CartProduct } from "@/types/shop";

const CatalogContext = createContext<{ map: Map<string, CartProduct>; renderedAt: number }>({ map: new Map(), renderedAt: 0 });

/**
 * Catalogue allégé (nom, prix, stock, visuel) transmis par le layout pour
 * afficher le panier sur toutes les pages. Les prix restent recalculés par le
 * serveur au moment du paiement.
 * `renderedAt` : heure de génération de la page, pour que l'affichage des
 * soldes soit identique côté serveur et à l'hydratation.
 */
export function CatalogProvider({ products, renderedAt, children }: { products: CartProduct[]; renderedAt: number; children: React.ReactNode }) {
  const value = useMemo(() => ({ map: new Map(products.map((p) => [p.slug, p])), renderedAt }), [products, renderedAt]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext).map;
}

/* Heure courante à la minute, partagée par tous les prix affichés. */
const minute = () => Math.floor(Date.now() / 60_000) * 60_000;
let now = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  timer ??= setInterval(() => {
    const next = minute();
    if (next !== now) {
      now = next;
      listeners.forEach((l) => l());
    }
  }, 20_000);
  return () => {
    listeners.delete(listener);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/**
 * Instant de référence pour les soldes : l'heure de génération de la page
 * pendant l'hydratation, puis l'heure réelle (mise à jour chaque minute). Une
 * page générée avant la fin d'un solde affiche donc le bon prix dès son
 * chargement, sans attendre sa régénération.
 */
export function useShopNow(): number {
  const { renderedAt } = useContext(CatalogContext);
  return useSyncExternalStore(
    subscribe,
    () => (now ||= minute()),
    () => renderedAt || minute(),
  );
}
