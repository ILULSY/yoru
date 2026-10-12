import type { License } from "@/types/shop";

/**
 * Licences proposées dans la boutique. Les noms d'œuvres sont des marques
 * appartenant à leurs ayants droit : la boutique doit uniquement vendre des
 * produits officiels achetés auprès de distributeurs agréés.
 * Aucun logo officiel n'est utilisé : les noms sont composés en typographie YORU.
 */
export const LICENSES: License[] = [
  {
    slug: "dragon-ball-z",
    name: "Dragon Ball Z",
    short: "DBZ",
    about: "Issu du manga d'Akira Toriyama lancé en 1984 dans le Weekly Shōnen Jump, Dragon Ball est devenu l'une des franchises les plus populaires au monde.",
    color: "#FF6B35",
    ink: "#111114",
  },
  {
    slug: "hunter-x-hunter",
    name: "Hunter × Hunter",
    short: "HxH",
    about: "Manga de Yoshihiro Togashi publié depuis 1998 : la quête de Gon pour retrouver son père, chasseur légendaire.",
    color: "#C6FF1A",
    ink: "#111114",
  },
  {
    slug: "one-piece",
    name: "One Piece",
    short: "One Piece",
    about: "Le manga d'Eiichiro Oda, publié depuis 1997, suit Luffy et son équipage de pirates en quête du trésor légendaire.",
    color: "#FF2D95",
    ink: "#111114",
  },
  {
    slug: "naruto",
    name: "Naruto",
    short: "Naruto",
    about: "Manga de Masashi Kishimoto (1999-2014) qui raconte l'ascension d'un jeune ninja rejeté par son village.",
    color: "#FFE600",
    ink: "#111114",
  },
  {
    slug: "pokemon",
    name: "Pokémon",
    short: "Pokémon",
    about: "Née en 1996 avec les jeux vidéo, la franchise Pokémon s'est déclinée en anime, en films et en jeu de cartes à collectionner.",
    color: "#00E5FF",
    ink: "#111114",
  },
  {
    slug: "jujutsu-kaisen",
    name: "Jujutsu Kaisen",
    short: "JJK",
    about: "Manga de Gege Akutami (2018-2024) sur un lycéen plongé dans le monde des exorcistes et des fléaux.",
    color: "#3155FF",
    ink: "#F8F5EF",
  },
  {
    slug: "demon-slayer",
    name: "Demon Slayer",
    short: "Demon Slayer",
    about: "Kimetsu no Yaiba, manga de Koyoharu Gotōge (2016-2020), suit Tanjirō, devenu pourfendeur de démons pour sauver sa sœur.",
    color: "#8B35FF",
    ink: "#F8F5EF",
  },
  {
    slug: "yu-gi-oh",
    name: "Yu-Gi-Oh!",
    short: "Yu-Gi-Oh!",
    about: "Créé par Kazuki Takahashi en 1996, Yu-Gi-Oh! a donné naissance à l'un des jeux de cartes à collectionner les plus joués.",
    color: "#111114",
    ink: "#FFE600",
  },
];

export const LICENSE_MAP = Object.fromEntries(LICENSES.map((l) => [l.slug, l])) as Record<string, License>;

/** Identité visuelle des produits sans licence (accessoires, marque YORU). */
export const HOUSE_LICENSE: License = {
  slug: "yoru",
  name: "YORU",
  short: "YORU",
  about: "Accessoires et créations de la marque YORU.",
  color: "#8B35FF",
  ink: "#F8F5EF",
};

/** Licence d'un produit (ou identité YORU pour les produits sans licence). */
export function licenseOf(slug: string | null): License {
  return slug ? (LICENSE_MAP[slug] ?? HOUSE_LICENSE) : HOUSE_LICENSE;
}

export const CATEGORY_INFO = {
  cartes: {
    name: "Cartes à collectionner",
    short: "Cartes",
    tagline: "Boosters, decks, coffrets et tout pour protéger vos trésors.",
    media: "cards-scattered",
    color: "bg-cyan",
  },
  figurines: {
    name: "Figurines",
    short: "Figurines",
    tagline: "Figurines PVC, articulées et statues pour une vitrine qui claque.",
    media: "vintage-heroes",
    color: "bg-pink",
  },
  "produits-derives": {
    name: "Produits dérivés",
    short: "Dérivés",
    tagline: "Textile, mugs, peluches, posters : la pop culture au quotidien.",
    media: "toy-showcase",
    color: "bg-yellow",
  },
} as const;
