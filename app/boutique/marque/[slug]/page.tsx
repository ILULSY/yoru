import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BRAND_MAP } from "@/data/shop/brands";
import { brandsWithCounts, productsByBrand } from "@/lib/shop/catalog";
import { ShopExplorer } from "@/components/shop/ShopExplorer";
import { ProductMedia } from "@/components/shop/ProductMedia";
import { ProductGrid, ShopDemoNotice, ShopPerks } from "@/components/shop/ShopParts";
import { CssSplit } from "@/components/motion/CssSplit";

type Props = { params: Promise<{ slug: string }> };

// Une marque qui reçoit son premier produit depuis l'espace édition obtient sa page sans nouveau build.
export async function generateStaticParams() {
  return (await brandsWithCounts()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = BRAND_MAP[slug];
  if (!b) return {};
  return {
    title: `${b.name} : la sélection de la boutique`,
    description: `Les produits ${b.name} de la boutique YORU. ${b.about}`,
    alternates: { canonical: `/boutique/marque/${slug}` },
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = BRAND_MAP[slug];
  if (!brand) notFound();
  const products = await productsByBrand(slug);
  if (!products.length) notFound();
  const showcase = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 3);
  const others = (await brandsWithCounts()).filter((b) => b.slug !== slug);

  return (
    <>
      <header className="relative isolate overflow-hidden border-b-[4px] border-ink" style={{ background: brand.color, color: brand.ink }}>
        <div aria-hidden className="speedlines absolute inset-0 -z-10 opacity-20 [--line:currentColor]" />
        <span aria-hidden className="text-outline pointer-events-none absolute -bottom-10 -left-4 -z-10 font-display text-[clamp(8rem,26vw,22rem)] leading-none whitespace-nowrap opacity-25 [--stroke:currentColor] [--stroke-w:3px]">
          {brand.name}
        </span>
        <div className="mx-auto grid max-w-[88rem] items-center gap-10 px-4 pt-10 pb-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <nav aria-label="Fil d'Ariane" className="font-mono text-xs font-bold tracking-wider uppercase">
              <Link href="/boutique" className="hover:underline">
                Boutique
              </Link>{" "}
              /{" "}
              <Link href="/boutique/marques" className="hover:underline">
                Marques
              </Link>{" "}
              / <span aria-current="page">{brand.name}</span>
            </nav>
            <CssSplit text={brand.name} className="display mt-4 text-[clamp(3.6rem,11vw,8.5rem)]" />
            <p className="rise-in mt-4 max-w-xl text-lg leading-relaxed" style={{ "--d": "0.25s" } as React.CSSProperties}>
              {brand.about}
            </p>
            <p className="rise-in mt-4 font-mono text-sm font-bold" style={{ "--d": "0.35s" } as React.CSSProperties}>
              {products.length} produit{products.length > 1 ? "s" : ""} disponibles dans la boutique
            </p>
            <p className="rise-in mt-2 text-xs opacity-80" style={{ "--d": "0.4s" } as React.CSSProperties}>
              Marque citée pour identifier les produits ; YORU n&apos;est pas affilié à {brand.name}.
            </p>
          </div>
          <div className="grid grid-cols-3 items-end gap-3">
            {showcase.map((p, i) => (
              <Link
                key={p.slug}
                href={`/boutique/produit/${p.slug}`}
                className="slide-in-card block overflow-hidden border-[4px] border-ink shadow-pop-lg transition-transform hover:-translate-y-1"
                style={{ "--r": `${[-6, 2, 7][i]}deg`, "--d": `${0.15 + i * 0.1}s` } as React.CSSProperties}
                aria-label={p.name}
              >
                <ProductMedia product={p} idSuffix="hero" sizes="(min-width: 1024px) 14vw, 30vw" />
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[88rem] px-4 pt-10 sm:px-6 lg:px-8">
        <ShopDemoNotice className="mb-10" />
        <Suspense fallback={<ProductGrid products={products} />}>
          <ShopExplorer products={products} lockedBrand={slug} />
        </Suspense>
      </div>

      <section aria-labelledby="other-brands" className="mx-auto max-w-[88rem] px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <h2 id="other-brands" className="display text-4xl">
          Autres marques
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {others.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/boutique/marque/${l.slug}`}
                className="inline-flex h-11 items-center gap-2 border-[3px] border-ink px-4 font-bold transition-transform hover:-translate-y-0.5 hover:-rotate-2"
                style={{ background: l.color, color: l.ink }}
              >
                {l.name} <span className="font-mono text-xs opacity-70">{l.count}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/boutique/marques" className="inline-flex h-11 items-center gap-2 border-[3px] border-dashed border-ink px-4 font-bold hover:bg-yellow">
              Toutes les marques et licences
            </Link>
          </li>
        </ul>
        <ShopPerks className="mt-14" />
      </section>
    </>
  );
}
