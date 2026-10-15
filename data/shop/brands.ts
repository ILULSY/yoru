import type { Brand } from "@/types/shop";

/**
 * Marques et fabricants des produits (à distinguer des licences, qui sont les
 * œuvres : un Funko Pop! Harry Potter a pour licence Harry Potter et pour
 * marque Funko). Ce sont des marques déposées de leurs propriétaires : seuls des
 * produits officiels, achetés auprès de distributeurs agréés, doivent être vendus.
 * Aucun logo n'est reproduit ; les noms sont composés en typographie YORU.
 */
export const BRANDS: Brand[] = [
  {
    slug: "funko",
    name: "Funko",
    about: "Fabricant américain de figurines de collection, connu pour ses figurines Pop! en vinyle, déclinées sur des milliers de personnages.",
    color: "#111114",
    ink: "#F8F5EF",
  },
  {
    slug: "bandai",
    name: "Bandai",
    about: "Fabricant japonais de jouets du groupe Bandai Namco, éditeur notamment des jeux de cartes One Piece et Dragon Ball.",
    color: "#E8112D",
    ink: "#F8F5EF",
  },
  {
    slug: "banpresto",
    name: "Banpresto",
    about: "Marque de Bandai Spirits spécialisée dans les figurines de personnages d'anime et de manga.",
    color: "#FFE600",
    ink: "#111114",
  },
  {
    slug: "hasbro",
    name: "Hasbro",
    about: "Fabricant américain de jouets, à l'origine des gammes de figurines Marvel Legends et Star Wars: The Black Series.",
    color: "#3155FF",
    ink: "#F8F5EF",
  },
  {
    slug: "ravensburger",
    name: "Ravensburger",
    about: "Éditeur allemand de jeux et de puzzles, éditeur du jeu de cartes à collectionner Disney Lorcana.",
    color: "#00E5FF",
    ink: "#111114",
  },
  {
    slug: "the-pokemon-company",
    name: "The Pokémon Company",
    about: "Société qui gère la marque Pokémon et édite le Jeu de Cartes à Collectionner Pokémon.",
    color: "#FFE600",
    ink: "#3155FF",
  },
  {
    slug: "konami",
    name: "Konami",
    about: "Éditeur japonais de jeux vidéo et du jeu de cartes à collectionner Yu-Gi-Oh!.",
    color: "#8B35FF",
    ink: "#F8F5EF",
  },
];

export const BRAND_MAP = Object.fromEntries(BRANDS.map((b) => [b.slug, b])) as Record<string, Brand>;

export function brandOf(slug: string | undefined | null): Brand | undefined {
  return slug ? BRAND_MAP[slug] : undefined;
}
