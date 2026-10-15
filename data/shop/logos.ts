/**
 * Logos des licences et des marques, affichés en filigrane derrière leur nom
 * (tuiles de la boutique, en-têtes des pages licence et marque).
 *
 * Ce sont des marques déposées : ils servent uniquement à identifier les
 * produits vendus et n'impliquent aucun partenariat. Chaque fichier indique sa
 * provenance et son statut ; remplacez-les par les fichiers fournis par vos
 * distributeurs si vous en disposez. Une licence ou une marque sans logo garde
 * son nom en grand en guise de décor.
 */
export interface LogoAsset {
  /** Fichier dans /public (SVG ou PNG à fond transparent). */
  src: string;
  /** Page d'origine du fichier. */
  source: string;
  /** Statut du fichier à la source (ex. « domaine public (logo textuel) »). */
  license: string;
}

/**
 * Fichiers téléchargés depuis Wikimedia Commons le 15 octobre 2026, puis convertis en
 * silhouettes (PNG transparent) ; pour Marvel, Hasbro et Ravensburger, le lettrage blanc
 * est découpé dans la forme, pour Star Wars seul le contour des lettres est gardé.
 * Sans logo disponible : Funko, Bandai, Banpresto, The Pokémon Company, Yu-Gi-Oh!, Spy × Family.
 */
export const LOGOS: Record<string, LogoAsset> = {
  "chainsaw-man": {
    src: "/images/logos/chainsaw-man.png",
    source: "https://commons.wikimedia.org/wiki/File:Chainsaw_Man_logo.png",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "dc-comics": {
    src: "/images/logos/dc-comics.png",
    source: "https://commons.wikimedia.org/wiki/File:DC_Comics_logo.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "demon-slayer": {
    src: "/images/logos/demon-slayer.png",
    source: "https://commons.wikimedia.org/wiki/File:Kimetsu_no_Yaiba_logo.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "disney": {
    src: "/images/logos/disney.png",
    source: "https://commons.wikimedia.org/wiki/File:Disney_wordmark.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "dragon-ball-z": {
    src: "/images/logos/dragon-ball-z.png",
    source: "https://commons.wikimedia.org/wiki/File:Dragon_Ball_Z_Logo.png",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "harry-potter": {
    src: "/images/logos/harry-potter.png",
    source: "https://commons.wikimedia.org/wiki/File:Harry_Potter_wordmark.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "hasbro": {
    src: "/images/logos/hasbro.png",
    source: "https://commons.wikimedia.org/wiki/File:Hasbro_logo.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "hunter-x-hunter": {
    src: "/images/logos/hunter-x-hunter.png",
    source: "https://commons.wikimedia.org/wiki/File:Hunter_%C3%97_Hunter_logo.png",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "jujutsu-kaisen": {
    src: "/images/logos/jujutsu-kaisen.png",
    source: "https://commons.wikimedia.org/wiki/File:Jujutsu_Kaisen_logo_(Japanese_anime).svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "konami": {
    src: "/images/logos/konami.png",
    source: "https://commons.wikimedia.org/wiki/File:Konami_4th_logo_1.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "l-attaque-des-titans": {
    src: "/images/logos/l-attaque-des-titans.png",
    source: "https://commons.wikimedia.org/wiki/File:Attack_on_Titan_logo.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "marvel": {
    src: "/images/logos/marvel.png",
    source: "https://commons.wikimedia.org/wiki/File:Marvel_Logo.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "my-hero-academia": {
    src: "/images/logos/my-hero-academia.png",
    source: "https://commons.wikimedia.org/wiki/File:My_Hero_Academia_-_international_logo.png",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "naruto": {
    src: "/images/logos/naruto.png",
    source: "https://commons.wikimedia.org/wiki/File:Naruto_logo.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "one-piece": {
    src: "/images/logos/one-piece.png",
    source: "https://commons.wikimedia.org/wiki/File:One_piece_logo.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "pokemon": {
    src: "/images/logos/pokemon.png",
    source: "https://commons.wikimedia.org/wiki/File:International_Pok%C3%A9mon_logo.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "ravensburger": {
    src: "/images/logos/ravensburger.png",
    source: "https://commons.wikimedia.org/wiki/File:Ravensburger_logo.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "star-wars": {
    src: "/images/logos/star-wars.png",
    source: "https://commons.wikimedia.org/wiki/File:Star_Wars_Logo.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
  "studio-ghibli": {
    src: "/images/logos/studio-ghibli.png",
    source: "https://commons.wikimedia.org/wiki/File:Studio_Ghibli_wordmark.svg",
    license: "Wikimedia Commons : domaine public (droit d'auteur), marque déposée",
  },
};

export function logoOf(slug: string | null | undefined): LogoAsset | undefined {
  return slug ? LOGOS[slug] : undefined;
}
