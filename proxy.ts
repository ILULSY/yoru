import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/server/admin-session";

/**
 * Espace édition : redirection anticipée vers la page de connexion.
 * Ce n'est qu'un premier filtre : chaque page, action serveur et route d'API
 * de l'espace édition vérifie elle-même la session (lib/server/admin-auth.ts).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const loggedIn = verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
  const isLogin = pathname === "/admin/connexion";

  let response: NextResponse;
  if (!loggedIn && !isLogin) {
    const url = new URL("/admin/connexion", request.url);
    if (pathname !== "/admin") url.searchParams.set("suite", `${pathname}${search}`);
    response = NextResponse.redirect(url);
  } else if (loggedIn && isLogin) {
    response = NextResponse.redirect(new URL("/admin", request.url));
  } else {
    response = NextResponse.next();
  }
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
