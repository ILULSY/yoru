import "server-only";
import type { Product } from "@/types/shop";
import { validateCatalog } from "@/lib/shop/schema";
import { StoreError, type CatalogSnapshot, type ProductStore } from "@/lib/shop/store/types";

/**
 * Catalogue dans Supabase (table `products`, photos dans Supabase Storage).
 * Pour les hébergements serverless. Schéma : supabase/schema.sql.
 *
 * La clé `SUPABASE_SERVICE_ROLE_KEY` contourne les règles RLS : elle reste
 * côté serveur (jamais de préfixe NEXT_PUBLIC_).
 */

export const PRODUCTS_TAG = "products";

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_PRODUCTS_BUCKET || "products";
  return url && key ? { url, key, bucket } : null;
}

function need() {
  const c = config();
  if (!c) {
    throw new StoreError("Supabase n'est pas configuré : renseignez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.", "unavailable");
  }
  return c;
}

function headers(key: string, extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: key,
    // Les anciennes clés (JWT) passent aussi en Authorization ; les nouvelles (sb_secret_…) seulement en apikey.
    ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
    ...extra,
  };
}

async function call(path: string, init: RequestInit & { next?: { tags?: string[]; revalidate?: number } } = {}) {
  const { url, key } = need();
  const res = await fetch(`${url}${path}`, {
    ...init,
    headers: headers(key, { "content-type": "application/json", ...(init.headers as Record<string, string> | undefined) }),
  });
  if (res.status === 409) throw new StoreError("Un produit utilise déjà cette adresse.", "exists");
  if (!res.ok) {
    console.error("[catalogue supabase]", res.status, (await res.text()).slice(0, 300));
    throw new StoreError("Supabase a refusé la demande. Vérifiez la table « products » et la clé de service.", "unavailable");
  }
  return res;
}

async function fetchAll(init: Parameters<typeof call>[1]): Promise<CatalogSnapshot> {
  const res = await call("/rest/v1/products?select=data&order=slug.asc", init);
  const rows = (await res.json()) as { data: unknown }[];
  const snap = validateCatalog(rows.map((r) => r.data));
  if (snap.problems.length) console.error(`[catalogue] fiches ignorées :\n${snap.problems.join("\n")}`);
  return snap;
}

async function currentRow(slug: string): Promise<{ data: Product } | null> {
  const res = await call(`/rest/v1/products?select=data&slug=eq.${encodeURIComponent(slug)}`, { cache: "no-store" });
  const rows = (await res.json()) as { data: Product }[];
  return rows[0] ?? null;
}

const row = (p: Product) => ({ slug: p.slug, status: p.status, data: p, updated_at: p.updatedAt });

export const supabaseStore: ProductStore = {
  kind: "supabase",
  label: "Supabase (table products)",
  read: () => fetchAll({ next: { tags: [PRODUCTS_TAG], revalidate: 3600 } }),
  readFresh: () => fetchAll({ cache: "no-store" }),

  async save(product, { previousSlug, expectedUpdatedAt }) {
    if (previousSlug) {
      const current = await currentRow(previousSlug);
      if (!current) throw new StoreError("Ce produit n'existe plus : il a peut-être été supprimé entre-temps.", "not_found");
      if (expectedUpdatedAt && current.data.updatedAt !== expectedUpdatedAt) {
        throw new StoreError(
          "Ce produit a été modifié entre-temps (dans un autre onglet ?). Rechargez la page pour repartir de la dernière version.",
          "conflict",
        );
      }
      if (product.slug === previousSlug) {
        await call(`/rest/v1/products?slug=eq.${encodeURIComponent(previousSlug)}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify(row(product)),
        });
        return;
      }
      // Changement d'adresse : nouvelle ligne puis suppression de l'ancienne.
      await call("/rest/v1/products", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row(product)) });
      await call(`/rest/v1/products?slug=eq.${encodeURIComponent(previousSlug)}`, { method: "DELETE" });
      return;
    }
    await call("/rest/v1/products", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row(product)) });
  },

  async remove(slug) {
    const res = await call(`/rest/v1/products?slug=eq.${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: { Prefer: "return=representation" },
    });
    const deleted = (await res.json()) as unknown[];
    if (!deleted.length) throw new StoreError("Ce produit n'existe plus.", "not_found");
  },

  async saveImage(data, name) {
    const { url, key, bucket } = need();
    const res = await fetch(`${url}/storage/v1/object/${bucket}/${name}`, {
      method: "POST",
      headers: headers(key, { "content-type": "image/webp", "cache-control": "31536000", "x-upsert": "false" }),
      body: new Uint8Array(data),
    });
    if (!res.ok) {
      console.error("[photos supabase]", res.status, (await res.text()).slice(0, 300));
      throw new StoreError(`Envoi refusé par Supabase Storage. Vérifiez que le bucket public « ${bucket} » existe.`, "unavailable");
    }
    return `${url}/storage/v1/object/public/${bucket}/${name}`;
  },

  async health() {
    if (!config()) {
      return {
        writable: false,
        message:
          "PRODUCTS_SOURCE=supabase est activé mais SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manque : les produits ne peuvent être ni lus ni enregistrés.",
      };
    }
    return { writable: true };
  },
};
