import type { Transition, Variants } from "motion/react";

/**
 * Langage de mouvement YORU.
 * - « expo » : sorties franches et élégantes (révélations, panneaux).
 * - « pop »  : léger dépassement, pour ce qui doit « claquer » (badges, stickers).
 * - « snap » : transitions d'interface rapides.
 * Seuls transform et opacity sont animés, pour rester fluide.
 */
export const EASE = {
  expo: [0.16, 1, 0.3, 1] as const,
  pop: [0.34, 1.56, 0.64, 1] as const,
  snap: [0.76, 0, 0.24, 1] as const,
};

export const SPRING = {
  snappy: { type: "spring", stiffness: 520, damping: 32, mass: 0.7 } satisfies Transition,
  bouncy: { type: "spring", stiffness: 380, damping: 16, mass: 0.8 } satisfies Transition,
  soft: { type: "spring", stiffness: 160, damping: 24 } satisfies Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.expo } },
};

export const stagger = (step = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -8 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: SPRING.bouncy },
};

/** Révélation par masque (clip-path) pour les images. */
export const wipe: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  show: { clipPath: "inset(0 0 0% 0)", transition: { duration: 1, ease: EASE.expo } },
};

export const VIEWPORT = { once: true, amount: 0.25 } as const;
