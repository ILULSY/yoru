import { logoOf } from "@/data/shop/logos";
import { withBase } from "@/lib/static-site";
import { cn } from "@/lib/utils";

/**
 * Logo d'une licence ou d'une marque en filigrane, derrière son nom. Le fichier
 * sert de masque : il prend la couleur du texte (currentColor), ce qui garde
 * l'identité YORU quelle que soit la couleur d'origine du logo.
 * Rien n'est affiché si le logo n'est pas disponible.
 */
export function LogoBackdrop({ slug, className, opacity = 0.2 }: { slug: string; className?: string; opacity?: number }) {
  const logo = logoOf(slug);
  if (!logo) return null;
  const url = `url("${withBase(logo.src)}")`;
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute bg-current", className)}
      style={{
        opacity,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
