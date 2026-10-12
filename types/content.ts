/**
 * Modèle de contenu YORU.
 * Ces types sont la source de vérité partagée par les fichiers de données
 * locaux (/data) et par les adaptateurs CMS / base de données (/lib/content/sources).
 */

export const UNIVERSE_SLUGS = [
  "cinema",
  "series",
  "anime",
  "manga",
  "jeux-video",
  "comics",
  "collectors",
  "tech",
] as const;

export type UniverseSlug = (typeof UNIVERSE_SLUGS)[number];

export const ARTICLE_TYPES = ["actu", "critique", "dossier", "guide", "top"] as const;
export type ArticleType = (typeof ARTICLE_TYPES)[number];

export type PatternName =
  | "rays"
  | "scanlines"
  | "speedlines"
  | "tone"
  | "pixels"
  | "benday"
  | "holo"
  | "grid";

export interface MediaAsset {
  /** Clé interne (ex. "cinema-hall") utilisée par les articles. */
  key: string;
  /** URL de base de l'image, sans paramètres de redimensionnement. */
  src: string;
  /** Texte alternatif en français, décrivant réellement l'image. */
  alt: string;
  width: number;
  height: number;
  /** Couleur dominante : sert de fond pendant le chargement. */
  color: string;
  credit?: {
    name: string;
    /** Identifiant du photographe sur la plateforme source. */
    username: string;
    source: "unsplash";
  };
}

export interface Author {
  key: string;
  name: string;
  role: string;
}

export interface Universe {
  slug: UniverseSlug;
  name: string;
  /** Libellé court pour la navigation. */
  short: string;
  /** Numéro de rubrique affiché façon magazine. */
  number: string;
  tagline: string;
  description: string;
  /** Mots-clés SEO et suggestions de recherche. */
  keywords: string[];
  pattern: PatternName;
  /** Clé média de l'image d'ouverture de la rubrique. */
  cover: string;
  /** Nom de l'icône Lucide associée (voir components/ui/UniverseIcon). */
  icon: string;
  /** Onomatopée / accroche graphique propre à l'univers. */
  shout: string;
}

/** Bloc de contenu structuré. Le texte accepte **gras**, _italique_ et [liens](/url). */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "image"; image: string; caption?: string }
  | { type: "callout"; tone: "info" | "tip" | "warning"; title?: string; text: string }
  | { type: "verdict"; score: number; pros: string[]; cons: string[]; text: string };

export interface Article {
  slug: string;
  title: string;
  /** Chapô affiché sous le titre. */
  subtitle: string;
  /** Résumé court pour les cartes et le SEO (≈ 160 caractères). */
  excerpt: string;
  universe: UniverseSlug;
  type: ArticleType;
  tags: string[];
  /** Clé média de l'image principale. */
  cover: string;
  /** Date ISO de publication. */
  publishedAt: string;
  updatedAt?: string;
  author: string;
  /** Article principal de la section « À la une ». */
  featured?: boolean;
  /** Indicateur de popularité (démo : valeurs fictives, à brancher sur vos statistiques). */
  popularity: number;
  /** true = contenu de démonstration, signalé comme tel sur le site. */
  demo: boolean;
  /** Note sur 10 (critiques uniquement). */
  rating?: number;
  body: Block[];
}

/** Version allégée envoyée aux composants client (listes, recherche, favoris). */
export interface ArticleSummary {
  slug: string;
  title: string;
  excerpt: string;
  universe: UniverseSlug;
  type: ArticleType;
  tags: string[];
  cover: MediaAsset;
  publishedAt: string;
  popularity: number;
  readingMinutes: number;
  demo: boolean;
  rating?: number;
  featured?: boolean;
}

export interface TocEntry {
  id: string;
  text: string;
}
