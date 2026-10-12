import { PageHero } from "@/components/ui/PageHero";

/** Mise en page sobre et lisible des pages légales. */
export function LegalLayout({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero kicker="§ Informations légales" title={title} intro={intro} />
      <div className="mx-auto max-w-3xl px-4 pt-12 pb-24 sm:px-6">
        <p className="border-[3px] border-dashed border-ink bg-yellow p-4 text-sm leading-relaxed">
          <strong>Modèle à compléter.</strong> Les mentions entre crochets doivent être renseignées par l&apos;éditeur réel du site.
          Ce texte ne constitue pas un avis juridique et ne garantit pas la conformité : faites-le valider par un professionnel avant
          la mise en ligne.
        </p>
        <div className="prose-pop mt-10 space-y-6 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-extrabold [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
          {children}
        </div>
        <p className="mt-12 font-mono text-xs text-muted">Dernière mise à jour : {updated}</p>
      </div>
    </>
  );
}
