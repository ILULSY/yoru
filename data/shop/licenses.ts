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
  {
    slug: "disney",
    name: "Disney",
    short: "Disney",
    about: "Les héros des studios Disney, de Mickey à Stitch, et le jeu de cartes à collectionner Disney Lorcana.",
    color: "#F8F5EF",
    ink: "#3155FF",
  },
  {
    slug: "marvel",
    name: "Marvel",
    short: "Marvel",
    about: "L'univers des super-héros Marvel Comics, éditeur né en 1939 sous le nom de Timely Publications.",
    color: "#E8112D",
    ink: "#F8F5EF",
  },
  {
    slug: "star-wars",
    name: "Star Wars",
    short: "Star Wars",
    about: "La saga créée par George Lucas, lancée au cinéma en 1977 et prolongée en films, séries et romans.",
    color: "#111114",
    ink: "#F8F5EF",
  },
  {
    slug: "harry-potter",
    name: "Harry Potter",
    short: "Harry Potter",
    about: "La saga de J.K. Rowling : sept romans publiés de 1997 à 2007, adaptés en huit films.",
    color: "#7A1F2B",
    ink: "#FFE600",
  },
  {
    slug: "dc-comics",
    name: "DC Comics",
    short: "DC",
    about: "L'éditeur de Batman, Superman et Wonder Woman, fondé en 1934.",
    color: "#3155FF",
    ink: "#FFE600",
  },
  {
    slug: "studio-ghibli",
    name: "Studio Ghibli",
    short: "Ghibli",
    about: "Le studio d'animation fondé en 1985 par Hayao Miyazaki, Isao Takahata et Toshio Suzuki.",
    color: "#9BE15D",
    ink: "#111114",
  },
  {
    slug: "my-hero-academia",
    name: "My Hero Academia",
    short: "MHA",
    about: "Le manga de Kōhei Horikoshi, publié dans le Weekly Shōnen Jump de 2014 à 2024.",
    color: "#007A4D",
    ink: "#F8F5EF",
  },
  {
    slug: "l-attaque-des-titans",
    name: "L'Attaque des Titans",
    short: "Titans",
    about: "Le manga de Hajime Isayama, publié de 2009 à 2021 et réuni en 34 tomes.",
    color: "#6B4E3D",
    ink: "#F8F5EF",
  },
  {
    slug: "chainsaw-man",
    name: "Chainsaw Man",
    short: "Chainsaw",
    about: "Le manga de Tatsuki Fujimoto, lancé en 2018 dans le Weekly Shōnen Jump.",
    color: "#FF4D00",
    ink: "#111114",
  },
  {
    slug: "spy-x-family",
    name: "Spy × Family",
    short: "Spy×Family",
    about: "Le manga de Tatsuya Endō, publié depuis 2019 sur la plateforme Shōnen Jump+.",
    color: "#FFB3D9",
    ink: "#111114",
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
