"use client";

import { m, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { useCalm } from "@/lib/stores/motion-pref";
import { cn } from "@/lib/utils";

const SOFT = { stiffness: 220, damping: 20, mass: 0.6 };

/**
 * Carte inclinable en 3D qui suit le pointeur, avec reflet lumineux et
 * (option) effet holographique façon carte rare. Désactivée au tactile et
 * quand les animations sont réduites.
 */
export function TiltCard({
  children,
  className,
  max = 9,
  holo = false,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  holo?: boolean;
  glare?: boolean;
}) {
  const calm = useCalm();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useSpring(0, SOFT);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SOFT);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SOFT);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)`;
  const holoPos = useMotionTemplate`${gx} ${gy}`;
  const holoOpacity = useTransform(hover, [0, 1], [0, 0.55]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (calm || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  return (
    <m.div
      className={cn("relative [transform-style:preserve-3d]", className)}
      style={calm ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerEnter={(e) => e.pointerType === "mouse" && hover.set(1)}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
        hover.set(0);
      }}
    >
      {children}
      {holo && !calm && (
        <m.div
          aria-hidden
          className="holo pointer-events-none absolute inset-0 z-20 mix-blend-color-dodge"
          style={{ opacity: holoOpacity, backgroundPosition: holoPos, backgroundSize: "200% 200%" }}
        />
      )}
      {glare && !calm && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light"
          style={{ background: glareBg, opacity: hover }}
        />
      )}
    </m.div>
  );
}

/** Élément « aimanté » : il glisse légèrement vers le pointeur. */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const calm = useCalm();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 18, mass: 0.5 });
  const y = useSpring(0, { stiffness: 300, damping: 18, mass: 0.5 });

  return (
    <m.div
      ref={ref}
      className={cn("inline-block", className)}
      style={calm ? undefined : { x, y }}
      onPointerMove={(e) => {
        if (calm || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.div>
  );
}
