"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { useMotionPref } from "@/lib/stores/motion-pref";
import { EASE } from "@/lib/motion";

const loadFeatures = () => import("./features").then((r) => r.default);

/**
 * Fournit Motion à toute l'application :
 * - LazyMotion charge les fonctionnalités d'animation après l'hydratation
 *   (bundle initial plus léger ; les entrées critiques sont en CSS) ;
 * - MotionConfig coupe les animations de transformation quand
 *   l'utilisateur a choisi (ou hérité du système) « animations réduites ».
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pref = useMotionPref();
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig
        reducedMotion={pref === "reduced" ? "always" : "never"}
        transition={{ duration: 0.5, ease: EASE.expo }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
