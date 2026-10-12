import type { Article } from "@/types/content";

export const mangaArticles: Article[] = [
  {
    slug: "france-pays-du-manga-histoire-d-une-passion",
    title: "La France, pays du manga : histoire d'une passion",
    subtitle:
      "Des dessins animés du Club Dorothée aux rayons qui débordent en librairie, la France entretient avec la bande dessinée japonaise une relation unique au monde.",
    excerpt:
      "Goldorak, le Club Dorothée, Akira, Dragon Ball… comment la France est devenue l'un des plus grands marchés du manga au monde.",
    universe: "manga",
    type: "dossier",
    tags: ["manga", "France", "édition", "Club Dorothée", "histoire"],
    cover: "manga-stand",
    publishedAt: "2026-09-24T09:00:00+02:00",
    author: "japon",
    popularity: 26540,
    demo: true,
    body: [
      {
        type: "p",
        text: "La France est régulièrement présentée comme le deuxième marché mondial du manga, derrière le Japon. Cette passion ne s'est pas construite en un jour : elle est le fruit de plusieurs générations de lecteurs, de téléspectateurs et d'éditeurs audacieux.",
      },
      { type: "h2", id: "tout-commence-a-la-television", text: "Tout commence à la télévision" },
      {
        type: "p",
        text: "En 1978, la diffusion de _Goldorak_ sur Antenne 2 crée un véritable choc. Dans les années 1980 et 1990, le _Club Dorothée_ sur TF1 fait découvrir à toute une génération _Dragon Ball_, _Les Chevaliers du Zodiaque_ ou _Ken le Survivant_. Beaucoup de futurs lecteurs de manga sont d'abord des enfants devant leur écran.",
      },
      { type: "h2", id: "les-pionniers-de-l-edition", text: "Les pionniers de l'édition" },
      {
        type: "p",
        text: "En 1990, Glénat lance la publication d'_Akira_ de Katsuhiro Ōtomo, puis celle de _Dragon Ball_ quelques années plus tard. D'autres maisons suivent et se spécialisent : Kana, Pika, Kurokawa, Ki-oon… Le manga quitte peu à peu les rayons spécialisés pour s'installer partout, des grandes surfaces aux bibliothèques.",
      },
      { type: "image", image: "manga-shelf", caption: "Le manga occupe aujourd'hui une place majeure en librairie." },
      { type: "h2", id: "une-nouvelle-generation", text: "Une nouvelle génération de lecteurs" },
      {
        type: "p",
        text: "Au début des années 2020, la crise sanitaire, l'essor des plateformes de streaming d'anime et le pass Culture destiné aux jeunes ont provoqué une nouvelle explosion des ventes. Les séries comme _One Piece_, _Demon Slayer_ ou _Jujutsu Kaisen_ ont trouvé un public énorme, souvent venu d'abord par l'anime.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Un événement emblématique",
        text: "Créée en 1999, Japan Expo s'est imposée comme l'un des grands rendez-vous européens de la culture japonaise et du manga, avec ses dédicaces, ses concerts et ses défilés de cosplay.",
      },
      { type: "h2", id: "et-maintenant", text: "Et maintenant ?" },
      {
        type: "p",
        text: "Le marché français ne se contente plus d'importer : des auteurs français publient désormais des « mangas » ou des œuvres fortement influencées par le style japonais, et certaines séries s'exportent à leur tour. La passion est devenue un dialogue.",
      },
    ],
  },
  {
    slug: "shonen-seinen-shojo-josei-guide",
    title: "Shōnen, seinen, shōjo, josei : le guide pour s'y retrouver",
    subtitle:
      "Ces étiquettes ne désignent pas des genres, mais des publics cibles. Les comprendre aide à mieux choisir ses lectures — et à sortir de ses habitudes.",
    excerpt:
      "Ce que veulent vraiment dire shōnen, seinen, shōjo et josei, et pourquoi ces catégories ne doivent pas limiter vos lectures.",
    universe: "manga",
    type: "guide",
    tags: ["shōnen", "seinen", "shōjo", "josei", "débuter"],
    cover: "manga-shelf",
    publishedAt: "2026-09-18T09:00:00+02:00",
    author: "japon",
    popularity: 18420,
    demo: true,
    body: [
      {
        type: "p",
        text: "Au Japon, les mangas sont d'abord prépubliés dans des magazines, chacun visant un public précis. Les catégories que l'on retrouve sur les couvertures françaises viennent de là : elles indiquent **à qui** le magazine d'origine s'adresse, pas **de quoi** parle l'histoire.",
      },
      { type: "h2", id: "shonen", text: "Shōnen : l'aventure avant tout" },
      {
        type: "p",
        text: "Destiné principalement aux jeunes garçons, le shōnen met souvent en scène l'amitié, le dépassement de soi et des combats spectaculaires. Le magazine _Weekly Shōnen Jump_ en est le symbole : _Dragon Ball_, _Naruto_ et _One Piece_ y ont été publiés.",
      },
      { type: "h2", id: "shojo", text: "Shōjo : l'émotion au premier plan" },
      {
        type: "p",
        text: "Pensé pour les jeunes filles, le shōjo accorde une grande place aux sentiments et aux relations, mais aussi à la magie et à l'aventure. _Sailor Moon_ (publié dans _Nakayoshi_) ou _Fruits Basket_ (dans _Hana to Yume_) en sont des classiques.",
      },
      { type: "h2", id: "seinen", text: "Seinen : pour lecteurs adultes" },
      {
        type: "p",
        text: "Le seinen s'adresse aux jeunes hommes adultes et se permet des thèmes plus sombres ou plus complexes : violence, politique, psychologie. _Berserk_, publié dans _Young Animal_, est un exemple célèbre de dark fantasy seinen.",
      },
      { type: "h2", id: "josei", text: "Josei : le quotidien des adultes" },
      {
        type: "p",
        text: "Le josei vise les femmes adultes et explore souvent la vie professionnelle, les relations amoureuses ou les passions avec réalisme. _Chihayafuru_, publié dans _Be Love_, raconte par exemple la compétition autour d'un jeu de cartes poétique traditionnel.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Le conseil YORU",
        text: "Ces étiquettes sont des repères, pas des frontières. De nombreux lecteurs adultes adorent les shōnen, et beaucoup de garçons lisent des shōjo. Choisissez une histoire, pas une catégorie.",
      },
    ],
  },
  {
    slug: "one-piece-phenomene-planetaire",
    title: "One Piece : comment un manga de pirates est devenu un phénomène planétaire",
    subtitle:
      "Depuis 1997, Eiichiro Oda raconte la quête de Luffy et de son équipage. Un record mondial, un anime au long cours, une série live-action, un jeu de cartes… Anatomie d'un succès hors norme.",
    excerpt:
      "Record du monde, anime fleuve, série live-action et jeu de cartes : pourquoi l'aventure de Luffy fédère autant depuis près de trente ans.",
    universe: "manga",
    type: "dossier",
    tags: ["One Piece", "Eiichiro Oda", "shōnen", "Weekly Shōnen Jump"],
    cover: "pirate-figure",
    publishedAt: "2026-10-05T09:00:00+02:00",
    author: "japon",
    popularity: 44120,
    demo: true,
    body: [
      {
        type: "p",
        text: "En juillet 1997, le magazine _Weekly Shōnen Jump_ publie le premier chapitre d'un manga de pirates signé **Eiichiro Oda**. Près de trente ans plus tard, _One Piece_ est l'une des bandes dessinées les plus vendues de l'histoire.",
      },
      { type: "h2", id: "un-record-du-monde", text: "Un record du monde" },
      {
        type: "p",
        text: "En 2015, le Guinness World Records reconnaît _One Piece_ comme la bande dessinée la plus publiée par un auteur unique. Depuis, la série a franchi le cap des cent volumes, et chaque nouveau tome reste un événement en librairie, au Japon comme en France, où elle est éditée par Glénat.",
      },
      { type: "h2", id: "un-monde-qui-s-agrandit", text: "Un monde qui s'agrandit sans cesse" },
      {
        type: "p",
        text: "La force de la série tient à son univers : des îles toutes différentes, des centaines de personnages, des mystères posés des années avant d'être résolus. Sous ses airs de comédie d'aventure, _One Piece_ parle aussi de liberté, d'injustice et de pouvoir — ce qui lui permet de grandir avec ses lecteurs.",
      },
      {
        type: "quote",
        text: "Chaque arc donne l'impression de découvrir un nouveau pays, avec sa culture et ses blessures.",
        cite: "La rédaction YORU",
      },
      { type: "h2", id: "au-dela-du-papier", text: "Au-delà du papier" },
      {
        type: "list",
        items: [
          "**L'anime** produit par Toei Animation depuis 1999, l'un des plus longs de l'histoire.",
          "**La série live-action** de Netflix (2023), saluée pour sa fidélité au ton du manga.",
          "**Le One Piece Card Game**, lancé par Bandai en 2022, devenu un pilier des boutiques de cartes.",
        ],
      },
      { type: "h2", id: "vers-la-fin-du-voyage", text: "Vers la fin du voyage" },
      {
        type: "p",
        text: "En 2022, Oda a annoncé l'entrée de la série dans sa saga finale. Une perspective vertigineuse pour des millions de lecteurs qui ont parfois grandi avec Luffy — et qui découvriront, enfin, ce qu'est vraiment le One Piece.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Côté collection",
        text: "Le boom du jeu de cartes One Piece vous intrigue ? Lisez notre dossier sur [l'explosion des jeux de cartes à collectionner](/articles/pokemon-one-piece-lorcana-boom-des-tcg).",
      },
    ],
  },
  {
    slug: "dessiner-un-manga-du-name-a-la-planche",
    title: "Dessiner un manga : du « name » à la planche finale",
    subtitle:
      "Storyboard, crayonné, encrage, trames : les grandes étapes de fabrication d'une page de manga, telles que les pratiquent les mangakas professionnels.",
    excerpt:
      "Name, crayonné, encrage et trames : les étapes qui transforment une idée en page de manga, de la table à dessin au logiciel.",
    universe: "manga",
    type: "guide",
    tags: ["mangaka", "dessin", "technique", "trames", "création"],
    cover: "drawing-anime",
    publishedAt: "2026-09-12T09:00:00+02:00",
    author: "japon",
    popularity: 8940,
    demo: true,
    body: [
      {
        type: "p",
        text: "Une page de manga paraît simple : du noir, du blanc, quelques gris. Derrière cette apparente sobriété se cache pourtant une chaîne de fabrication très codifiée, pensée pour tenir des rythmes de publication souvent hebdomadaires.",
      },
      { type: "h2", id: "le-name", text: "Étape 1 : le « name »" },
      {
        type: "p",
        text: "Le _name_ est le brouillon du chapitre : un découpage rapide qui fixe la taille des cases, la position des bulles et le rythme de lecture. C'est souvent cette version que le mangaka soumet à son éditeur, qui joue un rôle très important dans l'industrie japonaise.",
      },
      { type: "h2", id: "crayonne-et-encrage", text: "Étape 2 : crayonné et encrage" },
      {
        type: "p",
        text: "Une fois le découpage validé, l'auteur dessine les planches au crayon, puis les encre. Traditionnellement, on utilise des plumes métalliques — la célèbre « G-pen » pour les traits expressifs, la « maru pen » pour les détails fins. Aujourd'hui, beaucoup d'auteurs travaillent directement sur tablette graphique.",
      },
      { type: "h2", id: "les-trames", text: "Étape 3 : les trames" },
      {
        type: "p",
        text: "Les gris d'un manga sont obtenus grâce aux **trames** : des motifs de points, de lignes ou de dégradés, autrefois vendus en feuilles adhésives que l'on découpait au cutter, aujourd'hui appliqués numériquement. Elles donnent volume, ambiance et textures.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Le saviez-vous ?",
        text: "Les trames de manga sont cousines des points Ben-Day des comics américains. Nous racontons leur histoire dans [notre dossier sur la trame](/articles/points-ben-day-histoire-de-la-trame).",
      },
      { type: "h2", id: "le-travail-d-equipe", text: "Un travail d'équipe" },
      {
        type: "p",
        text: "Pour tenir le rythme, les mangakas publiés chaque semaine s'appuient souvent sur des **assistants** qui dessinent les décors, posent les trames ou ajoutent les effets. Le nom de l'auteur est sur la couverture, mais chaque chapitre est aussi le fruit d'un atelier.",
      },
    ],
  },
];
