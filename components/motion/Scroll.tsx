"use client";

import {
  m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  animate,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useCalm } from "@/lib/stores/motion-pref";

/**
 * Primitives synchronisées avec le défilement. Toutes animent uniquement
 * transform / opacity et se figent si les animations sont réduites.
 */

/** Décalage vertical proportionnel au défilement (effet de profondeur). */
export function Parallax({
  children,
  className,
  speed = 0.15,
  rotate = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Amplitude relative : 0.1 = discret, 0.4 = marqué. Négatif = sens inverse. */
  speed?: number;
  rotate?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useCalm();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  const r = useTransform(scrollYProgress, [0, 1], [-rotate, rotate]);
  return (
    <m.div ref={ref} className={className} style={reduce ? undefined : { y, rotate: r }}>
      {children}
    </m.div>
  );
}

/** Barre de progression de lecture / de page. */
export function ScrollProgressBar({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });
  return (
    <m.div
      aria-hidden
      className={cn("h-1 origin-left bg-[linear-gradient(90deg,var(--color-pink),var(--color-yellow),var(--color-cyan))]", className)}
      style={{ scaleX }}
    />
  );
}

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/**
 * Bandeau défilant dont la vitesse réagit au défilement de la page :
 * il accélère quand on scrolle vite et change de sens selon la direction.
 */
export function VelocityMarquee({
  children,
  baseVelocity = -2.5,
  className,
  itemClassName,
}: {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
  itemClassName?: string;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);
  const reduce = useCalm();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={ref} className={cn("flex overflow-hidden whitespace-nowrap", className)}>
      <m.div className="flex shrink-0 flex-nowrap" style={reduce ? undefined : { x }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={cn("flex shrink-0 items-center", itemClassName)} aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </m.div>
    </div>
  );
}

/**
 * Compteur animé quand il entre dans l'écran. La valeur finale est rendue
 * côté serveur (lisible sans JavaScript) ; l'animation part de zéro ensuite.
 */
export function CountUp({ to, className, suffix = "" }: { to: number; className?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useCalm();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView || reduce) return;
    // Pendant l'intro, on attend que le rideau soit levé.
    const delay = document.documentElement.dataset.intro === "on" ? 1.9 : 0.5;
    const controls = animate(0, to, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

/** Retourne un MotionValue de progression (0 → 1) pour un élément. */
export function useElementProgress(
  ref: React.RefObject<HTMLElement | null>,
  offset: ["start end", "end start"] | ["start start", "end end"] = ["start end", "end start"],
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return scrollYProgress;
}
