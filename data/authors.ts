import type { Author } from "@/types/content";

/**
 * Signatures éditoriales. Le site de démonstration n'invente pas de
 * journalistes : les articles sont signés par des pôles de la rédaction.
 * Remplacez-les par vos auteurs réels lors de la mise en production.
 */
export const AUTHORS: Record<string, Author> = {
  ecrans: { key: "ecrans", name: "Pôle Écrans", role: "Cinéma & séries" },
  japon: { key: "japon", name: "Pôle Japon", role: "Anime & manga" },
  play: { key: "play", name: "Pôle Play", role: "Jeux vidéo" },
  capes: { key: "capes", name: "Pôle Capes & Étoiles", role: "Comics & science-fiction" },
  collec: { key: "collec", name: "Pôle Collection", role: "Cartes & figurines" },
  labo: { key: "labo", name: "Le Labo", role: "Geek & tech" },
};

export function getAuthor(key: string): Author {
  return AUTHORS[key] ?? { key, name: "La rédaction YORU", role: "Rédaction" };
}
