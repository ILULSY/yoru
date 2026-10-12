"use client";

import { m } from "motion/react";
import { Pause, Play } from "lucide-react";
import { setMotionPref, useMotionPref } from "@/lib/stores/motion-pref";
import { useHydrated } from "@/lib/stores/favorites";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Interrupteur « Animations » : permet de réduire les animations même si la
 * préférence système ne le demande pas (et inversement). Choix mémorisé.
 */
export function MotionToggle({ className }: { className?: string }) {
  const pref = useMotionPref();
  const hydrated = useHydrated();
  const on = !hydrated || pref === "full";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setMotionPref(on ? "reduced" : "full")}
      className={cn("group inline-flex min-h-11 items-center gap-3 text-sm font-semibold", className)}
    >
      <span
        className={cn(
          "relative flex h-7 w-12 items-center border-2 border-current p-0.5 transition-colors",
          on ? "justify-end bg-lime text-ink" : "justify-start",
        )}
        aria-hidden
      >
        <m.span layout transition={SPRING.snappy} className="grid size-5 place-items-center bg-ink text-paper">
          {on ? <Play className="size-3" /> : <Pause className="size-3" />}
        </m.span>
      </span>
      <span>
        Animations {on ? "activées" : "réduites"}
        <span className="sr-only"> — appuyez pour {on ? "réduire" : "activer"} les animations</span>
      </span>
    </button>
  );
}
