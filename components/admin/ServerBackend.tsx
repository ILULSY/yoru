"use client";

import {
  applySaleAction,
  deleteProductAction,
  removeSaleAction,
  saveProductAction,
  toggleStatusAction,
} from "@/app/admin/actions";
import { AdminBackendProvider, type AdminBackend } from "@/components/admin/backend";

/** Version complète : actions serveur et envoi des photos à /api/admin/upload. */
const serverBackend: AdminBackend = {
  kind: "server",
  save: saveProductAction,
  remove: deleteProductAction,
  toggleStatus: toggleStatusAction,
  applySale: applySaleAction,
  removeSale: removeSaleAction,
  async upload(file, { slug, removeWhite }) {
    const body = new FormData();
    body.set("file", file);
    body.set("slug", slug);
    body.set("removeWhite", removeWhite ? "1" : "0");
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await res.json()) as { ok: boolean; message?: string; src?: string; width?: number; height?: number };
    if (!data.ok || !data.src) throw new Error(data.message ?? "Envoi impossible.");
    return { src: data.src, width: data.width!, height: data.height! };
  },
  listHref: "/admin",
  editHref: (slug) => `/admin/produits/${slug}`,
  newHref: (from) => (from ? `/admin/produits/nouveau?depuis=${from}` : "/admin/produits/nouveau"),
};

export function ServerBackend({ children }: { children: React.ReactNode }) {
  return <AdminBackendProvider value={serverBackend}>{children}</AdminBackendProvider>;
}
