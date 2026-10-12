import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Scroll";
import { Bolt, Burst, Sparkle } from "@/components/ui/Decor";

/** Bloc newsletter : grande bulle de dialogue sur fond jaune tramé. */
export function Newsletter() {
  return (
    <section aria-labelledby="newsletter-title" className="relative overflow-hidden border-y-[4px] border-ink bg-yellow py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="halftone absolute inset-0 opacity-[0.12] [--dot-gap:12px]" />
      </div>
      <Parallax speed={0.3} className="pointer-events-none absolute bottom-10 left-[44%] hidden lg:block">
        <Bolt className="h-40 w-24 -rotate-12" fill="var(--color-pink)" />
      </Parallax>
      <Parallax speed={-0.2} className="pointer-events-none absolute right-[5%] bottom-12 hidden lg:block">
        <Sparkle className="size-20 animate-spin-slow" fill="var(--color-ink)" />
      </Parallax>

      <div className="relative mx-auto grid max-w-[88rem] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="font-mono text-xs font-bold tracking-[0.3em] uppercase">§ 11 — Newsletter</p>
          <h2 id="newsletter-title" className="display mt-4 text-[clamp(3rem,9vw,7.5rem)]">
            La pop culture
            <br />
            <span className="text-outline [--stroke:var(--color-ink)] [--stroke-w:3px]">dans ta boîte</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg">
            Une sélection d&apos;articles, de critiques et de dossiers, sans spam. Promis juré sur la tête de notre carte la plus rare.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div className="bubble rounded-[2.5rem] p-6 shadow-pop-lg sm:p-10 [--bubble-bg:var(--color-paper)] [--tail-x:12%]">
            <NewsletterForm />
          </div>
          <div className="pointer-events-none absolute -top-10 -right-4 sm:-right-8">
            <Burst className="size-24 font-comic text-xl text-ink sm:size-28" fill="var(--color-cyan)" spin>
              Gratuit
            </Burst>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
