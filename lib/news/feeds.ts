import type { UniverseSlug } from "@/types/content";

/**
 * Sources du fil d'actualités en direct (flux RSS publics).
 * Seuls le titre, le lien, la date et le nom de la source sont affichés,
 * avec un lien vers l'article original : aucun contenu n'est republié.
 * Toutes ces URL ont été testées le 10 octobre 2026.
 */
export interface FeedSource {
  id: string;
  name: string;
  url: string;
  homepage: string;
  lang: "fr" | "en";
  universe: UniverseSlug;
}

export const FEEDS: FeedSource[] = [
  { id: "ecranlarge", name: "Écran Large", url: "https://www.ecranlarge.com/rss", homepage: "https://www.ecranlarge.com", lang: "fr", universe: "cinema" },
  { id: "allocine", name: "AlloCiné", url: "https://www.allocine.fr/rss/news.xml", homepage: "https://www.allocine.fr", lang: "fr", universe: "cinema" },
  { id: "ann", name: "Anime News Network", url: "https://www.animenewsnetwork.com/news/rss.xml?ann-edition=w", homepage: "https://www.animenewsnetwork.com", lang: "en", universe: "anime" },
  { id: "mal", name: "MyAnimeList", url: "https://myanimelist.net/rss/news.xml", homepage: "https://myanimelist.net/news", lang: "en", universe: "anime" },
  { id: "jvc", name: "Jeuxvideo.com", url: "https://www.jeuxvideo.com/rss/rss.xml", homepage: "https://www.jeuxvideo.com", lang: "fr", universe: "jeux-video" },
  { id: "gamekult", name: "Gamekult", url: "https://www.gamekult.com/feed.xml", homepage: "https://www.gamekult.com", lang: "fr", universe: "jeux-video" },
  { id: "siliconera", name: "Siliconera", url: "https://www.siliconera.com/feed/", homepage: "https://www.siliconera.com", lang: "en", universe: "jeux-video" },
  { id: "cbr", name: "CBR", url: "https://www.cbr.com/feed/", homepage: "https://www.cbr.com", lang: "en", universe: "comics" },
  { id: "actuabd", name: "ActuaBD", url: "https://www.actuabd.com/spip.php?page=backend", homepage: "https://www.actuabd.com", lang: "fr", universe: "comics" },
  { id: "jdg", name: "Journal du Geek", url: "https://www.journaldugeek.com/feed/", homepage: "https://www.journaldugeek.com", lang: "fr", universe: "tech" },
  { id: "numerama", name: "Numerama", url: "https://www.numerama.com/feed/", homepage: "https://www.numerama.com", lang: "fr", universe: "tech" },
];

/** Durée de mise en cache des flux (secondes). */
export const NEWS_REVALIDATE = 1800;
