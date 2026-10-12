import { Info, Lightbulb, ThumbsDown, ThumbsUp, TriangleAlert } from "lucide-react";
import type { Block } from "@/types/content";
import { getMedia } from "@/data/media";
import { Inline } from "@/components/article/Inline";
import { SmartImage, PhotoCredit } from "@/components/ui/SmartImage";
import { ScoreDial } from "@/components/ui/ScoreDial";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const CALLOUTS = {
  info: { icon: Info, cls: "bg-cyan", label: "Info" },
  tip: { icon: Lightbulb, cls: "bg-lime", label: "Conseil" },
  warning: { icon: TriangleAlert, cls: "bg-orange", label: "Attention" },
};

/** Rendu des blocs structurés d'un article. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  // Numéro de chaque intertitre et position du premier paragraphe (lettrine).
  const h2Numbers = blocks.reduce<number[]>((acc, b, i) => {
    acc[i] = (acc[i - 1] ?? 0) + (b.type === "h2" ? 1 : 0);
    return acc;
  }, []);
  const firstParagraph = blocks.findIndex((b) => b.type === "p");

  return (
    <div className="prose-pop">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p": {
            const dropCap = i === firstParagraph;
            return (
              <p
                key={i}
                className={cn(
                  "my-6",
                  dropCap &&
                    "text-xl leading-relaxed first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:border-[3px] first-letter:border-ink first-letter:bg-u first-letter:px-2.5 first-letter:py-1 first-letter:font-display first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:text-u-fg",
                )}
              >
                <Inline text={b.text} />
              </p>
            );
          }
          case "h2":
            return (
              <h2 key={i} id={b.id} className="group relative mt-16 mb-6 scroll-mt-28 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight font-extrabold tracking-tight">
                <span aria-hidden className="mb-2 block font-mono text-sm font-bold tracking-[0.3em] text-muted">
                  {String(h2Numbers[i]).padStart(2, "0")} —
                </span>
                <Inline text={b.text} />
                <span aria-hidden className="mt-3 block h-1.5 w-16 bg-u transition-[width] duration-500 ease-[var(--ease-expo)] group-hover:w-32" />
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-10 mb-3 text-2xl font-bold">
                <Inline text={b.text} />
              </h3>
            );
          case "quote":
            return (
              <Reveal as="figure" key={i} className="relative my-12 border-l-[6px] border-u py-2 pl-6 sm:pl-10" x={-30} y={0}>
                <span aria-hidden className="absolute -top-8 left-4 font-display text-[7rem] leading-none text-u sm:left-8">
                  “
                </span>
                <blockquote className="relative text-[clamp(1.5rem,3vw,2.1rem)] leading-snug font-bold tracking-tight">
                  <Inline text={b.text} />
                </blockquote>
                {b.cite && <figcaption className="mt-3 font-mono text-sm text-muted">— {b.cite}</figcaption>}
              </Reveal>
            );
          case "list":
            return b.ordered ? (
              <ol key={i} className="my-8 space-y-4">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-4">
                    <span aria-hidden className="grid size-9 shrink-0 place-items-center border-[3px] border-ink bg-u font-display text-lg text-u-fg">
                      {j + 1}
                    </span>
                    <span className="pt-0.5">
                      <Inline text={item} />
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="my-8 space-y-3">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 size-3 shrink-0 rotate-45 border-2 border-ink bg-u" />
                    <span>
                      <Inline text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "image": {
            const asset = getMedia(b.image);
            return (
              <figure key={i} className="my-12 lg:-mx-16">
                <ImageReveal className="aspect-[16/9] border-[4px] border-ink shadow-pop-lg">
                  <SmartImage asset={asset} sizes="(min-width: 1024px) 860px, 94vw" />
                </ImageReveal>
                <figcaption className="mt-3 flex flex-col gap-1 text-sm text-muted sm:flex-row sm:items-baseline sm:justify-between">
                  {b.caption && <span className="font-semibold text-ink">{b.caption}</span>}
                  <PhotoCredit asset={asset} />
                </figcaption>
              </figure>
            );
          }
          case "callout": {
            const c = CALLOUTS[b.tone];
            const Icon = c.icon;
            return (
              <Reveal as="aside" key={i} className={cn("my-10 border-[3px] border-ink p-5 text-ink shadow-pop sm:p-6", c.cls)} aria-label={b.title ?? c.label}>
                <p className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.25em] uppercase">
                  <Icon className="size-4" aria-hidden /> {b.title ?? c.label}
                </p>
                <p className="mt-2 text-[1.05rem] leading-relaxed">
                  <Inline text={b.text} />
                </p>
              </Reveal>
            );
          }
          case "verdict":
            return (
              <Reveal as="aside" key={i} className="my-14 border-[4px] border-ink bg-paper-2 shadow-pop-lg" aria-label="Verdict de la rédaction">
                <div className="flex flex-col items-center gap-5 border-b-[4px] border-ink bg-ink p-6 text-paper sm:flex-row">
                  <ScoreDial score={b.score} size={120} />
                  <div>
                    <p className="font-mono text-xs font-bold tracking-[0.3em] text-yellow uppercase">Le verdict</p>
                    <p className="mt-2 text-xl leading-snug font-bold">
                      <Inline text={b.text} />
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 p-6 sm:grid-cols-2">
                  <div>
                    <p className="flex items-center gap-2 font-bold">
                      <ThumbsUp className="size-5 text-[#1a7f37]" aria-hidden /> On a aimé
                    </p>
                    <ul className="mt-3 space-y-2 text-base">
                      {b.pros.map((p, j) => (
                        <li key={j} className="flex gap-2">
                          <span aria-hidden>+</span> <Inline text={p} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 font-bold">
                      <ThumbsDown className="size-5 text-[#b0005a]" aria-hidden /> Moins convaincant
                    </p>
                    <ul className="mt-3 space-y-2 text-base">
                      {b.cons.map((p, j) => (
                        <li key={j} className="flex gap-2">
                          <span aria-hidden>−</span> <Inline text={p} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
        }
      })}
    </div>
  );
}
