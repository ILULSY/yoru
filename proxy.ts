import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/server/admin-session";

/**
 * Espace édition.
 * - Redirection anticipée vers la page de connexion. Ce n'est qu'un premier
 *   filtre : chaque page, action serveur et route d'API de l'espace édition
 *   vérifie elle-même la session (lib/server/admin-auth.ts).
 * - Adresse dédiée facultative (ADMIN_HOST, ex. « admin.yoru.ch ») : l'espace
 *   édition n'est alors joignable que sur cette adresse, et sa page d'accueil
 *   mène directement à la gestion des produits.
 */

function hostMatches(request: NextRequest, expected: string): boolean {
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").toLowerCase();
  const want = expected.toLowerCase();
  return want.includes(":") ? host === want : host.split(":")[0] === want;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const adminHost = process.env.ADMIN_HOST?.trim();

  // Base des redirections : l'adresse configurée (et non l'en-tête Host reçu) sur l'adresse dédiée.
  let base = request.url;
  if (adminHost) {
    const onAdminHost = hostMatches(request, adminHost);
    if (onAdminHost) base = `${request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "")}://${adminHost}`;
    // Sur le site public, l'espace édition n'existe pas (page 404 du site).
    if (!onAdminHost && isAdminPath) return NextResponse.rewrite(new URL("/__espace-indisponible", request.url));
    if (onAdminHost && pathname === "/") return NextResponse.redirect(new URL("/admin", base));
  }
  if (!isAdminPath) return NextResponse.next();

  const loggedIn = verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
  const isLogin = pathname === "/admin/connexion";

  let response: NextResponse;
  if (!loggedIn && !isLogin) {
    const url = new URL("/admin/connexion", base);
    if (pathname !== "/admin") url.searchParams.set("suite", `${pathname}${search}`);
    response = NextResponse.redirect(url);
  } else if (loggedIn && isLogin) {
    response = NextResponse.redirect(new URL("/admin", base));
  } else {
    response = NextResponse.next();
  }
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*"],
};
