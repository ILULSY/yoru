import type { ProductIssues } from "@/lib/shop/schema";

/** Résultat d'un enregistrement de fiche produit (affiché par le formulaire). */
export type SaveState = { message?: string; errors?: ProductIssues };

export type LoginState = { error?: string };
