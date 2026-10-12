"use client";

import { m } from "motion/react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Note sur 10 dans un cadran circulaire qui se remplit à l'apparition. */
export function ScoreDial({ score, className, size = 120 }: { score: number; className?: string; size?: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="10" />
        <m.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--color-pink)"
          strokeWidth="7"
          strokeLinecap="butt"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - score / 10) }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4, ease: EASE.expo, delay: 0.2 }}
        />
      </svg>
      <span className="relative text-center leading-none">
        <span className="display block text-[2.6em]" style={{ fontSize: size * 0.34 }}>
          {score.toString().replace(".", ",")}
        </span>
        <span className="font-mono text-[11px] font-bold">/10</span>
      </span>
      <span className="sr-only">Note : {score} sur 10</span>
    </div>
  );
}
