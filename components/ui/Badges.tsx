import Link from "next/link";
import type { ArticleType, UniverseSlug } from "@/types/content";
import { ARTICLE_TYPE_LABELS, UNIVERSE_MAP } from "@/data/universes";
import { cn } from "@/lib/utils";

/** Pastille d'univers aux couleurs de la rubrique. */
export function UniverseBadge({
  universe,
  link = false,
  className,
}: {
  universe: UniverseSlug;
  link?: boolean;
  className?: string;
}) {
  const u = UNIVERSE_MAP[universe];
  const cls = cn(
    "relative z-10 inline-flex items-center gap-1 border-2 border-ink bg-u px-2 py-0.5 font-mono text-[11px] leading-none font-bold tracking-widest text-u-fg uppercase",
    link && "transition-transform duration-200 ease-[var(--ease-pop)] hover:-rotate-3 hover:scale-105",
    className,
  );
  const content = (
    <>
      <span aria-hidden className="opacity-70">
        {u.number}
      </span>
      {u.short}
    </>
  );
  return link ? (
    <Link href={`/univers/${u.slug}`} data-universe={u.slug} className={cls}>
      {content}
    </Link>
  ) : (
    <span data-universe={u.slug} className={cls}>
      {content}
    </span>
  );
}

const TYPE_STYLES: Record<ArticleType, string> = {
  actu: "bg-paper text-ink",
  critique: "bg-pink text-ink",
  dossier: "bg-yellow text-ink",
  guide: "bg-cyan text-ink",
  top: "bg-lime text-ink",
};

export function TypeBadge({ type, className }: { type: ArticleType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 border-ink px-2 py-0.5 font-mono text-[11px] leading-none font-bold tracking-widest uppercase",
        TYPE_STYLES[type],
        className,
      )}
    >
      {ARTICLE_TYPE_LABELS[type]}
    </span>
  );
}

/** Signale clairement un contenu de démonstration. */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      title="Contenu de démonstration : article d'exemple rédigé pour présenter le site."
      className={cn(
        "inline-flex items-center gap-1 border-2 border-dashed border-current px-1.5 py-0.5 font-mono text-[10px] leading-none font-bold tracking-widest uppercase opacity-80",
        className,
      )}
    >
      Démo
    </span>
  );
}

/** Sticker incliné façon autocollant, avec un léger balancement. */
export function Sticker({
  children,
  className,
  tone = "yellow",
  rotate = -6,
  animated = true,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "yellow" | "pink" | "cyan" | "lime" | "paper" | "ink" | "u";
  rotate?: number;
  animated?: boolean;
}) {
  const tones = {
    yellow: "bg-yellow text-ink",
    pink: "bg-pink text-ink",
    cyan: "bg-cyan text-ink",
    lime: "bg-lime text-ink",
    paper: "bg-paper text-ink",
    ink: "bg-ink text-paper",
    u: "bg-u text-u-fg",
  };
  return (
    <span
      style={{ "--r": `${rotate}deg`, transform: `rotate(${rotate}deg)` } as React.CSSProperties}
      className={cn(
        "inline-block border-[3px] border-ink px-3 py-1 font-comic text-lg leading-none tracking-wide shadow-pop-sm",
        tones[tone],
        animated && "animate-wiggle",
        className,
      )}
    >
      {children}
    </span>
  );
}
