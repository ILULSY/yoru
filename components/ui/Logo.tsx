import { cn } from "@/lib/utils";

/** Croissant de lune du logo (cercle r 13 évidé par un cercle r 11 décalé vers le haut à droite). */
export const CRESCENT_PATH = "M21.12 11.32A13 13 0 1 0 36.68 26.88A11 11 0 0 1 21.12 11.32Z";

/**
 * Logo YORU (夜, « nuit » en japonais) : un croissant de lune violet sur un
 * disque noir, avec une petite étoile. Au survol du lien parent (.group), la
 * lune pivote et l'étoile scintille.
 * `ring` ajoute un liseré violet pour garder la pastille lisible sur fond noir.
 */
export function LogoMark({ className, ring = false }: { className?: string; ring?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("shrink-0", className)} aria-hidden>
      <circle
        cx="24"
        cy="24"
        r={ring ? 22.5 : 23}
        fill="var(--color-ink)"
        stroke={ring ? "var(--color-violet)" : "none"}
        strokeWidth={ring ? 1.5 : 0}
      />
      <g className="origin-center transition-transform duration-700 ease-[var(--ease-pop)] group-hover:-rotate-[24deg]">
        <path d={CRESCENT_PATH} fill="var(--color-violet)" />
      </g>
      <path
        d="M33 12.5l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z"
        fill="var(--color-paper)"
        className="origin-[33px_16px] transition-transform duration-500 ease-[var(--ease-pop)] group-hover:scale-150 group-hover:rotate-45"
      />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="size-9 sm:size-10" />
      {!compact && (
        <span className="flex items-baseline gap-1.5">
          <span className="relative font-display text-[1.65rem] leading-none tracking-tight uppercase sm:text-[1.9rem]">
            <span
              className="absolute inset-0 translate-x-[3px] translate-y-[3px] text-violet transition-transform duration-300 ease-[var(--ease-pop)] group-hover:translate-x-[5px] group-hover:translate-y-[4px]"
              aria-hidden
            >
              Yoru
            </span>
            <span className="relative">Yoru</span>
          </span>
          <span lang="ja" className="text-sm leading-none font-bold text-violet" aria-hidden>
            夜
          </span>
        </span>
      )}
    </span>
  );
}
