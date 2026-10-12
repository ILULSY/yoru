import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isAdmin, requireAdmin } from "@/lib/server/admin-auth";
import { getStore } from "@/lib/shop/store";
import { productToDraft } from "@/lib/shop/draft";
import { ProductForm } from "@/components/admin/ProductForm";
import { DeleteProduct } from "@/components/admin/DeleteProduct";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!(await isAdmin())) return { title: "Modifier un produit" };
  const product = (await getStore().readFresh()).products.find((p) => p.slug === slug);
  return { title: `Modifier « ${product?.name ?? slug} »` };
}

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();
  const { slug } = await params;
  const store = getStore();
  const [{ products }, health] = await Promise.all([store.readFresh(), store.health()]);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <>
      <ProductForm
        // Nouvelle clé à chaque version : le formulaire repart des données enregistrées.
        key={product.updatedAt}
        mode="edit"
        initial={productToDraft(product)}
        previousSlug={product.slug}
        expectedUpdatedAt={product.updatedAt}
        typeSuggestions={[...new Set(products.map((p) => p.type))].sort((a, b) => a.localeCompare(b, "fr"))}
        readOnly={!health.writable}
      />
      {health.writable && <DeleteProduct slug={product.slug} name={product.name} />}
    </>
  );
}
