import type { MediaAsset } from "@/types/content";

/**
 * Médiathèque YORU.
 *
 * Toutes les photos proviennent d'Unsplash (licence Unsplash : usage libre,
 * commercial inclus, sans obligation d'attribution — nous créditons quand même
 * chaque photographe). Elles ne sont PAS des visuels officiels des œuvres,
 * marques ou personnages qu'elles peuvent montrer.
 *
 * Pour remplacer une image : changez `src` (et les dimensions) ici, ou ajoutez
 * une nouvelle entrée et référencez sa `key` dans un article. Les images
 * locales sont aussi possibles : placez-les dans /public/images et utilisez
 * un chemin "/images/mon-fichier.jpg".
 */

type Raw = [key: string, path: string, w: number, h: number, color: string, name: string, username: string, alt: string];

const U = "https://images.unsplash.com/";

const RAW: Raw[] = [
  // ── Cinéma
  ["cinema-hall", "photo-1561722798-9a732d141027", 4032, 3024, "#262626", "Augusto Oazi", "augustooazi", "Salle de cinéma plongée dans le noir, face à un grand écran blanc"],
  ["projector-beams", "photo-1762541693135-fb989de961e1", 2268, 4032, "#260c0c", "Rafi Mohammed", "iamrafimohammed", "Faisceaux lumineux d'un projecteur traversant une salle de cinéma vide"],
  ["kaiju-figures", "photo-1761948244883-05a6a0454cc4", 5925, 3333, "#262626", "Lilian Do Khac", "nailil", "Deux figurines de monstres géants s'affrontant devant un décor de ville"],
  ["home-projector", "photo-1478720568477-152d9b164e26", 5184, 3456, "#262626", "Jeremy Yap", "jeremyyappy", "Projecteur allumé dont le faisceau traverse une pièce sombre"],
  ["vinyl-purple", "photo-1619983081563-430f63602796", 3493, 5239, "#f3c00c", "Erik Mclean", "introspectivedsgn", "Disques vinyles colorés, violet et jaune, posés à plat"],
  ["clap-popcorn", "photo-1598899134739-24c46f58b8c0", 5674, 3847, "#d9d9d9", "GR Stocks", "grstocks", "Clap de cinéma et pop-corn sur un fond jaune vif"],
  ["cinema-marquee", "photo-1563381013529-1c922c80ac8d", 3610, 2577, "#260c0c", "Simon Ray", "simonbhray", "Façade de cinéma illuminée de néons, la nuit, avec une foule devant l'entrée"],
  ["film-reels", "photo-1440404653325-ab127d49abc1", 4896, 3264, "#404040", "Noom Peerapong", "imnoom", "Projecteur de cinéma ancien équipé de deux bobines de film"],
  ["posters-wall", "photo-1572188863110-46d457c9234d", 4896, 3264, "#c0c0c0", "H&CO", "hngstrm", "Trois affiches de films encadrées sur un mur clair, sous l'inscription « coming soon »"],
  // ── Séries
  ["graffiti-neon", "photo-1604716053460-3f66248bf8de", 5616, 3744, "#264040", "BP Miller", "bp_miller", "Graffiti aux formes turquoise, violettes et jaunes très saturées"],
  ["tv-silhouettes", "photo-1548095115-45697e222a58", 4928, 3264, "#262626", "Aneta Pawlik", "anetakpawlik", "Silhouettes de trois personnes regardant un écran de télévision lumineux"],
  ["retro-tv", "photo-1580247817119-c6cb496270a4", 4000, 6000, "#c08c40", "Francisco Andreotti", "frandreotti", "Téléviseur vintage orange posé sur un plan de travail"],
  ["tv-remote", "photo-1584905066893-7d5c142ba4e1", 3648, 5472, "#262626", "Erik Mclean", "introspectivedsgn", "Main tenant une télécommande pointée vers un téléviseur allumé"],
  // ── Anime
  ["akihabara-billboards", "photo-1613487957484-32c977a8bd62", 7558, 5046, "#0c2626", "Pat Krupa", "patkrupa", "Panneaux publicitaires d'anime illuminés sur les façades d'Akihabara, la nuit"],
  ["cosplay-blue", "photo-1727409048076-182d2907a59e", 4000, 6000, "#a6a68c", "Hưng Nguyễn", "hungngng", "Cosplayeuse aux longues couettes bleues posant pour une photo"],
  ["kabukicho-mural", "photo-1791295267191-c8a397878858", 4160, 6240, "#a6d9f3", "Leroy van den Berg", "leroyvandenberg", "Grande fresque colorée d'une héroïne d'anime armée d'une épée, à Kabukichō (Tokyo)"],
  ["shibuya-night", "photo-1542051841857-5f90071e7989", 7931, 5290, "#0c5973", "Jezael Melgoza", "jezar", "Carrefour de Shibuya éclairé par les néons, à Tokyo, la nuit"],
  ["akihabara-street", "photo-1580094573009-7a220cc896b2", 3973, 2912, "#0c2626", "Jezael Melgoza", "jezar", "Rue d'Akihabara bordée d'enseignes lumineuses, avec des passants le soir"],
  // ── Manga
  ["manga-stand", "photo-1744412161702-dcfd3bea6845", 4016, 6016, "#f3d9c0", "Tina Devidze", "teenytina", "Piles de magazines et de mangas japonais exposés sur un présentoir"],
  ["manga-shelf", "photo-1768224946465-9ba1dfabd3d3", 3024, 2005, "#404040", "Hưng Phạm", "seoling", "Piles de mangas rangées sur une étagère"],
  ["pirate-figure", "photo-1621478374422-35206faeddfb", 5184, 3456, "#262626", "Melvin Chavez", "chavezmel", "Figurine d'un pirate au chapeau de paille entourée d'autres figurines"],
  ["drawing-anime", "photo-1759302307377-e72f6a6918a1", 6000, 3560, "#c0c0c0", "Yulin Wang", "lanaill", "Main dessinant un personnage d'anime au crayon sur une feuille"],
  ["manga-library", "photo-1747762323695-eae327c2896f", 2976, 1984, "#737359", "@tanyabarrow", "tanyabarrow", "Étagères de librairie remplies de mangas et de livres"],
  // ── Jeux vidéo
  ["gaming-screen", "photo-1593305841991-05c297ba4575", 2957, 2266, "#260c26", "Fábio Magalhães", "tamarisco", "Écran de jeu vidéo dans une pièce baignée de lumière violette"],
  ["gameboy-yellow", "photo-1531525645387-7f14be1bdbbd", 6000, 6000, "#f3a60c", "Mike Meyers", "mike_meyers", "Console portable rétro blanche posée sur un fond jaune"],
  ["arcade-neon", "photo-1636070759654-5c93bbca2862", 4480, 6720, "#260c26", "Dillon Kydd", "kyddvisuals", "Salle remplie de bornes d'arcade et de néons colorés"],
  ["switch-console", "photo-1578303512597-81e6cc155b3e", 6000, 4000, "#260c40", "Yasin Hasan", "yasin", "Console hybride allumée avec ses manettes bleue et rouge"],
  ["arcade-room", "photo-1511512578047-dfb367046420", 5375, 3583, "#0c2626", "Carl Raw", "carltraw", "Salle de jeux avec une rangée de bornes d'arcade éclairées"],
  ["controller-neon", "photo-1612287230202-1ff1d85d1bdf", 3812, 2541, "#73f3f3", "Javier Martínez", "cjdante", "Manette de jeu sans fil éclairée par une lumière néon cyan et magenta"],
  ["esports-room", "photo-1558008258-7ff8888b42b0", 6000, 3376, "#260c0c", "Stem List", "stemlist", "Joueurs alignés devant leurs écrans lors d'une session de jeu en réseau"],
  ["pinball", "photo-1567304529193-acc92518efcd", 4000, 2649, "#260c0c", "Heather McKean", "hjmckean", "Gros plan sur le plateau coloré d'un flipper"],
  // ── Comics & SF
  ["spider-cosplay", "photo-1534809027769-b00d750a6bac", 3456, 5184, "#262626", "Judeus Samson", "shotbyjudeus", "Cosplayeur en costume de super-héros rouge et bleu tendant la main vers l'objectif"],
  ["vintage-comics", "photo-1618519764620-7403abdbdfe9", 5472, 3648, "#262626", "Erik Mclean", "introspectivedsgn", "Comics vintage de super-héros étalés et superposés"],
  ["comics-scattered", "photo-1601645191163-3fc0d5d64e35", 3036, 4048, "#0c2626", "Dev", "devp10", "Collection de comics de super-héros éparpillés sur une surface"],
  ["astronaut", "photo-1454789548928-9efd52dc4031", 5735, 5735, "#8ca6c0", "NASA", "nasa", "Astronaute en sortie extravéhiculaire flottant au-dessus de la Terre"],
  ["comics-stack", "photo-1620336655052-b57986f5a26a", 5472, 3648, "#0c8c8c", "Erik Mclean", "introspectivedsgn", "Pile de comics aux couvertures colorées"],
  ["comics-pile", "photo-1612036782180-6f0b6cd846fe", 5472, 3648, "#0c2626", "Erik Mclean", "introspectivedsgn", "Comics disposés côte à côte en éventail"],
  // ── Collectors
  ["card-dragon", "photo-1611931960487-4932667079f1", 5504, 8256, "#262626", "Steven Cordes", "steven3466", "Carte à collectionner brillante représentant un dragon de feu, posée sur un tissu gris"],
  ["cards-pile", "photo-1647892591880-58c55fd726d8", 4983, 3322, "#f3f3f3", "Giorgio Trovato", "giorgiotrovato", "Pile de cartes à collectionner aux dos bleus et illustrations colorées"],
  ["cards-scattered", "photo-1613771404784-3a5686aa2be3", 6016, 4016, "#260c0c", "Thimo Pedersen", "thimo", "Cartes à collectionner colorées éparpillées sur une table"],
  ["vintage-monsters", "photo-1788928808718-c8bf344f4ee7", 3725, 5587, "#402626", "Vincent Yap", "chonky_films", "Collection de figurines japonaises vintage de monstres et de héros"],
  ["toy-showcase", "photo-1739102174050-85ffaadab43f", 2624, 3936, "#26260c", "Polina Cherkasova", "thepollenpolin", "Vitrine éclairée remplie de jouets et de figurines"],
  ["ball-cards", "photo-1613771404721-1f92d799e49f", 6016, 4016, "#734026", "Thimo Pedersen", "thimo", "Boule rouge et blanche posée sur un tas de cartes à collectionner"],
  ["vintage-heroes", "photo-1741512612523-d6b9b7cdd18b", 6720, 4480, "#d9c0a6", "Alex Robertson", "observationalme", "Collection de figurines vintage de super-héros alignées"],
  // ── Geek & tech
  ["vr-headset", "photo-1622979135225-d2ba269cf1ac", 6546, 4364, "#d9d9d9", "Remy Gieling", "gieling", "Casque de réalité virtuelle blanc posé sur une table, sur fond rose"],
  ["keyboard-orange", "photo-1618384887929-16ec33fab9ef", 3691, 3692, "#d9d9d9", "Stefen Tan", "stefentan", "Clavier mécanique compact noir aux touches orange, sur un marbre blanc"],
  ["printers-3d", "photo-1611117775350-ac3950990985", 6015, 4006, "#0c2626", "Minku Kang", "minkus", "Rangée d'imprimantes 3D en train d'imprimer des pièces en plastique bleu"],
  ["dice-pile", "photo-1723925871704-45a628fd750c", 2815, 3753, "#260c0c", "Tasha Kostyuk", "tashakostyuk", "Tas de dés de jeu de rôle multicolores"],
  ["circuit-teal", "photo-1550751827-4bd374c3f58b", 7360, 4912, "#0c2626", "Adi Goldstein", "adigold1", "Circuit électronique éclairé en bleu sarcelle dans l'obscurité"],
];

export const MEDIA: Record<string, MediaAsset> = Object.fromEntries(
  RAW.map(([key, path, width, height, color, name, username, alt]) => [
    key,
    { key, src: U + path, width, height, color, alt, credit: { name, username, source: "unsplash" } },
  ]),
);

/**
 * Résout une référence d'image : clé de la médiathèque, chemin local
 * ("/images/…") ou URL absolue (contenus venant d'un CMS).
 */
export function getMedia(ref: string, fallbackAlt = ""): MediaAsset {
  const asset = MEDIA[ref];
  if (asset) return asset;
  if (ref.startsWith("/") || ref.startsWith("https://")) {
    return { key: ref, src: ref, alt: fallbackAlt, width: 1600, height: 1000, color: "#111114" };
  }
  throw new Error(`[media] Image inconnue : "${ref}". Ajoutez-la dans data/media.ts.`);
}

export function isMediaRef(ref: string): boolean {
  return ref in MEDIA || ref.startsWith("/") || ref.startsWith("https://");
}
