import Link from "next/link";
import { Rss } from "lucide-react";
import { UNIVERSES } from "@/data/universes";
import { SITE } from "@/lib/site";
import { LogoMark } from "@/components/ui/Logo";
import { Sparkle } from "@/components/ui/Decor";
import { VelocityMarquee } from "@/components/motion/Scroll";
import { MotionToggle } from "@/components/layout/MotionToggle";

const MEDIA_LINKS = [
  { href: "/news", label: "News en direct" },
  { href: "/actualites", label: "Tous les articles" },
  { href: "/actualites?type=dossier", label: "Dossiers" },
  { href: "/actualites?type=critique", label: "Critiques" },
  { href: "/actualites?type=guide", label: "Guides" },
  { href: "/boutique", label: "Boutique" },
  { href: "/favoris", label: "Mes favoris" },
];

const ABOUT_LINKS = [
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
  { href: "/cgv", label: "CGV" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex min-h-8 items-center gap-2 text-paper/85 transition-colors hover:text-yellow"
      >
        <span className="h-[3px] w-0 bg-yellow transition-[width] duration-300 ease-[var(--ease-expo)] group-hover:w-4" aria-hidden />
        {children}
      </Link>
    </li>
  );
}

export function Footer() {
  const socials = SITE.socials.filter((s) => s.url);
  const year = new Date().getFullYear();

  return (
    <footer data-surface="ink" className="relative overflow-hidden border-t-[4px] border-ink bg-ink text-paper">
      <div className="border-b-[3px] border-paper/15 bg-violet py-3 text-paper">
        <VelocityMarquee baseVelocity={-1.6} itemClassName="gap-8 pr-8">
          {["Collect the night", "Cinéma", "Anime", "Manga", "Gaming", "Comics", "Collectors", "Geek & Tech"].map((t) => (
            <span key={t} className="display flex items-center gap-8 text-3xl sm:text-4xl">
              {t}
              <Sparkle className="size-6 text-ink" />
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <div className="mx-auto max-w-[88rem] px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3" aria-label="YORU — accueil">
              <LogoMark className="size-14" ring />
              <span className="display text-5xl">Yoru</span>
              <span lang="ja" className="text-2xl font-bold text-violet" aria-hidden>
                夜
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-paper/75">
              <span lang="en" className="font-bold text-paper">{SITE.slogan}</span> {SITE.description}
            </p>
            <div className="mt-6">
              <MotionToggle />
            </div>
          </div>

          <nav aria-label="Univers">
            <h2 className="font-mono text-xs tracking-[0.3em] text-muted-ink uppercase">Univers</h2>
            <ul className="mt-4 space-y-1.5">
              {UNIVERSES.map((u) => (
                <FooterLink key={u.slug} href={`/univers/${u.slug}`}>
                  {u.name}
                </FooterLink>
              ))}
            </ul>
          </nav>

          <nav aria-label="Le média">
            <h2 className="font-mono text-xs tracking-[0.3em] text-muted-ink uppercase">Le média</h2>
            <ul className="mt-4 space-y-1.5">
              {MEDIA_LINKS.map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </ul>
          </nav>

          <div>
            <nav aria-label="Informations">
              <h2 className="font-mono text-xs tracking-[0.3em] text-muted-ink uppercase">Infos</h2>
              <ul className="mt-4 space-y-1.5">
                {ABOUT_LINKS.map((l) => (
                  <FooterLink key={l.href} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </ul>
            </nav>
            <h2 className="mt-8 font-mono text-xs tracking-[0.3em] text-muted-ink uppercase">Suivre</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              <li>
                <a
                  href="/rss.xml"
                  className="inline-flex h-10 items-center gap-2 border-2 border-paper/40 px-3 text-sm font-semibold transition-colors hover:border-yellow hover:bg-yellow hover:text-ink"
                >
                  <Rss className="size-4" aria-hidden /> Flux RSS
                </a>
              </li>
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center border-2 border-paper/40 px-3 text-sm font-semibold transition-colors hover:border-pink hover:bg-pink hover:text-ink"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
            {socials.length === 0 && (
              <p className="mt-3 text-sm text-muted-ink">Nos comptes sur les réseaux sociaux ne sont pas encore ouverts.</p>
            )}
          </div>
        </div>

        <div aria-hidden className="pointer-events-none mt-16 select-none">
          <p className="display text-outline text-center text-[clamp(6rem,38vw,34rem)] leading-[0.8] [--stroke:rgba(139,53,255,0.55)] [--stroke-w:2px]">
            Yoru
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t-2 border-paper/15 pt-6 text-sm text-muted-ink md:flex-row md:items-center md:justify-between">
          <p>
            © {year} YORU. Site de démonstration : les articles marqués « Démo » sont des exemples éditoriaux.
          </p>
          <p>
            Photos libres de droits issues d&apos;
            <a href="https://unsplash.com/?utm_source=yoru&utm_medium=referral" className="underline" target="_blank" rel="noopener noreferrer">
              Unsplash
            </a>{" "}
            — crédits sur chaque article. Visuels produits de la boutique : éditeurs des licences ou illustrations YORU.
          </p>
        </div>
      </div>
    </footer>
  );
}
