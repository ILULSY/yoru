import type { Article } from "@/types/content";

export const collectorsArticles: Article[] = [
  {
    slug: "grading-cartes-psa-cgc-beckett-comment-ca-marche",
    title: "Grading des cartes : PSA, CGC, Beckett… comment ça marche ?",
    subtitle:
      "Faire noter une carte par une société spécialisée peut multiplier sa valeur… ou vous coûter plus qu'elle ne vaut. Le guide pour comprendre le grading avant d'envoyer votre collection.",
    excerpt:
      "Centrage, coins, tranches, surface : comment les sociétés de grading notent vos cartes, et quand cela vaut vraiment le coup.",
    universe: "collectors",
    type: "guide",
    tags: ["grading", "PSA", "Beckett", "CGC", "Pokémon", "cartes"],
    cover: "card-dragon",
    publishedAt: "2026-10-09T09:00:00+02:00",
    author: "collec",
    popularity: 33480,
    demo: true,
    body: [
      {
        type: "p",
        text: "Dans le monde des cartes à collectionner, une même carte peut valoir dix euros ou plusieurs milliers selon son état. Pour objectiver cet état, des sociétés spécialisées proposent un service de **grading** : elles authentifient la carte, lui attribuent une note et la scellent dans un boîtier rigide, le « slab ».",
      },
      { type: "h2", id: "les-quatre-criteres", text: "Les quatre critères observés" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Le centrage** : l'illustration est-elle bien centrée, avec des bordures égales ?",
          "**Les coins** : sont-ils parfaitement nets ou légèrement arrondis, blanchis ?",
          "**Les tranches** : présentent-elles des éclats ou des marques ?",
          "**La surface** : rayures, traces, défauts d'impression ou de brillance.",
        ],
      },
      { type: "h2", id: "les-grands-noms", text: "Les grands noms du secteur" },
      {
        type: "p",
        text: "**PSA** (Professional Sports Authenticator), fondée en 1991 aux États-Unis, est la référence la plus connue, avec une note globale sur 10. **Beckett** (BGS) se distingue par ses sous-notes détaillées pour chaque critère ; une carte obtenant la note parfaite partout reçoit le très convoité « Black Label ». **CGC**, d'abord réputée pour la notation des comics, s'est aussi imposée sur les cartes.",
      },
      { type: "image", image: "cards-pile", caption: "Toutes les cartes ne méritent pas d'être gradées." },
      { type: "h2", id: "quand-faire-grader", text: "Quand faire grader une carte ?" },
      {
        type: "p",
        text: "Le grading a un coût (frais de service, envoi, assurance) et des délais parfois longs. Il est surtout pertinent pour des cartes **rares, recherchées et en excellent état**, ou pour sécuriser l'authenticité d'une carte de valeur avant une revente.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Faites votre pré-grading",
        text: "Avant tout envoi, examinez la carte sous une lumière forte, avec une loupe. Un coin blanchi ou un centrage décalé peut suffire à faire chuter la note — et à rendre l'opération non rentable.",
      },
      { type: "h2", id: "une-note-n-est-pas-une-cote", text: "Une note n'est pas une cote" },
      {
        type: "p",
        text: "Gardez en tête qu'une note mesure un état, pas une valeur garantie. Les prix dépendent de la demande, des tendances et des ventes réelles. Et n'oubliez pas de bien [protéger vos cartes](/articles/proteger-sa-collection-de-cartes) avant même de penser au grading.",
      },
    ],
  },
  {
    slug: "proteger-sa-collection-de-cartes",
    title: "Protéger sa collection de cartes : sleeves, toploaders et classeurs",
    subtitle:
      "Humidité, lumière, frottements : les ennemis de vos cartes sont nombreux. Les bons accessoires et les bons gestes pour les garder en parfait état pendant des années.",
    excerpt:
      "Sleeves, toploaders, classeurs, humidité et lumière : les gestes simples qui préservent la valeur (et la beauté) de vos cartes.",
    universe: "collectors",
    type: "guide",
    tags: ["cartes", "protection", "sleeves", "classeur", "conservation"],
    cover: "cards-pile",
    publishedAt: "2026-09-17T09:00:00+02:00",
    author: "collec",
    popularity: 15780,
    demo: true,
    body: [
      {
        type: "p",
        text: "Une carte à collectionner est un petit morceau de carton imprimé : fragile, sensible à l'humidité et aux frottements. La bonne nouvelle, c'est qu'une protection efficace coûte très peu cher.",
      },
      { type: "h2", id: "la-base-les-sleeves", text: "La base : les sleeves" },
      {
        type: "p",
        text: "Les **sleeves** sont des pochettes plastiques souples. Les modèles fins et bon marché (« penny sleeves ») protègent les cartes du quotidien ; les modèles plus épais servent aux cartes jouées en tournoi. Pour une protection maximale, certains collectionneurs utilisent une double pochette : une première bien ajustée, une seconde par-dessus.",
      },
      { type: "h2", id: "les-cartes-de-valeur", text: "Pour les cartes de valeur" },
      {
        type: "p",
        text: "Les **toploaders**, étuis rigides dans lesquels on glisse la carte déjà protégée par une sleeve, évitent qu'elle se plie. Les boîtiers magnétiques, plus chers, offrent une présentation soignée pour les pièces maîtresses.",
      },
      {
        type: "list",
        items: [
          "Choisissez des accessoires **sans PVC** et sans acide, qui ne libèrent pas de substances avec le temps.",
          "Préférez les classeurs à pochettes intégrées aux classeurs à anneaux, qui peuvent marquer les cartes proches de la reliure.",
          "Ne surchargez pas les pochettes : une carte par emplacement.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Les deux ennemis invisibles",
        text: "L'humidité peut gondoler les cartes, et la lumière directe du soleil fait pâlir les couleurs. Rangez votre collection dans une pièce sèche, à l'abri des fenêtres.",
      },
      { type: "h2", id: "manipuler-avec-soin", text: "Manipuler avec soin" },
      {
        type: "p",
        text: "Ayez les mains propres et sèches, manipulez les cartes par les bords et posez-les sur une surface douce. Ces gestes simples font toute la différence le jour où vous envisagerez de [faire grader une carte](/articles/grading-cartes-psa-cgc-beckett-comment-ca-marche).",
      },
    ],
  },
  {
    slug: "pokemon-one-piece-lorcana-boom-des-tcg",
    title: "Pokémon, One Piece, Lorcana : pourquoi les jeux de cartes à collectionner explosent",
    subtitle:
      "Des boosters introuvables, des files d'attente devant les boutiques, de nouveaux jeux qui séduisent en quelques mois : décryptage d'un engouement qui dépasse largement les cours de récréation.",
    excerpt:
      "Nostalgie, vidéos d'ouverture de boosters, nouvelles licences : les raisons d'un boom des TCG qui touche toutes les générations.",
    universe: "collectors",
    type: "dossier",
    tags: ["TCG", "Pokémon", "One Piece Card Game", "Lorcana", "Magic"],
    cover: "cards-scattered",
    publishedAt: "2026-10-01T09:00:00+02:00",
    author: "collec",
    popularity: 37260,
    demo: true,
    body: [
      {
        type: "p",
        text: "Le jeu de cartes à collectionner — ou _TCG_, pour _trading card game_ — n'est pas une invention récente. Mais jamais il n'avait touché un public aussi large qu'aujourd'hui.",
      },
      { type: "h2", id: "une-histoire-commencee-en-1993", text: "Une histoire commencée en 1993" },
      {
        type: "p",
        text: "Tout commence avec _Magic: The Gathering_, imaginé par le mathématicien Richard Garfield et publié par Wizards of the Coast en 1993. Le **jeu de cartes Pokémon** apparaît au Japon en 1996, puis arrive en Occident à la fin des années 1990, suivi de près par _Yu-Gi-Oh!_. Une génération entière grandit avec des classeurs remplis de cartes.",
      },
      { type: "h2", id: "les-nouveaux-venus", text: "Les nouveaux venus qui changent la donne" },
      {
        type: "p",
        text: "Le **One Piece Card Game**, lancé par Bandai en 2022, a rapidement trouvé sa place grâce à la popularité colossale du manga. En 2023, **Disney Lorcana**, édité par Ravensburger, a démontré qu'une licence familiale pouvait séduire les joueurs expérimentés comme les collectionneurs.",
      },
      { type: "image", image: "ball-cards", caption: "Les jeux de cartes séduisent aussi bien les joueurs que les collectionneurs." },
      { type: "h2", id: "les-moteurs-du-boom", text: "Les moteurs du boom" },
      {
        type: "list",
        items: [
          "**La nostalgie** : les enfants des années 1990 ont aujourd'hui un pouvoir d'achat.",
          "**Les vidéos d'ouverture de boosters** et les lives, qui transforment chaque tirage en spectacle.",
          "**Le jeu en boutique** : tournois et soirées créent une vraie vie de quartier.",
          "**La spéculation**, qui attire aussi des acheteurs plus intéressés par la revente que par le jeu.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Prudence",
        text: "Les ruptures de stock favorisent la revente à prix gonflés. Achetez auprès de boutiques identifiées et méfiez-vous des produits scellés vendus à des tarifs trop bas : ils peuvent avoir été ouverts puis recollés.",
      },
      { type: "h2", id: "jouer-ou-collectionner", text: "Jouer ou collectionner ?" },
      {
        type: "p",
        text: "Les deux, souvent. C'est la grande force des TCG : la même carte peut être un outil stratégique pour un joueur et une pièce rare pour un collectionneur. Notre conseil reste le même : achetez d'abord ce qui vous fait plaisir.",
      },
    ],
  },
  {
    slug: "figurines-du-jouet-a-l-objet-d-art",
    title: "Figurines : du jouet d'enfant à l'objet d'art",
    subtitle:
      "Figurines à l'échelle, Nendoroid, garage kits, sofubi, art toys : la figurine est devenue un univers d'une richesse incroyable. Petit lexique pour s'y retrouver.",
    excerpt:
      "Échelles, garage kits, Nendoroid, sofubi et art toys : le lexique pour comprendre l'univers foisonnant des figurines de collection.",
    universe: "collectors",
    type: "dossier",
    tags: ["figurines", "Nendoroid", "garage kit", "sofubi", "art toys"],
    cover: "vintage-monsters",
    publishedAt: "2026-09-22T09:00:00+02:00",
    author: "collec",
    popularity: 13210,
    demo: true,
    body: [
      {
        type: "p",
        text: "Une vitrine de figurines peut rassembler des objets très différents : une statuette finement peinte, un petit personnage à grosse tête, un monstre en vinyle souple… Chaque famille a son histoire et ses codes.",
      },
      { type: "h2", id: "les-figurines-a-l-echelle", text: "Les figurines à l'échelle" },
      {
        type: "p",
        text: "Les _scale figures_ reproduisent un personnage à une proportion donnée, souvent 1/7 ou 1/8. Peintes avec un grand souci du détail, elles s'adressent clairement aux collectionneurs adultes. Leur prix reflète des mois de conception et de fabrication.",
      },
      { type: "h2", id: "nendoroid-et-figurines-articulees", text: "Nendoroid et figurines articulées" },
      {
        type: "p",
        text: "Créées par Good Smile Company en 2006, les **Nendoroid** ont popularisé un style « chibi » à grosse tête, avec visages et accessoires interchangeables. Les gammes articulées, comme les figma de Max Factory, permettent quant à elles de reproduire des poses dynamiques.",
      },
      { type: "h2", id: "garage-kits-et-sofubi", text: "Garage kits et sofubi" },
      {
        type: "p",
        text: "Les **garage kits** sont des figurines en résine à assembler et à peindre soi-même ; le salon Wonder Festival, organisé au Japon depuis 1984, est leur grand rendez-vous. Le **sofubi** (vinyle souple) est, lui, indissociable des monstres de [films de kaiju](/articles/kaiju-monstres-geants-de-godzilla-a-aujourdhui) et des héros de séries japonaises.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Les art toys",
        text: "Depuis les années 2000, des artistes conçoivent des figurines originales en séries limitées, à mi-chemin entre jouet et sculpture. Elles se collectionnent comme des œuvres.",
      },
      { type: "h2", id: "collectionner-intelligemment", text: "Collectionner intelligemment" },
      {
        type: "p",
        text: "Définissez un thème (une licence, un artiste, un fabricant), un budget mensuel et un espace d'exposition à l'abri de la lumière directe. Et avant tout achat d'occasion, relisez [nos conseils contre les contrefaçons](/articles/figurines-contrefaites-signaux-d-alerte).",
      },
    ],
  },
  {
    slug: "figurines-contrefaites-signaux-d-alerte",
    title: "Figurines contrefaites : les signaux d'alerte avant d'acheter",
    subtitle:
      "Prix trop beau, boîte approximative, peinture baveuse : les contrefaçons (ou « bootlegs ») inondent certaines plateformes. Comment les repérer et les éviter.",
    excerpt:
      "Prix, vendeur, autocollant d'authenticité, qualité de la boîte et de la peinture : la checklist pour éviter les figurines contrefaites.",
    universe: "collectors",
    type: "guide",
    tags: ["contrefaçon", "bootleg", "figurines", "achat", "conseils"],
    cover: "toy-showcase",
    publishedAt: "2026-09-11T09:00:00+02:00",
    author: "collec",
    popularity: 10450,
    demo: true,
    body: [
      {
        type: "p",
        text: "Les figurines contrefaites copient des modèles officiels en utilisant des matériaux et des finitions de moindre qualité. Au-delà de la déception, elles peuvent poser des problèmes de sécurité (plastiques non contrôlés) et nuisent aux créateurs.",
      },
      { type: "h2", id: "le-prix-premier-indice", text: "Le prix, premier indice" },
      {
        type: "p",
        text: "Une figurine neuve vendue à une fraction de son prix habituel doit immédiatement éveiller vos soupçons. Comparez avec le prix de lancement et les tarifs pratiqués par les revendeurs agréés.",
      },
      { type: "h2", id: "la-checklist", text: "La checklist de l'acheteur" },
      {
        type: "list",
        ordered: true,
        items: [
          "**L'autocollant d'authenticité** : de nombreux fabricants japonais apposent un sticker holographique officiel sur la boîte.",
          "**La boîte** : impression floue, couleurs ternes, fautes de frappe ou logo approximatif sont de mauvais signes.",
          "**La peinture** : bavures, traits imprécis, yeux mal alignés.",
          "**Les matériaux** : plastique brillant de mauvaise qualité, odeur chimique forte, jointures visibles.",
          "**Le vendeur** : historique, avis, localisation et photos réelles plutôt que visuels officiels.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Demandez des photos",
        text: "Pour un achat d'occasion, demandez des photos de la figurine sous plusieurs angles, de l'autocollant et du dessous du socle. Un vendeur honnête n'y verra aucun problème.",
      },
      { type: "h2", id: "si-vous-etes-tombe-dans-le-piege", text: "Si vous êtes tombé dans le piège" },
      {
        type: "p",
        text: "Contactez le vendeur, puis la plateforme : la plupart proposent des procédures de litige pour les produits non conformes. Signaler l'annonce aide aussi les autres collectionneurs.",
      },
    ],
  },
];
