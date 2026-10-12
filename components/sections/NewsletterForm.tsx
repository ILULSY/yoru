"use client";

import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { Check, Info, LoaderCircle, Send } from "lucide-react";
import { FieldError, Honeypot, inputClasses } from "@/components/ui/Field";
import { fieldErrors, newsletterSchema, type FormResult } from "@/lib/validation";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Phase = "idle" | "submitting" | "done";

/**
 * Inscription à la newsletter. L'état affiché reflète exactement la réponse
 * du serveur : rien n'est simulé si le fournisseur n'est pas configuré.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<FormResult | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { email, consent, website, startedAt };
    const check = newsletterSchema.safeParse(data);
    if (!check.success) {
      setErrors(fieldErrors(check.error));
      return;
    }
    setErrors({});
    setPhase("submitting");
    setResult(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as FormResult;
      setResult(body);
      if (!body.ok && body.fields) setErrors(body.fields);
      setPhase(body.ok ? "done" : "idle");
    } catch {
      setResult({ ok: false, status: "provider_error", message: "Connexion impossible. Vérifiez votre réseau et réessayez." });
      setPhase("idle");
    }
  };

  if (phase === "done" && result?.ok) {
    return (
      <m.div
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={SPRING.bouncy}
        className="relative border-[4px] border-ink bg-lime p-6 shadow-pop-lg"
        role="status"
      >
        <m.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...SPRING.bouncy, delay: 0.1 }}
          className="grid size-14 place-items-center border-[3px] border-ink bg-paper"
        >
          <Check className="size-8" strokeWidth={3.5} aria-hidden />
        </m.span>
        <p className="display mt-4 text-4xl">{result.status === "pending" ? "Vérifiez vos e-mails !" : "Bienvenue !"}</p>
        <p className="mt-2 font-semibold">{result.message}</p>
      </m.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative" aria-describedby="nl-legal">
      <Honeypot value={website} onChange={setWebsite} />
      <label htmlFor="nl-email" className="font-mono text-xs font-bold tracking-[0.25em] uppercase">
        Votre e-mail
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="nl-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="prenom@exemple.fr"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((er) => ({ ...er, email: "" }));
          }}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "nl-email-error" : undefined}
          className={cn(inputClasses(Boolean(errors.email)), "h-14 flex-1 text-lg")}
        />
        <button
          type="submit"
          disabled={phase === "submitting"}
          className="group/btn relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden border-[3px] border-ink bg-ink px-7 text-lg font-bold text-paper shadow-[5px_5px_0_0_var(--color-pink)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-pop)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--color-pink)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-wait"
        >
          <AnimatePresence mode="wait" initial={false}>
            {phase === "submitting" ? (
              <m.span key="load" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-2">
                <LoaderCircle className="size-5 animate-spin" aria-hidden /> Envoi…
              </m.span>
            ) : (
              <m.span key="idle" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-2">
                S&apos;inscrire
                <Send className="size-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 group-hover/btn:rotate-12" aria-hidden />
              </m.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      <FieldError id="nl-email-error" message={errors.email} />

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-snug">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (errors.consent) setErrors((er) => ({ ...er, consent: "" }));
          }}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "nl-consent-error" : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-ink"
        />
        <span>
          J&apos;accepte de recevoir la newsletter YORU. Désinscription possible à tout moment depuis chaque e-mail.
        </span>
      </label>
      <FieldError id="nl-consent-error" message={errors.consent} />

      <AnimatePresence>
        {result && !result.ok && (
          <m.div
            key={result.status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className={cn(
              "mt-5 flex items-start gap-3 border-[3px] border-ink p-4 font-semibold",
              result.status === "not_configured" ? "bg-paper" : "bg-pink",
            )}
          >
            <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>{result.message}</span>
          </m.div>
        )}
      </AnimatePresence>

      <p id="nl-legal" className="mt-4 text-xs leading-relaxed opacity-80">
        Votre adresse sert uniquement à l&apos;envoi de la newsletter. Détails dans notre{" "}
        <Link href="/confidentialite" className="font-semibold underline">
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  );
}
