import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Espace édition", template: "%s · Espace édition" },
  robots: { index: false, follow: false, nocache: true },
};

/** Espace édition : sans l'en-tête ni le pied de page du site (voir PublicOnly). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-paper-2">{children}</div>;
}
