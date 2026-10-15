import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/types/shop";
import { CATEGORY_INFO } from "@/data/shop/licenses";
import { getMedia } from "@/data/media";
import { brandsWithCounts, featuredProducts, getProducts, licensesWithCounts } from "@/lib/shop/catalog";
import { ShopExplorer } from "@/components/shop/ShopExplorer";
import { CurrencyToggle, Money } from "@/components/shop/Money";
import { SHOP } from "@/lib/shop/config";
import { ProductMedia } from "@/components/shop/ProductMedia";
import { ProductGrid, ShopDemoNotice, ShopPerks } from "@/components/shop/ShopParts";
import { SmartImage } from "@/components/ui/SmartImage";
import { Sticker } from "@/components/ui/Badges";
import { CssSplit } from "@/components/motion/CssSplit";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { VelocityMarquee } from "@/components/motion/Scroll";
import { TiltCard } from "@/components/motion/Interactive";
import { Sparkle } from "@/components/ui/Decor";
import { LogoBackdrop } from "@/components/shop/LogoBackdrop";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "La boutique YORU : cartes à collectionner, figurines et produits dérivés Dragon Ball Z, Hunter × Hunter, One Piece, Pokémon, Naruto et plus.",
  alternates: { canonical: "/boutique" },
};

export default async function ShopPage() {
  const [products, featured, licenses, brands] = await Promise.all([getProducts(), featuredProducts(4), licensesWithCounts(), brandsWithCounts()]);
  const heroPicks = ["one-piece-card-game-op17-booster", "pokemon-30th-celebration-booster", "pokemon-30e-anniversaire-lot-de-boosters"].map((slug) => products.find((p) => p.slug === slug)).filter(Boolean) as typeof products;

  return (
    <>
      {/* ── Hero ── */}
      <header className="relative isolate overflow-hidden border-b-[4px] border-ink bg-orange">
        <div aria-hidden className="rays absolute inset-0 -z-10 opacity-[0.14] [--line:var(--color-ink)] [--ray-y:120%]" />
        <div className="mx-auto grid max-w-[88rem] items-center gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-16">
          <div>
            <p className="rise-in font-mono text-xs font-bold tracking-[0.3em] uppercase">§ Le shop YORU</p>
            <CssSplit text="La boutique" className="display mt-4 text-[clamp(4rem,13vw,10rem)]" />
            <p className="rise-in mt-5 max-w-xl text-lg leading-relaxed sm:text-xl" style={{ "--d": "0.3s" } as React.CSSProperties}>
              Cartes à collectionner, figurines et produits dérivés de vos univers préférés : Pokémon, One Piece, Dragon Ball Z,
              Demon Slayer, Disney, Marvel, Star Wars, Harry Potter… et des marques comme Funko, Bandai ou Hasbro.
            </p>
            <div className="rise-in mt-6 flex items-center gap-3" style={{ "--d": "0.4s" } as React.CSSProperties}>
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase">Prix en</span>
              <CurrencyToggle />
            </div>
            <div className="pop-in mt-7 inline-block" style={{ "--r": "-5deg", "--d": "0.5s" } as React.CSSProperties}>
              <Sticker tone="yellow" rotate={-5}>
                Livraison offerte dès <Money values={{ EUR: SHOP.shipping.EUR.freeFrom, CHF: SHOP.shipping.CHF.freeFrom }} /> !
              </Sticker>
            </div>
          </div>
          <div className="relative mx-auto grid w-full max-w-lg grid-cols-3 items-end gap-3">
            {heroPicks.map((p, i) => (
              <div
                key={p.slug}
                className="slide-in-card"
                style={{ "--r": `${[-8, 3, 9][i]}deg`, "--d": `${0.2 + i * 0.12}s` } as React.CSSProperties}
              >
                <TiltCard max={10}>
                  <Link
                    href={`/boutique/produit/${p.slug}`}
                    className={`block overflow-hidden border-[4px] border-ink shadow-pop-lg ${i === 1 ? "-mb-6" : ""}`}
                    aria-label={p.name}
                  >
                    <ProductMedia product={p} idSuffix="hero" sizes="(min-width: 1024px) 14vw, 30vw" priority />
                  </Link>
                </TiltCard>
              </div>
            ))}
            <Sparkle className="absolute -top-8 right-4 size-12 animate-float text-ink" fill="currentColor" />
          </div>
        </div>
      </header>

      <div className="border-b-[4px] border-ink bg-ink py-3 text-paper" aria-hidden>
        <VelocityMarquee baseVelocity={-1.8} itemClassName="gap-8 pr-8">
          {licenses.map((l) => (
            <span key={l.slug} className="display flex items-center gap-8 text-3xl" style={{ color: l.color === "#111114" ? "#FFE600" : l.color }}>
              {l.name}
              <Sparkle className="size-5 text-paper" />
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <div className="mx-auto max-w-[88rem] px-4 pt-10 sm:px-6 lg:px-8">
        <ShopDemoNotice />
      </div>

      {/* ── Catégories ── */}
      <section aria-labelledby="shop-cats" className="mx-auto max-w-[88rem] px-4 pt-14 sm:px-6 lg:px-8">
        <h2 id="shop-cats" className="display text-[clamp(2.6rem,6vw,4.5rem)]">
          Par catégorie
        </h2>
        <RevealGroup className="mt-8 grid gap-5 md:grid-cols-3" step={0.1}>
          {PRODUCT_CATEGORIES.map((c, i) => {
            const info = CATEGORY_INFO[c];
            return (
              <RevealItem key={c} className="h-full">
                <Link
                  href={`/boutique/${c}`}
                  className={`group relative flex h-full flex-col overflow-hidden border-[4px] border-ink ${info.color} shadow-pop transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:-rotate-1 hover:shadow-pop-lg`}
                >
                  <div className="relative aspect-[16/9] overflow-hidden border-b-[4px] border-ink">
                    <SmartImage asset={getMedia(info.media)} sizes="(min-width: 768px) 30vw, 92vw" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="relative p-5">
                    <p className="font-mono text-xs font-bold tracking-[0.25em] uppercase">
                      0{i + 1} · {products.filter((p) => p.category === c).length} produits
                    </p>
                    <h3 className="display mt-1 flex items-end justify-between gap-2 text-[clamp(2rem,3vw,2.5rem)] leading-[0.95]">
                      {info.name}
                      <ArrowUpRight className="size-7 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                    </h3>
                    <p className="mt-1 text-sm font-medium">{info.tagline}</p>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* ── Licences ── */}
      <section aria-labelledby="shop-licenses" className="mx-auto max-w-[88rem] px-4 pt-16 sm:px-6 lg:px-8">
        <h2 id="shop-licenses" className="display text-[clamp(2.6rem,6vw,4.5rem)]">
          Par licence
        </h2>
        <RevealGroup as="ul" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4" step={0.05}>
          {licenses.map((l) => (
            <RevealItem as="li" key={l.slug}>
              <Link
                href={`/boutique/licence/${l.slug}`}
                className="group relative flex h-32 flex-col justify-between overflow-hidden border-[3px] border-ink p-3 transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:rotate-1 hover:shadow-pop"
                style={{ background: l.color, color: l.ink }}
              >
                <span className="halftone pointer-events-none absolute -right-6 -bottom-6 size-24 opacity-30 [--dot-gap:9px]" aria-hidden />
                <LogoBackdrop slug={l.slug} className="inset-x-4 inset-y-5 transition-transform duration-500 group-hover:scale-110" opacity={0.22} />
                <span className="relative font-mono text-xs font-bold">{l.count} produit{l.count > 1 ? "s" : ""}</span>
                <span className="display relative text-[clamp(1.6rem,3vw,2.3rem)] leading-[0.95] transition-transform duration-300 group-hover:-translate-y-1">
                  {l.name}
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Marques ── */}
      <section aria-labelledby="shop-brands" className="mx-auto max-w-[88rem] px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="shop-brands" className="display text-[clamp(2.6rem,6vw,4.5rem)]">
            Par marque
          </h2>
          <Link href="/boutique/marques" className="inline-flex items-center gap-1.5 font-bold underline decoration-[3px] underline-offset-4 hover:decoration-violet">
            Toutes les marques et licences <ArrowUpRight className="size-5" aria-hidden />
          </Link>
        </div>
        <RevealGroup as="ul" className="mt-8 flex flex-wrap gap-3" step={0.04}>
          {brands.map((b) => (
            <RevealItem as="li" key={b.slug}>
              <Link
                href={`/boutique/marque/${b.slug}`}
                className="relative inline-flex h-14 items-center gap-3 overflow-hidden border-[3px] border-ink px-5 transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:-rotate-1 hover:shadow-pop"
                style={{ background: b.color, color: b.ink }}
              >
                <LogoBackdrop slug={b.slug} className="inset-1.5" opacity={0.2} />
                <span className="display relative text-2xl leading-none">{b.name}</span>
                <span className="relative font-mono text-xs font-bold opacity-80">{b.count}</span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Incontournables ── */}
      <section aria-labelledby="shop-featured" className="mx-auto max-w-[88rem] px-4 pt-16 sm:px-6 lg:px-8">
        <h2 id="shop-featured" className="display text-[clamp(2.6rem,6vw,4.5rem)]">
          Les <span className="text-outline [--stroke:var(--color-ink)]">incontournables</span>
        </h2>
        <Reveal className="mt-8">
          <ProductGrid products={featured} />
        </Reveal>
      </section>

      {/* ── Tout le catalogue ── */}
      <section aria-labelledby="shop-all" className="mx-auto max-w-[88rem] px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <h2 id="shop-all" className="display text-[clamp(2.6rem,6vw,4.5rem)]">
          Tout le catalogue
        </h2>
        <div className="mt-8">
          <Suspense fallback={<ProductGrid products={products.slice(0, 12)} />}>
            <ShopExplorer products={products} />
          </Suspense>
        </div>
      </section>

      <div className="mx-auto max-w-[88rem] px-4 pb-24 sm:px-6 lg:px-8">
        <ShopPerks />
      </div>
    </>
  );
}
