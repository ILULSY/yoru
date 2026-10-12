import "server-only";
import type { ContactInput } from "@/lib/validation";
import { CONTACT_SUBJECTS } from "@/lib/validation";

/**
 * Envoi des messages du formulaire de contact — fournisseur : Resend.
 * Variables requises : RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.
 */

export type SendOutcome = "sent" | "not_configured" | "provider_error";

export function mailerConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL);
}

export async function sendContactMessage(input: ContactInput): Promise<SendOutcome> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) return "not_configured";

  const subject = `[YORU] ${CONTACT_SUBJECTS[input.subject]} — ${input.name}`;
  const text = [
    `Nom : ${input.name}`,
    `E-mail : ${input.email}`,
    `Sujet : ${CONTACT_SUBJECTS[input.subject]}`,
    "",
    input.message,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: input.email, subject, text }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return "sent";
    console.error("[contact] Resend a répondu", res.status, await res.text().catch(() => ""));
    return "provider_error";
  } catch (err) {
    console.error("[contact] Échec de l'appel à Resend", err);
    return "provider_error";
  }
}
