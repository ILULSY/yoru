import type { Article } from "@/types/content";

/**
 * Contrat minimal qu'une source de contenu doit respecter.
 * Pour brancher un CMS (Sanity, Strapi, Directus…), créez un fichier dans ce
 * dossier qui renvoie des `Article` et sélectionnez-le dans lib/content/index.ts.
 */
export interface ContentSource {
  name: string;
  /** Renvoie tous les articles publiés (non triés). */
  listArticles(): Promise<Article[]>;
}
