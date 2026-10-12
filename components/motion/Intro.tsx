"use client";

import { useEffect, useRef, useState } from "react";
import { CRESCENT_PATH } from "@/components/ui/Logo";

const LETTERS = "YORU".split("");
// Rideau nocturne : violets et bleus, avec une touche de rose.
const BARS = ["var(--color-violet)", "var(--color-blue)", "var(--color-pink)", "var(--color-violet)", "var(--color-cyan)"];

/**
 * Écran d'introduction (≈ 2 s, une fois par session, page d'accueil uniquement).
 * L'animation est entièrement en CSS : elle démarre dès le premier rendu,
 * sans attendre le JavaScript, et disparaît d'elle-même. Ce composant ne fait
 * que permettre de la passer (clic, touche, molette) et nettoyer le DOM.
 * Si l'intro n'a pas lieu d'être (déjà vue, animations réduites), le CSS la
 * masque avant même le premier affichage (voir BootScript).
 */
export function Intro() {
  const [gone, setGone] = useState(false);
  const [skip, setSkip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro !== "on") return;
    try {
      sessionStorage.setItem("pv-intro", "1");
    } catch {}

    const doSkip = () => {
      if (html.dataset.intro === "on") html.dataset.intro = "skip";
      setSkip(true);
    };
    window.addEventListener("keydown", doSkip, { once: true });
    window.addEventListener("wheel", doSkip, { once: true, passive: true });
    window.addEventListener("touchmove", doSkip, { once: true, passive: true });
    // Une fois les entrées du hero terminées, on revient aux délais normaux.
    const t = window.setTimeout(() => {
      html.dataset.intro = "off";
    }, 3600);

    return () => {
      window.removeEventListener("keydown", doSkip);
      window.removeEventListener("wheel", doSkip);
      window.removeEventListener("touchmove", doSkip);
      window.clearTimeout(t);
      // Navigation vers une autre page avant la fin : on rétablit les délais normaux.
      // (Le test différé évite de couper l'intro lors du double montage du mode strict.)
      window.setTimeout(() => {
        if (!document.querySelector(".intro")) html.dataset.intro = "off";
      }, 0);
    };
  }, []);

  if (gone) return null;

  const skipNow = () => {
    const html = document.documentElement;
    if (html.dataset.intro === "on") html.dataset.intro = "skip";
    setSkip(true);
  };

  return (
    <div
      ref={ref}
      className={skip ? "intro intro--skip" : "intro"}
      aria-hidden
      onClick={skipNow}
      onAnimationEnd={(e) => {
        if (e.target === ref.current && e.animationName === "intro-hide") {
          if (document.documentElement.dataset.intro === "skip") document.documentElement.dataset.intro = "off";
          setGone(true);
        }
      }}
    >
      <div className="intro-bars">
        {BARS.map((c, i) => (
          <span key={i} className="intro-bar" style={{ "--i": i, "--bar-color": c } as React.CSSProperties} />
        ))}
      </div>

      <div className="intro-content flex flex-col items-center px-6 text-center text-paper">
        {/* Formes qui entrent dans l'écran */}
        {/* La lune se lève derrière le nom */}
        <svg
          viewBox="8 8 32 32"
          className="intro-shape -top-28 -right-10 size-36 text-violet sm:-top-36 sm:-right-28 sm:size-52"
          style={{ "--fx": "30vw", "--fy": "-40vh", "--fr": "-70deg", "--d": "0.02s" } as React.CSSProperties}
        >
          <path d={CRESCENT_PATH} fill="currentColor" />
        </svg>
        <span
          className="intro-shape halftone -bottom-16 -left-4 size-36 text-violet sm:-left-28"
          style={{ "--fx": "-40vw", "--fy": "40vh", "--d": "0.12s", "--dot-gap": "10px" } as React.CSSProperties}
        />
        {[
          { cls: "top-2 -left-6 size-5 sm:-left-16", fx: "-30vw", fy: "-20vh", d: "0.18s" },
          { cls: "-bottom-10 right-6 size-7 sm:right-0", fx: "20vw", fy: "30vh", d: "0.24s" },
          { cls: "top-1/3 -right-8 size-3 sm:-right-20", fx: "40vw", fy: "0", d: "0.3s" },
        ].map((s) => (
          <svg
            key={s.d}
            viewBox="0 0 10 10"
            className={`intro-shape text-paper ${s.cls}`}
            style={{ "--fx": s.fx, "--fy": s.fy, "--fr": "180deg", "--d": s.d } as React.CSSProperties}
          >
            <path d="M5 0l1.3 3.7L10 5 6.3 6.3 5 10 3.7 6.3 0 5l3.7-1.3z" fill="currentColor" />
          </svg>
        ))}

        <p className="display text-pop relative text-[clamp(5rem,24vw,15rem)] leading-[0.82] [--pop-1:var(--color-violet)] [--pop-2:var(--color-pink)]">
          {LETTERS.map((l, i) => (
            <span key={i} className="intro-letter" style={{ "--i": i, "--r": `${i % 2 ? 14 : -14}deg` } as React.CSSProperties}>
              {l}
            </span>
          ))}
        </p>
        <p className="intro-tagline relative mt-5 flex items-center gap-3 border-[3px] border-paper bg-violet px-4 py-1.5 font-comic text-xl tracking-wide text-paper sm:text-3xl">
          <span lang="ja" className="font-sans text-base font-bold sm:text-xl">夜</span> Collect the night.
        </p>
      </div>

      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          skipNow();
        }}
        className="absolute right-4 bottom-4 z-10 border-2 border-paper/60 px-3 py-1.5 font-mono text-xs tracking-widest text-paper uppercase transition-colors hover:bg-paper hover:text-ink"
      >
        Passer l&apos;intro →
      </button>
    </div>
  );
}
