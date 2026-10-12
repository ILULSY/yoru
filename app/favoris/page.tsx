import type { Metadata } from "next";
import { getSummaries } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { FavoritesClient } from "@/components/news/FavoritesClient";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Les articles YORU que vous avez mis de côté.",
  alternates: { canonical: "/favoris" },
  robots: { index: false, follow: true },
};

export default async function FavoritesPage() {
  const articles = await getSummaries();
  return (
    <>
      <PageHero
        kicker="§ Ma collection"
        title="Mes favoris"
        intro="Vos articles mis de côté. Ils sont enregistrés uniquement dans ce navigateur, sur cet appareil : aucun compte, rien n'est envoyé à nos serveurs."
      />
      <section className="mx-auto max-w-[88rem] px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <FavoritesClient articles={articles} />
      </section>
    </>
  );
}
