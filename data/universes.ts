import type { Universe, UniverseSlug } from "@/types/content";

/**
 * Les huit univers éditoriaux de YORU.
 * Les couleurs de chaque univers sont définies dans styles/globals.css
 * (sélecteurs [data-universe="…"]) afin de rester dans le design system.
 */
export const UNIVERSES: Universe[] = [
  {
    slug: "cinema",
    name: "Cinéma",
    short: "Ciné",
    number: "01",
    tagline: "Grand écran, grandes émotions.",
    description:
      "Blockbusters, films d'auteur, salles premium et coulisses de tournage : tout ce qui fait battre le cœur du septième art.",
    keywords: ["film", "salle", "IMAX", "réalisateur", "bande originale", "kaiju"],
    pattern: "rays",
    cover: "cinema-marquee",
    icon: "clapperboard",
    shout: "ACTION !",
  },
  {
    slug: "series",
    name: "Séries",
    short: "Séries",
    number: "02",
    tagline: "Encore un épisode. Promis.",
    description:
      "Séries animées, sagas au long cours, génériques cultes et nouvelles façons de regarder : le petit écran n'a jamais été aussi grand.",
    keywords: ["streaming", "épisode", "saison", "générique", "animation"],
    pattern: "scanlines",
    cover: "tv-silhouettes",
    icon: "tv",
    shout: "S01E01",
  },
  {
    slug: "anime",
    name: "Anime",
    short: "Anime",
    number: "03",
    tagline: "L'animation japonaise, à pleine vitesse.",
    description:
      "Studios, réalisateurs, adaptations et culture cosplay : plongée dans l'animation japonaise et ses fans.",
    keywords: ["studio", "japanimation", "cosplay", "Tokyo", "adaptation"],
    pattern: "speedlines",
    cover: "akihabara-billboards",
    icon: "sparkles",
    shout: "ZOOM!",
  },
  {
    slug: "manga",
    name: "Manga",
    short: "Manga",
    number: "04",
    tagline: "Se lit de droite à gauche. Se dévore dans tous les sens.",
    description:
      "Shōnen, seinen, shōjo : les séries, les auteurs, l'édition et la passion française pour la bande dessinée japonaise.",
    keywords: ["shōnen", "seinen", "shōjo", "mangaka", "tome", "édition"],
    pattern: "tone",
    cover: "manga-library",
    icon: "book-open",
    shout: "ドン!",
  },
  {
    slug: "jeux-video",
    name: "Jeux vidéo",
    short: "Jeux",
    number: "05",
    tagline: "Insert coin. Continue ?",
    description:
      "Jeux indés, rétrogaming, consoles portables, arcade et esport : tous les niveaux, du premier pixel au boss final.",
    keywords: ["gaming", "indé", "rétro", "console", "arcade", "metroidvania"],
    pattern: "pixels",
    cover: "arcade-neon",
    icon: "gamepad-2",
    shout: "PRESS START",
  },
  {
    slug: "comics",
    name: "Comics & SF",
    short: "Comics",
    number: "06",
    tagline: "Capes, multivers et étoiles lointaines.",
    description:
      "Super-héros, romans graphiques, science-fiction au cinéma et sur papier : les mythologies modernes décryptées.",
    keywords: ["super-héros", "comics", "science-fiction", "multivers", "roman graphique"],
    pattern: "benday",
    cover: "comics-stack",
    icon: "zap",
    shout: "POW!",
  },
  {
    slug: "collectors",
    name: "Collectors",
    short: "Collectors",
    number: "07",
    tagline: "Cartes rares, figurines et objets qui brillent.",
    description:
      "Cartes à collectionner (Pokémon, One Piece et bien d'autres), figurines, produits dérivés : guides, cotes et conseils de collectionneurs.",
    keywords: ["TCG", "cartes", "Pokémon", "One Piece", "figurine", "grading"],
    pattern: "holo",
    cover: "ball-cards",
    icon: "gem",
    shout: "RARE ★",
  },
  {
    slug: "tech",
    name: "Geek & Tech",
    short: "Tech",
    number: "08",
    tagline: "Les gadgets, les codes et la culture qui va avec.",
    description:
      "Réalité virtuelle, claviers mécaniques, impression 3D, jeux de rôle : la culture geek et la technologie qui l'accompagne.",
    keywords: ["VR", "clavier", "impression 3D", "jeu de rôle", "gadget"],
    pattern: "grid",
    cover: "circuit-teal",
    icon: "cpu",
    shout: "BOOT_OK",
  },
];

export const UNIVERSE_MAP = Object.fromEntries(UNIVERSES.map((u) => [u.slug, u])) as Record<
  UniverseSlug,
  Universe
>;

export function getUniverse(slug: string): Universe | undefined {
  return UNIVERSE_MAP[slug as UniverseSlug];
}

export const ARTICLE_TYPE_LABELS = {
  actu: "Actu",
  critique: "Critique",
  dossier: "Dossier",
  guide: "Guide",
  top: "Top",
} as const;
