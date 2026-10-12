"use client";

import { AnimatePresence, m } from "motion/react";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useFavorites, useHydrated } from "@/lib/stores/favorites";
import { useToast } from "@/components/ui/Toaster";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PARTICLES = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2;
  return {
    x: Math.cos(a) * 30,
    y: Math.sin(a) * 30,
    c: ["var(--color-pink)", "var(--color-yellow)", "var(--color-cyan)", "var(--color-violet)"][i % 4],
  };
});

/**
 * Bouton favori : le cœur se remplit avec un rebond et projette des
 * confettis. État conservé localement (voir lib/stores/favorites).
 */
export function FavoriteButton({
  slug,
  title,
  variant = "icon",
  className,
}: {
  slug: string;
  title: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const hydrated = useHydrated();
  const toast = useToast();
  const [burst, setBurst] = useState(0);
  const active = hydrated && isFavorite(slug);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(slug);
    if (added) setBurst((b) => b + 1);
    toast({
      tone: added ? "success" : "info",
      title: added ? "Ajouté à vos favoris" : "Retiré de vos favoris",
      description: added ? "Retrouvez-le dans la page Favoris." : undefined,
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Retirer « ${title} » des favoris` : `Ajouter « ${title} » aux favoris`}
      title={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={cn(
        "z-10 inline-flex items-center justify-center gap-2 border-[3px] border-ink font-bold transition-[transform,background-color] duration-200 ease-[var(--ease-pop)] hover:-rotate-6 hover:scale-105 active:scale-90",
        active ? "bg-pink text-ink" : "bg-paper text-ink",
        variant === "icon" ? "size-11" : "h-12 px-4",
        className,
      )}
    >
      <span className="relative grid place-items-center">
        <m.span
          key={active ? "on" : "off"}
          initial={{ scale: active ? 0.3 : 1 }}
          animate={{ scale: 1 }}
          transition={SPRING.bouncy}
          className="grid place-items-center"
        >
          <Heart className={cn("size-5", active && "fill-ink")} strokeWidth={2.6} aria-hidden />
        </m.span>
        <AnimatePresence>
          {burst > 0 && (
            <m.span key={burst} className="pointer-events-none absolute inset-0" aria-hidden>
              {PARTICLES.map((p, i) => (
                <m.span
                  key={i}
                  className="absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full border border-ink"
                  style={{ background: p.c }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{ x: p.x, y: p.y, scale: [0, 1.2, 0], opacity: [1, 1, 0] }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </m.span>
          )}
        </AnimatePresence>
      </span>
      {variant === "full" && <span>{active ? "Dans vos favoris" : "Ajouter aux favoris"}</span>}
    </button>
  );
}
