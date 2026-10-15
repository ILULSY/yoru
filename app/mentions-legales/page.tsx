import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/ui/LegalLayout";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site YORU : éditeur, hébergement, propriété intellectuelle et crédits.",
  alternates: { canonical: "/mentions-legales" },
};

export default function LegalNoticePage() {
  return (
    <LegalLayout
      title="Mentions légales"
      intro="Informations prévues par la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN)."
      updated="10 octobre 2026"
    >
      <h2>Éditeur du site</h2>
      <ul>
        <li>Nom ou raison sociale : [à compléter]</li>
        <li>Forme juridique et capital social (le cas échéant) : [à compléter]</li>
        <li>Adresse : [à compléter]</li>
        <li>Numéro d&apos;immatriculation (RCS / SIREN) : [à compléter]</li>
        <li>
          Contact : via le <Link href="/contact">formulaire de contact</Link> ou [adresse e-mail à compléter]
        </li>
        <li>Directeur ou directrice de la publication : [à compléter]</li>
      </ul>

      <h2>Hébergement</h2>
      <p>
        Hébergeur : [nom, adresse et téléphone de l&apos;hébergeur retenu, par exemple la plateforme sur laquelle le site est
        déployé].
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        La mise en page, le logo YORU, les textes rédactionnels et les éléments graphiques originaux du site sont protégés. Toute
        reproduction sans autorisation est interdite, sauf courte citation mentionnant la source.
      </p>
      <p>
        Les noms d&apos;œuvres, de personnages, de marques et de licences cités appartiennent à leurs ayants droit respectifs. Leur
        mention a une finalité éditoriale et n&apos;implique aucun partenariat.
      </p>

      <h2>Crédits photographiques</h2>
      <p>
        Les photographies proviennent d&apos;Unsplash et sont utilisées selon la licence Unsplash. Le nom de chaque photographe est
        indiqué sous l&apos;image correspondante. Ces photos ne sont pas des visuels officiels des œuvres ou produits qu&apos;elles
        peuvent montrer.
      </p>
      <p>
        Dans la boutique, certains produits sont illustrés par les visuels de leurs éditeurs (Bandai, The Pokémon Company…),
        utilisés pour présenter les produits mis en vente ; les autres visuels sont des illustrations créées par YORU.
      </p>
      <p>
        Les logos de licences et de marques affichés en filigrane dans la boutique proviennent de Wikimedia Commons (fichiers
        versés au domaine public pour le droit d&apos;auteur) et restent des marques déposées de leurs propriétaires. Ils servent
        uniquement à identifier les produits proposés et n&apos;impliquent aucun partenariat. La liste des fichiers et leur
        provenance figurent dans le code du site (data/shop/logos.ts).
      </p>

      <h2>Contenus de démonstration</h2>
      <p>
        Les articles signalés « Démo » sont des contenus d&apos;exemple rédigés pour présenter le site. Les dates et indicateurs de
        popularité associés sont fictifs.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des données est décrit dans la <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>
    </LegalLayout>
  );
}
