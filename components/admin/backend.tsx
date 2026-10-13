"use client";

import { createContext, useContext } from "react";
import type { SaveState } from "@/lib/admin/types";

/**
 * Ce que l'espace édition sait faire, indépendamment de l'endroit où sont
 * enregistrées les données : serveur (version complète, actions serveur) ou
 * dépôt GitHub (version en ligne sur GitHub Pages).
 */
export interface AdminBackend {
  kind: "server" | "github";
  save: (prev: SaveState, formData: FormData) => Promise<SaveState>;
  remove: (formData: FormData) => Promise<void>;
  toggleStatus: (formData: FormData) => Promise<void>;
  applySale: (formData: FormData) => Promise<void>;
  removeSale: (formData: FormData) => Promise<void>;
  upload: (file: File, opts: { slug: string; removeWhite: boolean }) => Promise<{ src: string; width: number; height: number }>;
  listHref: string;
  editHref: (slug: string) => string;
  newHref: (from?: string) => string;
  /** Après un enregistrement : délai avant que la boutique publique soit à jour. */
  publishNote?: string;
}

const BackendContext = createContext<AdminBackend | null>(null);

export function AdminBackendProvider({ value, children }: { value: AdminBackend; children: React.ReactNode }) {
  return <BackendContext.Provider value={value}>{children}</BackendContext.Provider>;
}

export function useAdminBackend(): AdminBackend {
  const backend = useContext(BackendContext);
  if (!backend) throw new Error("Espace édition : AdminBackendProvider manquant");
  return backend;
}
