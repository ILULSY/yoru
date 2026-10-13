// Prépare la version statique du site pour GitHub Pages, AVANT `next build`.
// Le projet complet (espace édition, paiement, formulaires) reste inchangé :
// ce script retire, dans la copie de travail de GitHub Actions uniquement, ce qui
// demande un serveur, et applique les quelques adaptations d'un export statique.
//
// Il modifie le dossier où il s'exécute : il refuse donc de tourner ailleurs que
// sur GitHub Actions, sauf avec --copie (dossier de test jetable).
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
if (process.env.GITHUB_ACTIONS !== "true" && !process.argv.includes("--copie")) {
  console.error("Ce script supprime l'espace édition et les API du dossier courant : il ne s'exécute que sur GitHub Actions.");
  console.error("Pour un essai local, lancez-le dans une copie jetable du projet avec --copie.");
  process.exit(1);
}

// 1. Ce qui demande un serveur : pages de l'espace édition (remplacées par la version en ligne), API,
//    photos envoyées, retour de paiement, proxy. app/admin/actions.ts reste (aucune page ne l'importe).
const REMOVE = ["app/admin/(espace)", "app/admin/connexion", "app/admin/layout.tsx", "app/api", "app/media", "app/boutique/merci", "proxy.ts"];
for (const rel of REMOVE) {
  rmSync(path.join(root, rel), { recursive: true, force: true });
  console.log(`retiré   ${rel}`);
}

// 2. Fichiers remplacés par leur version statique.
const overrides = path.join(root, "deploy/github-pages/overrides");
cpSync(overrides, root, { recursive: true });
console.log("remplacé app/recherche (recherche dans le navigateur) et app/admin (espace édition via GitHub)");

// 3. Réglages de pages : pas de régénération (ISR), uniquement les adresses connues au build.
const PATCHES = [
  ["app/page.tsx", "export const revalidate = 1800;\n", ""],
  ["app/news/page.tsx", "export const revalidate = 1800;\n", ""],
  ["app/boutique/produit/[slug]/page.tsx", "export const revalidate = 900;", "export const dynamicParams = false;"],
  ["app/boutique/licence/[slug]/page.tsx", "export async function generateStaticParams() {", "export const dynamicParams = false;\n\nexport async function generateStaticParams() {"],
  ["app/articles/[slug]/page.tsx", "export async function generateStaticParams() {", "export const dynamicParams = false;\n\nexport async function generateStaticParams() {"],
];
for (const [rel, from, to] of PATCHES) {
  const file = path.join(root, rel);
  const text = readFileSync(file, "utf8");
  if (!text.includes(from)) {
    console.error(`Adaptation impossible : « ${from.trim()} » introuvable dans ${rel}. Mettez à jour deploy/github-pages/prepare.mjs.`);
    process.exit(1);
  }
  writeFileSync(file, text.replace(from, to));
  console.log(`adapté   ${rel}`);
}

// 4. Photos envoyées depuis l'espace édition (stockage fichier) : servies comme fichiers statiques.
const uploads = path.join(root, "data/shop/uploads");
if (existsSync(uploads)) {
  const target = path.join(root, "public/media/shop");
  mkdirSync(target, { recursive: true });
  const files = readdirSync(uploads).filter((f) => /^[a-z0-9-]+\.(webp|png)$/.test(f));
  for (const f of files) cpSync(path.join(uploads, f), path.join(target, f));
  console.log(`copié    ${files.length} photo(s) produit dans public/media/shop`);
}

// 5. GitHub Pages ne doit pas passer le site dans Jekyll (dossier _next).
writeFileSync(path.join(root, "public/.nojekyll"), "");
console.log("prêt pour STATIC_EXPORT=1 next build");
