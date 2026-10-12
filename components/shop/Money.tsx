"use client";

import { m } from "motion/react";
import { useId } from "react";
import type { Currency } from "@/types/shop";
import { CURRENCIES } from "@/types/shop";
import { convert, formatMoney } from "@/lib/shop/currency";
import { setCurrency, useCurrency, useRates } from "@/lib/stores/currency";
import { useHydrated } from "@/lib/stores/favorites";
import { useToast } from "@/components/ui/Toaster";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Values = Record<Currency, number>;

function useValues(amount: number | undefined, from: Currency, values?: Values): Values {
  const rates = useRates();
  if (values) return values;
  const a = amount ?? 0;
  return { EUR: convert(a, from, "EUR", rates), CHF: convert(a, from, "CHF", rates) };
}

/**
 * Montant affiché dans la devise choisie. Les deux montants sont rendus et le
 * CSS (html[data-currency]) masque l'autre : le changement est instantané.
 * `alt` affiche au contraire la devise NON choisie (« soit … »).
 */
export function Money({
  amount,
  from = "EUR",
  values,
  alt = false,
  className,
}: {
  amount?: number;
  from?: Currency;
  values?: Values;
  alt?: boolean;
  className?: string;
}) {
  const v = useValues(amount, from, values);
  const attr = alt ? "data-cur-alt" : "data-cur";
  return (
    <span className={className}>
      {CURRENCIES.map((c) => (
        <span key={c} {...{ [attr]: c }}>
          {formatMoney(v[c], c)}
        </span>
      ))}
    </span>
  );
}

/** Sélecteur de devise € / CHF : met à jour tous les prix du site. */
export function CurrencyToggle({ className, size = "md", tone = "paper" }: { className?: string; size?: "sm" | "md"; tone?: "paper" | "ink" }) {
  const current = useCurrency();
  const hydrated = useHydrated();
  const toast = useToast();
  const uid = useId();
  const active = hydrated ? current : null;
  return (
    <div
      role="radiogroup"
      aria-label="Devise d'affichage des prix"
      className={cn(
        "inline-flex shrink-0 border-[3px]",
        tone === "ink" ? "border-paper/70 text-paper" : "border-ink bg-paper text-ink",
        className,
      )}
    >
      {CURRENCIES.map((c) => {
        const on = active === c;
        return (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => {
              if (current === c) return;
              setCurrency(c);
              toast({ tone: "info", title: c === "CHF" ? "Prix affichés en francs suisses" : "Prix affichés en euros" });
            }}
            className={cn("relative isolate font-bold transition-colors", size === "sm" ? "h-8 min-w-11 px-2 text-xs" : "h-10 min-w-14 px-3 text-sm")}
          >
            {on && (
              <m.span
                layoutId={`cur-pill-${uid}`}
                className={cn("absolute inset-0 -z-10", tone === "ink" ? "bg-yellow" : "bg-ink")}
                transition={SPRING.snappy}
              />
            )}
            <span className={cn(on && (tone === "ink" ? "text-ink" : "text-paper"))}>{c === "EUR" ? "€ EUR" : "CHF"}</span>
          </button>
        );
      })}
    </div>
  );
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

/** Mention du taux utilisé pour la conversion. */
export function RateNote({ className }: { className?: string }) {
  const rates = useRates();
  return (
    <p className={cn("font-mono text-[11px] text-muted", className)}>
      1 € = {rates.CHF.toLocaleString("fr-FR", { maximumFractionDigits: 4 })} CHF ·{" "}
      {rates.source === "BCE" ? `taux de référence BCE du ${dateFmt.format(new Date(rates.date))}` : `taux de secours du ${dateFmt.format(new Date(rates.date))}`}
    </p>
  );
}
