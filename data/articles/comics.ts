import type { Article } from "@/types/content";

export const comicsArticles: Article[] = [
  {
    slug: "spider-verse-animation-case-de-comics",
    title: "Spider-Verse : quand l'animation est devenue une case de comics",
    subtitle:
      "Avec Into the Spider-Verse puis Across the Spider-Verse, Sony Pictures Animation a prouvé qu'un film d'animation pouvait ressembler à une bande dessinée en mouvement. Critique d'une révolution visuelle.",
    excerpt:
      "Trames, onomatopées, images saccadées assumées : retour critique sur la saga qui a changé le visage de l'animation occidentale.",
    universe: "comics",
    type: "critique",
    tags: ["Spider-Verse", "animation", "Miles Morales", "super-héros", "Sony"],
    cover: "spider-cosplay",
    publishedAt: "2026-10-04T09:00:00+02:00",
    author: "capes",
    popularity: 35910,
    demo: true,
    rating: 9,
    body: [
      {
        type: "p",
        text: "En 2018, _Spider-Man: New Generation_ (_Into the Spider-Verse_) débarque dans un paysage dominé par l'animation 3D lisse et photoréaliste. Le film de Bob Persichetti, Peter Ramsey et Rodney Rothman prend le contre-pied total : il veut ressembler à un comic book. Pari réussi — il remporte l'**Oscar du meilleur film d'animation**.",
      },
      { type: "h2", id: "une-grammaire-de-bande-dessinee", text: "Une grammaire de bande dessinée" },
      {
        type: "p",
        text: "Tout y rappelle le papier : les trames de points façon impression ancienne, les décalages de couleurs comme sur une page mal calée, les onomatopées et les bulles de pensée qui s'affichent à l'écran. Chaque univers parallèle a même son propre style graphique.",
      },
      { type: "h2", id: "l-art-de-la-saccade", text: "L'art de la saccade" },
      {
        type: "p",
        text: "Idée géniale : Miles Morales est d'abord animé « en deux », c'est-à-dire avec une image dessinée toutes les deux images, ce qui le rend légèrement saccadé. À mesure qu'il maîtrise ses pouvoirs, son animation gagne en fluidité. Le style devient récit.",
      },
      {
        type: "quote",
        text: "Spider-Verse ne cherche pas à imiter la réalité : il cherche à imiter le plaisir de lire.",
        cite: "La rédaction YORU",
      },
      { type: "h2", id: "across-the-spider-verse-plus-loin", text: "Across the Spider-Verse, encore plus loin" },
      {
        type: "p",
        text: "La suite, sortie en 2023 et réalisée par Joaquim Dos Santos, Kemp Powers et Justin K. Thompson, pousse les curseurs au maximum : aquarelle mouvante pour Gwen Stacy, collage punk pour Spider-Punk, architecture futuriste pour Mumbattan. C'est parfois épuisant, souvent sublime, et toujours inventif.",
      },
      { type: "h2", id: "un-heritage-visible-partout", text: "Un héritage visible partout" },
      {
        type: "p",
        text: "Depuis, d'autres films ont osé les styles hybrides : _Les Mitchell contre les machines_ (2021), _Le Chat Potté 2 : la dernière quête_ (2022) ou _Ninja Turtles : Teenage Years_ (2023). La saga a ouvert une porte que l'animation occidentale ne semble plus vouloir refermer.",
      },
      {
        type: "verdict",
        score: 9,
        pros: [
          "Une identité visuelle unique, où chaque univers a son style",
          "Une animation qui raconte l'évolution du héros",
          "Un amour sincère pour la bande dessinée",
        ],
        cons: [
          "Un rythme parfois saturé dans le second film",
          "Une fin en suspens pour Across the Spider-Verse",
        ],
        text: "Une saga majeure, qui a prouvé qu'un blockbuster de super-héros pouvait aussi être une œuvre d'art graphique audacieuse.",
      },
    ],
  },
  {
    slug: "points-ben-day-histoire-de-la-trame",
    title: "Les points Ben-Day : petite histoire de la trame qui a fait les comics",
    subtitle:
      "Ces petits points colorés qui composent les vieilles pages de comics sont nés d'une contrainte d'imprimerie. Ils sont devenus un symbole de la pop culture tout entière.",
    excerpt:
      "Née d'une contrainte d'impression, la trame de points est devenue l'une des signatures visuelles de la pop culture, de Lichtenstein à Spider-Verse.",
    universe: "comics",
    type: "dossier",
    tags: ["Ben-Day", "impression", "pop art", "Lichtenstein", "histoire"],
    cover: "vintage-comics",
    publishedAt: "2026-09-27T09:00:00+02:00",
    author: "capes",
    popularity: 13470,
    demo: true,
    body: [
      {
        type: "p",
        text: "Regardez de près une page de comic des années 1950 : les visages roses ou les ciels pâles ne sont pas des aplats, mais des milliers de petits points. Ce procédé porte un nom, celui de son inventeur.",
      },
      { type: "h2", id: "une-invention-de-1879", text: "Une invention de 1879" },
      {
        type: "p",
        text: "En 1879, l'illustrateur et imprimeur américain **Benjamin Henry Day Jr.** met au point une technique pour créer des nuances avec un nombre limité d'encres. En jouant sur la taille et l'espacement de points d'une même couleur, on obtient des tons plus clairs ; en superposant des points de couleurs différentes, de nouvelles teintes apparaissent.",
      },
      { type: "h2", id: "l-economie-des-comics", text: "L'économie des comics" },
      {
        type: "p",
        text: "Pour les éditeurs de comics, imprimés sur du papier bon marché, la technique est idéale : quatre encres suffisent à produire une palette très large. Les trames deviennent ainsi la texture même de l'âge d'or des super-héros.",
      },
      { type: "h2", id: "du-kiosque-au-musee", text: "Du kiosque au musée" },
      {
        type: "p",
        text: "Dans les années 1960, le peintre **Roy Lichtenstein** agrandit des cases de comics et reproduit leurs points à la main, sur de grandes toiles. Des œuvres comme _Whaam!_ (1963) font entrer l'esthétique de la bande dessinée dans les musées et deviennent des icônes du pop art.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Clin d'œil",
        text: "Les motifs de points que vous voyez partout sur YORU rendent hommage à cette histoire. Ils sont générés en CSS, sans image, pour rester légers.",
      },
      { type: "h2", id: "une-seconde-vie-numerique", text: "Une seconde vie numérique" },
      {
        type: "p",
        text: "La colorisation numérique a rendu la trame inutile techniquement. Mais elle n'a jamais disparu : elle est devenue un clin d'œil, une manière de dire « ceci est un comic ». Le film [Spider-Verse](/articles/spider-verse-animation-case-de-comics) l'utilise abondamment, tout comme les trames des [mangas](/articles/dessiner-un-manga-du-name-a-la-planche), ses lointaines cousines japonaises.",
      },
    ],
  },
  {
    slug: "debuter-les-comics-par-ou-commencer",
    title: "Débuter les comics : par où commencer sans se perdre dans le multivers",
    subtitle:
      "Des décennies de continuité, des centaines de personnages, des versions alternatives à n'en plus finir… Pas de panique : voici quelques portes d'entrée idéales.",
    excerpt:
      "Récits complets, formats, éditeurs français : nos repères pour se lancer dans les comics sans se noyer dans des décennies de continuité.",
    universe: "comics",
    type: "guide",
    tags: ["comics", "débuter", "romans graphiques", "lecture"],
    cover: "comics-scattered",
    publishedAt: "2026-09-13T09:00:00+02:00",
    author: "capes",
    popularity: 14920,
    demo: true,
    body: [
      {
        type: "p",
        text: "Les comics de super-héros ont une réputation intimidante : on imagine qu'il faut avoir tout lu depuis 1938 pour comprendre quoi que ce soit. C'est faux. La plupart des grandes histoires peuvent se lire indépendamment.",
      },
      { type: "h2", id: "privilegier-les-recits-complets", text: "Privilégier les récits complets" },
      {
        type: "p",
        text: "Le plus simple est de commencer par des histoires qui ont un début et une fin. Quelques classiques incontournables :",
      },
      {
        type: "list",
        items: [
          "**Watchmen** d'Alan Moore et Dave Gibbons (1986-1987), le chef-d'œuvre qui a déconstruit le mythe du super-héros.",
          "**Batman : Année Un** de Frank Miller et David Mazzucchelli (1987), un polar urbain sur les débuts du justicier.",
          "**All-Star Superman** de Grant Morrison et Frank Quitely, une lettre d'amour lumineuse au héros de Krypton.",
          "**Saga** de Brian K. Vaughan et Fiona Staples, un space opera hors des super-héros.",
        ],
      },
      { type: "h2", id: "comprendre-les-formats", text: "Comprendre les formats" },
      {
        type: "p",
        text: "Aux États-Unis, les comics paraissent d'abord en fascicules mensuels d'une vingtaine de pages, puis sont rassemblés en albums. En France, on lit surtout ces recueils, publiés notamment par **Urban Comics** pour l'univers DC et par **Panini Comics** pour Marvel. Les intégrales et _omnibus_ regroupent de longues périodes en un seul volume.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "L'astuce",
        text: "Suivez un auteur plutôt qu'un personnage. Un scénariste que vous aimez vous guidera bien mieux dans un univers que l'ordre chronologique des publications.",
      },
      { type: "h2", id: "et-les-films", text: "Et si vous venez des films ?" },
      {
        type: "p",
        text: "Les films adaptent rarement une histoire précise, mais s'inspirent souvent de plusieurs arcs. Demandez conseil à votre libraire : il saura vous orienter vers le récit qui a inspiré votre film préféré. Et si c'est l'animation qui vous a séduit, ne manquez pas [notre critique de Spider-Verse](/articles/spider-verse-animation-case-de-comics).",
      },
    ],
  },
  {
    slug: "science-fiction-defi-du-realisme-spatial",
    title: "Science-fiction : le grand défi du réalisme spatial au cinéma",
    subtitle:
      "Silence dans le vide, gravité, trous noirs : certains films ont fait de la rigueur scientifique un argument. D'autres assument le spectacle. Les deux approches ont leurs chefs-d'œuvre.",
    excerpt:
      "De 2001 à Interstellar, comment le cinéma de science-fiction jongle entre rigueur scientifique et spectacle grand public.",
    universe: "comics",
    type: "dossier",
    tags: ["science-fiction", "espace", "Interstellar", "2001", "cinéma"],
    cover: "astronaut",
    publishedAt: "2026-09-19T09:00:00+02:00",
    author: "capes",
    popularity: 17650,
    demo: true,
    body: [
      {
        type: "p",
        text: "Dans l'espace, personne ne vous entend crier. Le célèbre slogan d'_Alien_ résume un dilemme permanent pour le cinéma de science-fiction : faut-il respecter la physique, ou privilégier l'émotion et le spectacle ?",
      },
      { type: "h2", id: "2001-la-reference", text: "2001, la référence absolue" },
      {
        type: "p",
        text: "En 1968, Stanley Kubrick sort _2001 : l'Odyssée de l'espace_. Pas de bruit d'explosion dans le vide, une gravité artificielle créée par la rotation des vaisseaux, des séquences d'une lenteur hypnotique. Plus d'un demi-siècle après, le film reste un étalon du réalisme spatial.",
      },
      { type: "h2", id: "interstellar-et-la-science", text: "Interstellar et la science" },
      {
        type: "p",
        text: "Pour _Interstellar_ (2014), Christopher Nolan s'entoure du physicien **Kip Thorne**, futur lauréat du prix Nobel. Les équations fournies aux équipes d'effets visuels pour représenter le trou noir Gargantua ont même donné lieu à des publications scientifiques sur le rendu des trous noirs en rotation.",
      },
      {
        type: "list",
        items: [
          "**Gravity** (2013) : la mécanique orbitale au service du suspense.",
          "**Seul sur Mars** (2015) : la résolution de problèmes scientifiques comme moteur du récit.",
          "**The Expanse** (série, 2015-2022) : l'inertie et la gravité prises au sérieux dans un space opera.",
        ],
      },
      { type: "h2", id: "le-droit-au-spectacle", text: "Le droit au spectacle" },
      {
        type: "p",
        text: "À l'opposé, _Star Wars_ assume ses combats de chasseurs pleins de sons et de lumières, inspirés des films de guerre aérienne. Ce n'est pas une erreur : c'est un choix de genre, plus proche du conte que de l'anticipation.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Notre avis",
        text: "Le réalisme n'est pas une note de qualité. Ce qui compte, c'est la cohérence : un film doit respecter les règles qu'il se fixe lui-même.",
      },
    ],
  },
];
