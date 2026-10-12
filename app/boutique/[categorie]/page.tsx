import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/types/shop";
import { CATEGORY_INFO } from "@/data/shop/licenses";
import { getMedia } from "@/data/media";
import { productsByCategory } from "@/lib/shop/catalog";
import { ShopExplorer } from "@/components/shop/ShopExplorer";
import { ProductGrid, ShopDemoNotice, ShopPerks } from "@/components/shop/ShopParts";
import { SmartImage } from "@/components/ui/SmartImage";
import { CssSplit } from "@/components/motion/CssSplit";

type Props = { params: Promise<{ categorie: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCT_CATEGORIES.map((categorie) => ({ categorie }));
}

const isCategory = (c: string): c is ProductCategory => (PRODUCT_CATEGORIES as readonly string[]).includes(c);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie } = await params;
  if (!isCategory(categorie)) return {};
  const info = CATEGORY_INFO[categorie];
  return {
    title: `${info.name} — Boutique`,
    description: `${info.tagline} Dragon Ball Z, Hunter × Hunter, One Piece, Pokémon et plus sur la boutique YORU.`,
    alternates: { canonical: `/boutique/${categorie}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categorie } = await params;
  if (!isCategory(categorie)) notFound();
  const info = CATEGORY_INFO[categorie];
  const products = await productsByCategory(categorie);

  return (
    <>
      <header className={`relative isolate overflow-hidden border-b-[4px] border-ink ${info.color}`}>
        <div aria-hidden className="halftone absolute inset-0 -z-10 opacity-[0.12] [--dot-gap:12px]" />
        <div className="mx-auto grid max-w-[88rem] items-center gap-8 px-4 pt-10 pb-12 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <div>
            <nav aria-label="Fil d'Ariane" className="font-mono text-xs font-bold tracking-wider uppercase">
              <Link href="/boutique" className="hover:underline">
                Boutique
              </Link>{" "}
              / <span aria-current="page">{info.name}</span>
            </nav>
            <CssSplit text={info.name} className="display mt-4 text-[clamp(3.4rem,10vw,8rem)]" />
            <p className="rise-in mt-4 max-w-xl text-lg" style={{ "--d": "0.25s" } as React.CSSProperties}>
              {info.tagline}
            </p>
          </div>
          <div className="slide-in-card relative hidden aspect-[16/10] overflow-hidden border-[4px] border-ink shadow-pop-lg lg:block" style={{ "--r": "2deg", "--d": "0.15s" } as React.CSSProperties}>
            <SmartImage asset={getMedia(info.media)} sizes="40vw" priority />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[88rem] px-4 pt-10 pb-24 sm:px-6 lg:px-8">
        <ShopDemoNotice className="mb-10" />
        <Suspense fallback={<ProductGrid products={products} />}>
          <ShopExplorer products={products} lockedCategory={categorie} />
        </Suspense>
        <ShopPerks className="mt-16" />
      </div>
    </>
  );
}
