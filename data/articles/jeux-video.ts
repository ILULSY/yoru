import type { Article } from "@/types/content";

export const gamingArticles: Article[] = [
  {
    slug: "metroidvania-genre-reinvente-par-les-independants",
    title: "Metroidvania : le genre que les studios indépendants ont réinventé",
    subtitle:
      "Exploration, retours en arrière, pouvoirs qui ouvrent de nouveaux chemins : longtemps délaissé par les grands éditeurs, le metroidvania est devenu le terrain de jeu favori des indés.",
    excerpt:
      "De Metroid à Hollow Knight en passant par Dead Cells, comment les petits studios ont fait d'un genre de niche l'un des plus créatifs du jeu vidéo.",
    universe: "jeux-video",
    type: "dossier",
    tags: ["metroidvania", "indé", "Hollow Knight", "Dead Cells", "exploration"],
    cover: "gaming-screen",
    publishedAt: "2026-10-07T09:00:00+02:00",
    author: "play",
    popularity: 31280,
    demo: true,
    body: [
      {
        type: "p",
        text: "Le mot est un mélange de deux noms : _Metroid_ (1986) et _Castlevania: Symphony of the Night_ (1997). Il désigne des jeux d'action-plateforme où l'on explore une grande carte interconnectée, dont les zones se débloquent au fil des capacités acquises.",
      },
      { type: "h2", id: "un-genre-de-structure", text: "Un genre de structure" },
      {
        type: "p",
        text: "Ce qui définit un metroidvania n'est pas son décor, mais son architecture. Un mur infranchissable aperçu au début devient, des heures plus tard, un passage évident grâce à un double saut ou un grappin. Le plaisir vient de cette sensation de **maîtriser un lieu**, de le comprendre peu à peu.",
      },
      { type: "h2", id: "l-age-d-or-des-independants", text: "L'âge d'or des indépendants" },
      {
        type: "p",
        text: "Dans les années 2010, alors que les grands éditeurs se tournent vers les mondes ouverts en 3D, de petits studios s'emparent du genre. _Ori and the Blind Forest_ (Moon Studios, 2015) éblouit par sa direction artistique. _Hollow Knight_ (Team Cherry, 2017), conçu par une équipe minuscule en Australie, devient une référence absolue, à tel point que sa suite _Silksong_ restera pendant des années l'un des jeux les plus attendus de la planète avant sa sortie en septembre 2025.",
      },
      {
        type: "p",
        text: "En France, le studio bordelais Motion Twin popularise avec _Dead Cells_ (2018) le « roguevania » : un metroidvania dont la carte se réorganise à chaque partie, avec une mort définitive qui renvoie au départ.",
      },
      {
        type: "quote",
        text: "Un bon metroidvania vous fait vous sentir plus intelligent à chaque porte qui s'ouvre.",
        cite: "La rédaction YORU",
      },
      { type: "h2", id: "pourquoi-ca-marche-chez-les-indes", text: "Pourquoi ça marche si bien chez les indés" },
      {
        type: "list",
        items: [
          "**La 2D coûte moins cher** à produire qu'un monde ouvert en 3D, sans limiter la créativité.",
          "**Le level design prime** : une petite équipe talentueuse peut rivaliser avec les plus gros studios.",
          "**Le public est fidèle** et partage volontiers ses découvertes, ce qui nourrit le bouche-à-oreille.",
        ],
      },
      { type: "h2", id: "le-retour-des-grands", text: "Le retour des grands" },
      {
        type: "p",
        text: "Ironie de l'histoire : ce sont désormais les indés qui inspirent les géants. Nintendo a relancé sa série fondatrice avec _Metroid Dread_ (2021), développé avec le studio espagnol MercurySteam. Le genre a bouclé la boucle — et il n'a jamais été aussi vivant.",
      },
    ],
  },
  {
    slug: "retrogaming-jamais-aussi-vivant",
    title: "Le rétrogaming n'a jamais été aussi vivant",
    subtitle:
      "Mini-consoles, abonnements rétro, matériel FPGA, speedruns caritatifs : jouer aux jeux d'hier est devenu une culture à part entière, avec ses enjeux de préservation.",
    excerpt:
      "Mini-consoles, FPGA, speedruns et préservation : pourquoi les vieux jeux attirent une nouvelle génération de joueurs.",
    universe: "jeux-video",
    type: "dossier",
    tags: ["rétrogaming", "préservation", "Game Boy", "speedrun", "collection"],
    cover: "gameboy-yellow",
    publishedAt: "2026-09-29T09:00:00+02:00",
    author: "play",
    popularity: 22350,
    demo: true,
    body: [
      {
        type: "p",
        text: "Souffler dans une cartouche, entendre le son de démarrage d'une console portable sortie en 1989… Pour certains, c'est de la nostalgie. Pour beaucoup de jeunes joueurs, c'est une découverte. Le rétrogaming rassemble aujourd'hui les deux publics.",
      },
      { type: "h2", id: "jouer-aux-classiques-aujourd-hui", text: "Jouer aux classiques aujourd'hui" },
      {
        type: "p",
        text: "Les constructeurs ont compris l'intérêt du patrimoine : mini-consoles préchargées de jeux, catalogues rétro inclus dans les abonnements en ligne, rééditions et compilations. Ces solutions officielles ont rendu les classiques accessibles à un public qui n'avait jamais possédé les machines d'origine.",
      },
      { type: "h2", id: "la-precision-du-fpga", text: "La précision du FPGA" },
      {
        type: "p",
        text: "Les passionnés les plus exigeants se tournent vers les consoles à base de **FPGA**, des puces reprogrammables qui reproduisent le fonctionnement électronique des machines d'origine au lieu de les émuler logiciellement. L'_Analogue Pocket_, sortie en 2021, a popularisé cette approche auprès du grand public.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Un patrimoine en danger",
        text: "En 2023, une étude de la Video Game History Foundation estimait qu'environ 87 % des jeux classiques sortis aux États-Unis n'étaient plus commercialisés. La préservation — par les musées, les bibliothèques et les rééditions — est devenue un enjeu culturel majeur.",
      },
      { type: "h2", id: "le-speedrun-sport-et-spectacle", text: "Le speedrun, sport et spectacle" },
      {
        type: "p",
        text: "Terminer un jeu le plus vite possible est devenu une discipline à part entière. Des marathons diffusés en direct, comme Games Done Quick, enchaînent les performances pendant des jours et récoltent des millions de dollars pour des associations. Les vieux jeux y sont rois : leurs failles sont connues, documentées et exploitées avec une précision vertigineuse.",
      },
      { type: "h2", id: "collectionner-sans-se-ruiner", text: "Collectionner sans se ruiner" },
      {
        type: "p",
        text: "Revers de la médaille : la cote de certains jeux en boîte a fortement grimpé. Pour débuter, privilégiez les jeux en loose (sans boîte), fixez-vous un budget et méfiez-vous des reproductions vendues comme originales — un sujet que nous abordons aussi côté [figurines contrefaites](/articles/figurines-contrefaites-signaux-d-alerte).",
      },
    ],
  },
  {
    slug: "salles-d-arcade-bornes-neons-high-scores",
    title: "Bornes, néons et high scores : le retour des salles d'arcade",
    subtitle:
      "Bars à jeux, tournois de jeux de combat, rythme et flippers : l'arcade revient sous de nouvelles formes, portée par le besoin de jouer ensemble, en vrai.",
    excerpt:
      "Bars à jeux, tournois de combat et flippers : pourquoi l'arcade revient au moment où l'on n'a jamais autant joué en ligne.",
    universe: "jeux-video",
    type: "actu",
    tags: ["arcade", "flipper", "jeux de combat", "sortie"],
    cover: "arcade-room",
    publishedAt: "2026-09-16T09:00:00+02:00",
    author: "play",
    popularity: 11760,
    demo: true,
    body: [
      {
        type: "p",
        text: "À la fin des années 1970 et au début des années 1980, _Space Invaders_ (1978) puis _Pac-Man_ (1980) remplissent les salles de jeux du monde entier. Puis l'arcade décline, concurrencée par des consoles de salon de plus en plus puissantes. Pourtant, les bornes n'ont jamais complètement disparu.",
      },
      { type: "h2", id: "le-concept-du-bar-a-jeux", text: "Le concept du bar à jeux" },
      {
        type: "p",
        text: "Dans de nombreuses villes, les bars équipés de bornes d'arcade, de flippers et de consoles rétro se multiplient. Le modèle est simple : on vient pour boire un verre entre amis et on reste pour battre le record affiché à l'écran. Le jeu redevient une activité sociale, partagée dans un même lieu.",
      },
      { type: "image", image: "pinball", caption: "Le flipper, star mécanique des salles de jeux." },
      { type: "h2", id: "la-scene-des-jeux-de-combat", text: "La scène des jeux de combat" },
      {
        type: "p",
        text: "Les jeux de combat entretiennent un lien particulier avec l'arcade. Depuis _Street Fighter II_ (1991), la communauté s'est construite autour de bornes où l'on posait une pièce pour défier l'inconnu d'à côté. Les tournois actuels, même sur console, conservent cet esprit de confrontation directe et de spectateurs massés derrière les joueurs.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Pour une première sortie",
        text: "Les jeux de rythme et les jeux de tir coopératifs sont parfaits pour débuter en groupe : on comprend les règles en quelques secondes, et l'on rit beaucoup.",
      },
      { type: "h2", id: "l-arcade-un-antidote", text: "L'arcade, un antidote ?" },
      {
        type: "p",
        text: "À l'heure où l'on joue majoritairement en ligne, l'arcade offre quelque chose de rare : des parties courtes, intenses, et la présence physique des autres joueurs. C'est peut-être là le secret de son retour.",
      },
    ],
  },
  {
    slug: "pourquoi-le-jeu-portable-est-redevenu-roi",
    title: "Pourquoi le jeu portable est redevenu roi",
    subtitle:
      "Du Game Boy à la console hybride, en passant par les PC portables de jeu : le jeu nomade a toujours su se réinventer. Il occupe aujourd'hui une place centrale.",
    excerpt:
      "Game Boy, consoles hybrides, PC de poche : comment le jeu portable est passé de la récréation au cœur de l'industrie.",
    universe: "jeux-video",
    type: "dossier",
    tags: ["console portable", "Nintendo", "Steam Deck", "hybride"],
    cover: "switch-console",
    publishedAt: "2026-09-23T09:00:00+02:00",
    author: "play",
    popularity: 16890,
    demo: true,
    body: [
      {
        type: "p",
        text: "Le jeu vidéo portable a longtemps été considéré comme un « petit frère » du jeu sur console de salon. Cette époque est révolue : une grande partie des joueurs choisit désormais une machine qu'ils peuvent emporter partout — ou brancher sur la télévision.",
      },
      { type: "h2", id: "l-heritage-du-game-boy", text: "L'héritage du Game Boy" },
      {
        type: "p",
        text: "Lancé en 1989, le Game Boy de Nintendo impose une idée qui fera école : une autonomie solide, des jeux pensés pour des sessions courtes et un catalogue fort plutôt qu'une puissance brute. La Nintendo DS (2004) poursuit cette philosophie avec son double écran tactile.",
      },
      { type: "h2", id: "la-revolution-hybride", text: "La révolution hybride" },
      {
        type: "p",
        text: "En 2017, la Nintendo Switch efface la frontière : la même console se joue en mobilité ou sur le téléviseur. Son immense succès pousse toute l'industrie à repenser le jeu nomade. Sa successeure, la Switch 2, sortie en juin 2025, prolonge ce concept.",
      },
      { type: "h2", id: "le-pc-dans-la-poche", text: "Le PC dans la poche" },
      {
        type: "p",
        text: "Avec le Steam Deck, lancé par Valve en 2022, c'est une partie de la bibliothèque PC qui devient transportable. D'autres constructeurs ont suivi avec leurs propres PC portables de jeu, créant une catégorie entière d'appareils.",
      },
      {
        type: "list",
        items: [
          "**Sessions courtes** : les jeux s'adaptent à nos trajets et pauses.",
          "**Reprise instantanée** : la mise en veille rend le jeu disponible en une seconde.",
          "**Une seule machine** pour le salon et le voyage.",
        ],
      },
      { type: "h2", id: "ce-que-cela-change", text: "Ce que cela change pour les créateurs" },
      {
        type: "p",
        text: "Les développeurs conçoivent de plus en plus leurs interfaces pour de petits écrans et leurs jeux pour des sessions découpées. Les jeux indépendants, souvent moins gourmands, y trouvent un terrain idéal — comme le rappelle notre dossier sur [les metroidvania](/articles/metroidvania-genre-reinvente-par-les-independants).",
      },
    ],
  },
];
