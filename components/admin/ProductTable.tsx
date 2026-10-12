"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Copy, Eye, EyeOff, ExternalLink, PackageOpen, Pencil, Search } from "lucide-react";
import { PRODUCT_CATEGORIES, type Product, type ProductCategory, type ProductStatus } from "@/types/shop";
import { CATEGORY_INFO, licenseOf } from "@/data/shop/licenses";
import { availabilityLabel } from "@/lib/shop/format";
import { formatMoney } from "@/lib/shop/currency";
import { normalize } from "@/lib/text";
import { toggleStatusAction } from "@/app/admin/actions";
import { ProductMedia } from "@/components/shop/ProductMedia";
import { inputClasses } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

type Sort = "updated" | "name" | "stock";

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });

const TONE = { ok: "bg-lime", low: "bg-yellow", pre: "bg-cyan", out: "bg-pink" } as const;

export function StatusChip({ status }: { status: ProductStatus }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1 border-2 border-ink bg-violet px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-paper uppercase">
      <Eye className="size-3" aria-hidden /> En boutique
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 border-2 border-dashed border-ink bg-paper px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase">
      <EyeOff className="size-3" aria-hidden /> Brouillon
    </span>
  );
}

export function ProductTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [sort, setSort] = useState<Sort>("updated");

  const rows = useMemo(() => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    return products
      .filter((p) => status === "all" || p.status === status)
      .filter((p) => category === "all" || p.category === category)
      .filter((p) => {
        if (!tokens.length) return true;
        const hay = normalize(`${p.name} ${p.slug} ${p.type} ${licenseOf(p.license).name} ${p.tags.join(" ")}`);
        return tokens.every((t) => hay.includes(t));
      })
      .sort((a, b) =>
        sort === "name" ? a.name.localeCompare(b.name, "fr") : sort === "stock" ? a.stock - b.stock : b.updatedAt.localeCompare(a.updatedAt),
      );
  }, [products, query, status, category, sort]);

  const select = "h-11 border-[3px] border-ink bg-paper px-3 text-sm font-semibold";

  return (
    <section aria-labelledby="liste-produits" className="mt-10">
      <h2 id="liste-produits" className="sr-only">
        Liste des produits
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-60 flex-1">
          <span className="sr-only">Rechercher un produit</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom, licence, mot-clé…"
            className={cn(inputClasses(), "h-11 pl-10")}
          />
        </label>
        <label>
          <span className="sr-only">Statut</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus | "all")} className={select}>
            <option value="all">Tous les statuts</option>
            <option value="published">En boutique</option>
            <option value="draft">Brouillons</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Catégorie</span>
          <select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory | "all")} className={select}>
            <option value="all">Toutes les catégories</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_INFO[c].name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Trier</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={select}>
            <option value="updated">Derniers modifiés</option>
            <option value="name">Nom (A → Z)</option>
            <option value="stock">Stock (croissant)</option>
          </select>
        </label>
      </div>

      <p className="mt-4 font-mono text-xs text-muted" aria-live="polite">
        {rows.length} produit{rows.length > 1 ? "s" : ""}
      </p>

      {rows.length === 0 ? (
        <div className="mt-4 grid place-items-center gap-3 border-[3px] border-dashed border-ink bg-paper p-12 text-center">
          <PackageOpen className="size-10" aria-hidden />
          <p className="font-bold">{products.length ? "Aucun produit ne correspond à ces filtres." : "Le catalogue est vide."}</p>
          {!products.length && (
            <Link href="/admin/produits/nouveau" className="font-semibold underline">
              Ajouter le premier produit
            </Link>
          )}
        </div>
      ) : (
        <ul className="mt-3 divide-y-[3px] divide-ink border-[3px] border-ink bg-paper">
          {rows.map((p) => {
            const lic = licenseOf(p.license);
            const avail = availabilityLabel(p);
            return (
              <li key={p.slug} className={cn("grid gap-3 p-3 sm:grid-cols-[4.5rem_1fr_auto] sm:items-center", p.status === "draft" && "bg-paper-2/60")}>
                <div className="hidden size-[4.5rem] overflow-hidden border-2 border-ink sm:block">
                  <ProductMedia product={p} sizes="72px" compact idSuffix="admin" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip status={p.status} />
                    {p.demo && (
                      <span className="border-2 border-ink px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase">Démo</span>
                    )}
                    <span className={cn("border-2 border-ink px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase", TONE[avail.tone])}>
                      {p.availability === "preorder" ? "Précommande" : `${avail.tone === "out" ? "Rupture" : "Stock"} · ${p.stock}`}
                    </span>
                  </div>
                  <Link href={`/admin/produits/${p.slug}`} className="mt-1 block truncate font-extrabold hover:underline">
                    {p.name}
                  </Link>
                  <p className="truncate text-sm text-muted">
                    {lic.name} · {CATEGORY_INFO[p.category].short} · {p.type} ·{" "}
                    <strong className="text-ink">{formatMoney(p.price, p.currency ?? "EUR")}</strong> · modifié le{" "}
                    {dateFmt.format(new Date(p.updatedAt))}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Link
                    href={`/admin/produits/${p.slug}`}
                    className="inline-flex h-9 items-center gap-1.5 border-2 border-ink bg-ink px-3 text-sm font-bold text-paper hover:bg-violet"
                  >
                    <Pencil className="size-4" aria-hidden /> Modifier
                  </Link>
                  <form action={toggleStatusAction}>
                    <input type="hidden" name="slug" value={p.slug} />
                    <button
                      type="submit"
                      className="inline-flex h-9 items-center gap-1.5 border-2 border-ink bg-paper px-3 text-sm font-bold hover:bg-yellow"
                    >
                      {p.status === "published" ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                      {p.status === "published" ? "Masquer" : "Publier"}
                      <span className="sr-only"> {p.name}</span>
                    </button>
                  </form>
                  <Link
                    href={`/admin/produits/nouveau?depuis=${p.slug}`}
                    className="grid size-9 place-items-center border-2 border-ink bg-paper hover:bg-yellow"
                    title="Dupliquer"
                  >
                    <Copy className="size-4" aria-hidden />
                    <span className="sr-only">Dupliquer {p.name}</span>
                  </Link>
                  {p.status === "published" && (
                    <a
                      href={`/boutique/produit/${p.slug}`}
                      target="_blank"
                      rel="noopener"
                      className="grid size-9 place-items-center border-2 border-ink bg-paper hover:bg-yellow"
                      title="Voir en boutique"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      <span className="sr-only">Voir {p.name} en boutique (nouvel onglet)</span>
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
