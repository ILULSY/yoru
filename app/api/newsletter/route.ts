import { NextResponse } from "next/server";
import { fieldErrors, newsletterSchema, type FormResult } from "@/lib/validation";
import { clientIp, isSuspiciousTiming, rateLimit } from "@/lib/server/rate-limit";
import { subscribe } from "@/lib/server/newsletter";

const json = (body: FormResult, status: number, headers?: HeadersInit) => NextResponse.json(body, { status, headers });

export async function POST(request: Request) {
  const limit = rateLimit(`nl:${clientIp(request.headers)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return json(
      { ok: false, status: "rate_limited", message: "Trop de tentatives. Réessayez dans quelques minutes." },
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

  const parsed = newsletterSchema.safeParse(payload);
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    if (fields.website) return json({ ok: false, status: "spam", message: "Envoi refusé." }, 400);
    return json({ ok: false, status: "invalid", message: "Vérifiez les champs du formulaire.", fields }, 400);
  }
  if (isSuspiciousTiming(parsed.data.startedAt)) {
    return json({ ok: false, status: "spam", message: "Envoi trop rapide : patientez une seconde et réessayez." }, 400);
  }

  const outcome = await subscribe(parsed.data.email);
  switch (outcome) {
    case "subscribed":
      return json({ ok: true, status: "subscribed", message: "C'est fait ! Votre inscription à la newsletter est enregistrée." }, 200);
    case "pending":
      return json(
        { ok: true, status: "pending", message: "Presque fini : confirmez votre inscription via l'e-mail que nous venons d'envoyer." },
        200,
      );
    case "not_configured":
      return json(
        {
          ok: false,
          status: "not_configured",
          message:
            "La newsletter n'est pas encore ouverte : aucun service d'envoi n'est configuré. Votre adresse n'a pas été enregistrée.",
        },
        503,
      );
    default:
      return json(
        { ok: false, status: "provider_error", message: "Le service d'inscription ne répond pas. Réessayez plus tard." },
        502,
      );
  }
}
