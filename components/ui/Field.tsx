"use client";

import { AnimatePresence, m } from "motion/react";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** Message d'erreur animé, relié au champ par aria-describedby. */
export function FieldError({ id, message, light }: { id: string; message?: string; light?: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <m.p
          id={id}
          key={message}
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.22 }}
          className={cn("flex items-start gap-1.5 pt-1.5 text-sm font-semibold", light ? "text-yellow" : "text-[#b0005a]")}
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {message}
        </m.p>
      )}
    </AnimatePresence>
  );
}

export const inputClasses = (invalid?: boolean) =>
  cn(
    "w-full border-[3px] bg-paper px-4 text-base text-ink transition-[box-shadow,transform,border-color] duration-200 outline-none placeholder:text-muted/70",
    "focus:-translate-y-0.5 focus:shadow-[5px_5px_0_0_var(--color-ink)]",
    invalid ? "border-[#b0005a] shadow-[4px_4px_0_0_var(--color-pink)]" : "border-ink",
  );

/** Pot de miel invisible pour les robots (laisser vide). */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
      <label>
        Ne pas remplir ce champ
        <input type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} name="website" />
      </label>
    </div>
  );
}
