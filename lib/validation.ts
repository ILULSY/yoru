import { z } from "zod";

/**
 * Schémas de formulaires partagés entre le navigateur (retour immédiat)
 * et le serveur (seule validation qui fait foi).
 */

const email = z
  .string({ error: "Indiquez votre adresse e-mail." })
  .trim()
  .min(1, "Indiquez votre adresse e-mail.")
  .max(254, "Adresse e-mail trop longue.")
  .pipe(z.email("Cette adresse e-mail ne semble pas valide."));

/** Champs anti-abus : pot de miel (doit rester vide) et horodatage d'ouverture. */
const antiSpam = {
  website: z.string().max(0).optional().default(""),
  startedAt: z.number().int().positive(),
};

export const newsletterSchema = z.object({
  email,
  consent: z.literal(true, { error: "Cochez la case pour confirmer votre inscription." }),
  ...antiSpam,
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const CONTACT_SUBJECTS = {
  redaction: "Écrire à la rédaction",
  correction: "Signaler une erreur",
  partenariat: "Partenariat",
  autre: "Autre demande",
} as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Votre nom doit comporter au moins 2 caractères.").max(80, "80 caractères maximum."),
  email,
  subject: z.enum(Object.keys(CONTACT_SUBJECTS) as [keyof typeof CONTACT_SUBJECTS, ...(keyof typeof CONTACT_SUBJECTS)[]], {
    error: "Choisissez un sujet.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Votre message doit comporter au moins 20 caractères.")
    .max(3000, "3 000 caractères maximum."),
  consent: z.literal(true, { error: "Cochez la case pour que nous puissions vous répondre." }),
  ...antiSpam,
});
export type ContactInput = z.infer<typeof contactSchema>;

/** Transforme les erreurs Zod en { champ: message } pour l'affichage. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** Réponse normalisée des API de formulaires. */
export type FormResult =
  | { ok: true; status: "subscribed" | "pending" | "sent"; message: string }
  | {
      ok: false;
      status: "invalid" | "rate_limited" | "not_configured" | "provider_error" | "spam";
      message: string;
      fields?: Record<string, string>;
    };
