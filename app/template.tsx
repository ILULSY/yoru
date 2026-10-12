"use client";

import { m } from "motion/react";
import { useEffect, useState } from "react";
import { useCalm } from "@/lib/stores/motion-pref";
import { EASE } from "@/lib/motion";

// Vrai après le premier affichage : seules les navigations internes sont animées
// (le premier chargement n'est jamais retardé).
let hasNavigated = false;

const CURTAIN = ["bg-pink", "bg-yellow", "bg-cyan"];

/**
 * Transition entre les pages : trois volets colorés se retirent pendant que
 * la nouvelle page glisse en place.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => hasNavigated);
  const calm = useCalm();

  useEffect(() => {
    hasNavigated = true;
  }, []);

  if (!animate || calm) return <>{children}</>;

  return (
    <>
      <m.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE.expo, delay: 0.18 }}>
        {children}
      </m.div>
      <div className="pointer-events-none fixed inset-0 z-[80] flex" aria-hidden>
        {CURTAIN.map((c, i) => (
          <m.div
            key={c}
            className={`h-full flex-1 origin-top ${c}`}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.55, ease: EASE.snap, delay: i * 0.06 }}
          />
        ))}
      </div>
    </>
  );
}
