import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { NewsBrief } from "@/data/news-briefs";
import type { LiveItem } from "@/lib/news/live";
import { UNIVERSE_MAP } from "@/data/universes";
import { BriefCard } from "@/components/news/BriefCard";
import { RelativeTime } from "@/components/news/RelativeTime";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

/** Bloc « En direct » de l'accueil : trois brèves vérifiées + derniers titres du fil. */
export function LiveNewsStrip({ briefs, live }: { briefs: NewsBrief[]; live: LiveItem[] }) {
  return (
    <section aria-labelledby="live-strip-title" className="relative mx-auto max-w-[88rem] px-4 pt-20 sm:px-6 lg:px-8">
      <SectionHeading
        id="live-strip-title"
        number="01"
        kicker="En direct"
        title="Les news du moment"
        numberClassName="[--stroke:var(--color-paper-3)]"
        link={{ href: "/news", label: "Toutes les news" }}
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:col-span-7" step={0.1}>
          {briefs.slice(0, 3).map((b, i) => (
            <RevealItem key={b.id} className={i === 0 ? "sm:col-span-2" : undefined}>
              <BriefCard brief={b} large={i === 0} />
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="lg:col-span-5" delay={0.1}>
          <div data-surface="ink" className="h-full border-[4px] border-ink bg-ink p-5 text-paper shadow-pop-lg">
          <p className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.3em] uppercase">
            <span className="relative flex size-2.5" aria-hidden>
              <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-pink" />
              <span className="relative inline-flex size-2.5 rounded-full bg-pink" />
            </span>
            Le fil des médias
          </p>
          {live.length ? (
            <ol className="mt-3 divide-y-2 divide-paper/15">
              {live.slice(0, 8).map((it) => (
                <li key={it.id} data-universe={it.universe}>
                  <a href={it.url} target="_blank" rel="noopener noreferrer" className="group flex gap-3 py-3">
                    <span className="mt-1.5 size-2.5 shrink-0 rotate-45 bg-u" aria-hidden />
                    <span className="min-w-0">
                      <span className="line-clamp-2 leading-snug font-semibold transition-colors group-hover:text-yellow">
                        {it.title}
                        <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
                      </span>
                      <span className="mt-1 flex gap-2 font-mono text-[11px] text-muted-ink">
                        <span className="font-bold text-paper">{it.source}</span>
                        <span>{UNIVERSE_MAP[it.universe].short}</span>
                        {it.date && <RelativeTime iso={it.date} />}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-muted-ink">Le fil est momentanément indisponible.</p>
          )}
          <Link href="/news" className="group mt-2 inline-flex items-center gap-1.5 font-bold text-yellow">
            Ouvrir le fil complet
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
