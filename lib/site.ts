/**
 * Configuration éditoriale et technique du site.
 */
export const SITE = {
  name: "YORU",
  /** 夜 : « nuit » en japonais. */
  kanji: "夜",
  slogan: "Collect the night.",
  description:
    "YORU, le média pop culture : cinéma, séries, anime, manga, jeux vidéo, comics, science-fiction, cartes à collectionner, figurines et culture geek.",
  locale: "fr_FR",
  lang: "fr",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  /**
   * Réseaux sociaux : laissez `url` à null tant que le compte n'existe pas.
   * Le footer n'affiche que les réseaux configurés (pas de faux liens).
   */
  socials: [
    { name: "Instagram", url: null as string | null },
    { name: "TikTok", url: null as string | null },
    { name: "YouTube", url: null as string | null },
    { name: "Bluesky", url: null as string | null },
    { name: "Discord", url: null as string | null },
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
