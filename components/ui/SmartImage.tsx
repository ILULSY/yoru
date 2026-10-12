"use client";

import Image, { type ImageLoader } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { MediaAsset } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * Loader dédié au CDN d'Unsplash (imgix) : redimensionnement, recadrage et
 * format moderne (AVIF/WebP via auto=format) côté CDN, sans solliciter le
 * serveur Next. Les autres sources utilisent l'optimiseur Next par défaut.
 */
const unsplashLoader: ImageLoader = ({ src, width, quality }) =>
  `${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 70}`;

interface Props {
  asset: MediaAsset;
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Image principale au-dessus de la ligne de flottaison (LCP). */
  priority?: boolean;
  /** Surcharge du texte alternatif (sinon celui de la médiathèque). */
  alt?: string;
  quality?: number;
}

/**
 * Image remplissant son conteneur (qui doit être positionné), avec :
 * fond de la couleur dominante pendant le chargement, fondu à l'apparition,
 * et repli graphique si l'image ne peut pas être chargée.
 */
export function SmartImage({ asset, sizes, className, imgClassName, priority, alt, quality }: Props) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const isUnsplash = asset.src.startsWith("https://images.unsplash.com/");

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ backgroundColor: asset.color }}
    >
      {state !== "error" ? (
        <Image
          src={asset.src}
          alt={alt ?? asset.alt}
          fill
          sizes={sizes}
          quality={quality ?? 70}
          loader={isUnsplash ? unsplashLoader : undefined}
          preload={priority}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setState("loaded")}
          onError={() => setState("error")}
          className={cn(
            "object-cover transition-opacity duration-700",
            state === "loaded" || priority ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      ) : (
        <div
          role="img"
          aria-label={alt ?? asset.alt}
          className="absolute inset-0 grid place-items-center bg-ink text-paper"
        >
          <div className="halftone absolute inset-0 opacity-30 [--dot:var(--u)]" aria-hidden />
          <div className="relative flex flex-col items-center gap-2 p-4 text-center">
            <ImageOff className="size-8 text-u" aria-hidden />
            <span className="font-mono text-[11px] tracking-widest text-muted-ink uppercase">Image indisponible</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Crédit photo (exigé par l'éthique éditoriale, recommandé par Unsplash). */
export function PhotoCredit({ asset, className }: { asset: MediaAsset; className?: string }) {
  if (!asset.credit) return null;
  const utm = "?utm_source=yoru&utm_medium=referral";
  return (
    <span className={cn("font-mono text-[11px] tracking-wide", className)}>
      Photo :{" "}
      <a
        href={`https://unsplash.com/@${asset.credit.username}${utm}`}
        className="underline decoration-1 underline-offset-2 hover:decoration-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        {asset.credit.name}
      </a>{" "}
      sur{" "}
      <a
        href={`https://unsplash.com/${utm}`}
        className="underline decoration-1 underline-offset-2 hover:decoration-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        Unsplash
      </a>
    </span>
  );
}
