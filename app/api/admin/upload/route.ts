import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/admin-auth";
import { ImageError, MAX_UPLOAD_BYTES, prepareProductImage } from "@/lib/server/product-image";
import { getStore, StoreError } from "@/lib/shop/store";
import { slugify } from "@/lib/shop/draft";

/**
 * Envoi d'une photo produit depuis l'espace édition. Réservé aux sessions
 * ouvertes, et aux requêtes venant du site lui-même (en-tête Origin).
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, message: "Session expirée : reconnectez-vous." }, { status: 401 });

  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ ok: false, message: "Requête refusée." }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Envoi illisible." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, message: "Aucun fichier reçu." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ ok: false, message: "Photo trop lourde : 12 Mo maximum." }, { status: 413 });
  }

  const store = getStore();
  const health = await store.health();
  if (!health.writable) return NextResponse.json({ ok: false, message: health.message }, { status: 503 });

  try {
    const image = await prepareProductImage(Buffer.from(await file.arrayBuffer()), { removeWhite: form.get("removeWhite") === "1" });
    const base = slugify(String(form.get("slug") ?? "")).slice(0, 50) || "produit";
    const name = `${base}-${randomBytes(4).toString("hex")}.webp`;
    const src = await store.saveImage(image.data, name);
    return NextResponse.json({ ok: true, src, width: image.width, height: image.height });
  } catch (e) {
    if (e instanceof ImageError || e instanceof StoreError) {
      return NextResponse.json({ ok: false, message: e.message }, { status: 400 });
    }
    console.error("[admin] photo", e);
    return NextResponse.json({ ok: false, message: "La photo n'a pas pu être enregistrée." }, { status: 500 });
  }
}
