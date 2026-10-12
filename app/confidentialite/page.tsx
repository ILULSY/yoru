import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/ui/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données YORU traite, pourquoi, combien de temps, et comment exercer vos droits.",
  alternates: { canonical: "/confidentialite" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Confidentialité"
      intro="Ce que nous collectons (peu de choses), pourquoi, et comment exercer vos droits au titre du RGPD."
      updated="10 octobre 2026"
    >
      <h2>Responsable du traitement</h2>
      <p>[Nom de l&apos;éditeur et coordonnées à compléter — voir les mentions légales.]</p>

      <h2>Ce que le site ne fait pas</h2>
      <ul>
        <li>Aucun cookie publicitaire ni outil de mesure d&apos;audience n&apos;est installé dans cette version du site.</li>
        <li>Aucun compte utilisateur n&apos;est nécessaire.</li>
        <li>Les polices de caractères sont hébergées par le site lui-même (aucun appel à un service de polices tiers).</li>
      </ul>

      <h2>Stockage local sur votre appareil</h2>
      <p>
        Le site enregistre dans votre navigateur (localStorage / sessionStorage), et nulle part ailleurs : votre <strong>panier</strong>, vos <strong>favoris</strong>,
        votre <strong>préférence d&apos;animations</strong> et le fait que l&apos;intro a déjà été vue pendant la session. Ces
        informations ne nous sont pas transmises. Vous pouvez les supprimer depuis la page <Link href="/favoris">Favoris</Link> ou
        en effaçant les données du site dans votre navigateur.
      </p>

      <h2>Newsletter</h2>
      <p>
        Si la newsletter est activée, votre adresse e-mail est transmise à notre prestataire d&apos;envoi, <strong>Brevo</strong>, sur la
        base de votre consentement. Elle sert uniquement à l&apos;envoi de la newsletter et est conservée jusqu&apos;à votre
        désinscription (lien présent dans chaque e-mail). Tant que le service n&apos;est pas configuré, aucune adresse n&apos;est
        collectée ni conservée.
      </p>

      <h2>Formulaire de contact</h2>
      <p>
        Vos nom, adresse e-mail et message sont transmis par e-mail à la rédaction via notre prestataire <strong>Resend</strong>, afin de
        répondre à votre demande. Ils ne sont pas stockés dans une base de données du site. Les e-mails reçus sont conservés
        [durée à définir, par exemple 12 mois] puis supprimés.
      </p>

      <h2>Boutique et paiement</h2>
      <p>
        Lors d&apos;une commande, vous êtes redirigé vers la page de paiement sécurisée de notre prestataire <strong>Stripe</strong>, qui
        collecte directement vos coordonnées de paiement, votre adresse de livraison et votre e-mail. YORU ne reçoit ni ne
        stocke vos données bancaires. Les informations de commande sont conservées pendant la durée nécessaire à son exécution et
        aux obligations légales et comptables [durée à préciser, par exemple 10 ans pour les pièces comptables]. Tant que le paiement
        n&apos;est pas configuré, aucune donnée de commande n&apos;est collectée.
      </p>

      <h2>Fil d&apos;actualités</h2>
      <p>
        La page News affiche les titres publiés par d&apos;autres médias via leurs flux RSS publics. Ces flux sont récupérés par notre
        serveur : aucune donnée vous concernant ne leur est transmise. En cliquant sur un titre, vous quittez YORU pour le site du
        média concerné, soumis à sa propre politique de confidentialité.
      </p>

      <h2>Images et services tiers</h2>
      <p>
        Les photos sont chargées depuis le réseau de diffusion d&apos;<strong>Unsplash</strong> : comme pour toute ressource web, votre
        adresse IP est alors transmise à ce prestataire, qui peut être situé hors de l&apos;Union européenne. Les boutons de partage
        ouvrent les réseaux sociaux uniquement si vous cliquez dessus.
      </p>

      <h2>Journaux techniques</h2>
      <p>
        L&apos;hébergeur du site peut conserver des journaux techniques (adresse IP, date, page demandée) pour assurer la sécurité et
        le bon fonctionnement du service. [Durée de conservation selon l&apos;hébergeur retenu.]
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition et de
        portabilité, ainsi que du droit de retirer votre consentement à tout moment. Pour les exercer, utilisez le{" "}
        <Link href="/contact">formulaire de contact</Link>. Vous pouvez également introduire une réclamation auprès de la CNIL
        (cnil.fr).
      </p>
    </LegalLayout>
  );
}
