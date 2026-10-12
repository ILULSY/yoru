import type { Article } from "@/types/content";

export const techArticles: Article[] = [
  {
    slug: "realite-virtuelle-ou-en-est-le-jeu-vr",
    title: "Réalité virtuelle : où en est vraiment le jeu en VR ?",
    subtitle:
      "Plus de dix ans après la campagne Kickstarter de l'Oculus Rift, la réalité virtuelle a trouvé ses chefs-d'œuvre… sans encore devenir un loisir de masse. État des lieux.",
    excerpt:
      "Casques autonomes, chefs-d'œuvre comme Half-Life: Alyx, réalité mixte : bilan honnête d'une technologie toujours en quête de son grand public.",
    universe: "tech",
    type: "dossier",
    tags: ["VR", "réalité virtuelle", "casque", "Half-Life: Alyx", "réalité mixte"],
    cover: "vr-headset",
    publishedAt: "2026-10-03T09:00:00+02:00",
    author: "labo",
    popularity: 20190,
    demo: true,
    body: [
      {
        type: "p",
        text: "En 2012, une campagne de financement participatif pour un casque baptisé Oculus Rift relance l'intérêt pour la réalité virtuelle. Deux ans plus tard, Facebook rachète l'entreprise. Depuis, la VR oscille entre promesses spectaculaires et usages plus confidentiels.",
      },
      { type: "h2", id: "le-tournant-autonome", text: "Le tournant des casques autonomes" },
      {
        type: "p",
        text: "Les premiers casques exigeaient un PC puissant et des câbles. L'arrivée de modèles **autonomes**, comme le premier Oculus Quest en 2019, a changé la donne : on allume, on joue. Moins de barrières, plus de joueurs.",
      },
      { type: "h2", id: "les-jeux-qui-ont-tout-change", text: "Les jeux qui ont tout changé" },
      {
        type: "p",
        text: "Quelques titres ont prouvé que la VR pouvait offrir des expériences impossibles ailleurs. _Beat Saber_ a transformé le jeu de rythme en séance de sport. _Half-Life: Alyx_ (Valve, 2020) a démontré qu'un grand jeu narratif pouvait être pensé entièrement pour la réalité virtuelle, avec une interactivité physique bluffante.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Le mal des transports",
        text: "Certains joueurs ressentent des nausées en VR, surtout lors des déplacements artificiels. Commencez par des sessions courtes, privilégiez la téléportation et faites des pauses régulières.",
      },
      { type: "h2", id: "vers-la-realite-mixte", text: "Vers la réalité mixte" },
      {
        type: "p",
        text: "Les casques récents mélangent de plus en plus monde réel et éléments virtuels grâce à des caméras couleur : c'est la **réalité mixte**. L'arrivée de l'Apple Vision Pro en 2024 a relancé le débat sur l'avenir de ces appareils, davantage tournés vers la productivité et le divertissement que vers le seul jeu vidéo.",
      },
      { type: "h2", id: "notre-bilan", text: "Notre bilan" },
      {
        type: "p",
        text: "La VR n'a pas remplacé l'écran, et ne le remplacera peut-être jamais. Mais elle a trouvé sa place : celle d'une expérience à part, intense, qui procure des sensations qu'aucune autre technologie n'égale. Une niche, oui — une niche passionnante.",
      },
    ],
  },
  {
    slug: "claviers-mecaniques-guide-du-debutant",
    title: "Claviers mécaniques : le guide du débutant passionné",
    subtitle:
      "Linéaire, tactile ou clicky ? 60 % ou TKL ? ISO ou ANSI ? Le vocabulaire des claviers mécaniques peut effrayer. Voici l'essentiel pour choisir (et ne plus jamais revenir en arrière).",
    excerpt:
      "Types de switchs, formats, keycaps et dispositions AZERTY : l'essentiel pour choisir son premier clavier mécanique sans se tromper.",
    universe: "tech",
    type: "guide",
    tags: ["clavier mécanique", "switch", "keycaps", "setup", "AZERTY"],
    cover: "keyboard-orange",
    publishedAt: "2026-09-26T09:00:00+02:00",
    author: "labo",
    popularity: 16420,
    demo: true,
    body: [
      {
        type: "p",
        text: "Un clavier mécanique utilise un interrupteur individuel — un **switch** — sous chaque touche, au lieu d'une membrane commune. Résultat : une frappe plus précise, plus durable et entièrement personnalisable.",
      },
      { type: "h2", id: "les-trois-familles-de-switchs", text: "Les trois familles de switchs" },
      {
        type: "list",
        items: [
          "**Linéaire** : une course fluide, sans résistance particulière. Apprécié des joueurs.",
          "**Tactile** : une petite bosse se fait sentir au moment où la touche s'active. Idéal pour la frappe.",
          "**Clicky** : la bosse tactile s'accompagne d'un clic sonore. Satisfaisant… pour vous, moins pour vos voisins.",
        ],
      },
      { type: "h2", id: "choisir-son-format", text: "Choisir son format" },
      {
        type: "p",
        text: "Du plus grand au plus compact : le clavier **complet** avec pavé numérique, le **TKL** (sans pavé numérique), puis les formats **75 %**, **65 %** et **60 %**, qui suppriment progressivement les touches de fonction et les flèches. Plus le clavier est compact, plus il libère de place pour la souris.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Spécial France",
        text: "Le marché des claviers passionnés est très orienté vers la disposition américaine (ANSI QWERTY). Si vous tapez en AZERTY, vérifiez bien la disposition ISO et la disponibilité de keycaps françaises avant d'acheter.",
      },
      { type: "h2", id: "le-hot-swap", text: "Le hot-swap, votre meilleur ami" },
      {
        type: "p",
        text: "Un clavier **hot-swap** permet de changer les switchs sans soudure. Pour débuter, c'est l'option idéale : vous pourrez tester d'autres sensations plus tard sans racheter tout le clavier.",
      },
      { type: "h2", id: "keycaps-et-personnalisation", text: "Keycaps et personnalisation" },
      {
        type: "p",
        text: "Les capuchons de touches, ou **keycaps**, se changent eux aussi. Le plastique PBT résiste mieux à l'usure et au lustrage que l'ABS. C'est là que le clavier devient un objet personnel — certains collectionneurs y consacrent autant d'énergie qu'à des [figurines](/articles/figurines-du-jouet-a-l-objet-d-art).",
      },
    ],
  },
  {
    slug: "impression-3d-figurinistes-et-cosplayeurs",
    title: "Impression 3D : la nouvelle arme des figurinistes et cosplayeurs",
    subtitle:
      "Armures, accessoires, miniatures de jeu : l'impression 3D personnelle a bouleversé les loisirs créatifs. Ce qu'il faut savoir avant de se lancer, techniquement et légalement.",
    excerpt:
      "Filament ou résine, sécurité, droits des créateurs : le point sur l'impression 3D au service des cosplayeurs et des amateurs de figurines.",
    universe: "tech",
    type: "dossier",
    tags: ["impression 3D", "résine", "cosplay", "miniatures", "DIY"],
    cover: "printers-3d",
    publishedAt: "2026-09-09T09:00:00+02:00",
    author: "labo",
    popularity: 9210,
    demo: true,
    body: [
      {
        type: "p",
        text: "Il y a quinze ans, une imprimante 3D restait un outil de laboratoire ou d'industrie. Aujourd'hui, elle trône dans de nombreux ateliers de passionnés, entre la machine à coudre et la boîte de peinture.",
      },
      { type: "h2", id: "filament-ou-resine", text: "Filament ou résine ?" },
      {
        type: "p",
        text: "Les imprimantes à **filament** (FDM) déposent du plastique fondu couche par couche : parfaites pour les grandes pièces comme les casques et les armures de cosplay. Les imprimantes à **résine** durcissent un liquide photosensible avec de la lumière : elles offrent une finesse remarquable, idéale pour les miniatures et les figurines.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Sécurité avant tout",
        text: "La résine liquide est irritante : portez des gants nitrile, travaillez dans une pièce ventilée et nettoyez les pièces avec de l'alcool isopropylique, à manipuler lui aussi avec précaution.",
      },
      { type: "h2", id: "les-usages-qui-explosent", text: "Les usages qui explosent" },
      {
        type: "list",
        items: [
          "**Cosplay** : casques, armes factices, pièces d'armure à poncer et à peindre.",
          "**Jeux de figurines** : décors, terrains et miniatures personnalisées.",
          "**Restauration** : pièces de rechange pour jouets et consoles anciennes.",
        ],
      },
      { type: "h2", id: "la-question-des-droits", text: "La question des droits" },
      {
        type: "p",
        text: "Imprimer une figurine d'un personnage connu pour soi est une chose ; la vendre en est une autre. Les personnages sont protégés par le droit d'auteur et les marques. De nombreux créateurs de modèles 3D vendent par ailleurs leurs fichiers avec une licence précise : respectez-la, c'est ce qui leur permet de continuer à créer.",
      },
      { type: "image", image: "cosplay-blue", caption: "Le cosplay a été l'un des premiers terrains de jeu de l'impression 3D personnelle." },
      { type: "h2", id: "par-ou-commencer", text: "Par où commencer ?" },
      {
        type: "p",
        text: "Commencez par une imprimante à filament réputée pour sa simplicité, des modèles gratuits et de petites pièces. La patience est la première compétence à acquérir : une impression réussie se joue souvent dans les réglages.",
      },
    ],
  },
  {
    slug: "jeu-de-role-sur-table-grande-renaissance",
    title: "Jeu de rôle sur table : la grande renaissance",
    subtitle:
      "Longtemps cantonné aux clubs d'initiés, le jeu de rôle vit un âge d'or porté par les séries, les parties filmées et le jeu vidéo. Pourquoi tout le monde veut lancer les dés.",
    excerpt:
      "Stranger Things, parties diffusées en ligne, Baldur's Gate 3 : comment le jeu de rôle sur table est devenu un loisir grand public.",
    universe: "tech",
    type: "dossier",
    tags: ["jeu de rôle", "Donjons et Dragons", "dés", "actual play", "Baldur's Gate 3"],
    cover: "dice-pile",
    publishedAt: "2026-09-14T09:00:00+02:00",
    author: "labo",
    popularity: 12880,
    demo: true,
    body: [
      {
        type: "p",
        text: "Un groupe d'amis autour d'une table, des feuilles de personnages, des dés aux formes étranges et une personne qui raconte l'histoire : le jeu de rôle n'a pas besoin de grand-chose. C'est peut-être pour cela qu'il traverse les époques.",
      },
      { type: "h2", id: "aux-origines", text: "Aux origines" },
      {
        type: "p",
        text: "_Donjons et Dragons_, créé par Gary Gygax et Dave Arneson, paraît en 1974. Il pose les bases du genre : des joueurs incarnent des personnages, un maître du jeu décrit le monde et arbitre les règles, et les dés tranchent les situations incertaines.",
      },
      { type: "h2", id: "les-accelerateurs", text: "Les accélérateurs d'une renaissance" },
      {
        type: "list",
        items: [
          "**Stranger Things** (2016) a montré une bande d'adolescents jouant à _Donjons et Dragons_ — et rendu le jeu « cool ».",
          "**Les parties filmées** (_actual play_), comme celles de Critical Role depuis 2015, ont révélé le plaisir de regarder d'autres joueurs raconter une histoire.",
          "**Baldur's Gate 3** (Larian Studios, 2023), adapté des règles du jeu, a fait découvrir ses mécaniques à des millions de joueurs.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Pour une première partie",
        text: "Pas besoin de tout lire avant de jouer : un scénario d'initiation, des personnages prétirés et une soirée suffisent. Les boutiques de jeux organisent souvent des séances découverte.",
      },
      { type: "h2", id: "bien-plus-que-de-la-fantasy", text: "Bien plus que de la fantasy" },
      {
        type: "p",
        text: "Horreur, science-fiction, enquête, cyberpunk, univers de [films](/univers/cinema) ou de [comics](/univers/comics) : il existe des jeux de rôle pour tous les goûts, y compris de nombreuses créations françaises. Le point commun reste le même : construire une histoire ensemble.",
      },
    ],
  },
];
