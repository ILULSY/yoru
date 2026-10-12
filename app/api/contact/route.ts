import { NextResponse } from "next/server";
import { contactSchema, fieldErrors, type FormResult } from "@/lib/validation";
import { clientIp, isSuspiciousTiming, rateLimit } from "@/lib/server/rate-limit";
import { sendContactMessage } from "@/lib/server/mailer";

const json = (body: FormResult, status: number, headers?: HeadersInit) => NextResponse.json(body, { status, headers });

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientIp(request.headers)}`, 3, 15 * 60 * 1000);
  if (!limit.ok) {
    return json(
      { ok: false, status: "rate_limited", message: "Vous avez envoyé plusieurs messages récemment. Réessayez un peu plus tard." },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, status: "invalid", message: "Requête invalide." }, 400);
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    if (fields.website) return json({ ok: false, status: "spam", message: "Envoi refusé." }, 400);
    return json({ ok: false, status: "invalid", message: "Vérifiez les champs signalés.", fields }, 400);
  }
  if (isSuspiciousTiming(parsed.data.startedAt)) {
    return json({ ok: false, status: "spam", message: "Envoi trop rapide : patientez une seconde et réessayez." }, 400);
  }

  const outcome = await sendContactMessage(parsed.data);
  if (outcome === "sent") {
    return json({ ok: true, status: "sent", message: "Message envoyé ! Nous vous répondrons dès que possible." }, 200);
  }
  if (outcome === "not_configured") {
    return json(
      {
        ok: false,
        status: "not_configured",
        message:
          "Le formulaire n'est pas encore relié à une boîte de réception : votre message n'a pas été envoyé ni conservé.",
      },
      503,
    );
  }
  return json(
    { ok: false, status: "provider_error", message: "L'envoi a échoué de notre côté. Réessayez plus tard." },
    502,
  );
}
