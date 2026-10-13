"use client";

import Link from "next/link";
import { CircleCheck, Plus, TriangleAlert } from "lucide-react";
import type { Product } from "@/types/shop";
import { saleStatus } from "@/lib/shop/pricing";
import { useShopNow } from "@/components/shop/CatalogProvider";
import { useAdminBackend } from "@/components/admin/backend";
import { buttonClasses } from "@/components/ui/Button";
import { ProductTable } from "@/components/admin/ProductTable";

const OK: Record<string, (name: string) => string> = {
  cree: (n) => `« ${n} » a été créé.`,
  modifie: (n) => `« ${n} » a été enregistré.`,
  supprime: (n) => `« ${n} » a été supprimé.`,
  publie: (n) => `« ${n} » est maintenant visible en boutique.`,
  masque: (n) => `« ${n} » est repassé en brouillon : il n'est plus visible en boutique.`,
};
const ERR: Record<string, string> = {
  suppression: "La suppression a échoué : le produit n'a pas été modifié.",
  statut: "Le changement de statut a échoué : rechargez la page et réessayez.",
  introuvable: "Ce produit n'existe plus.",
  solde: "Solde non appliqué : indiquez une remise entre 1 et 90 % et sélectionnez au moins un produit.",
  "solde-dates": "Solde non appliqué : la fin doit être après le début.",
  "lecture-seule": "Modifications impossibles : le stockage est en lecture seule.",
};

/** Tableau de bord de l'espace édition : messages, compteurs, fiches invalides, liste des produits. */
export function Dashboard({
  products,
  problems,
  params,
}: {
  products: Product[];
  problems: string[];
  /** Paramètres d'adresse (?ok=…) laissés par la dernière action. */
  params: Record<string, string | string[] | undefined>;
}) {
  const backend = useAdminBackend();
  const now = useShopNow();
  const { ok, erreur, produit, nom, n, remise, echecs } = params;
  const name = (slug: unknown) => products.find((p) => p.slug === slug)?.name ?? (typeof nom === "string" ? nom : String(slug ?? ""));
  const count = Number(n) || 0;
  const plural = count > 1 ? "s" : "";
  const flash =
    ok === "solde"
      ? `${count} produit${plural} mis en solde (−${remise} %).`
      : ok === "solde-retire"
        ? `Solde retiré sur ${count} produit${plural} : le prix normal est rétabli.`
        : typeof ok === "string" && OK[ok]
          ? OK[ok](name(produit))
          : null;
  const failures = typeof echecs === "string" ? echecs : null;
  const error = typeof erreur === "string" ? (ERR[erreur] ?? "L'opération a échoué.") : null;

  const published = products.filter((p) => p.status === "published");
  const stats = [
    { label: "Produits", value: products.length },
    { label: "En boutique", value: published.length },
    { label: "En solde", value: published.filter((p) => saleStatus(p, now) === "active").length },
    { label: "Brouillons", value: products.length - published.length },
    { label: "Ruptures ou stock ≤ 5", value: published.filter((p) => p.availability !== "preorder" && p.stock <= 5).length },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.3em] text-muted uppercase">Catalogue</p>
          <h1 className="display mt-1 text-5xl sm:text-6xl">Produits</h1>
        </div>
        <Link href={backend.newHref()} className={buttonClasses("ink", "md")}>
          <Plus className="size-5" aria-hidden /> Ajouter un produit
        </Link>
      </div>

      {(flash || error) && (
        <p
          role="status"
          className={`mt-6 flex items-start gap-2 border-[3px] border-ink p-3 font-semibold ${error ? "bg-pink" : "bg-lime"}`}
        >
          {error ? <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden /> : <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden />}
          <span>
            {error ?? flash}
            {!error && backend.publishNote && <span className="block text-sm font-medium">{backend.publishNote}</span>}
          </span>
        </p>
      )}

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="border-[3px] border-ink bg-paper p-4">
            <dt className="font-mono text-[11px] font-bold tracking-widest text-muted uppercase">{s.label}</dt>
            <dd className="display mt-1 text-4xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      {failures && (
        <p role="alert" className="mt-3 flex items-start gap-2 border-[3px] border-ink bg-yellow p-3 text-sm font-semibold">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          Non modifiés (fiche invalide ou modifiée entre-temps) : {failures}
        </p>
      )}

      {problems.length > 0 && (
        <details className="mt-6 border-[3px] border-ink bg-yellow p-4">
          <summary className="cursor-pointer font-bold">
            {problems.length} fiche{problems.length > 1 ? "s" : ""} ignorée{problems.length > 1 ? "s" : ""} car invalide
            {problems.length > 1 ? "s" : ""} (fichier modifié à la main ?)
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 font-mono text-xs">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </details>
      )}

      {/* Nouvelle clé après chaque action : la sélection et les fenêtres se referment. */}
      <ProductTable key={JSON.stringify(params)} products={products} />
    </>
  );
}
