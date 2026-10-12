import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/ui/LegalLayout";
import { SHOP } from "@/lib/shop/config";
import { formatMoney } from "@/lib/shop/currency";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente de la boutique YORU : commande, prix, paiement, livraison, rétractation et garanties.",
  alternates: { canonical: "/cgv" },
};

export default function CgvPage() {
  return (
    <LegalLayout
      title="CGV"
      intro="Conditions générales de vente applicables aux commandes passées sur la boutique YORU par des consommateurs."
      updated="10 octobre 2026"
    >
      <h2>1. Vendeur</h2>
      <p>
        [Raison sociale, forme juridique, capital, adresse du siège, RCS/SIREN, n° de TVA intracommunautaire, e-mail et téléphone du
        service client — à compléter.] Voir aussi les <Link href="/mentions-legales">mentions légales</Link>.
      </p>

      <h2>2. Produits</h2>
      <p>
        Les caractéristiques essentielles des produits sont présentées sur chaque fiche. Certains produits sont présentés avec les visuels de
        leurs éditeurs, d&apos;autres avec des illustrations non contractuelles [à remplacer par les photos des produits réels]. Les produits sous licence doivent être des
        produits officiels acquis auprès de distributeurs agréés.
      </p>

      <h2>3. Prix</h2>
      <p>
        Les prix sont indiqués toutes taxes comprises (TTC), hors frais de livraison, en euros (€) ou en francs suisses (CHF) au
        choix du client. Chaque produit a un prix de référence dans l&apos;une des deux devises ; le prix dans l&apos;autre devise est
        calculé au taux de référence de la Banque centrale européenne du jour (arrondi au centime pour l&apos;euro, aux 5 centimes pour
        le franc suisse). La commande est facturée dans la devise affichée au moment du paiement. Frais de livraison :{" "}
        {formatMoney(SHOP.shipping.EUR.flat, "EUR")} ou {formatMoney(SHOP.shipping.CHF.flat, "CHF")}, offerts dès{" "}
        {formatMoney(SHOP.shipping.EUR.freeFrom, "EUR")} ou {formatMoney(SHOP.shipping.CHF.freeFrom, "CHF")} d&apos;achat [à adapter].
      </p>

      <h2>4. Commande et paiement</h2>
      <p>
        La commande est validée après le paiement en ligne par carte bancaire, traité par notre prestataire Stripe. YORU ne stocke
        aucune donnée bancaire. Un e-mail de confirmation récapitule la commande. [Préciser la procédure en cas de rupture après
        commande et le délai de remboursement.]
      </p>

      <h2>5. Précommandes</h2>
      <p>
        Les produits en précommande sont expédiés à leur date de sortie. Les dates communiquées par les fabricants peuvent évoluer ; en cas
        de report important, le client peut annuler sa commande et être remboursé. [À préciser.]
      </p>

      <h2>6. Livraison</h2>
      <p>
        Zones desservies : [France métropolitaine, Belgique, Luxembourg, Suisse, Monaco — à confirmer]. Délai indicatif :{" "}
        {SHOP.deliveryEstimate}. En cas de colis endommagé, émettez des réserves auprès du transporteur et contactez-nous.
      </p>

      <h2>7. Droit de rétractation</h2>
      <p>
        Conformément aux articles L221-18 et suivants du Code de la consommation, vous disposez de 14 jours à compter de la réception pour
        exercer votre droit de rétractation, sans motif. Les frais de retour sont [à la charge du client / pris en charge]. Le
        remboursement intervient dans les 14 jours suivant la rétractation. Exceptions prévues par la loi (article L221-28), notamment les
        biens descellés ne pouvant être renvoyés pour des raisons d&apos;hygiène ; [indiquer si les produits scellés, comme les boosters
        ou displays ouverts, sont concernés].
      </p>

      <h2>8. Garanties légales</h2>
      <p>
        Les produits bénéficient de la garantie légale de conformité (articles L217-3 et suivants du Code de la consommation) et de la
        garantie des vices cachés (articles 1641 et suivants du Code civil).
      </p>

      <h2>9. Médiation et litiges</h2>
      <p>
        En cas de litige, contactez d&apos;abord notre service client. Vous pouvez ensuite recourir gratuitement au médiateur de la
        consommation : [nom et coordonnées du médiateur — obligatoire]. Les présentes CGV sont soumises au droit français.
      </p>

      <h2>10. Données personnelles</h2>
      <p>
        Les données nécessaires à la commande sont traitées conformément à notre <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>
    </LegalLayout>
  );
}
