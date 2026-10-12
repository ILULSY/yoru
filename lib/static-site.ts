/**
 * Version statique du site (GitHub Pages) : construite sans serveur, donc sans
 * espace édition, paiement ni envoi de formulaires. Voir deploy/github-pages.
 */
export const STATIC_SITE = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/** Préfixe des adresses quand le site est servi dans un sous-dossier (ex. /yoru sur GitHub Pages). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Adresse d'un fichier public, préfixe compris (pour les URL que next/link ne gère pas). */
export const withBase = (path: string) => `${BASE_PATH}${path}`;
