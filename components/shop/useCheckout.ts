"use client";

import { useState } from "react";
import type { CartLine, Currency } from "@/types/shop";

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; status: string; message: string; issues?: { slug: string; message: string }[] };

/**
 * Lance le paiement : le serveur recalcule le panier à partir du catalogue
 * puis renvoie l'URL de la page de paiement sécurisée (Stripe Checkout).
 * Si le paiement n'est pas configuré, le message renvoyé est affiché tel quel.
 */
export function useCheckout() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<Extract<CheckoutResult, { ok: false }> | null>(null);

  const checkout = async (lines: CartLine[], currency: Currency) => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: lines, currency }),
      });
      const data = (await res.json()) as CheckoutResult;
      if (data.ok) {
        window.location.assign(data.url);
        return;
      }
      setError(data);
    } catch {
      setError({ ok: false, status: "network", message: "Connexion impossible. Vérifiez votre réseau et réessayez." });
    }
    setPending(false);
  };

  return { checkout, pending, error, clearError: () => setError(null) };
}
