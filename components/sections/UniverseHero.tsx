import type { MediaAsset, Universe } from "@/types/content";
import { SmartImage, PhotoCredit } from "@/components/ui/SmartImage";
import { Sticker } from "@/components/ui/Badges";
import { Burst, HudCorners, Sparkle } from "@/components/ui/Decor";
import { UniverseIcon, PATTERN_CLASS } from "@/components/ui/UniverseIcon";
import { CssSplit } from "@/components/motion/CssSplit";
import { Parallax } from "@/components/motion/Scroll";
import { cn } from "@/lib/utils";

/** Cadre de l'image d'ouverture, propre à chaque univers. */
function Frame({ universe, asset }: { universe: Universe; asset: MediaAsset }) {
  const img = <SmartImage asset={asset} sizes="(min-width: 1024px) 42vw, 92vw" priority quality={75} />;
  switch (universe.slug) {
    case "cinema":
      return (
        <div className="border-[4px] border-ink bg-ink p-0 shadow-pop-lg">
          <div className="film-perf h-6 [--perf:var(--color-paper)]" aria-hidden />
          <div className="relative aspect-[16/10]">{img}</div>
          <div className="film-perf h-6 [--perf:var(--color-paper)]" aria-hidden />
        </div>
      );
    case "series":
      return (
        <div className="rounded-[2.2rem] border-[4px] border-ink bg-ink p-4 shadow-pop-lg">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] border-[3px] border-ink">
            {img}
            <div className="scanlines pointer-events-none absolute inset-0 opacity-25 [--line:rgba(0,0,0,0.7)]" aria-hidden />
            <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]" aria-hidden />
          </div>
          <div className="mt-3 flex items-center justify-end gap-2 px-2" aria-hidden>
            <span className="size-3 rounded-full bg-pink" />
            <span className="size-3 rounded-full bg-yellow" />
          </div>
        </div>
      );
    case "anime":
      return (
        <div className="relative">
          <div className="speedlines absolute -inset-16 opacity-50 [--line:var(--color-ink)]" aria-hidden />
          <div className="relative aspect-[4/3] -rotate-2 border-[4px] border-ink shadow-pop-lg">{img}</div>
        </div>
      );
    case "manga":
      return (
        <div className="grid grid-cols-3 gap-2 border-[5px] border-ink bg-ink p-2">
          <div className="relative col-span-2 row-span-2 aspect-[3/4] overflow-hidden border-[3px] border-paper">
            <div className="absolute inset-0 [&_img]:grayscale [&_img]:contrast-125">{img}</div>
          </div>
          <div className="tone border-[3px] border-paper bg-paper text-ink" aria-hidden />
          <div className="grid place-items-center border-[3px] border-paper bg-paper font-display text-4xl text-ink [writing-mode:vertical-rl]" aria-hidden>
            漫画
          </div>
        </div>
      );
    case "jeux-video":
      return (
        <div className="relative p-5 text-cyan">
          <HudCorners />
          <div className="relative aspect-[16/10] border-[3px] border-cyan shadow-[0_0_40px_rgba(0,229,255,0.35)]">{img}</div>
          <p className="mt-3 flex justify-between font-mono text-xs tracking-[0.25em] uppercase">
            <span>HP ██████░░</span>
            <span className="animate-blink">Press start</span>
          </p>
        </div>
      );
    case "comics":
      return (
        <div className="relative">
          <div className="relative aspect-[4/3] rotate-1 border-[5px] border-ink shadow-pop-lg">
            {img}
            <div className="benday pointer-events-none absolute inset-0 opacity-20 mix-blend-screen [--dot:var(--color-yellow)]" aria-hidden />
          </div>
          <Burst className="absolute -bottom-10 -left-8 size-32 font-comic text-3xl text-ink" fill="var(--color-yellow)" spin>
            POW!
          </Burst>
        </div>
      );
    case "collectors":
      return (
        <div className="holo animate-holo rounded-3xl border-[4px] border-ink p-3 shadow-pop-lg">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-[3px] border-ink">{img}</div>
          <p className="mt-2 flex justify-between px-1 font-mono text-xs font-bold text-ink">
            <span>★★★★★ ULTRA RARE</span>
            <span>N° 007</span>
          </p>
        </div>
      );
    case "tech":
      return (
        <div className="overflow-hidden rounded-lg border-[4px] border-ink bg-ink shadow-pop-lg">
          <div className="flex items-center gap-2 border-b-[3px] border-ink bg-ink-3 px-3 py-2" aria-hidden>
            <span className="size-3 rounded-full bg-pink" />
            <span className="size-3 rounded-full bg-yellow" />
            <span className="size-3 rounded-full bg-lime" />
            <span className="ml-2 font-mono text-xs text-muted-ink">~/yoru/tech</span>
          </div>
          <div className="relative aspect-[16/10]">{img}</div>
          <p className="border-t-[3px] border-ink px-3 py-2 font-mono text-xs text-lime">
            $ boot --geek-mode <span className="animate-blink">▌</span>
          </p>
        </div>
      );
  }
}

export function UniverseHero({ universe, cover, count }: { universe: Universe; cover: MediaAsset; count: number }) {
  return (
    <header
      data-universe={universe.slug}
      data-surface={["series", "manga", "comics", "jeux-video"].includes(universe.slug) ? "ink" : undefined}
      className={cn(
        "relative isolate overflow-hidden border-b-[4px] border-ink",
        universe.slug === "jeux-video" ? "bg-ink text-paper" : "bg-u text-u-fg",
      )}
    >
      <div
        aria-hidden
        className={cn(PATTERN_CLASS[universe.slug], "absolute inset-0 -z-10 opacity-[0.14] [--dot:currentColor] [--line:currentColor]", universe.slug === "collectors" && "opacity-25")}
      />
      <span
        aria-hidden
        className="text-outline pointer-events-none absolute -right-6 -bottom-16 -z-10 font-display text-[clamp(14rem,40vw,34rem)] leading-none [--stroke:currentColor] [--stroke-w:3px] opacity-20"
      >
        {universe.number}
      </span>

      <div className="mx-auto grid max-w-[88rem] items-center gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="relative">
          <p className="rise-in flex items-center gap-3 font-mono text-xs font-bold tracking-[0.3em] uppercase">
            <span className="grid size-10 place-items-center border-2 border-current">
              <UniverseIcon universe={universe.slug} className="size-5" />
            </span>
            Univers {universe.number} · {count} article{count > 1 ? "s" : ""}
          </p>
          <CssSplit
            text={universe.name}
            className={cn(
              "display mt-5 text-[clamp(4rem,13vw,10rem)]",
              universe.slug === "jeux-video" && "text-pop [--pop-1:var(--color-violet)] [--pop-2:var(--color-cyan)]",
            )}
          />
          <p className="rise-in mt-5 text-2xl font-bold" style={{ "--d": "0.3s" } as React.CSSProperties}>
            {universe.tagline}
          </p>
          <p className="rise-in mt-4 max-w-xl text-lg leading-relaxed opacity-85" style={{ "--d": "0.4s" } as React.CSSProperties}>
            {universe.description}
          </p>
          <div className="pop-in mt-8 inline-block" style={{ "--r": "-6deg", "--d": "0.6s" } as React.CSSProperties}>
            <Sticker tone={universe.slug === "cinema" ? "pink" : "yellow"} rotate={-6}>
              {universe.shout}
            </Sticker>
          </div>
        </div>

        <div className="slide-in-card relative" style={{ "--r": "0deg", "--d": "0.2s" } as React.CSSProperties}>
          <Parallax speed={0.06}>
            <Frame universe={universe} asset={cover} />
          </Parallax>
          <div className="mt-3">
            <PhotoCredit asset={cover} className="opacity-80" />
          </div>
          <Sparkle className="absolute -top-6 -right-4 size-12 animate-float text-paper" fill="currentColor" />
        </div>
      </div>
    </header>
  );
}
