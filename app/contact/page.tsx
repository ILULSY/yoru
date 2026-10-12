import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { mailerConfigured } from "@/lib/server/mailer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrire à la rédaction de YORU : suggestion, correction, partenariat ou toute autre demande.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const configured = mailerConfigured();
  return (
    <>
      <PageHero
        kicker="§ Écrire à la rédaction"
        title="Contact"
        intro="Une suggestion de sujet, une erreur à corriger, une proposition de partenariat ? Écrivez-nous."
        tone="yellow"
      />
      <section className="mx-auto grid max-w-[88rem] gap-12 px-4 pt-14 pb-24 sm:px-6 lg:grid-cols-[1fr_22rem] lg:px-8">
        <Reveal className="border-[4px] border-ink bg-paper p-6 shadow-pop-lg sm:p-10">
          {!configured && (
            <p className="mb-6 border-[3px] border-dashed border-ink bg-paper-2 p-4 text-sm leading-relaxed">
              <strong>Information :</strong> l&apos;envoi des messages n&apos;est pas encore configuré sur ce site. Le formulaire
              fonctionne (validation comprise) mais vous indiquera honnêtement que le message n&apos;a pas pu être transmis.
            </p>
          )}
          <ContactForm />
        </Reveal>
        <Reveal delay={0.1} className="space-y-6">
          <div className="border-[3px] border-ink bg-cyan p-6">
            <h2 className="text-xl font-extrabold">Signaler une erreur</h2>
            <p className="mt-2 leading-relaxed">
              Indiquez l&apos;adresse de l&apos;article et la correction proposée : nous mettons à jour les contenus et précisons la date
              de modification.
            </p>
          </div>
          <div className="border-[3px] border-ink bg-pink p-6">
            <h2 className="text-xl font-extrabold">Ayants droit</h2>
            <p className="mt-2 leading-relaxed">
              Pour toute question sur une image ou un contenu, choisissez « Autre demande ». Notre politique est détaillée dans la
              page{" "}
              <Link href="/a-propos#images" className="font-bold underline">
                À propos
              </Link>
              .
            </p>
          </div>
          <div className="border-[3px] border-ink bg-paper-2 p-6 text-sm leading-relaxed">
            Vos données servent uniquement à vous répondre et ne sont ni revendues ni utilisées à des fins publicitaires.{" "}
            <Link href="/confidentialite" className="font-bold underline">
              En savoir plus
            </Link>
            .
          </div>
        </Reveal>
      </section>
    </>
  );
}
