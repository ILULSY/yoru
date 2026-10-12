"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useMemo, useState, useTransition } from "react";
import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from "@/types/shop";
import { CATEGORY_INFO, LICENSES } from "@/data/shop/licenses";
import { ProductCard } from "@/components/shop/ProductCard";
import { Burst } from "@/components/ui/Decor";
import { formatMoney, priceIn } from "@/lib/shop/currency";
import { useCurrency, useRates } from "@/lib/stores/currency";
import { CurrencyToggle } from "@/components/shop/Money";
import { normalize } from "@/lib/text";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PAGE = 12;
const SORTS = {
  populaire: "Popularité",
  nouveautes: "Nouveautés",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix décroissant",
} as const;
type Sort = keyof typeof SORTS;

const AVAIL = { tout: "Tout", stock: "En stock", precommande: "Précommandes" } as const;
type Avail = keyof typeof AVAIL;

/**
 * Explorateur de la boutique. Une catégorie ou une licence peut être imposée
 * (pages dédiées) ; les autres filtres restent libres et sont reflétés dans l'URL.
 */
export function ShopExplorer({
  products,
  lockedCategory,
  lockedLicense,
}: {
  products: Product[];
  lockedCategory?: ProductCategory;
  lockedLicense?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [visible, setVisible] = useState(PAGE);
  const [showFilters, setShowFilters] = useState(false);

  const category = lockedCategory ?? (PRODUCT_CATEGORIES as readonly string[]).find((c) => c === params.get("categorie")) ?? "all";
  const licenseParam = params.get("licence");
  const license = lockedLicense ?? (licenseParam && LICENSES.some((l) => l.slug === licenseParam) ? licenseParam : "all");
  const sort: Sort = (Object.keys(SORTS) as Sort[]).find((s) => s === params.get("tri")) ?? "populaire";
  const avail: Avail = (Object.keys(AVAIL) as Avail[]).find((a) => a === params.get("dispo")) ?? "tout";
  const currency = useCurrency();
  const rates = useRates();
  const priceOf = (p: Product) => priceIn(p, currency, rates);
  const maxAll = Math.max(...products.map(priceOf));
  const budget = Math.min(maxAll, Number(params.get("budget")) || maxAll);
  const urlQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  const update = (next: Record<string, string | null>) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v || v === "all" || (k === "tri" && v === "populaire") || (k === "dispo" && v === "tout")) sp.delete(k);
      else sp.set(k, v);
    }
    setVisible(PAGE);
    const qs = sp.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const filtered = useMemo(() => {
    const tokens = normalize(urlQuery).split(" ").filter((t) => t.length > 1);
    const list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (license !== "all" && p.license !== license) return false;
      if (avail === "stock" && p.availability !== "in_stock") return false;
      if (avail === "precommande" && p.availability !== "preorder") return false;
      if (priceOf(p) > budget) return false;
      if (tokens.length) {
        const lic = LICENSES.find((l) => l.slug === p.license);
        const hay = normalize(`${p.name} ${p.type} ${p.tags.join(" ")} ${lic?.name ?? ""} ${p.character ?? ""}`);
        return tokens.every((t) => hay.includes(t));
      }
      return true;
    });
    const sorted = [...list];
    if (sort === "populaire") sorted.sort((a, b) => b.popularity - a.popularity);
    if (sort === "nouveautes") sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    if (sort === "prix-asc") sorted.sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === "prix-desc") sorted.sort((a, b) => priceOf(b) - priceOf(a));
    // Les ruptures passent en fin de liste.
    return sorted.sort((a, b) => Number(a.availability === "out_of_stock") - Number(b.availability === "out_of_stock"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, category, license, avail, budget, sort, urlQuery, currency, rates]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of products) {
      c[p.category] = (c[p.category] ?? 0) + 1;
      if (p.license) c[p.license] = (c[p.license] ?? 0) + 1;
    }
    return c;
  }, [products]);

  const shown = filtered.slice(0, visible);
  const hasFilters = (!lockedCategory && category !== "all") || (!lockedLicense && license !== "all") || avail !== "tout" || budget < maxAll || urlQuery;
  const reset = () => {
    setQuery("");
    update({ categorie: null, licence: null, dispo: null, budget: null, q: null });
  };

  const chip = "relative isolate inline-flex h-10 items-center gap-1.5 border-2 border-ink px-3 text-sm font-bold transition-transform duration-200 ease-[var(--ease-pop)] hover:-translate-y-0.5";

  return (
    <div>
      <div className="border-[3px] border-ink bg-paper p-4 shadow-pop sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <form
            role="search"
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: query.trim() || null });
            }}
          >
            <label htmlFor="shop-q" className="sr-only">
              Rechercher un produit
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2" aria-hidden />
            <input
              id="shop-q"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value && urlQuery) update({ q: null });
              }}
              onBlur={() => query.trim() !== urlQuery && update({ q: query.trim() || null })}
              placeholder="Goku, booster, peluche…"
              className="h-12 w-full border-[3px] border-ink bg-paper pr-24 pl-11 font-semibold outline-none focus:shadow-[4px_4px_0_0_var(--color-pink)]"
            />
            <button type="submit" className="absolute top-1/2 right-1.5 h-9 -translate-y-1/2 border-2 border-ink bg-yellow px-3 text-sm font-bold">
              Chercher
            </button>
          </form>
          <div className="flex flex-wrap gap-3">
            <CurrencyToggle />
            <label className="sr-only" htmlFor="shop-sort">
              Trier
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(e) => update({ tri: e.target.value })}
              className="h-12 flex-1 cursor-pointer border-[3px] border-ink bg-paper px-3 font-bold md:flex-none"
            >
              {(Object.keys(SORTS) as Sort[]).map((s) => (
                <option key={s} value={s}>
                  {SORTS[s]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              aria-controls="shop-filters"
              className="inline-flex h-12 items-center gap-2 border-[3px] border-ink bg-ink px-4 font-bold text-paper lg:hidden"
            >
              <SlidersHorizontal className="size-5" aria-hidden /> Filtres
            </button>
          </div>
        </div>

        <div id="shop-filters" className={cn("mt-5 space-y-4", !showFilters && "max-lg:hidden")}>
          {!lockedCategory && (
            <fieldset>
              <legend className="font-mono text-[11px] font-bold tracking-[0.25em] text-muted uppercase">Catégorie</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["all", ...PRODUCT_CATEGORIES] as const).map((c) => {
                  const active = category === c;
                  return (
                    <button key={c} type="button" aria-pressed={active} onClick={() => update({ categorie: c })} className={chip}>
                      {active && <m.span layoutId="shop-cat" className="absolute inset-0 -z-10 bg-ink" transition={SPRING.snappy} />}
                      <span className={cn(active && "text-paper")}>{c === "all" ? "Toutes" : CATEGORY_INFO[c].name}</span>
                      {c !== "all" && <span className={cn("font-mono text-[11px] opacity-60", active && "text-paper")}>{counts[c] ?? 0}</span>}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {!lockedLicense && (
            <fieldset>
              <legend className="font-mono text-[11px] font-bold tracking-[0.25em] text-muted uppercase">Licence</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" aria-pressed={license === "all"} onClick={() => update({ licence: null })} className={chip}>
                  {license === "all" && <m.span layoutId="shop-lic" className="absolute inset-0 -z-10 bg-ink" transition={SPRING.snappy} />}
                  <span className={cn(license === "all" && "text-paper")}>Toutes</span>
                </button>
                {LICENSES.filter((l) => counts[l.slug]).map((l) => {
                  const active = license === l.slug;
                  return (
                    <button
                      key={l.slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() => update({ licence: l.slug })}
                      className={chip}
                      style={active ? { color: l.ink } : undefined}
                    >
                      {active && <m.span layoutId="shop-lic" className="absolute inset-0 -z-10" style={{ background: l.color }} transition={SPRING.snappy} />}
                      <span className="size-2.5 rounded-full border border-ink" style={{ background: l.color }} aria-hidden />
                      {l.name}
                      <span className="font-mono text-[11px] opacity-60">{counts[l.slug]}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <fieldset>
              <legend className="font-mono text-[11px] font-bold tracking-[0.25em] text-muted uppercase">Disponibilité</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(AVAIL) as Avail[]).map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={avail === a}
                    onClick={() => update({ dispo: a })}
                    className={cn("h-9 border-2 border-ink px-3 text-sm font-semibold transition-[transform,background-color]", avail === a ? "-rotate-2 bg-yellow" : "bg-paper hover:bg-paper-2")}
                  >
                    {AVAIL[a]}
                  </button>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="shop-budget" className="flex justify-between font-mono text-[11px] font-bold tracking-[0.25em] text-muted uppercase">
                <span>Budget max.</span>
                <span className="text-ink">{formatMoney(budget, currency)}</span>
              </label>
              <input
                id="shop-budget"
                type="range"
                min={500}
                max={maxAll}
                step={100}
                value={budget}
                onChange={(e) => update({ budget: Number(e.target.value) >= maxAll ? null : e.target.value })}
                className="mt-3 w-full cursor-pointer accent-pink"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="font-mono text-sm font-bold">
          {filtered.length} produit{filtered.length > 1 ? "s" : ""}
        </p>
        {hasFilters && (
          <button type="button" onClick={reset} className="group inline-flex items-center gap-1.5 text-sm font-bold underline decoration-pink decoration-2 underline-offset-4">
            <RotateCcw className="size-4 transition-transform duration-500 group-hover:-rotate-180" aria-hidden /> Réinitialiser
          </button>
        )}
      </div>

      {filtered.length ? (
        <m.ul layout className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => (
              <m.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { ...SPRING.snappy, delay: Math.min(i % PAGE, 8) * 0.03 } }}
                exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.16 } }}
              >
                <ProductCard product={p} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      ) : (
        <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 flex flex-col items-center border-[3px] border-dashed border-ink px-6 py-14 text-center">
          <Burst className="size-28 font-comic text-2xl" fill="var(--color-orange)" spin>
            Rien !
          </Burst>
          <p className="display mt-6 text-4xl">Aucun produit trouvé</p>
          <p className="mt-2 max-w-md text-muted">Élargissez votre budget, changez de licence ou retirez un filtre.</p>
          <button type="button" onClick={reset} className="mt-6 inline-flex h-12 items-center gap-2 border-[3px] border-ink bg-yellow px-5 font-bold shadow-pop-sm">
            <X className="size-4" aria-hidden /> Effacer les filtres
          </button>
        </m.div>
      )}

      {visible < filtered.length && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE)}
            className="inline-flex h-14 items-center gap-2 border-[3px] border-ink bg-ink px-7 text-lg font-bold text-paper shadow-[5px_5px_0_0_var(--color-yellow)] transition-transform hover:-translate-y-0.5 active:translate-y-1"
          >
            Voir plus de produits ({filtered.length - visible})
          </button>
        </div>
      )}
    </div>
  );
}
