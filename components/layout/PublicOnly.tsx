"use client";

import { usePathname } from "next/navigation";

/** Masque l'habillage public (en-tête, pied de page, panier) dans l'espace édition. */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
