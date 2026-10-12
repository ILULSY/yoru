"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Percent, X } from "lucide-react";
import type { Product } from "@/types/shop";
import { applySaleAction } from "@/app/admin/actions";
import { formatMoney } from "@/lib/shop/currency";
import { salePriceFromPercent } from "@/lib/shop/pricing";
import { inputClasses } from "@/components/ui/Field";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function Submit({ count }: { count: number }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClasses("ink", "md")}>
      {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : <Percent className="size-5" aria-hidden />}
      {pending ? "Application…" : count > 1 ? `Solder ${count} produits` : "Mettre en solde"}
    </button>
  );
}

/** Mise en solde d'un ou plusieurs produits : remise en %, dates facultatives (heure suisse). */
export function SaleDialog({ products, onClose }: { products: Product[]; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [percent, setPercent] = useState("20");
  const pct = Number(percent.replace(",", "."));
  const valid = pct >= 1 && pct <= 90;

  // Pas de close() au démontage : il déclencherait onClose (et React rejoue les effets en développement).
  // Retirer l'élément du DOM suffit à fermer la fenêtre.
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="sale-dialog-title"
      className="m-auto w-[min(36rem,calc(100%-2rem))] border-[4px] border-ink bg-paper p-0 text-ink shadow-pop-lg backdrop:bg-ink/60"
    >
      <form action={applySaleAction} className="p-5 sm:p-6">
        <input type="hidden" name="slugs" value={JSON.stringify(products.map((p) => p.slug))} />
        <div className="flex items-start justify-between gap-4">
          <h2 id="sale-dialog-title" className="text-xl font-extrabold">
            {products.length > 1 ? `Mettre ${products.length} produits en solde` : `Solder « ${products[0]?.name} »`}
          </h2>
          <button type="button" onClick={() => ref.current?.close()} className="grid size-9 shrink-0 place-items-center hover:bg-paper-2" aria-label="Fermer">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-bold">Remise</legend>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex">
              <input
                name="percent"
                value={percent}
                inputMode="numeric"
                aria-label="Remise en pourcentage"
                onChange={(e) => setPercent(e.target.value.replace(/[^\d,.]/g, ""))}
                className={cn(inputClasses(!valid), "h-11 w-24")}
              />
              <span className="grid place-items-center border-[3px] border-l-0 border-ink bg-paper-2 px-3 font-bold">%</span>
            </div>
            {[10, 20, 30, 50].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPercent(String(p))}
                className={cn("h-11 border-2 border-ink px-3 text-sm font-bold", percent === String(p) ? "bg-yellow" : "hover:bg-yellow")}
              >
                −{p} %
              </button>
            ))}
          </div>
          {!valid && <p className="pt-1.5 text-sm font-semibold text-[#b0005a]">Remise entre 1 et 90 %.</p>}
        </fieldset>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Début</span>
            <input name="startsAt" type="datetime-local" className={cn(inputClasses(), "h-11")} />
            <span className="block pt-1 text-sm text-muted">Vide : tout de suite.</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Fin</span>
            <input name="endsAt" type="datetime-local" className={cn(inputClasses(), "h-11")} />
            <span className="block pt-1 text-sm text-muted">Vide : sans date de fin.</span>
          </label>
        </div>
        <p className="mt-2 text-xs text-muted">Heure de Suisse et de France. Le prix normal revient tout seul à la fin.</p>

        {valid && (
          <ul className="mt-5 max-h-48 space-y-1 overflow-auto border-[3px] border-ink bg-paper-2/60 p-3 text-sm">
            {products.map((p) => {
              const cur = p.currency ?? "EUR";
              return (
                <li key={p.slug} className="flex justify-between gap-3">
                  <span className="truncate">{p.name}</span>
                  <span className="shrink-0 font-mono">
                    <span className="text-muted line-through">{formatMoney(p.price, cur)}</span>{" "}
                    <strong>{formatMoney(salePriceFromPercent(p.price, pct, cur), cur)}</strong>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-2 text-xs text-muted">Un solde déjà en place sur ces produits est remplacé. Prix en CHF arrondis aux 5 centimes.</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={() => ref.current?.close()} className="h-12 border-[3px] border-ink px-5 font-bold hover:bg-paper-2">
            Annuler
          </button>
          {valid ? <Submit count={products.length} /> : null}
        </div>
      </form>
    </dialog>
  );
}
