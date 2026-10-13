import type { Metadata } from "next";
import { Suspense } from "react";
import { StaticAdminProduct } from "@/components/admin/static/StaticAdminPages";

export const metadata: Metadata = { title: "Fiche produit" };

export default function AdminProductPage() {
  return (
    <Suspense fallback={null}>
      <StaticAdminProduct />
    </Suspense>
  );
}
