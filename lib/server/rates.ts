import "server-only";
import { cache } from "react";
import { FALLBACK_RATES, type Rates } from "@/lib/shop/currency";

/**
 * Taux de référence EUR → CHF publié chaque jour ouvré par la BCE
 * (https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml),
 * mis en cache 6 heures. En cas d'échec, le taux de secours daté est utilisé.
 */
export const getRates = cache(async (): Promise<Rates> => {
  try {
    const res = await fetch("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml", {
      next: { revalidate: 21600, tags: ["rates"] },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`BCE ${res.status}`);
    const xml = await res.text();
    const rate = Number(xml.match(/currency=['"]CHF['"]\s+rate=['"]([\d.]+)['"]/)?.[1]);
    const date = xml.match(/time=['"](\d{4}-\d{2}-\d{2})['"]/)?.[1];
    if (!Number.isFinite(rate) || rate < 0.5 || rate > 2 || !date) throw new Error("taux BCE illisible");
    return { CHF: rate, date, source: "BCE" };
  } catch (err) {
    console.warn("[taux] utilisation du taux de secours :", String(err));
    return FALLBACK_RATES;
  }
});
