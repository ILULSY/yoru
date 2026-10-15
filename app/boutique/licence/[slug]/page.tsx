import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LICENSE_MAP } from "@/data/shop/licenses";
import { licensesWithCounts, productsByLicense } from "@/lib/shop/catalog";
import { ShopExplorer } from "@/components/shop/ShopExplorer";
import { ProductMedia } from "@/components/shop/ProductMedia";
import { ProductGrid, ShopDemoNotice, ShopPerks } from "@/components/shop/ShopParts";
import { CssSplit } from "@/components/motion/CssSplit";
import { LogoBackdrop } from "@/components/shop/LogoBackdrop";
import { logoOf } from "@/data/shop/logos";

type Props = { params: Promise<{ slug: string }> };

// Une licence qui reçoit son premier produit depuis l'espace édition obtient sa page sans nouveau build.
export async function generateStaticParams() {
  return (await licensesWithCounts()).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const l = LICENSE_MAP[slug];
  if (!l) return {};
  return {
    title: `${l.name} : cartes, figurines et produits dérivés`,
    description: `Toute la boutique ${l.name} : cartes à collectionner, figurines et produits dérivés. ${l.about}`,
    alternates: { canonical: `/boutique/licence/${slug}` },
  };
}

export default async function LicensePage({ params }: Props) {
  const { slug } = await params;
  const license = LICENSE_MAP[slug];
  if (!license) notFound();
  const products = await productsByLicense(slug);
  if (!products.length) notFound();
  const showcase = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 3);
  const others = (await licensesWithCounts()).filter((l) => l.slug !== slug);

  return (
    <>
      <header className="relative isolate overflow-hidden border-b-[4px] border-ink" style={{ background: license.color, color: license.ink }}>
        <div aria-hidden className="speedlines absolute inset-0 -z-10 opacity-20 [--line:currentColor]" />
        {logoOf(slug) ? (
          <LogoBackdrop slug={slug} className="top-[10%] right-[-3%] -z-10 h-[80%] w-[62%] -rotate-6" opacity={0.18} />
        ) : (
          <span aria-hidden className="text-outline pointer-events-none absolute -bottom-10 -left-4 -z-10 font-display text-[clamp(8rem,26vw,22rem)] leading-none whitespace-nowrap opacity-25 [--stroke:currentColor] [--stroke-w:3px]">
            {license.short}
          </span>
        )}
        <div className="mx-auto grid max-w-[88rem] items-center gap-10 px-4 pt-10 pb-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <nav aria-label="Fil d'Ariane" className="font-mono text-xs font-bold tracking-wider uppercase">
              <Link href="/boutique" className="hover:underline">
                Boutique
              </Link>{" "}
              / Licences / <span aria-current="page">{license.name}</span>
            </nav>
            <CssSplit text={license.name} className="display mt-4 text-[clamp(3.6rem,11vw,8.5rem)]" />
            <p className="rise-in mt-4 max-w-xl text-lg leading-relaxed" style={{ "--d": "0.25s" } as React.CSSProperties}>
              {license.about}
            </p>
            <p className="rise-in mt-4 font-mono text-sm font-bold" style={{ "--d": "0.35s" } as React.CSSProperties}>
              {products.length} produit{products.length > 1 ? "s" : ""} disponibles dans la boutique
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
          <ShopExplorer products={products} lockedLicense={slug} />
        </Suspense>
      </div>

      <section aria-labelledby="other-licenses" className="mx-auto max-w-[88rem] px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <h2 id="other-licenses" className="display text-4xl">
          Autres licences
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {others.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/boutique/licence/${l.slug}`}
                className="inline-flex h-11 items-center gap-2 border-[3px] border-ink px-4 font-bold transition-transform hover:-translate-y-0.5 hover:-rotate-2"
                style={{ background: l.color, color: l.ink }}
              >
                {l.name} <span className="font-mono text-xs opacity-70">{l.count}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ShopPerks className="mt-14" />
      </section>
    </>
  );
}
