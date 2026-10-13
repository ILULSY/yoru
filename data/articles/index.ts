import type { Article } from "@/types/content";
import { cinemaArticles } from "./cinema";
import { seriesArticles } from "./series";
import { animeArticles } from "./anime";
import { animePressArticles } from "./anime-presse";
import { mangaArticles } from "./manga";
import { gamingArticles } from "./jeux-video";
import { comicsArticles } from "./comics";
import { collectorsArticles } from "./collectors";
import { techArticles } from "./tech";

/**
 * Point d'entrée des articles locaux.
 * Pour ajouter un article : ajoutez un objet dans le fichier de son univers
 * (ex. data/articles/cinema.ts). Il sera validé au build (voir lib/content/schema.ts).
 */
export const LOCAL_ARTICLES: Article[] = [
  ...cinemaArticles,
  ...seriesArticles,
  ...animeArticles,
  ...animePressArticles,
  ...mangaArticles,
  ...gamingArticles,
  ...comicsArticles,
  ...collectorsArticles,
  ...techArticles,
];
