import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Client Stripe minimal (API REST, sans SDK).
 * Variables : STRIPE_SECRET_KEY (sk_test_… ou sk_live_…), STRIPE_WEBHOOK_SECRET (whsec_…).
 */

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function stripeIsTestMode(): boolean {
  return (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_test_");
}

/** Encode un objet imbriqué au format attendu par l'API Stripe (a[b][0][c]=…). */
function encode(obj: unknown, prefix = "", out = new URLSearchParams()): URLSearchParams {
  if (obj === undefined || obj === null) return out;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => encode(v, `${prefix}[${i}]`, out));
  } else if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) encode(v, prefix ? `${prefix}[${k}]` : k, out);
  } else {
    out.append(prefix, String(obj));
  }
  return out;
}

async function stripe<T>(method: "GET" | "POST", path: string, body?: Record<string, unknown>): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquante");
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: body ? encode(body).toString() : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) throw new Error(`Stripe ${res.status} : ${data.error?.message ?? "erreur inconnue"}`);
  return data;
}

export interface CheckoutSession {
  id: string;
  url: string | null;
  status: "open" | "complete" | "expired";
  payment_status: "paid" | "unpaid" | "no_payment_required";
  amount_total: number | null;
  currency: string | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
}

export function createCheckoutSession(params: Record<string, unknown>) {
  return stripe<CheckoutSession>("POST", "checkout/sessions", params);
}

export function retrieveCheckoutSession(id: string) {
  return stripe<CheckoutSession>("GET", `checkout/sessions/${encodeURIComponent(id)}`);
}

/**
 * Vérifie la signature d'un webhook Stripe (en-tête Stripe-Signature :
 * « t=…,v1=… ») avec une tolérance de 5 minutes contre le rejeu.
 */
export function verifyWebhook(payload: string, header: string | null, secret: string, toleranceSec = 300): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const [k, ...v] = kv.split("=");
      return [k?.trim(), v.join("=")];
    }),
  ) as Record<string, string>;
  const t = Number(parts.t);
  const signatures = header
    .split(",")
    .filter((p) => p.trim().startsWith("v1="))
    .map((p) => p.trim().slice(3));
  if (!t || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return signatures.some((s) => {
    const a = Buffer.from(s, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  });
}
