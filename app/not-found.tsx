import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Burst } from "@/components/ui/Decor";

export default function NotFound() {
  return (
    <section data-surface="ink" className="relative isolate overflow-hidden bg-ink text-paper">
      <div aria-hidden className="pixels absolute inset-0 -z-10 opacity-[0.07] [--line:var(--color-cyan)]" />
      <div className="mx-auto flex min-h-[75vh] max-w-[88rem] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="pop-in" style={{ "--r": "-8deg", "--d": "0s" } as React.CSSProperties}>
          <Burst className="size-36 font-comic text-4xl text-ink" fill="var(--color-pink)" spin>
            404
          </Burst>
        </div>
        <h1 className="display text-pop mt-8 text-[clamp(4rem,16vw,12rem)] [--pop-1:var(--color-violet)] [--pop-2:var(--color-cyan)]">
          Game over
        </h1>
        <p className="mt-4 max-w-lg text-lg text-paper/80">
          Cette page a quitté la partie. Le lien est peut-être cassé, ou l&apos;article a changé d&apos;adresse.
        </p>
        <p className="mt-8 animate-blink font-mono text-sm tracking-[0.4em] text-yellow uppercase">Continue ?</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/" variant="yellow" size="lg">
            Retour à l&apos;accueil
          </ButtonLink>
          <ButtonLink href="/recherche" variant="paper" size="lg">
            Rechercher
          </ButtonLink>
        </div>
        <p className="mt-10 text-sm text-muted-ink">
          Ou explorez les <Link href="/univers" className="font-bold text-paper underline">univers</Link>.
        </p>
      </div>
    </section>
  );
}
