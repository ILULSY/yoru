"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { Currency } from "@/types/shop";
import { FALLBACK_RATES, type Rates } from "@/lib/shop/currency";

/**
 * Devise d'affichage (EUR ou CHF), choisie par le visiteur et mémorisée.
 * La valeur est posée sur <html data-currency> avant le premier rendu
 * (BootScript) : les deux prix sont présents dans le HTML et le CSS n'affiche
 * que celui de la devise choisie, sans clignotement ni écart d'hydratation.
 */
const KEY = "pv-currency";
const listeners = new Set<() => void>();

const read = (): Currency => (document.documentElement.dataset.currency === "CHF" ? "CHF" : "EUR");

export function setCurrency(c: Currency) {
  document.documentElement.dataset.currency = c;
  try {
    localStorage.setItem(KEY, c);
  } catch {}
  listeners.forEach((l) => l());
}

export function useCurrency(): Currency {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => "EUR",
  );
}

/** Taux de change fournis par le serveur (layout). */
export const RatesContext = createContext<Rates>(FALLBACK_RATES);
export const useRates = () => useContext(RatesContext);
