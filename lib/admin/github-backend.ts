import type { AdminBackend } from "@/components/admin/backend";
import type { Product } from "@/types/shop";
import { addFile, readCatalog, writeCatalog } from "@/lib/admin/github";
import { prepareImageInBrowser, setPendingImage } from "@/lib/admin/image-client";
import { draftToProduct, slugify, type ProductDraft } from "@/lib/shop/draft";
import { removeProduct, upsertProduct } from "@/lib/shop/catalog-ops";
import { salePriceFromPercent, zurichInputToIso } from "@/lib/shop/pricing";
import { issuesByField, productSchema, SLUG_RE } from "@/lib/shop/schema";
import { StoreError } from "@/lib/shop/store/types";
import { withBase } from "@/lib/static-site";

/**
 * Espace édition de la version en ligne (GitHub Pages) : chaque action lit le
 * catalogue sur GitHub, le modifie puis l'enregistre par un commit. GitHub
 * Actions republie ensuite le site. Mêmes règles de validation que le serveur.
 */

const go = (path: string): Promise<never> => {
  window.location.assign(withBase(path));
  // La page change : on laisse l'action « en cours » jusque-là.
  return new Promise<never>(() => {});
};

const slugsFrom = (formData: FormData): string[] => {
  try {
    const list = JSON.parse(String(formData.get("slugs") ?? "[]")) as unknown;
    return Array.isArray(list) ? [...new Set(list.filter((s): s is string => typeof s === "string" && SLUG_RE.test(s)))] : [];
  } catch {
    return [];
  }
};

const failed = (names: string[]) => (names.length ? `&echecs=${encodeURIComponent(names.join(" · ").slice(0, 400))}` : "");

export function createGithubBackend(token: string): AdminBackend {
  /** Lit le catalogue, applique `change` à la liste brute, puis l'enregistre en un seul commit. */
  async function commit(message: string, change: (list: unknown[]) => void) {
    const { doc, sha } = await readCatalog(token);
    change(doc.products);
    doc.updatedAt = new Date().toISOString();
    await writeCatalog(token, doc, sha, message);
  }

  /** Remplace des fiches existantes (soldes, statut), chacune revalidée. */
  async function updateEach(slugs: string[], message: string, update: (p: Product) => Product) {
    let done = 0;
    const rejected: string[] = [];
    await commit(message, (list) => {
      for (const slug of slugs) {
        const i = list.findIndex((p) => (p as { slug?: string })?.slug === slug);
        const current = i >= 0 ? productSchema.safeParse(list[i]) : null;
        if (!current?.success) {
          if (i >= 0) rejected.push(slug);
          continue;
        }
        const next = productSchema.safeParse({ ...update(current.data as Product), updatedAt: new Date().toISOString() });
        if (!next.success) {
          rejected.push(current.data.name);
          continue;
        }
        list[i] = next.data;
        done++;
      }
    });
    return { done, rejected };
  }

  return {
    kind: "github",
    publishNote: "La boutique en ligne sera à jour dans 2 à 3 minutes (publication automatique par GitHub).",
    listHref: "/admin/",
    editHref: (slug) => `/admin/produit/?slug=${slug}`,
    newHref: (from) => (from ? `/admin/produit/?depuis=${from}` : "/admin/produit/"),

    async save(_prev, formData) {
      let draft: ProductDraft;
      try {
        draft = JSON.parse(String(formData.get("payload") ?? "")) as ProductDraft;
      } catch {
        return { message: "Formulaire illisible : rechargez la page." };
      }
      const previousSlug = String(formData.get("previousSlug") ?? "") || undefined;
      const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "") || undefined;
      const parsed = productSchema.safeParse(draftToProduct(draft, new Date().toISOString()));
      if (!parsed.success) return { message: "Certains champs sont à corriger.", errors: issuesByField(parsed.error) };
      if (parsed.data.slug === "nouveau") {
        return { message: "Certains champs sont à corriger.", errors: { slug: "Cette adresse est réservée : choisissez-en une autre." } };
      }
      const product = parsed.data as Product;
      try {
        await commit(`Boutique : ${previousSlug ? "modification" : "ajout"} de « ${product.name} »`, (list) =>
          upsertProduct(list, product, { previousSlug, expectedUpdatedAt }),
        );
      } catch (e) {
        if (e instanceof StoreError) return e.code === "exists" ? { message: e.message, errors: { slug: e.message } } : { message: e.message };
        console.error("[admin] enregistrement", e);
        return { message: "L'enregistrement a échoué. Aucune modification n'a été faite." };
      }
      return go(`/admin/?ok=${previousSlug ? "modifie" : "cree"}&produit=${product.slug}`);
    },

    async remove(formData) {
      const slug = String(formData.get("slug") ?? "");
      if (!SLUG_RE.test(slug)) return go("/admin/?erreur=suppression");
      let name = slug;
      try {
        await commit(`Boutique : suppression de « ${slug} »`, (list) => {
          name = (list.find((p) => (p as { slug?: string })?.slug === slug) as { name?: string } | undefined)?.name ?? slug;
          removeProduct(list, slug);
        });
      } catch (e) {
        console.error("[admin] suppression", e);
        return go(`/admin/?erreur=suppression&produit=${slug}`);
      }
      return go(`/admin/?ok=supprime&nom=${encodeURIComponent(name)}`);
    },

    async toggleStatus(formData) {
      const slug = String(formData.get("slug") ?? "");
      const result: { status: Product["status"] } = { status: "draft" };
      try {
        const { done } = await updateEach([slug], `Boutique : visibilité de « ${slug} »`, (p) => {
          result.status = p.status === "published" ? "draft" : "published";
          return { ...p, status: result.status };
        });
        if (!done) return go("/admin/?erreur=introuvable");
      } catch (e) {
        console.error("[admin] statut", e);
        return go(`/admin/?erreur=statut&produit=${slug}`);
      }
      return go(`/admin/?ok=${result.status === "published" ? "publie" : "masque"}&produit=${slug}`);
    },

    async applySale(formData) {
      const slugs = slugsFrom(formData);
      const percent = Number(String(formData.get("percent") ?? "").replace(",", "."));
      if (!slugs.length || !(percent >= 1 && percent <= 90)) return go("/admin/?erreur=solde");
      const startsAt = zurichInputToIso(String(formData.get("startsAt") ?? "")) || undefined;
      const endsAt = zurichInputToIso(String(formData.get("endsAt") ?? "")) || undefined;
      if (startsAt && endsAt && Date.parse(endsAt) <= Date.parse(startsAt)) return go("/admin/?erreur=solde-dates");
      try {
        const { done, rejected } = await updateEach(slugs, `Boutique : solde −${percent} % sur ${slugs.length} produit(s)`, (p) => ({
          ...p,
          sale: { price: salePriceFromPercent(p.price, percent, p.currency ?? "EUR"), startsAt, endsAt },
        }));
        return go(`/admin/?ok=solde&n=${done}&remise=${percent}${failed(rejected)}`);
      } catch (e) {
        console.error("[admin] solde", e);
        return go(`/admin/?erreur=statut`);
      }
    },

    async removeSale(formData) {
      const slugs = slugsFrom(formData);
      if (!slugs.length) return go("/admin/?erreur=solde");
      try {
        const { done, rejected } = await updateEach(slugs, `Boutique : fin du solde sur ${slugs.length} produit(s)`, (p) => ({ ...p, sale: undefined }));
        return go(`/admin/?ok=solde-retire&n=${done}${failed(rejected)}`);
      } catch (e) {
        console.error("[admin] solde", e);
        return go(`/admin/?erreur=statut`);
      }
    },

    async upload(file, { slug, removeWhite }) {
      const image = await prepareImageInBrowser(file, removeWhite);
      const random = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b.toString(16).padStart(2, "0")).join("");
      const name = `${slugify(slug).slice(0, 50) || "produit"}-${random}.${image.ext}`;
      try {
        await addFile(token, `data/shop/uploads/${name}`, image.bytes, `Boutique : photo ${name}`);
      } catch (e) {
        throw new Error(e instanceof StoreError ? e.message : "La photo n'a pas pu être envoyée sur GitHub.");
      }
      const src = `/media/shop/${name}`;
      setPendingImage(src, image.previewUrl);
      return { src, width: image.width, height: image.height };
    },
  };
}
