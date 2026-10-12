import { buildSearchIndex } from "@/lib/search";

/**
 * Index de recherche généré au build : utilisé par la version statique du site
 * (GitHub Pages), où la recherche se fait dans le navigateur.
 */
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await buildSearchIndex());
}
