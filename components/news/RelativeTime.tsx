"use client";

import { useHydrated } from "@/lib/stores/favorites";

const abs = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

function relative(iso: string): string {
  const diff = (Date.parse(iso) - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, s] of units) {
    if (Math.abs(diff) >= s || unit === "minute") return rtf.format(Math.round(diff / s), unit);
  }
  return "";
}

/**
 * Date absolue au rendu serveur (stable pour l'hydratation), puis relative
 * (« il y a 2 heures ») une fois dans le navigateur.
 */
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const hydrated = useHydrated();
  return (
    <time dateTime={iso} title={abs.format(new Date(iso))} className={className}>
      {hydrated ? relative(iso) : abs.format(new Date(iso))}
    </time>
  );
}
