import Link from "next/link";
import { ArrowUpRight, Database, LogOut, Plus, TriangleAlert } from "lucide-react";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getStore } from "@/lib/shop/store";
import { logoutAction } from "@/app/admin/actions";
import { LogoMark } from "@/components/ui/Logo";
import { buttonClasses } from "@/components/ui/Button";

/** Habillage des pages protégées de l'espace édition. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const store = getStore();
  const health = await store.health();

  return (
    <>
      <header className="sticky top-0 z-40 border-b-[4px] border-ink bg-ink text-paper">
        <div className="mx-auto flex h-16 max-w-[88rem] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="group flex items-center gap-2.5">
            <LogoMark className="size-9" ring />
            <span className="leading-none">
              <span className="display block text-2xl">Yoru</span>
              <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-violet uppercase">Espace édition</span>
            </span>
          </Link>
          <nav aria-label="Espace édition" className="ml-auto flex items-center gap-2">
            <Link href="/admin/produits/nouveau" className={buttonClasses("yellow", "sm", "hidden sm:inline-flex")}>
              <Plus className="size-4" aria-hidden /> Nouveau produit
            </Link>
            <Link
              href="/boutique"
              target="_blank"
              className="inline-flex h-10 items-center gap-1.5 border-2 border-paper/40 px-3 text-sm font-semibold hover:border-paper"
            >
              Boutique <ArrowUpRight className="size-4" aria-hidden />
              <span className="sr-only">(nouvel onglet)</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-1.5 border-2 border-paper/40 px-3 text-sm font-semibold hover:border-pink hover:bg-pink hover:text-ink"
              >
                <LogOut className="size-4" aria-hidden />
                <span className="hidden sm:inline">Déconnexion</span>
                <span className="sr-only sm:hidden">Déconnexion</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      {!health.writable && (
        <div role="alert" className="border-b-[3px] border-ink bg-pink">
          <p className="mx-auto flex max-w-[88rem] items-start gap-2 px-4 py-3 text-sm font-semibold sm:px-6 lg:px-8">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            Modifications impossibles : {health.message}
          </p>
        </div>
      )}

      <div className="mx-auto max-w-[88rem] px-4 py-8 sm:px-6 lg:px-8">{children}</div>

      <footer className="mx-auto max-w-[88rem] px-4 pb-10 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <Database className="size-3.5" aria-hidden /> Stockage : {store.label}
        </p>
      </footer>
    </>
  );
}
