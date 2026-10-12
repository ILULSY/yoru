"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Favoris conservés localement (localStorage), synchronisés entre onglets.
 * Aucun compte n'est nécessaire : rien n'est envoyé à un serveur.
 * Pour une synchronisation multi-appareils, remplacez `persist` par un appel
 * à votre API (ex. table `favorites` Supabase protégée par RLS, cf. README).
 */

export interface Favorite {
  slug: string;
  savedAt: number;
}

const KEY = "pv-favorites";
const EMPTY: Favorite[] = [];
const listeners = new Set<() => void>();
let cache: Favorite[] | null = null;

function read(): Favorite[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (f): f is Favorite => typeof f?.slug === "string" && typeof f?.savedAt === "number",
    );
  } catch {
    return [];
  }
}

function persist(next: Favorite[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* stockage indisponible (navigation privée stricte) : les favoris restent en mémoire */
  }
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

const getSnapshot = () => (cache ??= read());
const getServerSnapshot = () => EMPTY;

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavorite = useCallback((slug: string) => favorites.some((f) => f.slug === slug), [favorites]);

  /** Ajoute ou retire un favori ; renvoie true si l'article est désormais en favori. */
  const toggle = useCallback((slug: string): boolean => {
    const current = getSnapshot();
    const exists = current.some((f) => f.slug === slug);
    persist(exists ? current.filter((f) => f.slug !== slug) : [{ slug, savedAt: Date.now() }, ...current]);
    return !exists;
  }, []);

  const remove = useCallback((slug: string) => persist(getSnapshot().filter((f) => f.slug !== slug)), []);
  const clear = useCallback(() => persist([]), []);
  const restore = useCallback((items: Favorite[]) => persist(items), []);

  return { favorites, isFavorite, toggle, remove, clear, restore };
}

const noop = () => () => {};
/** false pendant le rendu serveur et l'hydratation, true ensuite. */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
