"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CartLine } from "@/types/shop";
import { SHOP } from "@/lib/shop/config";

/**
 * Panier conservé dans le navigateur (localStorage), synchronisé entre onglets.
 * Les prix ne sont jamais stockés ici : ils sont relus dans le catalogue, et
 * recalculés par le serveur au moment du paiement.
 */

const KEY = "pv-cart";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let cache: CartLine[] | null = null;

// État d'ouverture du tiroir panier (partagé entre l'en-tête et les fiches produit).
let drawerOpen = false;
const drawerListeners = new Set<() => void>();

function read(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l): l is CartLine => typeof l?.slug === "string" && Number.isInteger(l?.qty) && l.qty > 0)
      .map((l) => ({ slug: l.slug, qty: Math.min(l.qty, SHOP.maxQtyPerItem) }));
  } catch {
    return [];
  }
}

function persist(next: CartLine[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const snapshot = () => (cache ??= read());

export function useCart() {
  const lines = useSyncExternalStore(subscribe, snapshot, () => EMPTY);

  const add = useCallback((slug: string, qty = 1, max: number = SHOP.maxQtyPerItem) => {
    const current = snapshot();
    const existing = current.find((l) => l.slug === slug);
    const limit = Math.min(max, SHOP.maxQtyPerItem);
    const nextQty = Math.min((existing?.qty ?? 0) + qty, limit);
    persist(
      existing ? current.map((l) => (l.slug === slug ? { ...l, qty: nextQty } : l)) : [...current, { slug, qty: nextQty }],
    );
    return nextQty;
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    const current = snapshot();
    persist(qty <= 0 ? current.filter((l) => l.slug !== slug) : current.map((l) => (l.slug === slug ? { ...l, qty } : l)));
  }, []);

  const remove = useCallback((slug: string) => persist(snapshot().filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => persist([]), []);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  return { lines, count, add, setQty, remove, clear };
}

export function useCartDrawer() {
  const open = useSyncExternalStore(
    (l) => {
      drawerListeners.add(l);
      return () => drawerListeners.delete(l);
    },
    () => drawerOpen,
    () => false,
  );
  const setOpen = useCallback((v: boolean) => {
    drawerOpen = v;
    drawerListeners.forEach((l) => l());
  }, []);
  return { open, setOpen };
}
