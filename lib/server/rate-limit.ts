import "server-only";

/**
 * Limiteur de débit en mémoire (fenêtre glissante).
 * Suffisant pour un serveur unique ; en déploiement serverless multi-instances,
 * remplacez-le par un stockage partagé (Redis / Upstash, table Supabase…).
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0]!)) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  // Nettoyage opportuniste
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return { ok: true, retryAfter: 0 };
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? headers.get("x-real-ip") ?? "unknown").trim();
}

/** Rejette les formulaires soumis trop vite (robots) ou trop vieux. */
export function isSuspiciousTiming(startedAt: number): boolean {
  const elapsed = Date.now() - startedAt;
  return elapsed < 2500 || elapsed > 1000 * 60 * 60 * 6;
}
