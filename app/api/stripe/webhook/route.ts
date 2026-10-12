import { NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/server/stripe";

/**
 * Webhook Stripe : confirmation fiable des paiements (à déclarer dans le
 * tableau de bord Stripe → Développeurs → Webhooks, événement
 * « checkout.session.completed »).
 *
 * À brancher selon votre organisation : création de la commande dans votre
 * outil de gestion, décrément du stock, e-mail de confirmation…
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });

  const payload = await request.text();
  if (!verifyWebhook(payload, request.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  let event: { type: string; data: { object: { id: string; amount_total?: number; metadata?: Record<string, string> } } };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    // Point d'intégration : enregistrer la commande (Supabase, ERP, e-mail…).
    console.info("[commande] paiement confirmé", { session: s.id, montant: s.amount_total, panier: s.metadata?.cart });
  }

  return NextResponse.json({ received: true });
}
