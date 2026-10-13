import type { Metadata } from "next";
import { StaticAdminShell } from "@/components/admin/static/StaticAdminShell";

/** Espace édition de la version en ligne (remplace app/admin au build GitHub Pages). */
export const metadata: Metadata = {
  title: { default: "Espace édition", template: "%s · Espace édition" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-paper-2">
      <StaticAdminShell>{children}</StaticAdminShell>
    </div>
  );
}
