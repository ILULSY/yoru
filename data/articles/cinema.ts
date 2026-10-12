import type { Article } from "@/types/content";

export const cinemaArticles: Article[] = [
  {
    slug: "imax-4dx-dolby-salles-premium",
    title: "IMAX, 4DX, Dolby Cinema : pourquoi les salles premium nous font revenir au cinéma",
    subtitle:
      "Écrans géants, son en trois dimensions, sièges qui bougent : face au streaming, les salles misent tout sur l'expérience. Décryptage d'une tendance qui change notre façon de choisir une séance.",
    excerpt:
      "Écrans géants, son immersif, sièges animés : comment les formats premium sont devenus l'argument numéro un des salles face au canapé.",
    universe: "cinema",
    type: "dossier",
    tags: ["IMAX", "salles", "4DX", "Dolby Cinema", "expérience"],
    cover: "cinema-hall",
    publishedAt: "2026-10-08T09:00:00+02:00",
    author: "ecrans",
    featured: true,
    popularity: 48210,
    demo: true,
    body: [
      {
        type: "p",
        text: "Il y a dix ans, la question était simple : _pourquoi payer une place quand le film arrivera bientôt sur une plateforme ?_ Les exploitants y répondent aujourd'hui par une promesse que le salon ne peut pas tenir : **l'événement**. Écrans hauts comme des immeubles, enceintes au plafond, fauteuils qui tremblent… Les formats dits « premium » sont devenus le cœur de la stratégie des salles.",
      },
      { type: "h2", id: "course-a-l-experience", text: "Une course à l'expérience" },
      {
        type: "p",
        text: "Le principe est le même partout : proposer une séance qu'on ne peut pas reproduire chez soi, et la faire payer un peu plus cher. Pour le spectateur, le calcul change. On ne va plus seulement voir _un film_, on choisit _comment_ le voir — et certains titres deviennent des rendez-vous à vivre dans un format précis.",
      },
      { type: "h2", id: "imax-le-geant-historique", text: "IMAX, le géant historique" },
      {
        type: "p",
        text: "Né au Canada, le procédé IMAX a été présenté au public lors de l'Exposition universelle d'Osaka en 1970. Son idée fondatrice : une pellicule bien plus grande que le 35 mm classique et un écran qui remplit le champ de vision. Les salles « IMAX with Laser » d'aujourd'hui reprennent cette ambition avec une projection numérique très lumineuse et un son calibré.",
      },
      {
        type: "p",
        text: "Le format a gagné en prestige grâce à des cinéastes qui tournent spécifiquement pour lui. _Oppenheimer_ de Christopher Nolan (2023) a ainsi été filmé en grande partie avec des caméras IMAX 65 mm, ce qui a fait de certaines copies 70 mm de véritables objets de pèlerinage pour cinéphiles.",
      },
      { type: "image", image: "projector-beams", caption: "La projection reste le cœur de l'expérience en salle." },
      { type: "h2", id: "4dx-screenx-le-cinema-qui-bouge", text: "4DX et ScreenX : le cinéma qui bouge" },
      {
        type: "p",
        text: "Développés par le groupe sud-coréen CJ 4DPlex, le **4DX** et le **ScreenX** jouent une autre carte : la sensation. En 4DX, les sièges basculent, vibrent, soufflent de l'air ou projettent quelques gouttes d'eau au rythme de l'action. Le ScreenX, lui, prolonge l'image sur les murs latéraux de la salle pour offrir une vision panoramique à 270 degrés.",
      },
      {
        type: "p",
        text: "Ces formats divisent : parfaits pour un film d'action ou d'animation pensé comme une attraction, ils peuvent devenir envahissants sur un drame intimiste. C'est justement leur force — ils transforment certaines sorties en sorties de groupe, presque en parc d'attractions.",
      },
      { type: "h2", id: "dolby-cinema-image-et-son", text: "Dolby Cinema : la bataille de l'image et du son" },
      {
        type: "p",
        text: "Plus discret, le Dolby Cinema mise sur la qualité pure : projection laser à fort contraste (Dolby Vision) et son spatialisé Dolby Atmos, avec des haut-parleurs répartis jusqu'au plafond. Les noirs sont profonds, les couleurs éclatent, et les effets sonores semblent se déplacer autour de vous.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Le bon réflexe",
        text: "Avant de réserver, vérifiez comment le film a été tourné et mixé. Une œuvre pensée pour l'IMAX (avec changements de format d'image) ou mixée en Atmos tirera vraiment parti du supplément ; une comédie dialoguée beaucoup moins.",
      },
      { type: "h2", id: "ce-que-ca-dit-de-l-avenir", text: "Ce que ça dit de l'avenir des salles" },
      {
        type: "p",
        text: "Les formats premium ne sauveront pas à eux seuls l'exploitation : les cinémas de quartier, les ciné-clubs et les salles art et essai défendent une autre idée du collectif, tout aussi précieuse. Mais ils révèlent une évolution profonde : le grand écran ne se contente plus d'être une fenêtre de diffusion. Il redevient un **lieu**, avec ses rituels et ses frissons.",
      },
    ],
  },
  {
    slug: "kaiju-monstres-geants-de-godzilla-a-aujourdhui",
    title: "Kaiju : plus de 70 ans de monstres géants, de Godzilla à aujourd'hui",
    subtitle:
      "Né dans le Japon traumatisé de l'après-guerre, le film de monstre géant est devenu un genre mondial. Retour sur une créature qui n'a jamais cessé de muter.",
    excerpt:
      "De 1954 à l'Oscar des effets visuels, comment le film de monstres géants est passé du cauchemar nucléaire au phénomène mondial.",
    universe: "cinema",
    type: "dossier",
    tags: ["Godzilla", "kaiju", "tokusatsu", "Japon", "effets spéciaux"],
    cover: "kaiju-figures",
    publishedAt: "2026-09-25T09:00:00+02:00",
    author: "ecrans",
    popularity: 21480,
    demo: true,
    body: [
      {
        type: "p",
        text: "En japonais, _kaijū_ signifie littéralement « bête étrange ». Le mot désigne aujourd'hui tout un genre : celui des créatures colossales qui piétinent les villes. Et tout commence avec un film sorti en 1954.",
      },
      { type: "h2", id: "1954-un-monstre-ne-du-traumatisme", text: "1954 : un monstre né du traumatisme" },
      {
        type: "p",
        text: "Réalisé par **Ishirō Honda** pour le studio Toho, _Godzilla_ (_Gojira_) arrive moins de dix ans après Hiroshima et Nagasaki, l'année même où l'équipage d'un thonier japonais est contaminé par un essai nucléaire américain. Le monstre, réveillé par les bombes, incarne une peur très concrète. Le film est sombre, presque funèbre — loin de l'image de divertissement familial que la saga prendra ensuite.",
      },
      { type: "h2", id: "la-magie-du-costume", text: "La magie du costume" },
      {
        type: "p",
        text: "Pour donner vie à la créature, l'équipe d'effets spéciaux d'Eiji Tsuburaya choisit une technique artisanale : un acteur dans un costume, évoluant au milieu de maquettes de villes miniatures. Cette méthode, qui deviendra la signature du _tokusatsu_ (le cinéma à effets spéciaux japonais), donnera naissance à _Ultraman_ et à toute une famille de héros et de monstres.",
      },
      {
        type: "quote",
        text: "Le kaiju est un miroir : chaque époque y projette ses propres catastrophes.",
        cite: "La rédaction YORU",
      },
      { type: "h2", id: "la-conquete-du-monde", text: "La conquête du monde" },
      {
        type: "p",
        text: "Le genre s'exporte très tôt, se décline (Gamera chez le studio Daiei dès 1965) et inspire Hollywood. Guillermo del Toro lui rend un hommage débordant d'enthousiasme avec _Pacific Rim_ (2013), tandis que le « MonsterVerse » de Legendary fait affronter Godzilla et King Kong à coups de budgets XXL.",
      },
      { type: "h2", id: "le-retour-en-grace-japonais", text: "Le retour en grâce japonais" },
      {
        type: "p",
        text: "Au Japon, deux films relancent la créature. _Shin Godzilla_ (2016), coréalisé par Hideaki Anno, en fait une satire de la paralysie bureaucratique. Puis _Godzilla Minus One_ (2023) de Takashi Yamazaki revient aux racines du mythe, dans le Japon d'après-guerre, et décroche l'**Oscar des meilleurs effets visuels** — une première pour la saga, obtenue avec un budget modeste à l'échelle hollywoodienne.",
      },
      {
        type: "p",
        text: "Plus de sept décennies après sa naissance, le roi des monstres prouve qu'un genre peut rester vivant à condition de continuer à parler de son temps. Les catastrophes changent ; le kaiju, lui, sait toujours où frapper.",
      },
    ],
  },
  {
    slug: "creer-son-coin-cinema-a-la-maison",
    title: "Créer son coin cinéma à la maison : le guide pour bien commencer",
    subtitle:
      "Vidéoprojecteur ou grand téléviseur ? Barre de son ou vrai système multicanal ? Les questions à se poser avant d'investir, sans se laisser aveugler par les fiches techniques.",
    excerpt:
      "Projecteur ou TV, distance de recul, lumière, son : les bases pour monter un coin cinéma qui tient ses promesses sans exploser le budget.",
    universe: "cinema",
    type: "guide",
    tags: ["home cinéma", "vidéoprojecteur", "son", "équipement"],
    cover: "home-projector",
    publishedAt: "2026-09-15T09:00:00+02:00",
    author: "ecrans",
    popularity: 9870,
    demo: true,
    body: [
      {
        type: "p",
        text: "Aucun salon ne remplacera une vraie salle. Mais avec quelques bons choix, il est possible de retrouver une partie de la magie : une image qui enveloppe, un son qui porte et, surtout, une pièce pensée pour regarder plutôt que pour simplement allumer un écran.",
      },
      { type: "h2", id: "projecteur-ou-televiseur", text: "Projecteur ou téléviseur ?" },
      {
        type: "p",
        text: "Le **vidéoprojecteur** offre une diagonale imbattable pour le prix, mais il exige une pièce maîtrisée : plus il y a de lumière ambiante, plus l'image se délave. Le **téléviseur**, lui, reste lumineux en plein jour et plus simple à installer. Si votre pièce ne peut pas être assombrie, un grand téléviseur sera souvent le choix le plus satisfaisant.",
      },
      { type: "h2", id: "la-question-du-recul", text: "La question du recul" },
      {
        type: "p",
        text: "La bonne taille d'image dépend de la distance entre vous et l'écran. Les recommandations professionnelles visent un angle de vision d'environ 30 à 40 degrés : assez pour être immergé, pas au point de tourner la tête. En pratique, mesurez votre distance d'assise avant de regarder les diagonales.",
      },
      {
        type: "list",
        items: [
          "**Mesurez** la distance canapé–mur et la hauteur disponible.",
          "**Vérifiez** la distance de projection (le « throw ») indiquée pour chaque projecteur.",
          "**Testez** l'obscurcissement de la pièce à l'heure où vous regardez le plus souvent.",
        ],
      },
      { type: "h2", id: "le-son-la-moitie-du-film", text: "Le son, la moitié du film" },
      {
        type: "p",
        text: "On l'oublie souvent, mais c'est le son qui procure le plus vite la sensation de « cinéma ». Une bonne barre de son avec caisson est un excellent premier pas ; un système multicanal avec enceintes arrière apportera ensuite la spatialisation. Pensez aussi aux voisins : un caisson de basses posé à même le sol se transmet très bien dans les murs.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Attention aux chiffres",
        text: "Les luminosités et contrastes annoncés ne sont pas toujours mesurés de la même façon d'une marque à l'autre. Fiez-vous aux tests indépendants plutôt qu'aux fiches commerciales.",
      },
      { type: "h2", id: "le-detail-qui-change-tout", text: "Le détail qui change tout" },
      {
        type: "p",
        text: "Une pièce sombre, des murs pas trop clairs autour de l'écran, des câbles rangés, un éclairage tamisé derrière vous : ces détails coûtent peu et transforment l'expérience. Le vrai luxe d'un coin cinéma, c'est l'attention qu'on porte au film.",
      },
    ],
  },
  {
    slug: "bandes-originales-de-films-stars-du-vinyle",
    title: "Les bandes originales de films, nouvelles stars du vinyle",
    subtitle:
      "Pochettes illustrées, disques colorés, éditions limitées : les musiques de films et de jeux vidéo sont devenues des objets de collection à part entière.",
    excerpt:
      "Disques colorés, pochettes d'artistes, éditions limitées : pourquoi les BO de films et de jeux vidéo sont devenues des objets de collection.",
    universe: "cinema",
    type: "actu",
    tags: ["vinyle", "bande originale", "musique", "collection"],
    cover: "vinyl-purple",
    publishedAt: "2026-09-10T09:00:00+02:00",
    author: "ecrans",
    popularity: 6340,
    demo: true,
    body: [
      {
        type: "p",
        text: "Chez les disquaires, un bac a pris de l'ampleur ces dernières années : celui des bandes originales. Films cultes, séries, anime, jeux vidéo… la musique à l'image est devenue l'un des terrains favoris du retour du vinyle.",
      },
      { type: "h2", id: "un-objet-avant-tout", text: "Un objet avant tout" },
      {
        type: "p",
        text: "Le vinyle de BO se vend rarement pour la seule écoute : on l'achète pour sa pochette redessinée par un illustrateur, son disque marbré aux couleurs du film, son livret de notes. Des labels spécialisés, comme l'américain Mondo, ont fait de ces éditions soignées leur marque de fabrique.",
      },
      { type: "h2", id: "les-compositeurs-en-tete-d-affiche", text: "Les compositeurs en tête d'affiche" },
      {
        type: "p",
        text: "Ennio Morricone, John Williams, Hans Zimmer, Joe Hisaishi pour les films du studio Ghibli, Ludwig Göransson… Les compositeurs sont devenus des noms qui font vendre, au point que leurs concerts symphoniques remplissent les grandes salles. Le vinyle prolonge cette relation : on écoute un film comme on écoute un album.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Bon à savoir",
        text: "Les tirages limités se revendent parfois très cher sur le marché de l'occasion. Méfiez-vous des annonces trop belles et vérifiez le numéro de catalogue de l'édition.",
      },
      { type: "h2", id: "le-jeu-video-s-invite", text: "Le jeu vidéo s'invite à la fête" },
      {
        type: "p",
        text: "Les musiques de jeux vidéo profitent particulièrement de cet engouement : des thèmes écoutés pendant des centaines d'heures prennent une dimension nostalgique très forte. Pour beaucoup de joueurs, posséder la BO en vinyle, c'est garder une trace physique d'une aventure entièrement numérique.",
      },
    ],
  },
];
