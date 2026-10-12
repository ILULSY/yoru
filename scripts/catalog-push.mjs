// Copie le catalogue local (data/shop/catalog.json) dans la table Supabase « products ».
// Usage : npm run catalog:push   (lit SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local)
// Les fiches déjà présentes avec la même adresse sont remplacées ; les autres ne sont pas touchées.
// Les photos envoyées depuis l'espace édition en mode fichier (/media/shop/…) ne sont pas copiées :
// renvoyez-les depuis l'espace édition une fois Supabase activé.
import { readFile } from "node:fs/promises";

const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis (.env.local).");
  process.exit(1);
}

const { products } = JSON.parse(await readFile(new URL("../data/shop/catalog.json", import.meta.url), "utf8"));
const rows = products.map((p) => ({ slug: p.slug, status: p.status, data: p, updated_at: p.updatedAt }));

const res = await fetch(`${url}/rest/v1/products?on_conflict=slug`, {
  method: "POST",
  headers: {
    apikey: key,
    ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
    "content-type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  },
  body: JSON.stringify(rows),
});

if (!res.ok) {
  console.error(`Échec (${res.status}) :`, await res.text());
  process.exit(1);
}
const local = products.filter((p) => p.image?.src?.startsWith("/media/")).length;
console.log(`${rows.length} produits envoyés dans Supabase.`);
if (local) console.log(`${local} photo(s) stockée(s) localement (/media/shop) : renvoyez-les depuis l'espace édition.`);
