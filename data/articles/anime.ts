import type { Article } from "@/types/content";

export const animeArticles: Article[] = [
  {
    slug: "grands-studios-animation-japonaise",
    title: "Ghibli, MAPPA, Trigger… comprendre les grands studios de l'animation japonaise",
    subtitle:
      "Derrière chaque anime se cache un studio avec son histoire, ses obsessions et sa patte visuelle. Petit guide pour reconnaître qui fait quoi.",
    excerpt:
      "Contemplation chez Ghibli, énergie folle chez Trigger, ambition spectaculaire chez MAPPA : le guide des studios qui façonnent l'anime.",
    universe: "anime",
    type: "guide",
    tags: ["studios", "Ghibli", "MAPPA", "Trigger", "Science SARU"],
    cover: "akihabara-billboards",
    publishedAt: "2026-10-02T09:00:00+02:00",
    author: "japon",
    popularity: 28760,
    demo: true,
    body: [
      {
        type: "p",
        text: "Pour beaucoup de spectateurs, un anime se résume à un titre et à ses personnages. Les fans, eux, regardent aussi le nom du studio au générique, car il en dit long sur la mise en scène, le rythme et l'ambition visuelle à attendre.",
      },
      { type: "h2", id: "studio-ghibli-la-contemplation", text: "Studio Ghibli, l'art de la contemplation" },
      {
        type: "p",
        text: "Fondé en 1985 par **Hayao Miyazaki**, **Isao Takahata** et le producteur **Toshio Suzuki**, Ghibli est le studio le plus célèbre hors du Japon. Ses films prennent le temps : un repas, une averse, un voyage en train deviennent des scènes à part entière. _Le Voyage de Chihiro_ a remporté l'Oscar du meilleur film d'animation en 2003, et _Le Garçon et le Héron_ a renouvelé l'exploit en 2024.",
      },
      { type: "h2", id: "mappa-l-ambition-spectaculaire", text: "MAPPA, l'ambition spectaculaire" },
      {
        type: "p",
        text: "Créé en 2011 par Masao Maruyama, déjà cofondateur du studio Madhouse, MAPPA s'est imposé avec des adaptations très attendues : _Jujutsu Kaisen_, _Chainsaw Man_ ou la saison finale de _L'Attaque des Titans_. Son style : des combats nerveux, une mise en scène cinématographique et une volonté d'en mettre plein les yeux.",
      },
      { type: "h2", id: "trigger-l-energie-pure", text: "Trigger, l'énergie pure" },
      {
        type: "p",
        text: "Fondé la même année par Hiroyuki Imaishi et Masahiko Ōtsuka, anciens de Gainax, Trigger pratique une animation explosive : couleurs saturées, formes géométriques, exagération assumée. _Kill la Kill_, _Promare_ ou _Cyberpunk: Edgerunners_ portent cette signature immédiatement reconnaissable.",
      },
      {
        type: "list",
        items: [
          "**Ufotable** : effets numériques spectaculaires, révélés au grand public avec _Demon Slayer_.",
          "**Production I.G** : la référence de l'anime adulte et technologique depuis _Ghost in the Shell_ (1995).",
          "**Science SARU** : cofondé par Masaaki Yuasa, connu pour _Devilman Crybaby_ et _Dan Da Dan_.",
        ],
      },
      { type: "h2", id: "un-studio-n-est-pas-une-marque-figee", text: "Un studio n'est pas une marque figée" },
      {
        type: "p",
        text: "Attention toutefois aux raccourcis : l'industrie de l'anime fonctionne beaucoup en sous-traitance, et les animateurs passent fréquemment d'un studio à l'autre. Pour vraiment comprendre une œuvre, regardez aussi le nom du réalisateur et du directeur de l'animation. Ce sont souvent eux qui donnent le ton.",
      },
    ],
  },
  {
    slug: "cosplay-reussir-sa-premiere-convention",
    title: "Cosplay : le guide pour réussir sa première convention",
    subtitle:
      "Choisir son personnage, gérer son budget, survivre à une journée de salon… Les conseils pour vivre une première expérience de cosplay sans stress.",
    excerpt:
      "Personnage, budget, matériaux, kit de survie et règles de bonne conduite : tout pour aborder sereinement son premier cosplay.",
    universe: "anime",
    type: "guide",
    tags: ["cosplay", "convention", "costume", "DIY"],
    cover: "cosplay-blue",
    publishedAt: "2026-09-28T09:00:00+02:00",
    author: "japon",
    popularity: 15230,
    demo: true,
    body: [
      {
        type: "p",
        text: "Le cosplay — contraction de _costume_ et _play_ — consiste à incarner un personnage de fiction. Pas besoin d'être couturier ou sculpteur pour commencer : la communauté est réputée pour sa bienveillance envers les débutants.",
      },
      { type: "h2", id: "choisir-son-personnage", text: "Choisir son personnage" },
      {
        type: "p",
        text: "Le meilleur choix est un personnage que vous aimez **et** dont le costume reste réaliste pour un premier essai. Une tenue reconnaissable à sa silhouette, à sa coiffure ou à un accessoire fort sera plus simple qu'une armure couverte de détails.",
      },
      { type: "h2", id: "materiaux-et-budget", text: "Matériaux et budget" },
      {
        type: "p",
        text: "Beaucoup de cosplayeurs combinent vêtements achetés et modifiés, éléments cousus et accessoires fabriqués. La mousse EVA, légère et facile à découper, est la matière reine des armures et des accessoires. Fixez un budget au départ : une perruque de qualité et des chaussures confortables valent souvent plus que des détails invisibles.",
      },
      { type: "image", image: "kabukicho-mural", caption: "L'univers visuel de l'anime inspire directement les costumes." },
      { type: "h2", id: "le-kit-de-survie", text: "Le kit de survie du jour J" },
      {
        type: "list",
        items: [
          "Épingles à nourrice, colle chaude ou ruban adhésif double face pour les réparations express.",
          "Eau, en-cas et pansements : une convention, c'est souvent une journée debout.",
          "Une tenue de rechange légère pour la fin de journée ou le trajet.",
          "Une copie du règlement de l'événement, notamment pour les accessoires ressemblant à des armes.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Cosplay n'est pas consentement",
        text: "Demandez toujours avant de photographier ou de toucher un cosplayeur. Cette règle d'or de la communauté est affichée dans la plupart des conventions, des petits salons jusqu'aux grands événements comme Japan Expo à Paris.",
      },
      { type: "h2", id: "profiter-avant-tout", text: "Profiter avant tout" },
      {
        type: "p",
        text: "Un premier cosplay n'a pas besoin d'être parfait. L'essentiel est de passer un bon moment, de rencontrer des personnes qui partagent votre passion… et de noter tout ce que vous ferez autrement la prochaine fois.",
      },
    ],
  },
  {
    slug: "adaptations-live-action-anime-pourquoi-ca-divise",
    title: "Adaptations live-action d'anime : pourquoi ça divise (autant)",
    subtitle:
      "Pour un succès salué, combien de projets moqués avant même leur sortie ? Analyse d'un exercice périlleux, entre fidélité, budget et choc des cultures.",
    excerpt:
      "Entre réussites saluées et fiascos retentissants, ce qui fait (ou défait) une adaptation en prises de vues réelles d'un anime ou d'un manga.",
    universe: "anime",
    type: "dossier",
    tags: ["live-action", "adaptation", "Netflix", "One Piece", "Hollywood"],
    cover: "shibuya-night",
    publishedAt: "2026-09-20T09:00:00+02:00",
    author: "japon",
    popularity: 19870,
    demo: true,
    body: [
      {
        type: "p",
        text: "Chaque annonce d'adaptation en prises de vues réelles d'un anime ou d'un manga déclenche la même vague d'inquiétude chez les fans. Il faut dire que l'histoire récente a laissé des traces.",
      },
      { type: "h2", id: "les-faux-pas-qui-ont-marque", text: "Les faux pas qui ont marqué" },
      {
        type: "p",
        text: "Le film _Death Note_ de Netflix (2017), qui transposait l'intrigue aux États-Unis, a été largement rejeté par les fans. _Ghost in the Shell_ (2017) a été critiqué pour le choix de ses acteurs principaux. La série _Cowboy Bebop_ (2021) a été arrêtée après une seule saison. Le point commun : une impression que l'âme de l'œuvre originale s'était perdue en route.",
      },
      { type: "h2", id: "ce-qui-fonctionne", text: "Ce qui fonctionne" },
      {
        type: "p",
        text: "À l'inverse, la série _One Piece_ de Netflix (2023) a surpris par l'accueil chaleureux du public. Son créateur, Eiichiro Oda, s'est fortement impliqué dans le projet, et la production a assumé le ton coloré et un peu fou du manga au lieu de chercher à le rendre « réaliste ». Au Japon, la trilogie _Kenshin le vagabond_ (à partir de 2012) avait déjà montré qu'une adaptation pouvait briller grâce à des combats chorégraphiés avec soin.",
      },
      {
        type: "quote",
        text: "Une bonne adaptation ne recopie pas les cases : elle traduit une énergie.",
        cite: "La rédaction YORU",
      },
      { type: "h2", id: "le-piege-de-l-exageration", text: "Le piège de l'exagération" },
      {
        type: "p",
        text: "L'animation autorise tout : coiffures impossibles, expressions extrêmes, lois de la physique malmenées. Transposé tel quel avec de vrais acteurs, ce langage visuel peut vite paraître ridicule. Trop atténué, il devient fade. Toute la difficulté est de trouver le bon curseur.",
      },
      { type: "h2", id: "la-cle-le-respect", text: "La clé : le respect de l'œuvre" },
      {
        type: "p",
        text: "Les adaptations réussies ont souvent un point commun : l'implication des auteurs originaux et une équipe qui connaît et aime le matériau de départ. Ce n'est pas une garantie, mais c'est un excellent signal à surveiller lors des prochaines annonces.",
      },
    ],
  },
];
