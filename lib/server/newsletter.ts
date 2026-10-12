import "server-only";

/**
 * Intégration newsletter — fournisseur : Brevo (API v3).
 * Variables requises : BREVO_API_KEY, BREVO_LIST_ID.
 * Double opt-in (recommandé) : BREVO_DOI_TEMPLATE_ID + BREVO_DOI_REDIRECT_URL.
 * Sans configuration, aucune adresse n'est collectée ni stockée.
 */

export type SubscribeOutcome = "subscribed" | "pending" | "not_configured" | "provider_error";

export function newsletterConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_LIST_ID);
}

export async function subscribe(email: string): Promise<SubscribeOutcome> {
  const key = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!key || !Number.isInteger(listId)) return "not_configured";

  const doiTemplate = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const doiRedirect = process.env.BREVO_DOI_REDIRECT_URL;
  const useDoi = Number.isInteger(doiTemplate) && Boolean(doiRedirect);

  const endpoint = useDoi
    ? "https://api.brevo.com/v3/contacts/doubleOptinConfirmation"
    : "https://api.brevo.com/v3/contacts";
  const body = useDoi
    ? { email, includeListIds: [listId], templateId: doiTemplate, redirectionUrl: doiRedirect }
    : { email, listIds: [listId], updateEnabled: true };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return useDoi ? "pending" : "subscribed";
    // On journalise côté serveur sans exposer le détail au visiteur.
    console.error("[newsletter] Brevo a répondu", res.status, await res.text().catch(() => ""));
    return "provider_error";
  } catch (err) {
    console.error("[newsletter] Échec de l'appel à Brevo", err);
    return "provider_error";
  }
}
