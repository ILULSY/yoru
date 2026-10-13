import type { Metadata } from "next";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getStore } from "@/lib/shop/store";
import { Dashboard } from "@/components/admin/Dashboard";

export const metadata: Metadata = { title: "Produits" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminProductsPage({ searchParams }: Props) {
  await requireAdmin();
  const [params, { products, problems }] = await Promise.all([searchParams, getStore().readFresh()]);
  return <Dashboard products={products} problems={problems} params={params} />;
}
