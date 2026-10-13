"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useAdminBackend } from "@/components/admin/backend";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center gap-2 border-[3px] border-ink bg-pink px-4 font-bold disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
      {pending ? "Suppression…" : "Oui, supprimer définitivement"}
    </button>
  );
}

/** Suppression en deux temps : rien n'est effacé sans confirmation explicite. */
export function DeleteProduct({ slug, name }: { slug: string; name: string }) {
  const backend = useAdminBackend();
  const [confirming, setConfirming] = useState(false);
  return (
    <section aria-labelledby="zone-suppression" className="mt-12 border-[3px] border-dashed border-ink p-5 sm:p-6 lg:max-w-[calc(100%-24rem)]">
      <h2 id="zone-suppression" className="text-lg font-extrabold">
        Supprimer ce produit
      </h2>
      <p className="mt-1 text-sm text-muted">
        La fiche disparaît de la boutique et de l&apos;espace édition. Pour la retirer temporairement, passez-la plutôt en brouillon.
      </p>
      {confirming ? (
        <form action={backend.remove} className="mt-4 flex flex-wrap items-center gap-3">
          <input type="hidden" name="slug" value={slug} />
          <p className="w-full font-semibold" role="alert">
            Supprimer « {name} » ? Cette action est irréversible.
          </p>
          <ConfirmButton />
          <button type="button" onClick={() => setConfirming(false)} className="h-11 border-[3px] border-ink bg-paper px-4 font-bold">
            Annuler
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-4 inline-flex h-11 items-center gap-2 border-[3px] border-ink bg-paper px-4 font-bold hover:bg-pink"
        >
          <Trash2 className="size-4" aria-hidden /> Supprimer…
        </button>
      )}
    </section>
  );
}
