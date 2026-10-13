# YORU (夜) — *Collect the night.*

Média digital consacré à toute la pop culture : cinéma, séries, anime, manga, jeux vidéo, comics & science-fiction,
cartes à collectionner, figurines et culture geek. Direction artistique pop art / comics / affiche de cinéma, motion
design au cœur de l'expérience, contenus en français.

Le site comprend aussi une **boutique** (cartes à collectionner, figurines, produits dérivés, filtrables par licence :
Dragon Ball Z, Hunter × Hunter, One Piece, Pokémon, Naruto…) et une page **News** avec l'actualité réelle du moment.

> ⚠️ Les 31 articles du magazine et les 34 produits de la boutique sont des **contenus de démonstration** (badge « Démo »,
> avertissement sur la boutique) : dates, popularités, prix et stocks sont fictifs.
> Les **brèves de la page News** sont, elles, des actualités réelles, vérifiées le 10 octobre 2026 et sourcées ; le **fil en
> direct** affiche les titres actuels de 11 médias via leurs flux RSS publics.

---

## 1. Démarrage rapide

Prérequis : **Node.js ≥ 20.9** (testé avec Node 24) et npm.

```bash
npm install
```

```bash
npm run dev
```

Le site est disponible sur http://localhost:3000. Aucune variable d'environnement n'est obligatoire en local.

| Commande            | Rôle                                                            |
| ------------------- | --------------------------------------------------------------- |
| `npm run dev`       | Serveur de développement (Turbopack)                            |
| `npm run build`     | Build de production (valide aussi tout le contenu, voir §5)     |
| `npm run start`     | Sert le build de production                                     |
| `npm run lint`      | ESLint (règles Next.js, Core Web Vitals, React hooks)           |
| `npm run typecheck` | Vérification TypeScript                                         |
| `npm run check`     | Les trois à la suite                                            |

## 2. Stack technique

| Besoin             | Choix                                   | Pourquoi                                                                 |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------------ |
| Framework          | **Next.js 16.3** (App Router, Turbopack) | Rendu statique (SSG) + routes serveur, SEO, images, polices              |
| UI                 | **React 19.2**, **TypeScript 5.9**       |                                                                          |
| Styles             | **Tailwind CSS 4.3** (config CSS-first) | Design tokens dans `styles/globals.css`                                  |
| Animations         | **Motion 12** (`motion/react`)          | Scroll, layout, gestes, AnimatePresence — chargé via `LazyMotion`        |
| Icônes             | **Lucide**                              |                                                                          |
| Validation         | **Zod 4**                               | Mêmes schémas côté navigateur et serveur ; validation du contenu au build |
| Newsletter         | **Brevo** (API REST, sans SDK)          | Prestataire français, double opt-in possible                             |
| E-mails de contact | **Resend** (API REST, sans SDK)         |                                                                          |
| Paiement           | **Stripe Checkout** (API REST, sans SDK) | Page de paiement hébergée : aucune donnée bancaire ne transite par le site |
| Base de données    | **Supabase** (optionnel, PostgREST)     | Adaptateur prêt, schéma SQL + RLS fournis                                |

Aucune dépendance superflue : pas de SDK Supabase/Brevo/Resend (simples `fetch`), pas de bibliothèque de formulaires,
pas d'utilitaire de classes.

## 3. Structure du projet

```
app/                      Pages (App Router), routes API, SEO technique
  page.tsx                Accueil (15 blocs)
  news/                   Brèves vérifiées + fil d'actualités en direct (RSS)
  actualites/             Liste filtrable des articles du magazine
  boutique/               Shop : accueil, [categorie]/, licence/[slug]/, produit/[slug]/, merci/
  panier/ cgv/            Panier détaillé, conditions générales de vente
  articles/[slug]/        Page article (SSG)
  univers/ , univers/[slug]/   Index et 8 pages d'univers
  recherche/ favoris/ a-propos/ contact/ mentions-legales/ confidentialite/
  api/search|newsletter|contact|checkout/route.ts, api/stripe/webhook/route.ts
  sitemap.ts robots.ts manifest.ts rss.xml/ opengraph-image.tsx icon.svg
  template.tsx            Transition animée entre les pages
components/
  layout/                 Header, méga-menu, menu mobile, recherche ⌘K, footer, interrupteur d'animations
  sections/               Blocs de l'accueil et des univers, formulaires
  article/                Rendu des blocs, sommaire, partage
  news/                   Explorateur d'articles, recherche, favoris, fil en direct, brèves
  shop/                   Cartes produit, visuels SVG, panier (tiroir + page), filtres, ajout au panier
  motion/                 Primitives d'animation (Reveal, Parallax, Marquee, Tilt, Intro…)
  ui/                     Boutons, badges, cartes, images, décors…
  admin/                  Espace édition : connexion, liste, formulaire produit, suppression
data/                     Contenus typés : articles/, universes.ts, media.ts, authors.ts, news-briefs.ts,
                          shop/catalog.json (catalogue, modifié par l'espace édition), shop/licenses.ts
lib/
  content/                Dépôt de contenu + schéma Zod + sources (local, Supabase)
  server/                 Code serveur uniquement : newsletter, mailer, Stripe, limiteur de débit, sessions de l'espace édition, photos
  shop/                   Catalogue (lecture publique), schéma Zod, stockage (store/ : fichier ou Supabase), prix, livraison
  news/                   Sources RSS, analyseur RSS/Atom, récupération mise en cache
  stores/                 Panier, favoris (localStorage) et préférence d'animation
  search.ts validation.ts motion.ts text.ts site.ts hooks.ts
styles/globals.css        Design system complet
types/content.ts shop.ts  Modèles de données partagés
supabase/schema.sql       Tables + politiques RLS
public/images/            Vos images locales
```

## 4. Design system

- **Identité** : YORU (夜, « nuit » en japonais), devise *Collect the night.* Logo : croissant de lune violet `#8B35FF`
  sur disque noir, avec une petite étoile (`components/ui/Logo.tsx`, `app/icon.svg`, image de partage
  `app/opengraph-image.tsx`). Nom, kanji et devise sont centralisés dans `lib/site.ts`.
- **Palette** : rose `#FF2D95`, jaune `#FFE600`, bleu `#3155FF`, cyan `#00E5FF`, violet `#8B35FF`, orange `#FF6B35`,
  noir `#111114`, blanc cassé `#F8F5EF` (+ un vert acide `#C6FF1A` réservé à l'univers Tech). Les associations
  texte/fond ont été choisies pour un contraste suffisant (ex. texte noir sur rose, blanc cassé sur bleu ou violet).
- **Chaque univers a sa couleur et son motif**, appliqués via l'attribut `data-universe` qui redéfinit les variables
  `--u`, `--u-fg`, `--u-2` (utilitaires `bg-u`, `text-u-fg`…) :
  Cinéma = jaune + rayons · Séries = violet + lignes CRT · Anime = rose + lignes de vitesse · Manga = noir + trame
  · Jeux vidéo = cyan + pixels/HUD · Comics = bleu + points Ben-Day · Collectors = orange + holographique · Tech = vert
  acide + grille.
- **Typographies** (auto-hébergées par `next/font`) : *Anton* (titres XXL), *Bricolage Grotesque* (texte),
  *Bangers* (onomatopées et bulles).
- **Motifs 100 % CSS** : `halftone`, `benday`, `tone`, `speedlines`, `rays`, `scanlines`, `pixels`, `grid-tech`,
  `stripes`, `holo`, `film-perf` ; découpes `clip-slant-*`, `clip-burst` ; texte `text-outline`, `text-pop`.
- **Cartes d'articles** en 9 variantes (`components/ui/ArticleCard.tsx`) : standard, affiche de cinéma, case de manga,
  cartouche de jeu, case de comics, carte à collectionner holographique, ligne numérotée, compacte, image pleine.

## 5. Motion design

| Zone              | Animations                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Intro (accueil)   | Rideau de 5 bandes nocturnes, lune et étoiles qui entrent, « YORU » lettre par lettre, devise révélée ; ≈ 2 s, une fois par session, passable au clic / clavier / molette |
| Hero              | Mots qui montent un à un, collage en profondeur (parallaxe au scroll + suivi de la souris), stickers qui « poppent », boutons aimantés |
| Défilement        | Titres mot par mot, images révélées par volet, cartes en cascade, bandeaux dont la vitesse suit le scroll, carrousel horizontal épinglé (« Le top »), compteurs, barre de progression |
| Cartes            | Zoom d'image, titre qui glisse, bordure/ombre à la couleur de l'univers, inclinaison 3D + reflet holographique (collectors) |
| Navigation        | En-tête qui se masque/réapparaît, indicateur actif et survol partagés (`layoutId`), méga-menu en cascade, menu mobile à volets colorés, recherche ⌘K animée, transition entre pages |
| Micro-interactions | Cœur à confettis, notifications, boutons qui s'enfoncent, états de chargement, filtres animés (`layout`)       |

**Performance** : seules `transform` et `opacity` sont animées (plus quelques `clip-path` ponctuels). Les entrées
critiques (intro, hero, titres H1, image principale d'article) sont en **CSS pur** et démarrent au premier rendu, sans
attendre le JavaScript ; Motion est chargé à la demande via `LazyMotion`.

**Accessibilité** : la préférence système `prefers-reduced-motion` est respectée, et un interrupteur « Animations »
(footer et menu mobile) permet de les réduire ou de les réactiver ; le choix est mémorisé.

## 6. Ajouter un article

1. Ouvrez le fichier de l'univers concerné, par exemple `data/articles/cinema.ts`.
2. Ajoutez un objet `Article` :

```ts
{
  slug: "mon-nouvel-article",              // URL : /articles/mon-nouvel-article
  title: "Titre de l'article",
  subtitle: "Chapô affiché sous le titre.",
  excerpt: "Résumé de 160 caractères environ (cartes, SEO).",
  universe: "cinema",                      // cinema | series | anime | manga | jeux-video | comics | collectors | tech
  type: "dossier",                         // actu | critique | dossier | guide | top
  tags: ["IMAX", "salles"],
  cover: "cinema-hall",                    // clé de data/media.ts, ou "/images/fichier.jpg"
  publishedAt: "2026-10-12T09:00:00+02:00",
  author: "ecrans",                        // clé de data/authors.ts
  popularity: 0,
  demo: false,                             // true = affiche le badge « Démo »
  body: [
    { type: "p", text: "Texte avec **gras**, _italique_ et [lien](/univers/cinema)." },
    { type: "h2", id: "premiere-partie", text: "Première partie" },  // alimente le sommaire
    { type: "quote", text: "Une citation.", cite: "Source" },
    { type: "list", items: ["Point 1", "Point 2"] },
    { type: "image", image: "projector-beams", caption: "Légende" },
    { type: "callout", tone: "tip", title: "Astuce", text: "…" },
    // Critiques : { type: "verdict", score: 8, pros: ["…"], cons: ["…"], text: "…" } + rating: 8
  ],
},
```

3. C'est tout : sitemap, RSS, recherche, pages d'univers, articles similaires et navigation précédent/suivant se mettent
   à jour. Le contenu est **validé** (schéma Zod) : slug en double, image inconnue, ancre en double ou lien interne cassé
   bloquent le build avec un message explicite.

### Espace édition de la boutique (`/admin`)

Les produits se gèrent depuis **`/admin`**, un espace protégé par mot de passe, invisible des clients (aucun lien sur le
site, pages `noindex`, sans l'en-tête ni le pied de page publics).

- **Connexion** : mot de passe `ADMIN_PASSWORD` (12 caractères min.) ; session de 12 h dans un cookie `httpOnly`,
  `SameSite=Strict`, signé avec `ADMIN_SESSION_SECRET`. Changer l'une de ces variables déconnecte tout le monde. 5 essais
  par IP et par quart d'heure. Sans ces variables, la page de connexion explique quoi configurer et personne ne peut entrer.
- **Liste** : recherche, filtres (statut, catégorie), tri, compteurs (brouillons, ruptures et stocks faibles), bascule
  rapide **Publier / Masquer**, duplication, lien vers la fiche publique.
- **Fiche produit** : nom, adresse (générée depuis le nom), catégorie, type, licence, personnage, prix TTC en **CHF ou €**
  (conversion affichée), prix barré, disponibilité, stock, date de sortie (précommande), photo, description,
  caractéristiques, mots-clés, badges, mise en avant, mention « démo ». **Aperçu en direct** de la carte boutique,
  avertissement avant de quitter sans enregistrer, raccourci Ctrl/⌘ + S.
- **Soldes** : dans la fiche (« Mettre ce produit en solde ») ou depuis la liste, sur un ou plusieurs produits
  sélectionnés (« Mettre en solde… », « Retirer le solde »). Remise en % (arrondie aux 5 centimes en CHF) ou prix soldé,
  avec début et fin facultatifs à l'heure de Suisse et de France. Le prix normal est conservé et revient seul à la fin.
  Côté client : prix soldé, prix barré, pastille « −20 % », date de fin sur la fiche, filtre « En solde » ; le panier, la
  recherche et le paiement utilisent le même prix. Un solde qui commence ou se termine est pris en compte à la minute
  dans le navigateur, sans régénérer les pages (calcul partagé : `lib/shop/pricing.ts`).
- **Brouillon / En boutique** : un brouillon n'apparaît nulle part côté client (fiche en 404, absent des listes, de la
  recherche, du plan du site et du panier) ; il ne peut pas être payé.
- **Photos** : JPEG, PNG, WebP ou AVIF jusqu'à 12 Mo. Le serveur les redresse, retire les métadonnées (GPS…), les réduit à
  1 600 px et les convertit en WebP ; option **« Retirer le fond blanc »** (le blanc relié aux bords devient transparent,
  le blanc à l'intérieur du produit est conservé). Les SVG et autres formats sont refusés.
- **Sécurité** : chaque page, action et envoi de photo revérifie la session (`lib/server/admin-auth.ts`), `proxy.ts` ne
  fait qu'une redirection anticipée ; toutes les saisies sont validées par le même schéma Zod (`lib/shop/schema.ts`).
  Deux personnes qui modifient la même fiche ne s'écrasent pas : la seconde est prévenue et doit recharger.
- Après chaque modification, les pages publiques sont régénérées (`revalidatePath`) : le changement est visible tout
  de suite, sans nouveau build (vérifié en production locale avec `next start`).

**Adresse dédiée (facultatif)** : avec `ADMIN_HOST=admin.votre-domaine.fr` (et ce sous-domaine pointé vers le même
hébergement), l'espace édition n'est joignable que sur cette adresse : `admin.votre-domaine.fr` mène directement aux
produits, et `/admin` renvoie une page introuvable sur le site public. Même code, mêmes données : rien à synchroniser.

**Où sont stockés les produits ?** (`PRODUCTS_SOURCE`)

| Mode | Données | Photos envoyées | Pour qui |
| --- | --- | --- | --- |
| `file` (défaut) | `data/shop/catalog.json` (copie de sécurité : `catalog.backup.json`) | `data/shop/uploads/`, servies par `/media/shop/…` | Développement, serveur Node avec disque persistant (VPS, Docker avec volume) |
| `supabase` | Table `products` (`supabase/schema.sql`) | Bucket public Supabase Storage | Hébergement serverless (**Vercel** : disque en lecture seule) |

En mode fichier sur un hébergement en lecture seule, l'espace édition l'indique clairement et bloque l'enregistrement.
Pour passer à Supabase : exécutez `supabase/schema.sql`, créez le bucket public `products`, renseignez `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY` et `PRODUCTS_SOURCE=supabase`, puis copiez le catalogue actuel avec `npm run catalog:push`.
L'adaptateur Supabase n'a pas encore été testé contre un projet réel.

**Ce que l'espace édition ne fait pas (encore)** : créer une nouvelle licence (ajoutez-la dans `data/shop/licenses.ts` :
nom, rappel factuel, couleurs), gérer plusieurs comptes ou un historique des modifications, supprimer les photos qui ne
servent plus (elles restent dans le stockage). Paramètres commerciaux (frais de port, seuil de gratuité, quantité max.,
pays livrés) : `lib/shop/config.ts`.

**Produits réels** : décochez « Produit de démonstration » pour qu'un produit soit vendable avec une clé Stripe réelle,
indexable et doté de données structurées Product. Trois fiches utilisent des visuels éditeurs (booster One Piece OP-17,
booster Pokémon 30th Celebration, lot de 6 boosters Pokémon 30e anniversaire ; stocks encore fictifs) : vérifiez que vous
disposez du droit de les utiliser (en général via votre distributeur). Sans photo, une illustration SVG est générée
(`components/shop/ProductVisual.tsx`).

### Prix en euros et en francs suisses

- Chaque produit a un **prix de référence** (`price`, en centimes) dans une devise (`currency: "EUR"` par défaut, ou
  `"CHF"`). L'autre devise est calculée au **taux de référence de la BCE** (relu toutes les 6 heures, taux de secours daté
  si la BCE ne répond pas) : arrondi au centime pour l'euro, aux 5 centimes pour le franc suisse.
- Exemple : booster à 6,95 CHF → 7,46 € au taux du 9 octobre 2026 (1 € = 0,9313 CHF).
- Le visiteur choisit la devise avec le sélecteur **€ / CHF** (en-tête sur grand écran, menu mobile, boutique, fiche produit,
  panier). Le choix est mémorisé ; par défaut, CHF pour les visiteurs en Suisse, EUR sinon. Les deux montants sont dans le
  HTML et le CSS n'affiche que la devise choisie : le changement est instantané, sans rechargement.
- Le paiement Stripe est créé dans la devise choisie, avec le même calcul côté serveur.
- Frais de port et seuil de livraison offerte sont définis séparément par devise dans `lib/shop/config.ts`
  (actuellement 4,90 € / 49 € et 5,90 CHF / 50 CHF, valeurs à adapter).

### Ajouter une brève ou une source d'actualités

- **Brève** : ajoutez un objet dans `data/news-briefs.ts`, rédigé avec vos propres mots, avec au moins une source et la
  date de vérification (`verifiedAt`). Les brèves anciennes peuvent être retirées.
- **Source du fil** : ajoutez un flux RSS/Atom public dans `lib/news/feeds.ts` (nom, URL, langue, univers). Les flux sont
  relus toutes les 30 minutes (`NEWS_REVALIDATE`) ; une source en panne est signalée sans bloquer les autres. Seuls le titre,
  le lien, la date et le nom de la source sont affichés.

**Ajouter une image** : ajoutez une ligne dans `data/media.ts` (clé, URL, dimensions, couleur dominante, photographe,
texte alternatif), ou déposez le fichier dans `public/images/`. Pour un autre domaine d'images distant, ajoutez-le à
`images.remotePatterns` dans `next.config.ts` et à `img-src` dans la CSP.

## 7. Variables d'environnement

Copiez `.env.example` en `.env.local`. Toutes sont facultatives.

| Variable                                         | Usage                                                     |
| ------------------------------------------------ | --------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                           | URL publique (canonical, sitemap, Open Graph, RSS)        |
| `BREVO_API_KEY`, `BREVO_LIST_ID`                 | Active l'inscription newsletter                           |
| `BREVO_DOI_TEMPLATE_ID`, `BREVO_DOI_REDIRECT_URL` | Active le double opt-in (recommandé)                      |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Active l'envoi du formulaire de contact          |
| `STRIPE_SECRET_KEY`                              | Active le paiement (Stripe Checkout)                      |
| `STRIPE_WEBHOOK_SECRET`                          | Vérifie les webhooks Stripe (`/api/stripe/webhook`)       |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`         | Ouvre l'espace édition `/admin` (voir §6)                 |
| `ADMIN_HOST`                                     | Adresse dédiée facultative de l'espace édition             |
| `PRODUCTS_SOURCE`                                | Catalogue : `file` (défaut) ou `supabase`                 |
| `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PRODUCTS_BUCKET` | Requis si `PRODUCTS_SOURCE=supabase` (serveur uniquement) |
| `CONTENT_SOURCE`                                 | `local` (défaut) ou `supabase`                            |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`              | Requis si `CONTENT_SOURCE=supabase`                       |

Les clés ne sont lues que côté serveur (`lib/server/*`, préfixe `NEXT_PUBLIC_` réservé à l'URL du site) : aucune n'est
envoyée au navigateur.

### Newsletter (Brevo)
1. Créez une liste de contacts dans Brevo et notez son identifiant numérique.
2. Créez une clé API (Paramètres → SMTP & API).
3. Pour le double opt-in : créez un modèle d'e-mail de confirmation (DOI) et renseignez son ID et l'URL de redirection.
4. Sans ces variables, le formulaire affiche : *« La newsletter n'est pas encore ouverte… Votre adresse n'a pas été
   enregistrée. »* (HTTP 503) — rien n'est simulé.

### Formulaire de contact (Resend)
1. Vérifiez votre domaine d'envoi dans Resend et créez une clé API.
2. Renseignez `CONTACT_FROM_EMAIL` (expéditeur vérifié) et `CONTACT_TO_EMAIL` (boîte de la rédaction).
3. Sans configuration, la page Contact le signale et l'API répond honnêtement que le message n'a pas été envoyé.

### Paiement (Stripe)
1. Créez un compte Stripe et récupérez une clé secrète de **test** (`sk_test_…`) dans Développeurs → Clés API.
2. Renseignez `STRIPE_SECRET_KEY` : le bouton « Passer au paiement » crée alors une session Stripe Checkout (cartes de test
   Stripe, par ex. 4242 4242 4242 4242). Le serveur recalcule prix, stocks et frais de port depuis le catalogue ; il ignore
   tout montant envoyé par le navigateur.
3. Déclarez le webhook `https://votre-domaine/api/stripe/webhook` (événement `checkout.session.completed`) et renseignez
   `STRIPE_WEBHOOK_SECRET`. La signature est vérifiée ; branchez ensuite l'enregistrement des commandes, le décrément de stock
   et l'e-mail de confirmation à l'endroit indiqué dans `app/api/stripe/webhook/route.ts`.
4. **Sécurité** : les produits `demo: true` sont refusés avec une clé `sk_live_`. Sans clé, le site affiche « Le paiement en
   ligne n'est pas encore activé : aucune commande n'a été créée et aucun montant n'a été débité » (HTTP 503).
5. La page `/boutique/merci` interroge Stripe pour afficher le vrai statut du paiement (jamais déduit de l'URL).

### Base de données (Supabase, optionnel)
1. Créez un projet Supabase, ouvrez l'éditeur SQL et exécutez `supabase/schema.sql` (table `articles` + RLS : lecture
   publique des seuls articles `published`, aucune écriture possible avec la clé publique).
2. Insérez vos articles (le champ `body` reçoit le tableau de blocs JSON décrit au §6).
3. Définissez `CONTENT_SOURCE=supabase`, `SUPABASE_URL` et `SUPABASE_ANON_KEY`. Les données sont relues toutes les
   5 minutes (`revalidate: 300`) et validées par le même schéma Zod.
4. Pour un autre CMS : implémentez `ContentSource` (`lib/content/sources/types.ts`) et branchez-le dans
   `lib/content/index.ts`.

## 8. Déploiement

**GitHub Pages** (version vitrine, en ligne) : https://ilulsy.github.io/yoru/
- Publiée depuis la branche `gh-pages`. Pour la mettre à jour après des modifications : `npm run publier` (le projet
  est copié dans un dossier temporaire, préparé, exporté en HTML puis envoyé ; votre dossier n'est pas modifié). Le site
  est à jour 1 à 2 minutes plus tard.
- GitHub Pages ne sert que des fichiers : `deploy/github-pages/prepare.mjs` retire, dans la copie seulement, l'espace
  édition, les API et le retour de paiement, puis le site est exporté (`STATIC_EXPORT=1`, préfixe `/yoru`). La recherche
  se fait dans le navigateur (`/search-index.json`) ; formulaires de contact et newsletter et paiement affichent un
  message « indisponible sur cette version » (`lib/static-site.ts`). Pas d'en-têtes de sécurité HTTP (non
  configurables sur GitHub Pages).
- Le fil d'actualités et le taux de change sont ceux du moment de la publication. Pour une mise à jour automatique (à
  chaque envoi et toutes les 3 heures), activez le modèle `deploy/github-pages/workflow.yml` (instructions en tête du
  fichier) : GitHub demande pour cela une autorisation supplémentaire (« workflow »).
- **Espace édition en ligne** : https://ilulsy.github.io/yoru/admin/ (mêmes écrans que la version complète). Le site étant
  statique, chaque enregistrement est un commit dans le dépôt (`data/shop/catalog.json`, photos dans
  `data/shop/uploads/`), fait depuis le navigateur avec une **clé GitHub personnelle** limitée au dépôt (permission
  *Contents : Read and write*, et *Actions : Read-only* pour suivre les publications). À la première connexion, la clé est
  vérifiée puis chiffrée dans le navigateur avec un mot de passe (PBKDF2 + AES-GCM, `lib/admin/vault.ts`) : ensuite, seul
  le mot de passe est demandé. La vraie protection est la clé : sans elle, personne ne peut écrire dans le dépôt. Photos
  préparées dans le navigateur (`lib/admin/image-client.ts`). Code : `lib/admin/github-backend.ts`,
  `components/admin/static/`. Le site public est reconstruit par GitHub Actions après chaque enregistrement.
- Espace édition **en local** (`npm run dev` puis `/admin`) : toujours disponible ; ses modifications partent en ligne avec
  un envoi sur GitHub.
- Un nom de domaine peut être branché dans Settings → Pages (pensez alors à adapter `PAGES_BASE_PATH`).

**Vercel** (relié au dépôt GitHub) :
1. Sur vercel.com, connectez-vous avec GitHub, « Add New… → Project », importez `ILULSY/yoru`, puis « Deploy » (aucun
   réglage requis : Next.js est détecté).
2. Chaque envoi sur la branche `main` met le site à jour ; les autres branches obtiennent une adresse d'aperçu.
3. Variables (Project → Settings → Environment Variables), puis « Redeploy » : `ADMIN_PASSWORD` et
   `ADMIN_SESSION_SECRET` pour l'espace édition, `NEXT_PUBLIC_SITE_URL` une fois votre nom de domaine branché (sinon
   l'adresse `*.vercel.app` du projet est utilisée), puis les clés Stripe, Brevo, Resend au besoin.
4. Le disque de Vercel est en lecture seule : l'espace édition s'affiche mais signale qu'il ne peut pas enregistrer tant
   que le stockage Supabase n'est pas activé (`PRODUCTS_SOURCE=supabase`, voir §6).

L'offre gratuite de Vercel (Hobby) est réservée à un usage personnel et non commercial : pour vendre réellement, passez
à l'offre Pro ou à un autre hébergeur. Le build génère
toutes les pages statiques ; `/recherche` et les routes `/api/*` sont rendues à la demande.

**Serveur Node** : `npm ci && npm run build && npm run start` (port 3000 par défaut, `PORT` pour le changer), derrière un
proxy HTTPS. Le catalogue (`data/shop/catalog.json`) et les photos envoyées (`data/shop/uploads/`) vivent alors sur
le disque du serveur : sauvegardez-les, et ne les écrasez pas en redéployant une ancienne version du dépôt.

Avant la mise en ligne :
- renseigner `NEXT_PUBLIC_SITE_URL` ;
- compléter les pages **Mentions légales** et **Confidentialité** (champs entre crochets) et les faire valider ;
- remplacer les articles de démonstration et les signatures de pôles par vos contenus et auteurs réels ;
- renseigner les réseaux sociaux dans `lib/site.ts` (seuls ceux renseignés s'affichent) ;
- boutique : remplacer le catalogue de démonstration par des **produits officiels** achetés auprès de distributeurs agréés
  (vente de produits sous licence), compléter les **CGV** (médiateur de la consommation obligatoire, rétractation, retours) ;
- stock : en production, le stock doit venir de votre outil de gestion et être décrémenté à chaque commande (webhook) ;
- en hébergement serverless multi-instances, remplacer le limiteur de débit en mémoire (`lib/server/rate-limit.ts`) par
  un stockage partagé (Redis/Upstash, Supabase…).

## 9. Sécurité

- Validation serveur de tous les formulaires (Zod), messages d'erreur sans détail technique.
- Anti-abus : pot de miel, délai minimal de remplissage, limitation de débit par IP (recherche, newsletter, contact).
- En-têtes : `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`, et une
  **CSP** en production (images limitées à Unsplash). La CSP autorise `'unsafe-inline'` pour les scripts d'hydratation ;
  pour une CSP stricte à nonce, étendez `proxy.ts` (voir la documentation Next.js).
- Supabase : RLS activé, lecture seule des articles publiés.
- Espace édition : mot de passe hors du code, session signée (cookie `httpOnly`, `SameSite=Strict`, `Secure` en
  production), vérifiée dans chaque action ; limitation des essais de connexion ; envois de photos réservés au site
  lui-même (en-tête `Origin`) et réencodés.
- Aucun cookie ni traceur pour les visiteurs ; favoris et préférences restent dans le navigateur. Seul l'espace
  édition pose un cookie de session.

Ces mesures n'ont pas fait l'objet d'un audit de sécurité indépendant.

## 10. Ce qui fonctionne, ce qui demande une configuration

| Fonctionnalité                                          | État                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| Navigation, 8 univers, pages article, À propos, légal   | ✅ Opérationnel                                               |
| Actualités : filtres univers/format, tri, mots-clés, « charger plus », état vide, URL partageable | ✅ Opérationnel        |
| Recherche (⌘K et page dédiée), tolérance aux accents, suggestions « Vouliez-vous dire » | ✅ Opérationnel            |
| Favoris (localStorage, synchronisés entre onglets)      | ✅ Opérationnel — pas de synchronisation multi-appareils (aucun système de comptes) |
| Partage (natif mobile, copie du lien, réseaux)          | ✅ Opérationnel                                               |
| Sommaire avec suivi de lecture, précédent/suivant, articles similaires | ✅ Opérationnel                               |
| SEO : métadonnées uniques, Open Graph, JSON-LD Article + fil d'Ariane, sitemap, robots, RSS | ✅ Opérationnel      |
| Newsletter                                              | ⚙️ Intégration Brevo prête — **nécessite les clés**           |
| Formulaire de contact                                   | ⚙️ Validation opérationnelle, envoi via Resend — **nécessite les clés** |
| Contenu depuis Supabase                                 | ⚙️ Adaptateur + schéma fournis — **non testé contre un projet réel** |
| Boutique : catalogue, catégories, 8 licences, filtres (catégorie, licence, dispo, budget, tri, mots-clés), fiches, panier (tiroir + page, localStorage), livraison offerte dès 49 € | ✅ Opérationnel — catalogue **de démonstration** |
| Paiement Stripe Checkout + page de confirmation + webhook signé | ⚙️ Intégration prête — **nécessite les clés Stripe**, non testée contre Stripe réel |
| Gestion des commandes et du stock après paiement        | ⚙️ À brancher (point d'intégration dans le webhook)            |
| News : 12 brèves réelles vérifiées + fil RSS en direct de 11 médias (ISR 30 min), filtres univers/langue | ✅ Opérationnel |
| Recherche étendue aux produits de la boutique           | ✅ Opérationnel                                               |
| Espace édition `/admin` : connexion, ajout, modification, duplication, brouillon/publication, soldes (un ou plusieurs produits, dates de début et de fin), suppression, photos (fond blanc retiré sur demande) | ✅ Opérationnel en stockage fichier — **nécessite `ADMIN_PASSWORD` et `ADMIN_SESSION_SECRET`** |
| Espace édition avec Supabase (serverless)               | ⚙️ Adaptateur, schéma et import fournis — **non testé contre un projet réel** |

## 11. Vérifications effectuées

- `tsc --noEmit` : 0 erreur · `eslint .` : 0 problème · `next build` : succès (112 pages générées).
- Boutique testée dans le navigateur : filtres de licence et de disponibilité (URL), état vide, ajout au panier, tiroir
  (quantités, progression vers la livraison offerte, total), passage au paiement → message « non configuré » honnête.
- API de paiement testée : panier valide (503 non configuré), rupture, produit inconnu, quantité > stock, panier vide,
  quantité invalide ; webhook sans secret (503).
- Page News : 11 sources joignables le 10/10/2026, titres datés et triés ; brèves vérifiées dans leurs sources.
- Toutes les routes testées (200, et 404 pour les URL inexistantes).
- API testées : validation, pot de miel, envoi trop rapide, JSON invalide, limite de débit (429), « non configuré » (503).
- Absence de débordement horizontal vérifiée automatiquement sur 16 pages à 375 px, et sur les pages principales à
  768, 1440 et 1920 px.
- Interactions testées dans le navigateur : filtres/tri/URL des actualités, état vide, favoris (stockage, compteur de
  l'en-tête, notification), formulaire de contact (erreurs, focus, réponse serveur), ouverture du menu mobile.
- Revue visuelle (captures) de toutes les sections de l'accueil à 1024 px de large.

- Revue visuelle (captures) de la boutique (accueil, catégorie, fiche produit, tiroir panier, mobile 375 px), de la page News
  des nouveaux blocs de l'accueil, d'une page univers (Manga) et d'une page article.

**Non effectué** : revue visuelle par captures des pages recherche et favoris et des autres univers (seuls des contrôles
automatiques de mise en page ont été faits) ; paiement réel avec des clés Stripe ; mesures Lighthouse / Core Web Vitals réelles ; tests
sur appareils physiques ; audit d'accessibilité avec lecteur d'écran ; audit de sécurité ; tests avec de vraies clés
Brevo / Resend / Supabase. Aucun score n'est donc annoncé.

## 12. Crédits

Photos : [Unsplash](https://unsplash.com/?utm_source=yoru&utm_medium=referral), licence Unsplash ; chaque photographe
est crédité sous son image. Ces photos ne sont pas des visuels officiels des œuvres, marques ou personnages qu'elles
peuvent montrer. Logo, motifs et mise en page : créations originales YORU.
