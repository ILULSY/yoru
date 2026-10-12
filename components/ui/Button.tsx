import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "ink" | "yellow" | "pink" | "paper" | "ghost" | "u";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  ink: "bg-ink text-paper [--btn-shadow:var(--color-pink)]",
  yellow: "bg-yellow text-ink [--btn-shadow:var(--color-ink)]",
  pink: "bg-pink text-ink [--btn-shadow:var(--color-ink)]",
  paper: "bg-paper text-ink [--btn-shadow:var(--color-ink)]",
  u: "bg-u text-u-fg [--btn-shadow:var(--color-ink)]",
  ghost: "bg-transparent text-current border-current [--btn-shadow:transparent] hover:bg-current/10",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-4 text-sm gap-1.5",
  md: "h-12 px-6 text-base gap-2",
  lg: "h-14 px-7 text-lg gap-2.5",
};

/**
 * Bouton « pop » : bordure épaisse et ombre décalée. Au survol il se soulève,
 * au clic il s'enfonce dans son ombre — retour visuel immédiat, en CSS pur
 * (transform uniquement), pour rester fluide même avant l'hydratation.
 */
export function buttonClasses(variant: Variant = "ink", size: Size = "md", className?: string) {
  return cn(
    "group/btn relative inline-flex items-center justify-center border-[3px] border-ink font-bold tracking-tight whitespace-nowrap select-none",
    "shadow-[4px_4px_0_0_var(--btn-shadow)] transition-[transform,box-shadow,background-color] duration-200 ease-[var(--ease-pop)]",
    "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--btn-shadow)]",
    "active:translate-x-1 active:translate-y-1 active:shadow-[0_0_0_0_var(--btn-shadow)] active:duration-75",
    "disabled:pointer-events-none disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: BtnProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

type LinkProps = React.ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: LinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}

/** Flèche qui glisse au survol du bouton parent. */
export function BtnArrow({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-5 overflow-hidden", className)} aria-hidden>
      <svg
        viewBox="0 0 20 20"
        className="absolute inset-0 size-5 transition-transform duration-300 ease-[var(--ease-expo)] group-hover/btn:translate-x-full"
      >
        <path d="M3 10h12M10 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
      </svg>
      <svg
        viewBox="0 0 20 20"
        className="absolute inset-0 size-5 -translate-x-full transition-transform duration-300 ease-[var(--ease-expo)] group-hover/btn:translate-x-0"
      >
        <path d="M3 10h12M10 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
      </svg>
    </span>
  );
}
