"use client";

import Link from "next/link";
import { m, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import type { MediaAsset, UniverseSlug } from "@/types/content";
import { SmartImage } from "@/components/ui/SmartImage";
import { Bolt, Burst, Sparkle } from "@/components/ui/Decor";
import { useCalm } from "@/lib/stores/motion-pref";
import { cn } from "@/lib/utils";

export interface CollageItem {
  asset: MediaAsset;
  universe: UniverseSlug;
  label: string;
}

/** Position, inclinaison et profondeur de chaque vignette du collage. */
const LAYOUT = [
  { cls: "left-[6%] top-[4%] w-[58%] aspect-[4/5] z-20", r: -4, depth: 1, d: 0.15, sizes: "(min-width: 1024px) 28vw, 55vw" },
  { cls: "right-[2%] top-[0%] w-[40%] aspect-square z-10", r: 6, depth: 0.55, d: 0.27, sizes: "(min-width: 1024px) 19vw, 38vw" },
  { cls: "right-[4%] bottom-[8%] w-[46%] aspect-[4/3] z-30", r: -7, depth: 1.4, d: 0.39, sizes: "(min-width: 1024px) 22vw, 44vw" },
  { cls: "left-[0%] bottom-[2%] w-[34%] aspect-[3/4] z-10", r: 5, depth: 0.7, d: 0.5, sizes: "(min-width: 1024px) 16vw, 32vw" },
];

function Layer({
  depth,
  px,
  py,
  scrollY,
  children,
  className,
}: {
  depth: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
  scrollY: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
}) {
  const x = useTransform(px, (v) => v * 22 * depth);
  const yPointer = useTransform(py, (v) => v * 18 * depth);
  const yScroll = useTransform(scrollY, [0, 1], [0, -90 * depth]);
  const y = useTransform(() => yPointer.get() + yScroll.get());
  return (
    <m.div className={cn("absolute", className)} style={{ x, y }}>
      {children}
    </m.div>
  );
}

/**
 * Collage d'images découpées façon couverture de magazine.
 * Profondeur : chaque calque bouge à sa vitesse au défilement et suit
 * légèrement la souris. Les vignettes mènent vers leur univers.
 */
export function HeroCollage({ items }: { items: CollageItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const calm = useCalm();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 80, damping: 18 });
  const py = useSpring(rawY, { stiffness: 80, damping: 18 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const zero = useMotionValue(0);
  const scroll = calm ? zero : scrollYProgress;

  const onMove = (e: React.PointerEvent) => {
    if (calm || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
      className="relative mx-auto aspect-[1/1.02] w-full max-w-[40rem] lg:max-w-none"
    >
      {items.slice(0, 4).map((item, i) => {
        const l = LAYOUT[i]!;
        return (
          <Layer key={item.asset.key} depth={calm ? 0 : l.depth} px={px} py={py} scrollY={scroll} className={l.cls}>
            <div className="slide-in-card size-full" style={{ "--r": `${l.r}deg`, "--d": `${l.d}s` } as React.CSSProperties}>
              <Link
                href={`/univers/${item.universe}`}
                data-universe={item.universe}
                className="group relative block size-full overflow-hidden border-[4px] border-ink bg-ink shadow-pop-lg transition-transform duration-500 ease-[var(--ease-pop)] hover:z-40 hover:scale-[1.04] hover:rotate-0"
              >
                <SmartImage
                  asset={item.asset}
                  sizes={l.sizes}
                  priority={i === 0}
                  quality={i === 0 ? 75 : 70}
                  imgClassName="transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-u opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-40" aria-hidden />
                <span className="absolute bottom-2 left-2 translate-y-[140%] border-2 border-ink bg-u px-2 py-1 font-mono text-[11px] font-bold tracking-widest text-u-fg uppercase transition-transform duration-300 ease-[var(--ease-pop)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
                  {item.label} →
                </span>
              </Link>
            </div>
          </Layer>
        );
      })}

      {/* Stickers et formes flottantes */}
      <Layer depth={calm ? 0 : 1.8} px={px} py={py} scrollY={scroll} className="top-[38%] -left-[4%] z-40">
        <div className="pop-in" style={{ "--r": "-12deg", "--d": "0.7s" } as React.CSSProperties}>
          <Burst className="size-28 font-comic text-2xl leading-none sm:size-36 sm:text-3xl" spin>
            NEW!
          </Burst>
        </div>
      </Layer>
      <Layer depth={calm ? 0 : 2.2} px={px} py={py} scrollY={scroll} className="top-[52%] right-[44%] z-40 hidden sm:block">
        <div className="pop-in" style={{ "--r": "4deg", "--d": "0.85s" } as React.CSSProperties}>
          <p className="bubble px-5 py-3 font-comic text-xl leading-tight [--tail-x:70%]">
            Tu lis quoi
            <br /> ce soir ?
          </p>
        </div>
      </Layer>
      <Layer depth={calm ? 0 : 1.2} px={px} py={py} scrollY={scroll} className="-top-[3%] left-[52%] z-30">
        <div className="pop-in" style={{ "--r": "14deg", "--d": "0.95s" } as React.CSSProperties}>
          <Bolt className="h-24 w-14 animate-float sm:h-28" />
        </div>
      </Layer>
      <Layer depth={calm ? 0 : 0.4} px={px} py={py} scrollY={scroll} className="right-[-2%] bottom-[44%] z-0">
        <Sparkle className="size-12 animate-float-rev text-cyan" fill="var(--color-cyan)" />
      </Layer>
      <Layer depth={calm ? 0 : 0.3} px={px} py={py} scrollY={scroll} className="bottom-[-2%] left-[38%] z-0">
        <div className="halftone size-28 rounded-full text-violet [--dot-gap:9px]" aria-hidden />
      </Layer>
    </div>
  );
}
