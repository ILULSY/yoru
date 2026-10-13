import type { Metadata } from "next";
import { Suspense } from "react";
import { StaticAdminHome } from "@/components/admin/static/StaticAdminPages";

export const metadata: Metadata = { title: "Produits" };

export default function AdminHomePage() {
  return (
    <Suspense fallback={null}>
      <StaticAdminHome />
    </Suspense>
  );
}
