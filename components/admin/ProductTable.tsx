"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Copy, Eye, EyeOff, ExternalLink, LoaderCircle, PackageOpen, Pencil, Percent, Search, X } from "lucide-react";
import { PRODUCT_CATEGORIES, type Product, type ProductCategory, type ProductStatus } from "@/types/shop";
import { CATEGORY_INFO, licenseOf } from "@/data/shop/licenses";
import { availabilityLabel } from "@/lib/shop/format";
import { formatMoney } from "@/lib/shop/currency";
import { currentPricing, formatSaleDate, saleStatus } from "@/lib/shop/pricing";
import { normalize } from "@/lib/text";
import { removeSaleAction, toggleStatusAction } from "@/app/admin/actions";
import { useShopNow } from "@/components/shop/CatalogProvider";
import { ProductMedia } from "@/components/shop/ProductMedia";
import { SaleDialog } from "@/components/admin/SaleDialog";
import { inputClasses } from "@/components/ui/Field";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site";

type Sort = "updated" | "name" | "stock";
type StatusFilter = ProductStatus | "all" | "sale";

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

const chip = "border-2 border-ink px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase";

function SaleChip({ product, now }: { product: Product; now: number }) {
  const status = saleStatus(product, now);
  if (status === "none" || !product.sale) return null;
  const pct = Math.round((1 - product.sale.price / product.price) * 100);
  if (status === "active") {
    return (
      <span className={cn(chip, "bg-[#c4006b] text-paper")} title={product.sale.endsAt ? `Jusqu'au ${formatSaleDate(product.sale.endsAt)}` : "Sans date de fin"}>
        Solde −{pct} %{product.sale.endsAt ? ` · fin ${formatSaleDate(product.sale.endsAt)}` : ""}
      </span>
    );
  }
  if (status === "scheduled") {
    return <span className={cn(chip, "border-dashed bg-[#ffe1f0]")}>Solde −{pct} % le {formatSaleDate(product.sale.startsAt!)}</span>;
  }
  return <span className={cn(chip, "bg-paper-2 text-muted")}>Solde terminé</span>;
}

function RemoveSaleButton({ count }: { count: number }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex h-10 items-center gap-1.5 border-2 border-paper/60 px-3 text-sm font-bold hover:bg-paper hover:text-ink">
      {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      Retirer le solde{count > 1 ? ` (${count})` : ""}
    </button>
  );
}

export function ProductTable({ products }: { products: Product[] }) {
  const now = useShopNow();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [sort, setSort] = useState<Sort>("updated");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saleFor, setSaleFor] = useState<Product[] | null>(null);

  const rows = useMemo(() => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    return products
      .filter((p) => (status === "all" ? true : status === "sale" ? saleStatus(p, now) === "active" || saleStatus(p, now) === "scheduled" : p.status === status))
      .filter((p) => category === "all" || p.category === category)
      .filter((p) => {
        if (!tokens.length) return true;
        const hay = normalize(`${p.name} ${p.slug} ${p.type} ${licenseOf(p.license).name} ${p.tags.join(" ")}`);
        return tokens.every((t) => hay.includes(t));
      })
      .sort((a, b) =>
        sort === "name" ? a.name.localeCompare(b.name, "fr") : sort === "stock" ? a.stock - b.stock : b.updatedAt.localeCompare(a.updatedAt),
      );
  }, [products, query, status, category, sort, now]);

  const selectedProducts = products.filter((p) => selected.has(p.slug));
  const allShownSelected = rows.length > 0 && rows.every((p) => selected.has(p.slug));
  const toggle = (slug: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  const toggleAll = () =>
    setSelected((s) => {
      const next = new Set(s);
      if (allShownSelected) rows.forEach((p) => next.delete(p.slug));
      else rows.forEach((p) => next.add(p.slug));
      return next;
    });

  const select = "h-11 border-[3px] border-ink bg-paper px-3 text-sm font-semibold";

  return (
    <section aria-labelledby="liste-produits" className="mt-10 pb-24">
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
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} className={select}>
            <option value="all">Tous les statuts</option>
            <option value="published">En boutique</option>
            <option value="draft">Brouillons</option>
            <option value="sale">En solde ou programmés</option>
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

      <div className="mt-4 flex items-center gap-3">
        {rows.length > 0 && (
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={allShownSelected} onChange={toggleAll} className="size-4 accent-[var(--color-ink)]" />
            Tout sélectionner
          </label>
        )}
        <p className="font-mono text-xs text-muted" aria-live="polite">
          {rows.length} produit{rows.length > 1 ? "s" : ""}
          {selected.size > 0 && ` · ${selected.size} sélectionné${selected.size > 1 ? "s" : ""}`}
        </p>
      </div>

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
            const pricing = currentPricing(p, now);
            const cur = p.currency ?? "EUR";
            return (
              <li
                key={p.slug}
                className={cn(
                  "grid grid-cols-[auto_1fr] gap-3 p-3 sm:grid-cols-[auto_4.5rem_1fr_auto] sm:items-center",
                  p.status === "draft" && "bg-paper-2/60",
                  selected.has(p.slug) && "bg-yellow/30",
                )}
              >
                <input
                  type="checkbox"
                  checked={selected.has(p.slug)}
                  onChange={() => toggle(p.slug)}
                  aria-label={`Sélectionner ${p.name}`}
                  className="mt-1 size-5 accent-[var(--color-ink)] sm:mt-0"
                />
                <div className="hidden size-[4.5rem] overflow-hidden border-2 border-ink sm:block">
                  <ProductMedia product={p} sizes="72px" compact idSuffix="admin" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip status={p.status} />
                    <SaleChip product={p} now={now} />
                    {p.demo && <span className={chip}>Démo</span>}
                    <span className={cn(chip, TONE[avail.tone])}>
                      {p.availability === "preorder" ? "Précommande" : `${avail.tone === "out" ? "Rupture" : "Stock"} · ${p.stock}`}
                    </span>
                  </div>
                  <Link href={`/admin/produits/${p.slug}`} className="mt-1 block truncate font-extrabold hover:underline">
                    {p.name}
                  </Link>
                  <p className="truncate text-sm text-muted">
                    {lic.name} · {CATEGORY_INFO[p.category].short} · {p.type} ·{" "}
                    <strong className={cn(pricing.onSale ? "text-[#c4006b]" : "text-ink")}>{formatMoney(pricing.price, cur)}</strong>
                    {pricing.struck !== undefined && <span className="line-through"> {formatMoney(pricing.struck, cur)}</span>} · modifié le{" "}
                    {dateFmt.format(new Date(p.updatedAt))}
                  </p>
                </div>
                <div className="col-span-2 flex flex-wrap items-center gap-1.5 sm:col-span-1">
                  <Link
                    href={`/admin/produits/${p.slug}`}
                    className="inline-flex h-9 items-center gap-1.5 border-2 border-ink bg-ink px-3 text-sm font-bold text-paper hover:bg-violet"
                  >
                    <Pencil className="size-4" aria-hidden /> Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSaleFor([p])}
                    className="inline-flex h-9 items-center gap-1.5 border-2 border-ink bg-paper px-3 text-sm font-bold hover:bg-[#ffe1f0]"
                  >
                    <Percent className="size-4" aria-hidden /> Solde
                    <span className="sr-only"> {p.name}</span>
                  </button>
                  <form action={toggleStatusAction}>
                    <input type="hidden" name="slug" value={p.slug} />
                    <button type="submit" className="inline-flex h-9 items-center gap-1.5 border-2 border-ink bg-paper px-3 text-sm font-bold hover:bg-yellow">
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
                      href={absoluteUrl(`/boutique/produit/${p.slug}`)}
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

      {/* Actions groupées sur la sélection */}
      {selected.size > 0 && (
        <div role="region" aria-label="Actions sur la sélection" className="fixed inset-x-0 bottom-0 z-40 border-t-[4px] border-ink bg-ink text-paper">
          <div className="mx-auto flex max-w-[88rem] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <p className="font-bold">
              {selected.size} produit{selected.size > 1 ? "s" : ""} sélectionné{selected.size > 1 ? "s" : ""}
            </p>
            <button
              type="button"
              onClick={() => setSaleFor(selectedProducts)}
              className="inline-flex h-10 items-center gap-1.5 border-2 border-paper bg-[#c4006b] px-3 text-sm font-bold hover:bg-pink hover:text-ink"
            >
              <Percent className="size-4" aria-hidden /> Mettre en solde…
            </button>
            <form action={removeSaleAction}>
              <input type="hidden" name="slugs" value={JSON.stringify([...selected])} />
              <RemoveSaleButton count={selected.size} />
            </form>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="ml-auto inline-flex h-10 items-center gap-1.5 px-3 text-sm font-semibold hover:underline"
            >
              <X className="size-4" aria-hidden /> Désélectionner
            </button>
          </div>
        </div>
      )}

      {saleFor && <SaleDialog products={saleFor} onClose={() => setSaleFor(null)} />}
    </section>
  );
}
