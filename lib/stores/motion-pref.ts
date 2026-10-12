"use client";

import { useSyncExternalStore } from "react";

/**
 * Préférence d'animation : « full » ou « reduced ».
 * Valeur initiale résolue avant le premier rendu par le script d'amorçage
 * (components/layout/BootScript.tsx) : choix enregistré, sinon préférence système.
 */
export type MotionPref = "full" | "reduced";

const KEY = "pv-motion";
const listeners = new Set<() => void>();

function current(): MotionPref {
  return document.documentElement.dataset.motion === "reduced" ? "reduced" : "full";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {}
    if (!stored) {
      document.documentElement.dataset.motion = mq.matches ? "reduced" : "full";
      listeners.forEach((l) => l());
    }
  };
  mq.addEventListener("change", onChange);
  return () => {
    listeners.delete(listener);
    mq.removeEventListener("change", onChange);
  };
}

export function setMotionPref(pref: MotionPref) {
  document.documentElement.dataset.motion = pref;
  try {
    localStorage.setItem(KEY, pref);
  } catch {}
  listeners.forEach((l) => l());
}

export function useMotionPref(): MotionPref {
  return useSyncExternalStore(subscribe, current, () => "full");
}

/** true quand les animations doivent être réduites (choix utilisateur ou système). */
export function useCalm(): boolean {
  return useMotionPref() === "reduced";
}
