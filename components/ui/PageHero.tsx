import { CssSplit } from "@/components/motion/CssSplit";
import { cn } from "@/lib/utils";

/** En-tête de page intérieure : surtitre, titre XXL animé, chapô. */
export function PageHero({
  kicker,
  title,
  intro,
  className,
  children,
  tone = "paper",
}: {
  kicker: string;
  title: string;
  intro?: string;
  className?: string;
  children?: React.ReactNode;
  tone?: "paper" | "ink" | "yellow" | "pink";
}) {
  const tones = {
    paper: "bg-paper text-ink",
    ink: "bg-ink text-paper",
    yellow: "bg-yellow text-ink",
    pink: "bg-pink text-ink",
  };
  return (
    <header
      data-surface={tone === "ink" ? "ink" : undefined}
      className={cn("relative isolate overflow-hidden border-b-[4px] border-ink", tones[tone], className)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="halftone halftone-fade absolute -top-10 -right-10 size-[26rem] opacity-60 [--dot-gap:13px] [--fade-dir:225deg]" style={{ color: tone === "pink" ? "var(--color-yellow)" : "var(--color-pink)" }} />
      </div>
      <div className="mx-auto max-w-[88rem] px-4 pt-14 pb-12 sm:px-6 lg:px-8 lg:pt-20">
        <p className="rise-in font-mono text-xs font-bold tracking-[0.3em] uppercase">{kicker}</p>
        <CssSplit text={title} className="display mt-4 text-[clamp(3.2rem,11vw,9rem)]" />
        {intro && <p className="rise-in mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl" style={{ "--d": "0.25s" } as React.CSSProperties}>{intro}</p>}
        {children}
      </div>
    </header>
  );
}
