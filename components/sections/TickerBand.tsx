import Link from "next/link";
import { UNIVERSES } from "@/data/universes";
import { VelocityMarquee } from "@/components/motion/Scroll";
import { Sparkle } from "@/components/ui/Decor";

/**
 * Double bandeau incliné entre deux sections : il accélère avec le défilement.
 * Le premier est décoratif, le second contient de vrais liens vers les univers.
 */
export function TickerBand() {
  return (
    <div className="relative z-10 -my-6 overflow-hidden py-8" aria-label="Univers YORU">
      <div className="-rotate-2 border-y-[4px] border-ink bg-ink py-3 text-paper" aria-hidden>
        <VelocityMarquee baseVelocity={-2} itemClassName="gap-6 pr-6">
          {["Actus", "Critiques", "Dossiers", "Guides", "Sorties", "Coulisses"].map((w) => (
            <span key={w} className="display flex items-center gap-6 text-3xl sm:text-4xl">
              {w}
              <Sparkle className="size-5 text-yellow" />
            </span>
          ))}
        </VelocityMarquee>
      </div>
      <div className="-mt-1 rotate-1 border-y-[4px] border-ink bg-pink py-2.5">
        <ul className="flex flex-wrap justify-center gap-2 px-4">
          {UNIVERSES.map((u) => (
            <li key={u.slug}>
              <Link
                href={`/univers/${u.slug}`}
                data-universe={u.slug}
                className="inline-flex items-center gap-1.5 border-2 border-ink bg-u px-2.5 py-1 font-mono text-xs font-bold tracking-widest text-u-fg uppercase transition-transform duration-200 ease-[var(--ease-pop)] hover:-translate-y-0.5 hover:-rotate-3"
              >
                <span className="opacity-70">{u.number}</span> {u.short}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
