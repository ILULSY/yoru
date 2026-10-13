import { clearWhiteBackground } from "@/lib/shop/white-cutout";

/**
 * Préparation d'une photo produit dans le navigateur (espace édition en ligne) :
 * redressement selon l'EXIF, 1600 px max, fond blanc retiré sur demande, puis
 * réencodage (WebP, ou PNG si le navigateur ne sait pas produire de WebP), ce
 * qui supprime aussi les métadonnées (GPS…).
 */

const MAX_BYTES = 12 * 1024 * 1024;
const MAX_SIDE = 1600;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function prepareImageInBrowser(file: File, removeWhite: boolean) {
  if (!TYPES.has(file.type)) throw new Error("Format non accepté : envoyez une photo JPEG, PNG, WebP ou AVIF.");
  if (file.size > MAX_BYTES) throw new Error("Photo trop lourde : 12 Mo maximum.");

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Ce fichier n'est pas une image lisible.");
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  if (removeWhite) {
    const img = ctx.getImageData(0, 0, w, h);
    clearWhiteBackground(img.data, w, h);
    ctx.putImageData(img, 0, 0);
    canvas = trimTransparent(canvas, img.data);
  }

  let blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.86));
  if (!blob || blob.type !== "image/webp") blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  if (!blob) throw new Error("La photo n'a pas pu être préparée.");
  return {
    bytes: new Uint8Array(await blob.arrayBuffer()),
    ext: blob.type === "image/webp" ? "webp" : "png",
    width: canvas.width,
    height: canvas.height,
    previewUrl: URL.createObjectURL(blob),
  } as const;
}

/** Recadre sur la partie non transparente. */
function trimTransparent(canvas: HTMLCanvasElement, px: Uint8ClampedArray): HTMLCanvasElement {
  const { width: w, height: h } = canvas;
  let top = h,
    left = w,
    right = -1,
    bottom = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3]! > 8) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (right < 0) return canvas;
  const out = document.createElement("canvas");
  out.width = right - left + 1;
  out.height = bottom - top + 1;
  out.getContext("2d")!.drawImage(canvas, left, top, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}

/* Aperçus des photos envoyées mais pas encore publiées (lus par lib/image-loader.ts). */
type PendingMap = Map<string, string>;
const g = globalThis as { __yoruPendingImages?: PendingMap };

export function setPendingImage(src: string, previewUrl: string) {
  (g.__yoruPendingImages ??= new Map()).set(src, previewUrl);
}
