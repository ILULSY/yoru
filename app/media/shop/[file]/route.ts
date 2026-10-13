import { promises as fs } from "node:fs";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/shop/store/file";

/**
 * Photos produit envoyées depuis l'espace édition (stockage fichier).
 * Elles ne sont pas dans /public, que Next.js ne sert qu'avec les fichiers
 * présents au moment du build.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-z0-9-]+\.(webp|png)$/.test(file)) return new Response("Introuvable", { status: 404 });
  try {
    const data = await fs.readFile(path.join(UPLOADS_DIR, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "content-type": file.endsWith(".png") ? "image/png" : "image/webp",
        // Nom de fichier unique à chaque envoi : le cache peut être permanent.
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
