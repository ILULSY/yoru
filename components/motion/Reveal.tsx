"use client";

import { m, useInView, type Variants } from "motion/react";
import { Fragment, useRef } from "react";
import { EASE, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Tag = "div" | "section" | "li" | "ul" | "ol" | "article" | "header" | "p" | "span" | "figure" | "aside";

/**
 * Apparition au défilement (une seule fois). Le contenu reste lisible sans
 * JavaScript grâce à la règle <noscript> du layout ([data-reveal]).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  x = 0,
  rotate = 0,
  scale = 1,
  as = "div",
  amount = VIEWPORT.amount,
  id,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  rotate?: number;
  scale?: number;
  as?: Tag;
  amount?: number;
  id?: string;
  "aria-label"?: string;
}) {
  const Comp = m[as] as typeof m.div;
  return (
    <Comp
      id={id}
      aria-label={ariaLabel}
      data-reveal
      className={className}
      initial={{ opacity: 0, y, x, rotate, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, ease: EASE.expo, delay }}
    >
      {children}
    </Comp>
  );
}

const groupVariants = (step: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36, rotate: 1.5 },
  show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.75, ease: EASE.expo } },
};

/** Conteneur qui déclenche l'apparition décalée de ses <RevealItem>. */
export function RevealGroup({
  children,
  className,
  step = 0.08,
  delay = 0,
  as = "div",
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
  delay?: number;
  as?: Tag;
  amount?: number;
}) {
  const Comp = m[as] as typeof m.div;
  return (
    <Comp
      className={className}
      variants={groupVariants(step, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
  variants = itemVariants,
}: {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  variants?: Variants;
}) {
  const Comp = m[as] as typeof m.div;
  return (
    <Comp data-reveal className={className} variants={variants}>
      {children}
    </Comp>
  );
}

/**
 * Titre révélé mot par mot (masques), déclenché à l'entrée dans l'écran.
 */
export function SplitTitle({
  text,
  className,
  as = "h2",
  delay = 0,
  wordClassName,
  id,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  wordClassName?: string;
  id?: string;
}) {
  const Comp = m[as] as typeof m.h2;
  const words = text.split(" ");
  return (
    <Comp
      id={id}
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word-mask" aria-hidden>
            <m.span
              data-reveal
              className={cn("inline-block", wordClassName)}
              variants={{
                hidden: { y: "110%", rotate: 6 },
                show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE.expo } },
              }}
            >
              {w}
            </m.span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Comp>
  );
}

/** Image révélée par un volet (clip-path) avec léger dézoom. */
export function ImageReveal({
  children,
  className,
  delay = 0,
  from = "bottom",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left" | "right" | "top";
}) {
  // L'observateur est posé sur un conteneur non masqué : un élément entièrement
  // découpé par clip-path n'est pas considéré comme visible par le navigateur.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const inset = {
    bottom: "inset(100% 0% 0% 0%)",
    top: "inset(0% 0% 100% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  }[from];
  return (
    <div ref={ref} className={cn("relative", className)}>
      <m.div
        data-reveal
        className="absolute inset-0 overflow-hidden"
        initial={{ clipPath: inset }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.1, ease: EASE.expo, delay }}
      >
        <m.div
          className="absolute inset-0"
          initial={{ scale: 1.25 }}
          animate={inView ? { scale: 1 } : undefined}
          transition={{ duration: 1.4, ease: EASE.expo, delay }}
        >
          {children}
        </m.div>
      </m.div>
    </div>
  );
}
