"use client";

import type { Rates } from "@/lib/shop/currency";
import { RatesContext } from "@/lib/stores/currency";

/** Transmet aux composants client le taux EUR/CHF lu côté serveur. */
export function CurrencyProvider({ rates, children }: { rates: Rates; children: React.ReactNode }) {
  return <RatesContext.Provider value={rates}>{children}</RatesContext.Provider>;
}
