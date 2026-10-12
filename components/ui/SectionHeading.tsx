import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SplitTitle } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * En-tête de section façon magazine : numéro de rubrique géant détouré,
 * surtitre technique et titre XXL révélé mot par mot.
 */
export function SectionHeading({
  number,
  kicker,
  title,
  intro,
  link,
  className,
  titleClassName,
  numberClassName,
  id,
}: {
  number: string;
  kicker: string;
  title: string;
  intro?: string;
  link?: { href: string; label: string };
  className?: string;
  titleClassName?: string;
  numberClassName?: string;
  id?: string;
}) {
  return (
    <div className={cn("relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="relative">
        <span
          aria-hidden
          className={cn(
            "text-outline pointer-events-none absolute -top-10 -left-2 font-display text-[7rem] leading-none select-none [--stroke-w:2px] sm:-top-14 sm:text-[10rem]",
            numberClassName,
          )}
        >
          {number}
        </span>
        <p className="relative font-mono text-xs font-bold tracking-[0.3em] uppercase">
          <span aria-hidden>§ {number} — </span>
          {kicker}
        </p>
        <SplitTitle
          id={id}
          text={title}
          className={cn("display relative mt-3 text-[clamp(2.9rem,8.5vw,7rem)]", titleClassName)}
        />
        {intro && <p className="relative mt-4 max-w-xl text-lg leading-relaxed opacity-85">{intro}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className="group inline-flex shrink-0 items-center gap-2 self-start border-[3px] border-current px-4 py-2.5 font-bold transition-transform duration-200 ease-[var(--ease-pop)] hover:-rotate-2 md:self-auto"
        >
          {link.label}
          <ArrowUpRight
            className="size-5 transition-transform duration-300 ease-[var(--ease-pop)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-12"
            aria-hidden
          />
        </Link>
      )}
    </div>
  );
}
