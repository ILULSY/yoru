import type { UniverseSlug } from "@/types/content";

/**
 * Brèves d'actualité RÉELLES, rédigées par la rédaction à partir de sources
 * publiées et vérifiées. Chaque brève indique sa date, ses sources et la date
 * de vérification. Contrairement aux articles « Démo », ces informations
 * correspondent à des annonces réelles (à la date de vérification).
 *
 * Pour ajouter une brève : rédigez-la avec vos propres mots, citez au moins
 * une source, et mettez à jour `verifiedAt`.
 */
export interface NewsBrief {
  id: string;
  title: string;
  summary: string;
  universe: UniverseSlug;
  /** Date de l'annonce ou de l'événement (ISO). */
  date: string;
  sources: { name: string; url: string }[];
  verifiedAt: string;
  /** Licence de la boutique liée (pour proposer les produits associés). */
  license?: string;
  /** Produit précis de la boutique lié à la brève. */
  product?: { slug: string; label: string };
}

export const NEWS_BRIEFS: NewsBrief[] = [
  {
    id: "dragon-ball-super-beerus",
    title: "Dragon Ball Super: Beerus débarque le 11 octobre",
    summary:
      "Toei Animation et Crunchyroll lancent ce dimanche une version « améliorée » de Dragon Ball Super : animation retravaillée, plans redessinés et récit reconstruit autour des arcs Battle of Gods et Resurrection of F. La série est diffusée au Japon sur Fuji TV et en simultané sur Crunchyroll, Europe comprise ; Netflix suivra à partir du 17 octobre dans plusieurs pays. Le premier épisode intégrerait des scènes jusqu'ici réservées au manga de Toyotarou.",
    universe: "anime",
    date: "2026-10-05",
    sources: [
      { name: "Final Weapon", url: "https://finalweapon.net/2026/10/05/dragon-ball-super-beerus-anime-to-stream-on-crunchyroll-starting-october-11/" },
      { name: "CBR", url: "https://www.cbr.com/dragon-ball-super-beerus-adding-manga-scenes/" },
    ],
    verifiedAt: "2026-10-10",
    license: "dragon-ball-z",
  },
  {
    id: "sparking-zero-feuille-de-route",
    title: "Dragon Ball: Sparking Zero dévoile sa feuille de route jusqu'en 2027",
    summary:
      "À la New York Comic Con, Bandai Namco a détaillé le suivi de son jeu de combat : Gogeta (Super) cet automne, un mode solo « Tower of Power » gratuit cet hiver sur PS5, Xbox Series et PC, puis des modes « SP » au printemps 2027. Une bêta du cross-play entre PS5, Xbox Series et PC est annoncée pour le second semestre 2027 ; les versions Switch et Switch 2 n'y participeront pas.",
    universe: "jeux-video",
    date: "2026-10-09",
    sources: [{ name: "Siliconera", url: "https://www.siliconera.com/dragon-ball-sparking-zero-cross-play-beta-on-update-and-dlc-roadmap/" }],
    verifiedAt: "2026-10-10",
    license: "dragon-ball-z",
  },
  {
    id: "dr-stone-terraforming",
    title: "Dr. Stone aura une suite animée : « Dr. Stone Terraforming »",
    summary:
      "L'événement Stone Fes. 2026 a annoncé la mise en production d'une nouvelle série animée. Elle adaptera l'histoire « Terraforming », publiée dans le 27e tome du manga et située après la fin du récit principal. Ni studio ni date de diffusion n'ont été communiqués pour l'instant.",
    universe: "anime",
    date: "2026-10-10",
    sources: [{ name: "Anime News Network", url: "https://www.animenewsnetwork.com/news/2026-10-10/dr-stone-tv-anime-gets-terraforming-sequel/.242690" }],
    verifiedAt: "2026-10-10",
  },
  {
    id: "billy-bat-harvey-award",
    title: "Billy Bat, de Naoki Urasawa, sacré meilleur manga aux Harvey Awards",
    summary:
      "Le thriller de Naoki Urasawa et Takashi Nagasaki remporte le Harvey Award 2026 du meilleur manga, annoncé à la New York Comic Con. Dans la catégorie des adaptations, le film d'animation Spider-Noir l'emporte face, notamment, à Chainsaw Man – The Movie: Reze Arc et à Demon Slayer : la Forteresse infinie.",
    universe: "manga",
    date: "2026-10-09",
    sources: [{ name: "Anime News Network", url: "https://www.animenewsnetwork.com/news/2026-10-09/billy-bat-manga-wins-harvey-award/.242681" }],
    verifiedAt: "2026-10-10",
  },
  {
    id: "ghost-of-tsushima-legends-2028",
    title: "L'anime Ghost of Tsushima Legends repoussé à 2028",
    summary:
      "Prévue pour 2027, la série animée tirée du jeu de Sucker Punch arrivera finalement dans le monde entier en 2028 sur Crunchyroll, en partenariat avec PlayStation Productions. Le scénario est toujours signé Gen Urobuchi. Aucune raison n'a été donnée pour ce report, annoncé à la New York Comic Con.",
    universe: "anime",
    date: "2026-10-09",
    sources: [{ name: "Siliconera", url: "https://www.siliconera.com/ghost-of-tsushima-legends-anime-set-for-2028/" }],
    verifiedAt: "2026-10-10",
  },
  {
    id: "webtoon-marvel-comics-app",
    title: "Une nouvelle application Marvel Comics signée WEBTOON le 16 novembre",
    summary:
      "WEBTOON Entertainment lancera avec Marvel une application de lecture regroupant des comics Marvel, Star Wars et 20th Century Studios, en format page classique ou défilement vertical. Deux formules d’abonnement sont prévues, à partir de 9,99 dollars par mois. Marvel Unlimited fermera en décembre, avec la possibilité de transférer sa bibliothèque.",
    universe: "comics",
    date: "2026-10-05",
    sources: [{ name: "Anime News Network", url: "https://www.animenewsnetwork.com/news/2026-10-09/webtoon-to-launch-new-marvel-comics-app-in-november/.242617" }],
    verifiedAt: "2026-10-10",
  },
  {
    id: "cyberpunk-2077-film-paramount",
    title: "Cyberpunk 2077 va devenir un film live-action chez Paramount",
    summary:
      "Paramount Pictures développe une adaptation en prises de vues réelles du jeu de CD Projekt Red, avec le producteur Lorenzo di Bonaventura (Transformers). Aucune date ni casting n'ont été annoncés. CD Projekt avait déjà évoqué en 2023 un projet live-action avec Anonymous Content.",
    universe: "cinema",
    date: "2026-10-08",
    sources: [{ name: "Video Games Chronicle", url: "https://www.videogameschronicle.com/news/cyberpunk-2077-is-getting-a-live-action-movie-from-paramount/" }],
    verifiedAt: "2026-10-10",
  },
  {
    id: "marvel-zombies-trois-films",
    title: "Marvel Zombies : trois films d'animation à la place d'une saison 2",
    summary:
      "Marvel Animation a annoncé trois productions pour Disney+ : The Winter Soldier à partir d'Halloween 2027, The Fist of Khonshu en 2028 et The Last Guardian en 2029. Elles prendront la suite de la série Marvel Zombies.",
    universe: "comics",
    date: "2026-10-08",
    sources: [{ name: "Écran Large", url: "https://www.ecranlarge.com/films/news/marvel-zombies-trois-films-disney" }],
    verifiedAt: "2026-10-10",
  },
  {
    id: "starfleet-academy-saison-2",
    title: "Star Trek: Starfleet Academy reviendra en mars 2027 pour sa dernière saison",
    summary:
      "Paramount+ a confirmé la diffusion de la saison 2 en mars 2027, présentée comme la dernière. Bill Nighy (en invité) et Rosemarie DeWitt rejoignent la distribution, aux côtés de Holly Hunter.",
    universe: "series",
    date: "2026-10-10",
    sources: [{ name: "CBR", url: "https://www.cbr.com/star-trek-starfleet-academy-season-2-release-date/" }],
    verifiedAt: "2026-10-10",
  },
  {
    id: "pokemon-tcg-30th-celebration",
    title: "Pokémon TCG : l'extension « 30th Celebration » fête les 30 ans de la licence",
    summary:
      "Commercialisée par vagues de coffrets spéciaux (la première est sortie le 16 septembre selon Siliconera), l'extension propose des boosters de six cartes entièrement brillantes, chacun contenant l'un des 30 Pikachu spéciaux, ainsi qu'une « Classic Collection » de 30 rééditions à bord doré, dont le Dracaufeu du set de base. Ces rééditions ne sont pas utilisables en format Standard.",
    universe: "collectors",
    date: "2026-09-16",
    sources: [{ name: "Siliconera", url: "https://www.siliconera.com/pokemon-tcg-the-best-30th-celebration-cards/" }],
    verifiedAt: "2026-10-10",
    license: "pokemon",
    product: { slug: "pokemon-30th-celebration-booster", label: "Le booster 30th Celebration" },
  },
  {
    id: "one-piece-wallstar-elbaph",
    title: "One Piece : Luffy et Nami en tenue d'Elbaph rejoignent la gamme Wallstar",
    summary:
      "Bandai Namco annonce deux nouvelles figurines MegaHouse d'une dizaine de centimètres, Luffy et Nami dans leurs tenues de l'arc Elbaph. Elles sortiront au Japon en mai 2027 au prix de 2 970 yens pièce ; une distribution internationale doit suivre, sans date pour l'instant.",
    universe: "collectors",
    date: "2026-10-09",
    sources: [{ name: "Siliconera", url: "https://www.siliconera.com/wallstar-one-piece-luffy-and-nami-elbaph-blister-figures-appear-in-2027/" }],
    verifiedAt: "2026-10-10",
    license: "one-piece",
  },
  {
    id: "ue-monnaies-virtuelles-jeux",
    title: "Monnaies virtuelles : l'Europe interpelle neuf éditeurs de jeux vidéo",
    summary:
      "Le réseau européen des autorités de protection des consommateurs (CPC) a lancé le 30 septembre une action coordonnée visant notamment Ubisoft, Riot Games, Mojang, King et Supercell. Il leur demande d'afficher le prix réel en euros des objets, de ne pas forcer l'achat de lots de monnaie superflus et de mieux protéger les mineurs. Aucune sanction n'a été prononcée à ce stade.",
    universe: "tech",
    date: "2026-09-30",
    sources: [
      { name: "Journal du Geek", url: "https://www.journaldugeek.com/2026/10/10/bruxelles-veut-savoir-ce-qui-se-cache-derriere-les-gemmes-des-jeux-video/" },
      { name: "Digital Policy Alert", url: "https://digitalpolicyalert.org/event/44138-consumer-protection-cooperation-network-announced-investigation-into-video-game-companies-over-alleged-breaches-of-european-union-consumer-law-regarding-in-game-virtual-currency-practices" },
    ],
    verifiedAt: "2026-10-10",
  },
];

export const BRIEFS_SORTED = [...NEWS_BRIEFS].sort((a, b) => b.date.localeCompare(a.date));
