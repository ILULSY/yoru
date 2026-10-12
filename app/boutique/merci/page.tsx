import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock, Info } from "lucide-react";
import { retrieveCheckoutSession, stripeConfigured, type CheckoutSession } from "@/lib/server/stripe";
import { formatMoney } from "@/lib/shop/currency";
import { buttonClasses } from "@/components/ui/Button";
import { Burst } from "@/components/ui/Decor";
import { ClearCartOnSuccess } from "@/components/shop/ClearCartOnSuccess";

export const metadata: Metadata = {
  title: "Confirmation de commande",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * Page de retour après Stripe Checkout. Le statut affiché provient de Stripe
 * (et non de l'URL) : une commande n'est annoncée comme payée que si Stripe
 * le confirme.
 */
export default async function ThanksPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const id = typeof session_id === "string" && /^cs_[A-Za-z0-9_]+$/.test(session_id) ? session_id : null;

  let session: CheckoutSession | null = null;
  let error = false;
  if (id && stripeConfigured()) {
    try {
      session = await retrieveCheckoutSession(id);
    } catch (e) {
      console.error("[merci]", e);
      error = true;
    }
  }

  const paid = session?.payment_status === "paid";

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
      {paid ? (
        <>
          <ClearCartOnSuccess />
          <div className="pop-in" style={{ "--r": "-8deg", "--d": "0s" } as React.CSSProperties}>
            <Burst className="size-36" fill="var(--color-lime)" spin>
              <Check className="mx-auto size-12" strokeWidth={3} aria-hidden />
            </Burst>
          </div>
          <h1 className="display mt-8 text-6xl sm:text-7xl">Merci pour votre commande !</h1>
          <p className="mt-4 text-lg">
            Paiement confirmé{session?.amount_total != null && <> : <strong>{formatMoney(session.amount_total, session.currency?.toUpperCase() === "CHF" ? "CHF" : "EUR")}</strong></>}.
            {session?.customer_details?.email && <> Un récapitulatif sera envoyé à {session.customer_details.email}.</>}
          </p>
          <p className="mt-2 font-mono text-xs text-muted">Référence : {session?.id}</p>
        </>
      ) : (
        <>
          <Burst className="size-32" fill="var(--color-yellow)" spin>
            {id ? <Clock className="mx-auto size-10" aria-hidden /> : <Info className="mx-auto size-10" aria-hidden />}
          </Burst>
          <h1 className="display mt-8 text-5xl sm:text-6xl">
            {!id ? "Aucune commande à afficher" : error || !stripeConfigured() ? "Statut indisponible" : "Paiement non finalisé"}
          </h1>
          <p className="mt-4 max-w-lg text-lg text-muted">
            {!id
              ? "Cette page s'affiche après un paiement. Si vous venez de payer, utilisez le lien reçu de notre prestataire."
              : error || !stripeConfigured()
                ? "Nous ne pouvons pas vérifier le statut de ce paiement pour le moment. Aucune commande n'est confirmée tant que le paiement n'est pas validé."
                : "Le paiement n'a pas été confirmé. Votre panier est conservé : vous pouvez réessayer."}
          </p>
        </>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/boutique" className={buttonClasses("ink", "lg")}>
          Retour à la boutique
        </Link>
        {!paid && (
          <Link href="/panier" className={buttonClasses("yellow", "lg")}>
            Voir mon panier
          </Link>
        )}
      </div>
    </section>
  );
}
