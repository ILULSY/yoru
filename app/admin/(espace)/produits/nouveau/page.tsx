import type { Metadata } from "next";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getStore } from "@/lib/shop/store";
import { emptyDraft, productToDraft, today } from "@/lib/shop/draft";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Nouveau produit" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function NewProductPage({ searchParams }: Props) {
  await requireAdmin();
  const { depuis } = await searchParams;
  const store = getStore();
  const [{ products }, health] = await Promise.all([store.readFresh(), store.health()]);

  // « Dupliquer » : on repart d'une fiche existante, en brouillon et avec une nouvelle adresse.
  const source = typeof depuis === "string" ? products.find((p) => p.slug === depuis) : undefined;
  const initial = source
    ? { ...productToDraft(source), slug: `${source.slug}-copie`.slice(0, 80), name: `${source.name} (copie)`, status: "draft" as const, addedAt: today() }
    : emptyDraft();

  return (
    <ProductForm
      mode="create"
      initial={initial}
      typeSuggestions={[...new Set(products.map((p) => p.type))].sort((a, b) => a.localeCompare(b, "fr"))}
      readOnly={!health.writable}
    />
  );
}
