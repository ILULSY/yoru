"use client";

import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { Check, Info, LoaderCircle, Send } from "lucide-react";
import { FieldError, Honeypot, inputClasses } from "@/components/ui/Field";
import { CONTACT_SUBJECTS, contactSchema, fieldErrors, type FormResult } from "@/lib/validation";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Values = { name: string; email: string; subject: string; message: string; consent: boolean };
const EMPTY: Values = { name: "", email: "", subject: "", message: "", consent: false };

/**
 * Formulaire de contact : validation instantanée (au départ de chaque champ),
 * validation serveur, et affichage honnête de l'issue de l'envoi.
 */
export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [website, setWebsite] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<FormResult | null>(null);

  const payload = () => ({ ...values, website, startedAt });

  const validateField = (name: keyof Values, next: Values) => {
    const res = contactSchema.safeParse({ ...next, website, startedAt });
    const errs = res.success ? {} : fieldErrors(res.error);
    setErrors((e) => ({ ...e, [name]: errs[name] ?? "" }));
  };

  const set = <K extends keyof Values>(name: K, value: Values[K]) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) validateField(name, next);
  };

  const blur = (name: keyof Values) => {
    setTouched((t) => ({ ...t, [name]: true }));
    validateField(name, values);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = contactSchema.safeParse(payload());
    if (!check.success) {
      const errs = fieldErrors(check.error);
      setErrors(errs);
      setTouched({ name: true, email: true, subject: true, message: true, consent: true });
      const first = Object.keys(errs)[0];
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const body = (await res.json()) as FormResult;
      setResult(body);
      if (!body.ok && body.fields) setErrors(body.fields);
      if (body.ok) setValues(EMPTY);
    } catch {
      setResult({ ok: false, status: "provider_error", message: "Connexion impossible. Vérifiez votre réseau et réessayez." });
    } finally {
      setSubmitting(false);
    }
  };

  const describe = (name: string, hint?: string) =>
    [errors[name] ? `contact-${name}-error` : null, hint].filter(Boolean).join(" ") || undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6">
      <Honeypot value={website} onChange={setWebsite} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="font-bold">
            Nom <span aria-hidden className="text-[#b0005a]">*</span>
          </label>
          <input
            id="contact-name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describe("name")}
            aria-required
            className={cn(inputClasses(Boolean(errors.name)), "mt-2 h-13")}
          />
          <FieldError id="contact-name-error" message={errors.name} />
        </div>
        <div>
          <label htmlFor="contact-email" className="font-bold">
            E-mail <span aria-hidden className="text-[#b0005a]">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => blur("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describe("email")}
            aria-required
            className={cn(inputClasses(Boolean(errors.email)), "mt-2 h-13")}
          />
          <FieldError id="contact-email-error" message={errors.email} />
        </div>
      </div>

      <fieldset>
        <legend className="font-bold">
          Sujet <span aria-hidden className="text-[#b0005a]">*</span>
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-describedby={describe("subject")}>
          {Object.entries(CONTACT_SUBJECTS).map(([key, label]) => {
            const active = values.subject === key;
            return (
              <label
                key={key}
                className={cn(
                  "relative flex min-h-12 cursor-pointer items-center gap-3 border-[3px] px-4 py-2 font-semibold transition-[transform,background-color] duration-200",
                  active ? "-rotate-1 border-ink bg-yellow" : "border-ink bg-paper hover:bg-paper-2",
                )}
              >
                <input
                  id={key === Object.keys(CONTACT_SUBJECTS)[0] ? "contact-subject" : undefined}
                  type="radio"
                  name="subject"
                  value={key}
                  checked={active}
                  onChange={() => {
                    set("subject", key);
                    setErrors((e) => ({ ...e, subject: "" }));
                  }}
                  className="size-4 accent-ink"
                />
                {label}
              </label>
            );
          })}
        </div>
        <FieldError id="contact-subject-error" message={errors.subject} />
      </fieldset>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="contact-message" className="font-bold">
            Message <span aria-hidden className="text-[#b0005a]">*</span>
          </label>
          <span id="contact-message-count" className={cn("font-mono text-xs", values.message.length > 3000 ? "text-[#b0005a]" : "text-muted")}>
            {values.message.length} / 3000
          </span>
        </div>
        <textarea
          id="contact-message"
          rows={7}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          onBlur={() => blur("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describe("message", "contact-message-count")}
          aria-required
          className={cn(inputClasses(Boolean(errors.message)), "mt-2 resize-y py-3 leading-relaxed")}
        />
        <FieldError id="contact-message-error" message={errors.message} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
          <input
            id="contact-consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => {
              set("consent", e.target.checked);
              setErrors((er) => ({ ...er, consent: "" }));
            }}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describe("consent")}
            className="mt-0.5 size-5 shrink-0 accent-ink"
          />
          <span>
            J&apos;accepte que mes nom, e-mail et message soient utilisés uniquement pour répondre à ma demande (voir la{" "}
            <Link href="/confidentialite" className="font-semibold underline">
              politique de confidentialité
            </Link>
            ).
          </span>
        </label>
        <FieldError id="contact-consent-error" message={errors.consent} />
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <m.div
            key={result.status}
            role={result.ok ? "status" : "alert"}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={SPRING.snappy}
            className={cn(
              "flex items-start gap-3 border-[3px] border-ink p-4 font-semibold",
              result.ok ? "bg-lime" : result.status === "not_configured" ? "bg-paper-2" : "bg-pink",
            )}
          >
            {result.ok ? <Check className="mt-0.5 size-5 shrink-0" aria-hidden /> : <Info className="mt-0.5 size-5 shrink-0" aria-hidden />}
            <span>{result.message}</span>
          </m.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={submitting}
        className="group/btn inline-flex h-14 items-center gap-2 border-[3px] border-ink bg-ink px-7 text-lg font-bold text-paper shadow-[5px_5px_0_0_var(--color-pink)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-pop)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--color-pink)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-wait disabled:opacity-80"
      >
        {submitting ? (
          <>
            <LoaderCircle className="size-5 animate-spin" aria-hidden /> Envoi en cours…
          </>
        ) : (
          <>
            Envoyer le message
            <Send className="size-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" aria-hidden />
          </>
        )}
      </button>
      <p className="text-sm text-muted">
        <span aria-hidden className="text-[#b0005a]">*</span> Champs obligatoires.
      </p>
    </form>
  );
}
