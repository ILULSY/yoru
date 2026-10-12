"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/stores/cart";

/** Vide le panier une fois le paiement confirmé par le serveur. */
export function ClearCartOnSuccess() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
