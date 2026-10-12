"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, Menu, Search } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ScrollProgressBar } from "@/components/motion/Scroll";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { CartButton } from "@/components/shop/CartButton";
import { CurrencyToggle } from "@/components/shop/Money";
import { useFavorites, useHydrated } from "@/lib/stores/favorites";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/news", label: "News", match: (p: string) => p.startsWith("/news") },
  { href: "/actualites", label: "Articles", match: (p: string) => p.startsWith("/actualites") || p.startsWith("/articles") },
  { href: "/univers", label: "Univers", mega: true, match: (p: string) => p.startsWith("/univers") },
  { href: "/boutique", label: "Boutique", match: (p: string) => p.startsWith("/boutique") || p.startsWith("/panier") },
  { href: "/a-propos", label: "À propos", match: (p: string) => p.startsWith("/a-propos") || p.startsWith("/contact") },
];

export function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const megaTimer = useRef<number | undefined>(undefined);
  const megaBtn = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();
  const { favorites } = useFavorites();
  const hydrated = useHydrated();
  const count = hydrated ? favorites.length : 0;

  // Masque l'en-tête quand on descend, le réaffiche dès qu'on remonte.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    if (mega || mobile || search) return;
    setHidden((h) => (y > 160 && y > prev + 2 ? true : y < prev - 2 ? false : h));
  });

  // Ferme les panneaux lors d'un changement de page
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMega(false);
    setMobile(false);
    setSearch(false);
  }

  // Raccourcis clavier : ⌘K / Ctrl+K ou « / » pour rechercher
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = () => {
    window.clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMegaSoon = () => {
    window.clearTimeout(megaTimer.current);
    megaTimer.current = window.setTimeout(() => setMega(false), 180);
  };

  return (
    <>
      <m.header
        className="sticky top-0 z-50"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onPointerLeave={(e) => e.pointerType === "mouse" && mega && closeMegaSoon()}
      >
        <div
          className={cn(
            "relative border-b-[3px] border-ink bg-paper transition-[box-shadow] duration-300",
            scrolled && "shadow-[0_6px_0_0_rgba(17,17,20,0.08)]",
          )}
        >
          <div className="mx-auto flex h-[var(--header-h)] max-w-[88rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="group -ml-1 shrink-0 rounded-sm" aria-label="YORU — accueil">
              <Logo />
            </Link>

            <nav aria-label="Navigation principale" className="ml-4 hidden lg:block">
              <ul className="flex items-center gap-1" onPointerLeave={() => setHovered(null)}>
                {NAV.map((item) => {
                  const active = item.match(pathname);
                  const isHovered = hovered === item.href;
                  const inner = (
                    <>
                      {isHovered && (
                        <m.span
                          layoutId="nav-hover"
                          className="absolute inset-0 -z-10 border-2 border-ink bg-violet"
                          transition={SPRING.snappy}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                      {item.mega && (
                        <ChevronDown
                          className={cn("size-4 transition-transform duration-300", mega && "rotate-180")}
                          aria-hidden
                        />
                      )}
                      {active && (
                        <m.span
                          layoutId="nav-active"
                          className="absolute right-2 -bottom-[3px] left-2 h-[5px] bg-pink"
                          transition={SPRING.snappy}
                        />
                      )}
                    </>
                  );
                  // Texte clair sur la pastille violette (contraste suffisant, contrairement au noir).
                  const cls = cn(
                    "relative isolate flex h-11 items-center gap-1 px-3.5 text-[0.95rem] font-bold tracking-tight transition-colors",
                    isHovered && "text-paper",
                  );
                  return (
                    <li key={item.href} onPointerEnter={() => setHovered(item.href)}>
                      {item.mega ? (
                        <button
                          ref={megaBtn}
                          type="button"
                          className={cls}
                          aria-expanded={mega}
                          aria-controls="mega-menu"
                          onClick={() => setMega((v) => !v)}
                          onPointerEnter={(e) => e.pointerType === "mouse" && openMega()}
                        >
                          {inner}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={cls}
                          aria-current={active ? "page" : undefined}
                          onPointerEnter={() => mega && closeMegaSoon()}
                        >
                          {inner}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <CurrencyToggle size="sm" className="hidden xl:inline-flex" />
              <button
                type="button"
                onClick={() => setSearch(true)}
                className="group/s flex h-11 items-center gap-2 border-[3px] border-ink bg-paper px-3 font-semibold transition-[transform,box-shadow] duration-200 ease-[var(--ease-pop)] hover:-translate-y-0.5 hover:shadow-pop-sm active:translate-y-0 active:shadow-none xl:w-56"
                aria-label="Rechercher (raccourci : Ctrl+K)"
              >
                <Search
                  className="size-5 transition-transform duration-300 ease-[var(--ease-pop)] group-hover/s:-rotate-12 group-hover/s:scale-110"
                  strokeWidth={2.6}
                  aria-hidden
                />
                <span className="hidden text-sm text-muted xl:inline">Rechercher…</span>
                <kbd className="ml-auto hidden border-2 border-ink/20 px-1.5 font-mono text-[11px] text-muted xl:inline">⌘K</kbd>
              </button>

              <Link
                href="/favoris"
                className="group/f relative hidden size-11 place-items-center border-[3px] border-ink bg-pink sm:grid transition-[transform,box-shadow] duration-200 ease-[var(--ease-pop)] hover:-translate-y-0.5 hover:-rotate-6 hover:shadow-pop-sm"
                aria-label={`Mes favoris${count ? ` (${count})` : ""}`}
              >
                <Heart className="size-5 transition-transform group-hover/f:scale-110" strokeWidth={2.6} aria-hidden />
                <AnimatePresence>
                  {count > 0 && (
                    <m.span
                      key={count}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={SPRING.bouncy}
                      className="absolute -top-2.5 -right-2.5 grid min-w-6 place-items-center rounded-full border-2 border-ink bg-yellow px-1 font-mono text-[11px] leading-5 font-bold"
                      aria-hidden
                    >
                      {count}
                    </m.span>
                  )}
                </AnimatePresence>
              </Link>

              <CartButton />

              <button
                type="button"
                onClick={() => setMobile(true)}
                className="grid size-11 place-items-center border-[3px] border-ink bg-ink text-paper transition-transform duration-200 ease-[var(--ease-pop)] hover:rotate-6 active:scale-90 lg:hidden"
                aria-label="Ouvrir le menu"
                aria-expanded={mobile}
                aria-controls="mobile-menu"
              >
                <Menu className="size-5" strokeWidth={2.6} aria-hidden />
              </button>
            </div>
          </div>
          <ScrollProgressBar className="absolute inset-x-0 -bottom-[3px]" />
        </div>

        <AnimatePresence>
          {mega && (
            <MegaMenu
              onClose={() => {
                setMega(false);
                megaBtn.current?.focus();
              }}
              onPointerEnter={openMega}
            />
          )}
        </AnimatePresence>
      </m.header>

      <AnimatePresence>{mobile && <MobileMenu onClose={() => setMobile(false)} pathname={pathname} />}</AnimatePresence>
      <AnimatePresence>{search && <SearchDialog onClose={() => setSearch(false)} />}</AnimatePresence>
    </>
  );
}
