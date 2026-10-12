import Link from "next/link";
import type { Product } from "@/types/shop";
import { CATEGORY_INFO } from "@/data/shop/licenses";
import { PRODUCT_CATEGORIES } from "@/types/shop";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sticker } from "@/components/ui/Badges";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Scroll";
import { Burst } from "@/components/ui/Decor";

/** Teaser de la boutique sur l'accueil : catégories, licences et best-sellers. */
export function ShopTeaser({
  products,
  licenses,
}: {
  products: Product[];
  licenses: { slug: string; name: string; color: string; ink: string; count: number }[];
}) {
  return (
    <section aria-labelledby="shop-teaser-title" className="relative overflow-hidden border-y-[4px] border-ink bg-orange py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="halftone absolute inset-0 opacity-[0.1] [--dot-gap:14px]" />
      </div>
      <Parallax speed={-0.2} className="pointer-events-none absolute top-8 right-[34%] hidden lg:block">
        <Burst className="size-32 font-comic text-2xl leading-none text-ink" fill="var(--color-yellow)" spin>
          Shop!
        </Burst>
      </Parallax>

      <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="shop-teaser-title"
          number="08"
          kicker="Cartes, figurines & dérivés"
          title="La boutique"
          intro="Boosters, figurines, peluches et textile de vos licences préférées."
          numberClassName="[--stroke:rgba(17,17,20,0.2)]"
          link={{ href: "/boutique", label: "Entrer dans la boutique" }}
        />

        <Reveal className="mt-8 flex flex-wrap gap-2">
          {PRODUCT_CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/boutique/${c}`}
              className={`inline-flex h-11 items-center border-[3px] border-ink px-4 font-bold transition-transform hover:-translate-y-0.5 hover:-rotate-2 ${CATEGORY_INFO[c].color}`}
            >
              {CATEGORY_INFO[c].name}
            </Link>
          ))}
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4" step={0.08}>
          {products.slice(0, 4).map((p) => (
            <RevealItem key={p.slug}>
              <ProductCard product={p} idSuffix="home" />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.3em] uppercase">Licences à l&apos;affiche</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {licenses.map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/boutique/licence/${l.slug}`}
                    className="inline-flex h-10 items-center gap-2 border-[3px] border-ink px-3 text-sm font-bold transition-transform hover:-translate-y-0.5 hover:rotate-2"
                    style={{ background: l.color, color: l.ink }}
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Sticker tone="paper" rotate={4} className="self-start md:self-auto">
            Catalogue de démo
          </Sticker>
        </div>
      </div>
    </section>
  );
}
