"use client";

import { AnimatePresence, m } from "motion/react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Check, Info, TriangleAlert, X } from "lucide-react";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Tone = "success" | "error" | "info";
interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: Tone;
}

const ToastContext = createContext<(t: Omit<Toast, "id">) => void>(() => {});

export const useToast = () => useContext(ToastContext);

const TONES: Record<Tone, { icon: typeof Check; cls: string }> = {
  success: { icon: Check, cls: "bg-lime" },
  error: { icon: TriangleAlert, cls: "bg-pink" },
  info: { icon: Info, cls: "bg-cyan" },
};

/** Notifications discrètes, annoncées aux lecteurs d'écran (aria-live). */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((ts) => ts.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = nextId.current++;
      setToasts((ts) => [...ts.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:items-end"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const { icon: Icon, cls } = TONES[t.tone];
            return (
              <m.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
                transition={SPRING.bouncy}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 border-[3px] border-ink bg-paper p-3 pr-2 shadow-pop"
              >
                <span className={cn("grid size-8 shrink-0 place-items-center border-2 border-ink", cls)}>
                  <Icon className="size-4" strokeWidth={3} aria-hidden />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm leading-tight font-bold">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-sm text-muted">{t.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="grid size-8 shrink-0 place-items-center transition-transform hover:rotate-90"
                  aria-label="Fermer la notification"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </m.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
