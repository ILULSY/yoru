import type { Metadata } from "next";
import { BRIEFS_SORTED } from "@/data/news-briefs";
import { getLiveNews } from "@/lib/news/live";
import { NEWS_REVALIDATE } from "@/lib/news/feeds";
import { PageHero } from "@/components/ui/PageHero";
import { BriefCard } from "@/components/news/BriefCard";
import { LiveFeed } from "@/components/news/LiveFeed";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "News — l'actu pop culture en direct",
  description:
    "Les dernières nouvelles de la pop culture : brèves vérifiées par la rédaction et fil en direct des médias spécialisés (cinéma, anime, jeux vidéo, comics, tech).",
  alternates: { canonical: "/news" },
};

const timeFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" });

export default async function NewsPage() {
  const live = await getLiveNews();
  const [lead, ...briefs] = BRIEFS_SORTED;
  const down = live.sources.filter((s) => !s.ok);

  return (
    <>
      <PageHero
        kicker="§ L'actu du moment"
        title="News"
        intro="Les nouvelles de la pop culture, maintenant : nos brèves vérifiées et sourcées, puis le fil en direct des médias spécialisés."
        tone="ink"
      >
        <p className="rise-in mt-6 inline-flex items-center gap-2 border-2 border-paper/40 px-3 py-1.5 font-mono text-xs" style={{ "--d": "0.35s" } as React.CSSProperties}>
          <span className="relative flex size-2.5" aria-hidden>
            <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-pink" />
            <span className="relative inline-flex size-2.5 rounded-full bg-pink" />
          </span>
          Fil mis à jour le {timeFmt.format(new Date(live.fetchedAt))} (actualisé toutes les {NEWS_REVALIDATE / 60} min)
        </p>
      </PageHero>

      {/* ── Brèves vérifiées ── */}
      <section aria-labelledby="briefs-title" className="mx-auto max-w-[88rem] px-4 pt-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="briefs-title" className="display text-[clamp(2.6rem,6vw,4.5rem)]">
            Les brèves <span className="text-outline [--stroke:var(--color-ink)]">vérifiées</span>
          </h2>
          <p className="max-w-md text-sm text-muted">
            Rédigées par YORU à partir des annonces officielles et des médias cités. Chaque brève est datée et sourcée.
          </p>
        </div>
        <RevealGroup className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3" step={0.06}>
          {lead && (
            <RevealItem className="md:col-span-2">
              <BriefCard brief={lead} large />
            </RevealItem>
          )}
          {briefs.map((b) => (
            <RevealItem key={b.id}>
              <BriefCard brief={b} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Fil en direct ── */}
      <section aria-labelledby="live-title" data-surface="ink" className="mt-20 border-y-[4px] border-ink bg-ink py-16 text-paper">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="live-title" className="display flex items-center gap-4 text-[clamp(2.6rem,6vw,4.5rem)]">
              <span className="relative flex size-4" aria-hidden>
                <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-pink" />
                <span className="relative inline-flex size-4 rounded-full bg-pink" />
              </span>
              Le fil en direct
            </h2>
            <p className="max-w-md text-sm text-muted-ink">
              Titres publiés par les médias ci-dessous via leurs flux RSS publics. Cliquez pour lire l&apos;article original sur leur
              site. YORU ne contrôle pas ces contenus.
            </p>
          </div>
          <div className="mt-8">
            {live.items.length ? (
              <LiveFeed items={live.items.slice(0, 150)} />
            ) : (
              <p className="border-[3px] border-paper/40 p-6 text-lg">
                Le fil est momentanément indisponible : aucune source n&apos;a pu être jointe. Les brèves vérifiées ci-dessus restent à
                jour.
              </p>
            )}
          </div>

          <div className="mt-12 border-t-2 border-paper/15 pt-6">
            <h3 className="font-mono text-xs font-bold tracking-[0.3em] text-muted-ink uppercase">Sources du fil</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {live.sources.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-paper/30 px-3 py-1.5 text-sm font-semibold transition-colors hover:border-yellow hover:text-yellow"
                  >
                    <span className={`size-2 rounded-full ${s.ok ? "bg-lime" : "bg-pink"}`} aria-hidden />
                    {s.name}
                    <span className="sr-only">{s.ok ? " (disponible)" : " (indisponible)"}</span>
                  </a>
                </li>
              ))}
            </ul>
            {down.length > 0 && (
              <p className="mt-3 text-sm text-muted-ink">
                {down.length} source{down.length > 1 ? "s" : ""} momentanément indisponible{down.length > 1 ? "s" : ""} :{" "}
                {down.map((d) => d.name).join(", ")}.
              </p>
            )}
          </div>
        </div>
      </section>
      <div className="pb-24" />
    </>
  );
}
