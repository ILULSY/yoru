import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck } from "lucide-react";
import { CATEGORY_INFO } from "@/data/shop/licenses";
import { getLicense, getProduct, getProducts, pricingNow, relatedProducts } from "@/lib/shop/catalog";
import { availabilityLabel } from "@/lib/shop/format";
import { formatMoney } from "@/lib/shop/currency";
import { CurrencyToggle, Money, RateNote } from "@/components/shop/Money";
import { SHOP } from "@/lib/shop/config";
import { absoluteUrl, SITE } from "@/lib/site";
import { ProductMedia } from "@/components/shop/ProductMedia";
import { Price, ProductBadges, SaleBadge, SaleNote, StockBadge } from "@/components/shop/ProductBits";
import { priceFields } from "@/lib/shop/pricing";
import { BuyBox } from "@/components/shop/BuyBox";
import { ProductGrid, ShopDemoNotice, ShopPerks } from "@/components/shop/ShopParts";
import { TiltCard } from "@/components/motion/Interactive";
import { CssSplit } from "@/components/motion/CssSplit";
import { Reveal } from "@/components/motion/Reveal";

type Props = { params: Promise<{ slug: string }> };

// Le prix des données structurées et de la description suit les soldes : régénération au plus toutes les 15 min.
// (Le prix affiché, lui, est recalculé dans le navigateur.)
export const revalidate = 900;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Produit introuvable" };
  const lic = getLicense(p.license);
  return {
    title: `${p.name} — ${lic.name}`,
    description: `${p.description.slice(0, 150)} ${formatMoney(pricingNow(p).price, p.currency ?? "EUR")} TTC.`,
    alternates: { canonical: `/boutique/produit/${p.slug}` },
    // Les fiches de démonstration ne doivent pas être indexées comme de vraies offres.
    robots: p.demo ? { index: false, follow: true } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const lic = getLicense(product.license);
  const category = CATEGORY_INFO[product.category];
  const related = await relatedProducts(product, 4);
  const pricing = pricingNow(product);

  // Données structurées Product : uniquement pour un produit réel (prix et stock vérifiés).
  const jsonLd = product.demo
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        sku: product.slug,
        brand: { "@type": "Brand", name: lic.name },
        offers: {
          "@type": "Offer",
          url: absoluteUrl(`/boutique/produit/${product.slug}`),
          priceCurrency: product.currency ?? "EUR",
          price: (pricing.price / 100).toFixed(2),
          ...(pricing.onSale && pricing.endsAt ? { priceValidUntil: pricing.endsAt.slice(0, 10) } : {}),
          availability:
            product.availability === "in_stock"
              ? "https://schema.org/InStock"
              : product.availability === "preorder"
                ? "https://schema.org/PreOrder"
                : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: SITE.name },
        },
      };

  return (
    <div className="pb-24">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}

      <div className="mx-auto max-w-[88rem] px-4 pt-8 sm:px-6 lg:px-8">
        <nav aria-label="Fil d'Ariane" className="font-mono text-xs font-bold tracking-wider uppercase">
          <ol className="flex flex-wrap items-center gap-2 text-muted">
            <li>
              <Link href="/boutique" className="hover:text-ink hover:underline">
                Boutique
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/boutique/${product.category}`} className="hover:text-ink hover:underline">
                {category.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="slide-in-card lg:sticky lg:top-24" style={{ "--r": "-1deg", "--d": "0.05s" } as React.CSSProperties}>
              <TiltCard max={7} holo={product.category === "cartes"}>
                <div className="relative overflow-hidden border-[4px] border-ink shadow-[12px_12px_0_0_var(--color-ink)]">
                  <ProductMedia product={product} idSuffix="main" sizes="(min-width: 1024px) 45vw, 92vw" priority />
                  <SaleBadge product={priceFields(product)} className="absolute top-4 right-4" size="lg" />
                </div>
              </TiltCard>
              <p className="mt-3 text-sm text-muted">
                {product.image
                  ? "Photo du produit, présentée sur fond YORU."
                  : "Visuel d'illustration généré par YORU — photos du produit réel à venir."}
              </p>
            </div>
          </div>

          <div>
            <div className="rise-in flex flex-wrap items-center gap-2">
              {product.license && (
                <Link
                  href={`/boutique/licence/${product.license}`}
                  className="border-2 border-ink px-2 py-0.5 font-mono text-[11px] font-bold tracking-widest uppercase transition-transform hover:-rotate-3"
                  style={{ background: lic.color, color: lic.ink }}
                >
                  {lic.name}
                </Link>
              )}
              <span className="border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[11px] font-bold tracking-widest uppercase">
                {product.type}
              </span>
              <ProductBadges product={product} />
            </div>
            <CssSplit text={product.name} className="mt-5 text-[clamp(2.2rem,4.6vw,3.8rem)] leading-[1.02] font-extrabold tracking-tight" />

            <div className="rise-in mt-6" style={{ "--d": "0.2s" } as React.CSSProperties}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <Price product={priceFields(product)} size="lg" />
                <CurrencyToggle />
              </div>
              <p className="mt-2 text-sm text-muted">Prix TTC, hors frais de livraison.</p>
              <RateNote className="mt-1" />
              <SaleNote product={priceFields(product)} className="mt-3 mr-2" />
              <StockBadge product={product} className="mt-3" />
            </div>

            <p className="rise-in mt-6 text-lg leading-relaxed" style={{ "--d": "0.28s" } as React.CSSProperties}>
              {product.description}
            </p>

            <div className="rise-in mt-8" style={{ "--d": "0.36s" } as React.CSSProperties}>
              <BuyBox product={product} />
            </div>

            <p className="mt-5 flex items-start gap-2 text-sm">
              <Truck className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {product.availability === "preorder"
                  ? `${availabilityLabel(product).label}. Expédition dès réception du produit.`
                  : `Expédition sous 48 h, ${SHOP.deliveryEstimate}.`}{" "}
                Livraison offerte dès <Money values={{ EUR: SHOP.shipping.EUR.freeFrom, CHF: SHOP.shipping.CHF.freeFrom }} />.
              </span>
            </p>

            {product.details.length > 0 && (
              <Reveal className="mt-10">
                <h2 className="font-mono text-xs font-bold tracking-[0.3em] uppercase">Caractéristiques</h2>
                <dl className="mt-3 divide-y-2 divide-ink/10 border-y-[3px] border-ink">
                  {[["Licence", lic.name] as [string, string], ["Catégorie", category.name] as [string, string], ...product.details].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 py-2.5 text-sm sm:grid-cols-[12rem_1fr]">
                      <dt className="font-bold">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}

            {product.demo && <ShopDemoNotice className="mt-8" />}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-products" className="mx-auto mt-20 max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <h2 id="related-products" className="display text-[clamp(2.4rem,5vw,4rem)]">
            Vous aimerez <span className="text-outline [--stroke:var(--color-ink)]">aussi</span>
          </h2>
          <Reveal className="mt-8">
            <ProductGrid products={related} />
          </Reveal>
        </section>
      )}

      <div className="mx-auto mt-16 max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <ShopPerks />
      </div>
    </div>
  );
}
