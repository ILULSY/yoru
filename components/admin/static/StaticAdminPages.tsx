"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStaticCatalog } from "@/components/admin/static/StaticAdminShell";
import { useAdminBackend } from "@/components/admin/backend";
import { Dashboard } from "@/components/admin/Dashboard";
import { ProductForm } from "@/components/admin/ProductForm";
import { DeleteProduct } from "@/components/admin/DeleteProduct";
import { emptyDraft, productToDraft, today } from "@/lib/shop/draft";

/** Liste des produits (version en ligne). */
export function StaticAdminHome() {
  const { products, problems } = useStaticCatalog();
  const params = Object.fromEntries(useSearchParams().entries());
  return <Dashboard products={products} problems={problems} params={params} />;
}

/** Création (?depuis=… pour dupliquer) ou modification (?slug=…) d'un produit (version en ligne). */
export function StaticAdminProduct() {
  const { products } = useStaticCatalog();
  const backend = useAdminBackend();
  const params = useSearchParams();
  const slug = params.get("slug");
  const types = [...new Set(products.map((p) => p.type))].sort((a, b) => a.localeCompare(b, "fr"));

  if (slug) {
    const product = products.find((p) => p.slug === slug);
    if (!product) {
      return (
        <p className="font-semibold">
          Ce produit n&apos;existe pas (ou plus).{" "}
          <Link href={backend.listHref} className="underline">
            Retour aux produits
          </Link>
        </p>
      );
    }
    return (
      <>
        <ProductForm
          key={product.updatedAt}
          mode="edit"
          initial={productToDraft(product)}
          previousSlug={product.slug}
          expectedUpdatedAt={product.updatedAt}
          typeSuggestions={types}
        />
        <DeleteProduct slug={product.slug} name={product.name} />
      </>
    );
  }

  const source = products.find((p) => p.slug === params.get("depuis"));
  const initial = source
    ? { ...productToDraft(source), slug: `${source.slug}-copie`.slice(0, 80), name: `${source.name} (copie)`, status: "draft" as const, addedAt: today() }
    : emptyDraft();
  return <ProductForm key={source?.slug ?? "nouveau"} mode="create" initial={initial} typeSuggestions={types} />;
}
