import type { Article } from "@/types/content";

/**
 * Actualités RÉELLES de l'univers Anime, rédigées par la rédaction à partir de
 * sources publiées (citées en fin d'article) et vérifiées à la date indiquée.
 * Contrairement aux articles de démonstration, `demo` vaut false.
 * Règles : vos propres mots, pas de reprise de texte, au moins une source,
 * `verifiedAt` à jour, et ce qui n'est pas encore annoncé dit comme tel.
 */
export const animePressArticles: Article[] = [
  {
    slug: "one-punch-man-saison-3-partie-2-janvier-2027",
    title: "One-Punch Man : la suite de la saison 3 arrive en janvier 2027",
    subtitle:
      "Bandai Namco Filmworks a dévoilé une bande-annonce et un nouveau visuel : le combat entre l'Association des héros et l'Association des monstres reprend au Japon dès janvier.",
    excerpt:
      "La deuxième partie de la saison 3 de One-Punch Man sera diffusée au Japon en janvier 2027, avec un nouveau générique de JAM Project.",
    universe: "anime",
    type: "actu",
    tags: ["One-Punch Man", "J.C. Staff", "JAM Project", "saison 3"],
    cover: "akihabara-billboards",
    publishedAt: "2026-10-13T09:00:00+02:00",
    author: "japon",
    popularity: 0,
    demo: false,
    sources: [
      {
        name: "Anime News Network",
        url: "https://www.animenewsnetwork.com/news/2026-10-10/one-punch-man-season-3-anime-2nd-part-reveals-january-2027-debut-in-video/.242696",
      },
      { name: "Final Weapon", url: "https://finalweapon.net/2026/10/10/one-punch-man-season-3-part-2-january-2027-release-date/" },
    ],
    verifiedAt: "2026-10-13",
    body: [
      {
        type: "p",
        text: "Saitama n'a pas fini de s'ennuyer. Bandai Namco Filmworks a publié le 11 octobre, pendant le week-end du New York Comic Con, une bande-annonce annonçant que la **deuxième partie de la saison 3** de _One-Punch Man_ commencera au Japon en **janvier 2027**. Le site officiel a mis en ligne un nouveau visuel au même moment.",
      },
      { type: "h2", id: "ce-qui-a-ete-annonce", text: "Ce qui a été annoncé" },
      {
        type: "list",
        items: [
          "Un début de diffusion en janvier 2027 au Japon, sans jour précis pour l'instant.",
          "Un nouveau visuel clé et une bande-annonce, sous-titrée en anglais par Viz Media.",
          "Le retour de **JAM Project** au générique de début, avec « Never Done -SUPREME POWER VS ULTIMATE FEAR- ».",
        ],
      },
      {
        type: "p",
        text: "Cette seconde moitié poursuit la confrontation entre l'Association des héros et l'Association des monstres, l'arc que la première partie avait lancé.",
      },
      { type: "h2", id: "ou-en-est-la-saison-3", text: "Où en est la saison 3" },
      {
        type: "p",
        text: "La saison 3 a démarré le 5 octobre 2025 par un épisode récapitulatif, avant la diffusion du 25e épisode de la série une semaine plus tard. Le générique de cette première partie, « Get No Satisfied! », réunissait déjà JAM Project et BABYMETAL. Comme pour la saison 2, l'animation est confiée au studio **J.C. Staff**, sous la direction de Shinpei Nagai, avec Tomohiro Suzuki au scénario. La saison 1, diffusée en 2015, avait été réalisée par Madhouse.",
      },
      { type: "h2", id: "et-hors-du-japon", text: "Et hors du Japon ?" },
      {
        type: "p",
        text: "Aucune plateforme n'a encore confirmé la diffusion internationale de cette deuxième partie, ni sa date. Nous mettrons cet article à jour dès que ce sera le cas.",
      },
    ],
  },

  {
    slug: "naruto-ninku-anime-crossover-quatre-episodes",
    title: "Naruto × NINKŪ : un anime inédit de quatre épisodes réunit deux héros du Jump",
    subtitle:
      "Annoncé au New York Comic Con, ce crossover envoie l'équipe 7 dans l'univers de NINKŪ, le manga de Kōji Kiriyama qui a inspiré Masashi Kishimoto.",
    excerpt:
      "Quatre épisodes inédits supervisés par Masashi Kishimoto et Kōji Kiriyama : Naruto, Sasuke et Sakura rencontrent Fūsuke. Date encore inconnue.",
    universe: "anime",
    type: "actu",
    tags: ["Naruto", "NINKŪ", "Pierrot", "Kishimoto", "NYCC"],
    cover: "manga-stand",
    publishedAt: "2026-10-13T10:30:00+02:00",
    author: "japon",
    popularity: 0,
    demo: false,
    sources: [
      { name: "NARUTO officiel (récapitulatif du panel)", url: "https://naruto-official.com/fr/news/01_2696" },
      { name: "Anime News Network", url: "https://www.animenewsnetwork.com/news/2026-10-10/naruto-gets-crossover-anime-with-ninku-franchise/.242693" },
    ],
    verifiedAt: "2026-10-13",
    body: [
      {
        type: "p",
        text: "C'est la surprise du panel « NARUTO: What's Next? », le 10 octobre au New York Comic Con : un anime inédit, **Naruto × NINKŪ**, est en production. Il comptera **quatre épisodes** et fera se croiser deux séries nées dans le _Weekly Shōnen Jump_ à quelques années d'écart.",
      },
      { type: "h2", id: "l-histoire", text: "L'histoire" },
      {
        type: "p",
        text: "Kakashi ne pouvant pas les accompagner, il confie une mission à l'équipe 7 et nomme Naruto chef par intérim. En chemin, Naruto, Sasuke et Sakura se perdent dans un autre monde, celui de _NINKŪ_, où ils rencontrent son héros, Fūsuke. Le récit est original : il ne s'appuie sur aucun chapitre existant et sera supervisé de bout en bout par les deux auteurs, Masashi Kishimoto et Kōji Kiriyama.",
      },
      { type: "quote", text: "Sans NINKŪ, Naruto n'existerait pas.", cite: "Masashi Kishimoto" },
      { type: "h2", id: "l-equipe", text: "L'équipe" },
      {
        type: "p",
        text: "La réalisation est confiée à **Noriyuki Abe**, réalisateur de _Boruto_ et de l'anime _NINKŪ_. **Tetsuya Nishio**, qui a travaillé sur les deux séries, signe le design des personnages et la direction de l'animation. Junko Takeuchi et Noriaki Sugiyama, les voix japonaises de Naruto et Sasuke, étaient présents sur scène.",
      },
      { type: "h2", id: "ninku-c-est-quoi", text: "NINKŪ, c'est quoi ?" },
      {
        type: "p",
        text: "Publié dans le _Weekly Shōnen Jump_ de 1993 à 1995 (neuf tomes), le manga de Kōji Kiriyama a pour héros Fūsuke. Le studio Pierrot l'avait adapté en 55 épisodes en 1995 et 1996. Pour faire patienter, le studio diffuse gratuitement les cinq premiers épisodes sur YouTube.",
      },
      { type: "h2", id: "les-autres-annonces", text: "Les autres annonces du panel" },
      {
        type: "list",
        items: [
          "Masashi Kishimoto dessine un **nouveau manga Naruto** : les détails seront donnés au panel de la Jump Festa, les 19 et 20 décembre.",
          "Le jeu mobile _Hokage Ninja MOBILE_ sortira dans le monde entier, à une date encore inconnue.",
          "Destin Daniel Cretton, réalisateur du film Naruto en prises de vues réelles produit par Lionsgate, a adressé un message aux fans, sans nouvelle information.",
        ],
      },
      { type: "h2", id: "ce-qu-on-ne-sait-pas-encore", text: "Ce qu'on ne sait pas encore" },
      {
        type: "p",
        text: "Ni la date de sortie ni les plateformes de diffusion n'ont été annoncées. On ignore aussi si ce crossover a un lien avec les quatre épisodes prévus pour les 20 ans de l'anime, reportés en septembre 2023 et dont il n'y a plus de nouvelles depuis.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Côté boutique",
        text: "Cartes, figurines et produits dérivés : retrouvez notre sélection [Naruto](/boutique/licence/naruto).",
      },
    ],
  },

  {
    slug: "cyberpunk-edgerunners-2-netflix-20-octobre",
    title: "Cyberpunk: Edgerunners 2 débarque sur Netflix le 20 octobre",
    subtitle:
      "Studio Trigger revient à Night City pour une nouvelle histoire en dix épisodes, avec de nouveaux personnages et un réalisateur dont c'est le premier poste, Kai Ikarashi.",
    excerpt:
      "Dix épisodes inédits, de nouveaux héros et Studio Trigger aux commandes : la suite de Cyberpunk: Edgerunners sort le 20 octobre sur Netflix.",
    universe: "anime",
    type: "actu",
    tags: ["Cyberpunk", "Edgerunners", "Studio Trigger", "Netflix", "CD Projekt"],
    cover: "shibuya-night",
    publishedAt: "2026-10-13T12:00:00+02:00",
    author: "japon",
    popularity: 0,
    demo: false,
    sources: [
      {
        name: "Anime Corner",
        url: "https://animecorner.me/cyberpunk-edgerunners-2-new-voiced-trailer-and-october-20-2026-release-date-revealed/",
      },
      {
        name: "Anime News Network",
        url: "https://www.animenewsnetwork.com/news/2026-10-12/netflix-india-lists-cyberpunk-edgerunners-2-anime-for-release-on-october-20/.242723",
      },
    ],
    verifiedAt: "2026-10-13",
    body: [
      {
        type: "p",
        text: "Quatre ans après la première saison, Night City rouvre ses portes : _Cyberpunk: Edgerunners 2_ sort le **20 octobre sur Netflix**, en même temps dans le monde entier. Netflix Inde vient de confirmer la date, annoncée fin août avec une nouvelle bande-annonce.",
      },
      { type: "h2", id: "une-nouvelle-histoire", text: "Une nouvelle histoire, de nouveaux héros" },
      {
        type: "p",
        text: "Il ne s'agit pas d'une suite directe : la série raconte une histoire indépendante, en **dix épisodes**, dans l'univers du jeu _Cyberpunk 2077_. Ses producteurs la décrivent comme un récit de rédemption et de vengeance. Quatre nouveaux personnages sont au centre : Roman Carax, Talia Yang, D et Weak Kingsley.",
      },
      { type: "h2", id: "l-equipe", text: "L'équipe" },
      {
        type: "list",
        items: [
          "**Studio Trigger**, déjà à l'œuvre sur la première saison, reprend l'animation.",
          "**Kai Ikarashi** réalise sa première série ; il avait été storyboardeur et directeur de l'animation sur la saison 1.",
          "**Ichigo Kanno** signe le design des personnages, **Masahiko Otsuka** le scénario.",
          "**Bartosz Sztybor**, de CD Projekt Red, revient comme showrunner, auteur de l'histoire et producteur.",
        ],
      },
      { type: "h2", id: "voix-et-musique", text: "Voix et musique" },
      {
        type: "p",
        text: "En version japonaise, Momoka Terasawa prête sa voix à Roman Carax, Akari Kitō à Talia Yang, Kōki Uchiyama à D et Kentarō Tone à Weak Kingsley. Côté musique, le générique de début reprend « 10:15 Saturday Night », un titre de The Cure sorti en 1978, et celui de fin est « Watson » de Petite Meller. La rappeuse Rico Nasty signe « YOU CAN'T RUN FROM ME », entendu dans la deuxième bande-annonce.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Pour patienter",
        text: "Le premier épisode a déjà été projeté à l'Anime Expo de Los Angeles le 3 juillet. La première saison, sortie en septembre 2022, reste disponible sur Netflix.",
      },
    ],
  },

  {
    slug: "carnets-apothicaire-film-11-decembre-japon",
    title: "Les Carnets de l'apothicaire : le film sort le 11 décembre au Japon",
    subtitle:
      "Maomao et Jinshi partent sur les traces d'une concubine disparue, dans une histoire inédite de l'autrice Hyuganatsu. Crunchyroll distribuera le film hors d'Asie.",
    excerpt:
      "Une histoire inédite signée Hyuganatsu et de nouvelles voix dévoilées : le film des Carnets de l'apothicaire sort le 11 décembre au Japon, puis chez Crunchyroll.",
    universe: "anime",
    type: "actu",
    tags: ["Les Carnets de l'apothicaire", "Maomao", "TOHO animation", "Crunchyroll", "film"],
    cover: "drawing-anime",
    publishedAt: "2026-10-13T14:00:00+02:00",
    author: "japon",
    popularity: 0,
    demo: false,
    sources: [
      {
        name: "Anime News Network (pirates du Kajadan)",
        url: "https://www.animenewsnetwork.com/news/2026-10-12/the-apothecary-diaries-the-late-lady-treasure-film-new-video-unveils-kajadan-pirates-cast/.242761",
      },
      {
        name: "Anime News Network (clan Bi)",
        url: "https://www.animenewsnetwork.com/news/2026-10-11/the-apothecary-diaries-the-late-lady-treasure-film-new-video-reveals-bi-clan-cast/.242730",
      },
    ],
    verifiedAt: "2026-10-13",
    body: [
      {
        type: "p",
        text: "Le premier film des _Carnets de l'apothicaire_ (titre international : _The Late Lady's Treasure_) sortira dans les cinémas japonais le **11 décembre**. TOHO animation multiplie les vidéos pour présenter ses nouveaux personnages, et plusieurs voix ont été dévoilées ces derniers jours.",
      },
      { type: "h2", id: "une-histoire-inedite", text: "Une histoire inédite" },
      {
        type: "p",
        text: "Le film n'adapte pas un tome existant : son histoire a été écrite spécialement par **Hyuganatsu**, l'autrice des romans d'origine illustrés par Touko Shino. Maomao et Jinshi s'y rendent dans la ville natale d'une concubine morte cinq ans plus tôt.",
      },
      { type: "h2", id: "nouveaux-personnages-nouvelles-voix", text: "Nouveaux personnages, nouvelles voix" },
      {
        type: "list",
        items: [
          "Chez les pirates du Kajadan : Kenshō Ono (Suija, leur chef actuel), Ryōta Takeuchi (Eishō, son fidèle second) et Jirō Saitō (Kaja, l'ancien chef).",
          "Dans le clan Bi : Nobuo Tobita (Birō, chef du clan), Kumiko Watanabe (Shūu, son épouse), Hirofumi Nojima (Bisen, le fils aîné) et Mariya Ise (Mu Qing, un fils du clan).",
          "Seisei, la sœur de Suija, apparaît dans les vidéos, mais sa voix n'a pas encore été annoncée.",
        ],
      },
      { type: "h2", id: "et-chez-nous", text: "Et chez nous ?" },
      {
        type: "p",
        text: "Crunchyroll a acquis les droits du film pour l'Amérique du Nord et le reste du monde, hors Asie. La date de sortie hors du Japon sera annoncée plus tard par Crunchyroll et Sony Pictures Entertainment.",
      },
    ],
  },

  {
    slug: "nue-exorcist-anime-ete-2027-tv-asahi",
    title: "Nue's Exorcist, le manga du Jump, adapté en anime pour l'été 2027",
    subtitle:
      "La série sera diffusée sur TV Asahi, réalisée par Hiroyuki Hashimoto au Studio Hibari, avec Hiroshi Seko au scénario et MONACA à la musique.",
    excerpt:
      "Le manga de Kōta Kawae, plébiscité à l'AnimeJapan 2025, devient un anime : diffusion sur TV Asahi à l'été 2027, premières voix dévoilées.",
    universe: "anime",
    type: "actu",
    tags: ["Nue's Exorcist", "Shōnen Jump", "Studio Hibari", "TV Asahi", "2027"],
    cover: "manga-shelf",
    publishedAt: "2026-10-13T16:00:00+02:00",
    author: "japon",
    popularity: 0,
    demo: false,
    sources: [
      {
        name: "Anime News Network",
        url: "https://www.animenewsnetwork.com/news/2026-10-12/kota-kawae-nue-exorcist-manga-gets-tv-anime-in-summer-2027/.242747",
      },
      { name: "Wikipédia (anglais) – Nue's Exorcist", url: "https://en.wikipedia.org/wiki/Nue%27s_Exorcist" },
    ],
    verifiedAt: "2026-10-13",
    body: [
      {
        type: "p",
        text: "C'était l'un des mangas que les lecteurs voulaient le plus voir adaptés : _Nue's Exorcist_ (_Nue no Onmyōji_), de **Kōta Kawae**, aura sa série animée. L'annonce a été faite le 12 octobre lors d'une diffusion en direct consacrée au _Weekly Shōnen Jump_, avec une première vidéo et un visuel. Diffusion prévue à l'**été 2027** sur la chaîne japonaise TV Asahi.",
      },
      { type: "h2", id: "l-histoire", text: "L'histoire" },
      {
        type: "p",
        text: "Gakuro Yajima, un lycéen timide capable de voir les esprits, est mortellement blessé. Il ne survit qu'en passant un pacte avec Nue, un esprit très puissant enfermé dans une salle de son lycée. En échange de ce pouvoir, il doit l'aider à éliminer les esprits malfaisants, aux côtés d'exorcistes qui se méfient d'elle.",
      },
      { type: "h2", id: "l-equipe-et-les-voix", text: "L'équipe et les voix" },
      {
        type: "list",
        items: [
          "Studio : **Studio Hibari** ; réalisation : **Hiroyuki Hashimoto**.",
          "Scénario : **Hiroshi Seko** ; design des personnages : Shunpei Mochizuki ; musique : **MONACA** ; direction du son : Takayuki Yamaguchi.",
          "Voix : Kaito Miura (Gakuro Yajima), Saori Ōnishi (Nue) et Sayumi Suzushiro (Kazusa Suo).",
        ],
      },
      { type: "h2", id: "le-manga", text: "Le manga" },
      {
        type: "p",
        text: "Publié depuis mai 2023 dans le _Weekly Shōnen Jump_, le manga compte 16 tomes au Japon, le dernier étant paru le 4 septembre. Il est disponible légalement en ligne sur MANGA Plus. Il était arrivé en tête du vote « Manga We Want to See Animated » organisé à l'AnimeJapan 2025.",
      },
    ],
  },
];
