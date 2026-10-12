import type { Article } from "@/types/content";
import { LOCAL_ARTICLES } from "@/data/articles";
import { validateArticles } from "../schema";
import type { ContentSource } from "./types";

let cache: Article[] | null = null;

/** Source par défaut : fichiers TypeScript typés du dossier /data. */
export const localSource: ContentSource = {
  name: "local",
  async listArticles() {
    cache ??= validateArticles(LOCAL_ARTICLES);
    return cache;
  },
};
