"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Burst } from "@/components/ui/Decor";

/** Erreur inattendue : message clair, sans détail technique exposé au visiteur. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
      <Burst className="size-32 font-comic text-3xl" fill="var(--color-orange)" spin>
        Aïe !
      </Burst>
      <h1 className="display mt-8 text-6xl sm:text-7xl">Petit bug dans le multivers</h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        Une erreur inattendue s&apos;est produite pendant l&apos;affichage de cette page. Vous pouvez réessayer.
      </p>
      {error.digest && <p className="mt-2 font-mono text-xs text-muted">Référence : {error.digest}</p>}
      <button
        type="button"
        onClick={reset}
        className="group mt-8 inline-flex h-14 items-center gap-2 border-[3px] border-ink bg-yellow px-6 text-lg font-bold shadow-pop transition-transform hover:-translate-y-0.5 active:translate-y-1"
      >
        <RotateCcw className="size-5 transition-transform duration-500 group-hover:-rotate-180" aria-hidden />
        Réessayer
      </button>
    </section>
  );
}
