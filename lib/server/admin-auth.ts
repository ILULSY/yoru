import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, createSessionToken, verifySessionToken } from "@/lib/server/admin-session";

/**
 * Contrôle d'accès de l'espace édition, à appeler au plus près des données :
 * dans chaque page, action serveur et route d'API de /admin (proxy.ts ne fait
 * qu'une redirection anticipée).
 */

export const isAdmin = cache(async (): Promise<boolean> => {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
});

/** Pages et actions : redirige vers la connexion si la session est absente ou expirée. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/connexion");
}

export async function openSession() {
  const { token, expires } = createSessionToken();
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires,
  });
}

export async function closeSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}
