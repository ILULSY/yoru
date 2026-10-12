import { NextResponse } from "next/server";
import { z } from "zod";
import { getProducts } from "@/lib/shop/catalog";
import { isPurchasable } from "@/lib/shop/format";
import { SHOP, shippingFor } from "@/lib/shop/config";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";
import { createCheckoutSession, stripeConfigured, stripeIsTestMode } from "@/lib/server/stripe";
import { absoluteUrl } from "@/lib/site";
import { CURRENCIES } from "@/types/shop";
import { priceIn } from "@/lib/shop/currency";
import { getRates } from "@/lib/server/rates";

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(120),
        qty: z.number().int().min(1, "Quantité invalide.").max(SHOP.maxQtyPerItem, `Quantité maximale : ${SHOP.maxQtyPerItem} exemplaires par produit.`),
      }),
    )
    .min(1, "Votre panier est vide.")
    .max(50),
  currency: z.enum(CURRENCIES, { error: "Devise non prise en charge (EUR ou CHF)." }).default("EUR"),
});

type Issue = { slug: string; message: string };

const fail = (status: number, body: { status: string; message: string; issues?: Issue[] }) =>
  NextResponse.json({ ok: false, ...body }, { status });

/**
 * Crée une session de paiement Stripe Checkout.
 * Le serveur ne fait JAMAIS confiance aux prix envoyés par le navigateur :
 * tout est recalculé depuis le catalogue (prix, disponibilité, quantités).
 */
export async function POST(request: Request) {
  const limit = rateLimit(`checkout:${clientIp(request.headers)}`, 10, 10 * 60 * 1000);
  if (!limit.ok) return fail(429, { status: "rate_limited", message: "Trop de tentatives de paiement. Réessayez dans quelques minutes." });

  let parsed;
  try {
    parsed = bodySchema.safeParse(await request.json());
  } catch {
    return fail(400, { status: "invalid", message: "Requête invalide." });
  }
  if (!parsed.success) return fail(400, { status: "invalid", message: parsed.error.issues[0]?.message ?? "Panier invalide." });

  // Regroupe les doublons éventuels puis vérifie chaque ligne.
  const merged = new Map<string, number>();
  for (const it of parsed.data.items) merged.set(it.slug, (merged.get(it.slug) ?? 0) + it.qty);

  const issues: Issue[] = [];
  const catalog = new Map((await getProducts()).map((p) => [p.slug, p]));
  const lines = [...merged].flatMap(([slug, qty]) => {
    const product = catalog.get(slug);
    if (!product) {
      issues.push({ slug, message: "Un produit de votre panier n'existe plus." });
      return [];
    }
    if (!isPurchasable(product)) {
      issues.push({ slug, message: `« ${product.name} » est en rupture de stock.` });
      return [];
    }
    if (qty > Math.min(product.stock, SHOP.maxQtyPerItem)) {
      issues.push({ slug, message: `« ${product.name} » : quantité disponible insuffisante (${product.stock}).` });
      return [];
    }
    return [{ product, qty }];
  });
  if (issues.length) return fail(409, { status: "cart_changed", message: "Votre panier doit être mis à jour :", issues });

  if (!stripeConfigured()) {
    return fail(503, {
      status: "not_configured",
      message:
        "Le paiement en ligne n'est pas encore activé sur ce site : aucune commande n'a été créée et aucun montant n'a été débité.",
    });
  }

  // Sécurité : les produits de démonstration ne peuvent être payés qu'en mode test.
  if (!stripeIsTestMode() && lines.some((l) => l.product.demo)) {
    return fail(409, {
      status: "demo_products",
      message: "Ce panier contient des produits de démonstration, qui ne peuvent pas être vendus. Aucune commande n'a été créée.",
    });
  }

  // Prix dans la devise choisie, recalculés avec le taux BCE (identique à l'affichage).
  const currency = parsed.data.currency;
  const rates = await getRates();
  const priced = lines.map((l) => ({ ...l, unit: priceIn(l.product, currency, rates) }));
  const subtotal = priced.reduce((s, l) => s + l.unit * l.qty, 0);
  const shipping = shippingFor(subtotal, currency);
  const cur = currency.toLowerCase();

  try {
    const session = await createCheckoutSession({
      mode: "payment",
      locale: "fr",
      success_url: `${absoluteUrl("/boutique/merci")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: absoluteUrl("/panier"),
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: [...SHOP.shippingCountries] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shipping === 0 ? "Livraison offerte" : "Livraison standard",
            fixed_amount: { amount: shipping, currency: cur },
          },
        },
      ],
      line_items: priced.map(({ product, qty, unit }) => ({
        quantity: qty,
        price_data: {
          currency: cur,
          unit_amount: unit,
          product_data: { name: product.name, metadata: { slug: product.slug } },
        },
      })),
      metadata: {
        cart: lines.map((l) => `${l.product.slug}x${l.qty}`).join(",").slice(0, 490),
        currency,
        rate_eur_chf: `${rates.CHF} (${rates.source} ${rates.date})`,
      },
    });
    if (!session.url) throw new Error("Session sans URL");
    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return fail(502, { status: "provider_error", message: "Le service de paiement ne répond pas. Aucun montant n'a été débité. Réessayez plus tard." });
  }
}
