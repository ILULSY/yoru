import { cn } from "@/lib/utils";

/**
 * Éléments graphiques décoratifs (aria-hidden) : étoiles d'éclat, éclairs,
 * gribouillis, flèches dessinées. SVG légers, colorés par currentColor.
 */

const BURST =
  "M50 0 56.4 13.6 67.1 3 68.5 18 82.1 11.7 78.3 26.2 93.3 25 84.8 37.3 99.2 41.3 87 50 99.2 58.7 84.8 62.7 93.3 75 78.3 73.8 82.1 88.3 68.5 82 67.1 97 56.4 86.4 50 100 43.6 86.4 32.9 97 31.5 82 17.9 88.3 21.7 73.8 6.7 75 15.2 62.7 0.8 58.7 13 50 0.8 41.3 15.2 37.3 6.7 25 21.7 26.2 17.9 11.7 31.5 18 32.9 3 43.6 13.6Z";

export function Burst({
  className,
  children,
  fill = "var(--color-yellow)",
  stroke = "var(--color-ink)",
  spin = false,
}: {
  className?: string;
  children?: React.ReactNode;
  fill?: string;
  stroke?: string;
  spin?: boolean;
}) {
  return (
    <span className={cn("relative inline-grid place-items-center", className)}>
      <svg viewBox="-4 -4 108 108" className={cn("absolute inset-0 size-full", spin && "animate-spin-slow")} aria-hidden>
        <path d={BURST} fill={fill} stroke={stroke} strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
      {children && <span className="relative text-center">{children}</span>}
    </span>
  );
}

export function Bolt({ className, fill = "var(--color-yellow)" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 60 100" className={className} aria-hidden>
      <path
        d="M36 2L4 58h22L18 98 56 36H33L44 2z"
        fill={fill}
        stroke="var(--color-ink)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" className={className} aria-hidden fill="none">
      <path
        d="M2 14c8-10 16-10 24 0s16 10 24 0 16-10 24 0 16 10 24 0 12-8 20-4"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DrawnArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden fill="none">
      <path
        d="M6 12c30-6 70 2 86 40"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray="0"
      />
      <path d="M74 50l20 6 6-20" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Sparkle({ className, fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path d="M20 0c2 11 9 18 20 20-11 2-18 9-20 20-2-11-9-18-20-20C11 18 18 11 20 0z" fill={fill} />
    </svg>
  );
}

/** Coins façon HUD de jeu vidéo. */
export function HudCorners({ className }: { className?: string }) {
  const c = "absolute size-5 border-current";
  return (
    <span className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <span className={cn(c, "top-0 left-0 border-t-[3px] border-l-[3px]")} />
      <span className={cn(c, "top-0 right-0 border-t-[3px] border-r-[3px]")} />
      <span className={cn(c, "bottom-0 left-0 border-b-[3px] border-l-[3px]")} />
      <span className={cn(c, "right-0 bottom-0 border-r-[3px] border-b-[3px]")} />
    </span>
  );
}
