"use server";

import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { closeSession, isAdmin, openSession, requireAdmin } from "@/lib/server/admin-auth";
import { adminConfigured, passwordMatches } from "@/lib/server/admin-session";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";
import { draftToProduct, type ProductDraft } from "@/lib/shop/draft";
import { issuesByField, productSchema, SLUG_RE } from "@/lib/shop/schema";
import { getStore, PRODUCTS_TAG, StoreError } from "@/lib/shop/store";
import { salePriceFromPercent, zurichInputToIso } from "@/lib/shop/pricing";
import type { Product } from "@/types/shop";

/* ── Connexion ─────────────────────────────────────────────────── */

export type { LoginState, SaveState } from "@/lib/admin/types";
import type { LoginState, SaveState } from "@/lib/admin/types";

function safeNext(value: FormDataEntryValue | null): string {
  const s = typeof value === "string" ? value : "";
  return /^\/admin(\/[a-z0-9/_-]*)?(\?[\w=&%.-]*)?$/i.test(s) ? s : "/admin";
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "L'espace édition n'est pas configuré (voir les instructions ci-dessus)." };

  const ip = clientIp(await headers());
  const perIp = rateLimit(`admin-login:${ip}`, 5, 15 * 60_000);
  const global = rateLimit("admin-login:*", 30, 15 * 60_000);
  if (!perIp.ok || !global.ok) {
    const wait = Math.ceil(Math.max(perIp.retryAfter, global.retryAfter) / 60);
    return { error: `Trop de tentatives. Réessayez dans ${wait} min.` };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !passwordMatches(password)) {
    // Ralentit les essais en série.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Mot de passe incorrect." };
  }

  await openSession();
  redirect(safeNext(formData.get("suite")));
}

export async function logoutAction() {
  await closeSession();
  redirect("/admin/connexion");
}

/* ── Produits ──────────────────────────────────────────────────── */


/** Toutes les pages publiques affichent des produits (accueil, boutique, recherche, panier du layout). */
function refreshShop() {
  revalidatePath("/", "layout");
  if (getStore().kind === "supabase") updateTag(PRODUCTS_TAG);
}

export async function saveProductAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();

  let draft: ProductDraft;
  try {
    draft = JSON.parse(String(formData.get("payload") ?? "")) as ProductDraft;
  } catch {
    return { message: "Formulaire illisible : rechargez la page." };
  }
  const previousSlug = String(formData.get("previousSlug") ?? "") || undefined;
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "") || undefined;
  if (previousSlug && !SLUG_RE.test(previousSlug)) return { message: "Produit d'origine invalide." };

  const parsed = productSchema.safeParse(draftToProduct(draft, new Date().toISOString()));
  if (!parsed.success) {
    return { message: "Certains champs sont à corriger.", errors: issuesByField(parsed.error) };
  }
  // « nouveau » est réservé à la page de création de l'espace édition.
  if (parsed.data.slug === "nouveau") {
    return { message: "Certains champs sont à corriger.", errors: { slug: "Cette adresse est réservée : choisissez-en une autre." } };
  }

  const store = getStore();
  const health = await store.health();
  if (!health.writable) return { message: health.message ?? "Le stockage est indisponible." };

  try {
    await store.save(parsed.data, { previousSlug, expectedUpdatedAt });
  } catch (e) {
    if (e instanceof StoreError) {
      return e.code === "exists" ? { message: e.message, errors: { slug: e.message } } : { message: e.message };
    }
    console.error("[admin] enregistrement", e);
    return { message: "L'enregistrement a échoué. Aucune modification n'a été faite." };
  }

  refreshShop();
  redirect(`/admin?ok=${previousSlug ? "modifie" : "cree"}&produit=${parsed.data.slug}`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  if (!SLUG_RE.test(slug)) redirect("/admin?erreur=suppression");

  const store = getStore();
  const name = (await store.readFresh()).products.find((p) => p.slug === slug)?.name ?? slug;
  try {
    await store.remove(slug);
  } catch (e) {
    console.error("[admin] suppression", e);
    redirect(`/admin?erreur=suppression&produit=${slug}`);
  }
  refreshShop();
  redirect(`/admin?ok=supprime&nom=${encodeURIComponent(name)}`);
}

/** Bascule rapide brouillon ⇄ publié depuis la liste. */
export async function toggleStatusAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/connexion");
  const slug = String(formData.get("slug") ?? "");
  const store = getStore();
  const product = (await store.readFresh()).products.find((p) => p.slug === slug);
  if (!product) redirect("/admin?erreur=introuvable");

  const next: Product = { ...product, status: product.status === "published" ? "draft" : "published", updatedAt: new Date().toISOString() };
  try {
    await store.save(next, { previousSlug: slug, expectedUpdatedAt: product.updatedAt });
  } catch (e) {
    console.error("[admin] statut", e);
    redirect(`/admin?erreur=statut&produit=${slug}`);
  }
  refreshShop();
  redirect(`/admin?ok=${next.status === "published" ? "publie" : "masque"}&produit=${slug}`);
}

/* ── Soldes (un ou plusieurs produits) ─────────────────────────── */

function slugsFrom(formData: FormData): string[] {
  try {
    const list = JSON.parse(String(formData.get("slugs") ?? "[]")) as unknown;
    return Array.isArray(list) ? [...new Set(list.filter((s): s is string => typeof s === "string" && SLUG_RE.test(s)))].slice(0, 500) : [];
  } catch {
    return [];
  }
}

/** Applique ou retire un solde sur une sélection ; chaque fiche est revalidée avant d'être enregistrée. */
async function updateSales(slugs: string[], change: (p: Product) => Product["sale"]) {
  const store = getStore();
  if (!(await store.health()).writable) redirect("/admin?erreur=lecture-seule");
  const { products } = await store.readFresh();
  let done = 0;
  const failed: string[] = [];
  for (const slug of slugs) {
    const p = products.find((x) => x.slug === slug);
    if (!p) continue;
    const parsed = productSchema.safeParse({ ...p, sale: change(p), updatedAt: new Date().toISOString() });
    if (!parsed.success) {
      failed.push(p.name);
      continue;
    }
    try {
      await store.save(parsed.data, { previousSlug: slug, expectedUpdatedAt: p.updatedAt });
      done++;
    } catch (e) {
      console.error("[admin] solde", slug, e);
      failed.push(p.name);
    }
  }
  if (done) refreshShop();
  return { done, failed };
}

const failedParam = (failed: string[]) => (failed.length ? `&echecs=${encodeURIComponent(failed.join(" · ").slice(0, 400))}` : "");

export async function applySaleAction(formData: FormData) {
  await requireAdmin();
  const slugs = slugsFrom(formData);
  const percent = Number(String(formData.get("percent") ?? "").replace(",", "."));
  if (!slugs.length || !(percent >= 1 && percent <= 90)) redirect("/admin?erreur=solde");
  const startsAt = zurichInputToIso(String(formData.get("startsAt") ?? "")) || undefined;
  const endsAt = zurichInputToIso(String(formData.get("endsAt") ?? "")) || undefined;
  if (startsAt && endsAt && Date.parse(endsAt) <= Date.parse(startsAt)) redirect("/admin?erreur=solde-dates");

  const { done, failed } = await updateSales(slugs, (p) => ({
    price: salePriceFromPercent(p.price, percent, p.currency ?? "EUR"),
    startsAt,
    endsAt,
  }));
  redirect(`/admin?ok=solde&n=${done}&remise=${percent}${failedParam(failed)}`);
}

export async function removeSaleAction(formData: FormData) {
  await requireAdmin();
  const slugs = slugsFrom(formData);
  if (!slugs.length) redirect("/admin?erreur=solde");
  const { done, failed } = await updateSales(slugs, () => undefined);
  redirect(`/admin?ok=solde-retire&n=${done}${failedParam(failed)}`);
}
