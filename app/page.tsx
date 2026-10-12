import { getFeatured, getPopular, getSummaries } from "@/lib/content";
import { getLiveNews } from "@/lib/news/live";
import { BRIEFS_SORTED } from "@/data/news-briefs";
import { featuredProducts, licensesWithCounts } from "@/lib/shop/catalog";
import { getMedia } from "@/data/media";
import { UNIVERSES } from "@/data/universes";
import { Intro } from "@/components/motion/Intro";
import { Hero } from "@/components/sections/Hero";
import { TickerBand } from "@/components/sections/TickerBand";
import { TopNews } from "@/components/sections/TopNews";
import { Featured } from "@/components/sections/Featured";
import { ScreensSection } from "@/components/sections/ScreensSection";
import { AnimeMangaSection } from "@/components/sections/AnimeMangaSection";
import { GamingSection } from "@/components/sections/GamingSection";
import { ComicsSection } from "@/components/sections/ComicsSection";
import { CollectorsSection } from "@/components/sections/CollectorsSection";
import { PopularCarousel } from "@/components/sections/PopularCarousel";
import { EditorialSection } from "@/components/sections/EditorialSection";
import { Newsletter } from "@/components/sections/Newsletter";
import { LiveNewsStrip } from "@/components/sections/LiveNewsStrip";
import { ShopTeaser } from "@/components/sections/ShopTeaser";
import type { CollageItem } from "@/components/sections/HeroCollage";

// Le fil d'actualités est relu toutes les 30 minutes.
export const revalidate = 1800;

export default async function HomePage() {
  const all = await getSummaries();
  const featured = await getFeatured();
  const popular = await getPopular(8);
  const live = await getLiveNews();
  const by = (u: string) => all.filter((a) => a.universe === u);

  const latest = all.filter((a) => a.slug !== featured.slug).slice(0, 5);
  const critique = all.find((a) => a.type === "critique");
  const dossiers = all.filter((a) => a.type === "dossier" && a.slug !== featured.slug && ["tech", "series", "cinema", "manga"].includes(a.universe));
  const guides = all.filter((a) => a.type === "guide");

  const collage: CollageItem[] = [
    { asset: getMedia("akihabara-billboards"), universe: "anime", label: "Anime" },
    { asset: getMedia("clap-popcorn"), universe: "cinema", label: "Cinéma" },
    { asset: getMedia("controller-neon"), universe: "jeux-video", label: "Jeux vidéo" },
    { asset: getMedia("spider-cosplay"), universe: "comics", label: "Comics" },
  ];

  return (
    <>
      <Intro />
      <Hero collage={collage} stats={{ articles: all.length, universes: UNIVERSES.length }} editionDate={all[0]!.publishedAt} />
      <TickerBand />
      <LiveNewsStrip briefs={BRIEFS_SORTED} live={live.items} />
      <TopNews articles={latest} />
      <Featured article={featured} />
      <ScreensSection cinema={by("cinema").filter((a) => a.slug !== featured.slug)} series={by("series")} />
      <AnimeMangaSection anime={by("anime")} manga={by("manga")} />
      <GamingSection items={by("jeux-video")} />
      <ComicsSection items={by("comics")} />
      <CollectorsSection items={by("collectors")} />
      <ShopTeaser products={await featuredProducts(4)} licenses={await licensesWithCounts()} />
      <PopularCarousel items={popular} />
      <EditorialSection critique={critique} dossiers={dossiers} guides={guides} />
      <Newsletter />
    </>
  );
}
