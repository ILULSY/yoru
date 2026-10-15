import type { Metadata } from "next";
import Link from "next/link";
import { brandsWithCounts, licensesWithCounts } from "@/lib/shop/catalog";
import { ShopDemoNotice, ShopPerks } from "@/components/shop/ShopParts";
import { CssSplit } from "@/components/motion/CssSplit";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Marques et licences",
  description:
    "Toutes les marques et licences de la boutique YORU : Pokémon, One Piece, Disney, Marvel, Star Wars, Harry Potter, Demon Slayer, Funko, Bandai, Hasbro et plus.",
  alternates: { canonical: "/boutique/marques" },
};

type Tile = { slug: string; name: string; color: string; ink: string; count: number };

function TileGrid({ items, base }: { items: Tile[]; base: string }) {
  return (
    <RevealGroup as="ul" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" step={0.04}>
      {items.map((t) => (
        <RevealItem as="li" key={t.slug}>
          <Link
            href={`${base}/${t.slug}`}
            className="group relative flex h-32 flex-col justify-between overflow-hidden border-[3px] border-ink p-3 transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:rotate-1 hover:shadow-pop"
            style={{ background: t.color, color: t.ink }}
          >
            <span className="halftone pointer-events-none absolute -right-6 -bottom-6 size-24 opacity-30 [--dot-gap:9px]" aria-hidden />
            <span className="font-mono text-xs font-bold">
              {t.count} produit{t.count > 1 ? "s" : ""}
            </span>
            <span className="display relative text-[clamp(1.5rem,2.8vw,2.2rem)] leading-[0.95] transition-transform duration-300 group-hover:-translate-y-1">
              {t.name}
            </span>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export default async function BrandsPage() {
  const [licenses, brands] = await Promise.all([licensesWithCounts(), brandsWithCounts()]);

  return (
    <>
      <header className="relative isolate overflow-hidden border-b-[4px] border-ink bg-ink text-paper">
        <div aria-hidden className="speedlines absolute inset-0 -z-10 opacity-15 [--line:var(--color-violet)]" />
        <div className="mx-auto max-w-[88rem] px-4 pt-10 pb-14 sm:px-6 lg:px-8">
          <nav aria-label="Fil d'Ariane" className="font-mono text-xs font-bold tracking-wider uppercase">
            <Link href="/boutique" className="hover:underline">
              Boutique
            </Link>{" "}
            / <span aria-current="page">Marques</span>
          </nav>
          <CssSplit text="Nos marques" className="display mt-4 text-[clamp(3.6rem,11vw,8.5rem)]" />
          <p className="rise-in mt-4 max-w-2xl text-lg leading-relaxed text-paper/85" style={{ "--d": "0.25s" } as React.CSSProperties}>
            Retrouvez vos univers préférés ({licenses.length} licences) et les fabricants dont nous proposons les produits (
            {brands.length} marques).
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[88rem] px-4 pt-10 sm:px-6 lg:px-8">
        <ShopDemoNotice />
      </div>

      <section aria-labelledby="brands-licenses" className="mx-auto max-w-[88rem] px-4 pt-14 sm:px-6 lg:px-8">
        <h2 id="brands-licenses" className="display text-[clamp(2.6rem,6vw,4.5rem)]">
          Univers et licences
        </h2>
        <p className="mt-2 max-w-2xl text-muted">Les œuvres : séries, films, mangas et jeux dont les produits sont tirés.</p>
        <TileGrid items={licenses} base="/boutique/licence" />
      </section>

      <section aria-labelledby="brands-makers" className="mx-auto max-w-[88rem] px-4 pt-16 sm:px-6 lg:px-8">
        <h2 id="brands-makers" className="display text-[clamp(2.6rem,6vw,4.5rem)]">
          Marques et fabricants
        </h2>
        <p className="mt-2 max-w-2xl text-muted">Ceux qui fabriquent ou éditent les produits : figurines, jeux de cartes, objets de collection.</p>
        <TileGrid items={brands} base="/boutique/marque" />
      </section>

      <section className="mx-auto max-w-[88rem] px-4 pt-14 pb-24 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-sm text-muted">
          Les noms cités sont des marques déposées de leurs propriétaires respectifs. Ils servent uniquement à identifier les
          produits ; YORU n&apos;est affilié à aucune de ces sociétés et n&apos;utilise pas leurs logos.
        </p>
        <ShopPerks className="mt-10" />
      </section>
    </>
  );
}
