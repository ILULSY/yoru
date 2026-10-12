import Link from "next/link";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import type { NewsBrief } from "@/data/news-briefs";
import { UniverseBadge } from "@/components/ui/Badges";
import { LICENSE_MAP } from "@/data/shop/licenses";
import { formatDate, frTypo } from "@/lib/text";
import { cn } from "@/lib/utils";

/** Brève vérifiée : date, résumé rédigé par YORU et sources citées. */
export function BriefCard({ brief, large, className }: { brief: NewsBrief; large?: boolean; className?: string }) {
  const lic = brief.license ? LICENSE_MAP[brief.license] : undefined;
  return (
    <article
      data-universe={brief.universe}
      className={cn(
        "group relative flex h-full flex-col border-[3px] border-ink p-5 transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 hover:shadow-pop",
        large ? "bg-u text-u-fg sm:p-8" : "bg-paper text-ink",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <UniverseBadge universe={brief.universe} className={large ? "border-current" : undefined} />
        <time dateTime={brief.date} className="font-mono text-xs font-bold">
          {formatDate(brief.date)}
        </time>
      </div>
      <h3 className={cn("mt-3 leading-tight font-extrabold tracking-tight", large ? "text-[clamp(1.8rem,3.4vw,2.8rem)]" : "text-xl")}>
        {frTypo(brief.title)}
      </h3>
      <p className={cn("mt-3 leading-relaxed", large ? "text-lg" : "text-[0.95rem] opacity-90")}>{frTypo(brief.summary)}</p>
      <div className="mt-auto pt-4">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="font-semibold">Source{brief.sources.length > 1 ? "s" : ""} :</span>
          {brief.sources.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-bold underline decoration-2 underline-offset-2">
              {s.name}
              <ArrowUpRight className="size-3.5" aria-hidden />
              <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
            </a>
          ))}
        </p>
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] opacity-75">
          <BadgeCheck className="size-3.5" aria-hidden /> Vérifié le {formatDate(brief.verifiedAt)}
        </p>
        {brief.product ? (
          <Link
            href={`/boutique/produit/${brief.product.slug}`}
            className="mt-3 inline-flex items-center gap-1.5 border-2 border-ink px-2.5 py-1 text-sm font-bold transition-transform hover:-rotate-2"
            style={lic ? { background: lic.color, color: lic.ink } : undefined}
          >
            {brief.product.label} dans la boutique <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        ) : lic && (
          <Link
            href={`/boutique/licence/${lic.slug}`}
            className="mt-3 inline-flex items-center gap-1.5 border-2 border-ink px-2.5 py-1 text-sm font-bold transition-transform hover:-rotate-2"
            style={{ background: lic.color, color: lic.ink }}
          >
            Produits {lic.name} <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    </article>
  );
}
