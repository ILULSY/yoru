"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Check, Link2, Mail, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Partage : feuille de partage native quand le navigateur la propose
 * (mobile), sinon menu avec copie du lien et réseaux. Seule l'URL publique
 * de l'article est transmise — aucune donnée personnelle.
 */
export function ShareButton({ url, title, className }: { url: string; title: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const share = async () => {
    if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    setOpen((o) => !o);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ tone: "success", title: "Lien copié", description: "Collez-le où vous voulez !" });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ tone: "error", title: "Copie impossible", description: "Votre navigateur bloque l'accès au presse-papiers." });
    }
  };

  const enc = encodeURIComponent;
  const targets = [
    { name: "X", href: `https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}` },
    { name: "Bluesky", href: `https://bsky.app/intent/compose?text=${enc(`${title} ${url}`)}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
  ];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={share}
        aria-expanded={open}
        aria-haspopup="true"
        className="group inline-flex h-12 items-center gap-2 border-[3px] border-ink bg-paper px-4 font-bold transition-[transform,box-shadow] duration-200 ease-[var(--ease-pop)] hover:-translate-y-0.5 hover:shadow-pop-sm active:translate-y-0.5 active:shadow-none"
      >
        <Share2 className="size-5 transition-transform duration-300 group-hover:-rotate-12" aria-hidden />
        Partager
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.95, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={SPRING.snappy}
            className="absolute top-full left-0 z-40 mt-2 w-60 origin-top-left border-[3px] border-ink bg-paper p-2 shadow-pop"
          >
            <button
              type="button"
              role="menuitem"
              onClick={copy}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left font-semibold hover:bg-yellow"
            >
              {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
              {copied ? "Lien copié !" : "Copier le lien"}
            </button>
            <a
              role="menuitem"
              href={`mailto:?subject=${enc(title)}&body=${enc(url)}`}
              className="flex items-center gap-2 px-3 py-2.5 font-semibold hover:bg-yellow"
            >
              <Mail className="size-4" aria-hidden /> Par e-mail
            </a>
            <div className="my-1 border-t-2 border-ink/10" />
            {targets.map((t) => (
              <a
                key={t.name}
                role="menuitem"
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 text-sm font-semibold hover:bg-yellow"
              >
                {t.name}
                <span aria-hidden>↗</span>
              </a>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
