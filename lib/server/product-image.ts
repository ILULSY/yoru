import "server-only";
import sharp, { type Metadata, type Sharp } from "sharp";
import { clearWhiteBackground } from "@/lib/shop/white-cutout";

/**
 * Préparation des photos produit envoyées depuis l'espace édition :
 * redressement selon l'EXIF, suppression des métadonnées (GPS…),
 * redimensionnement (1600 px max) et conversion en WebP.
 * Option : retrait du fond blanc (photos éditeur sur fond blanc).
 */

export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const ACCEPTED = new Set(["jpeg", "png", "webp", "avif", "heif"]);
const MAX_SIDE = 1600;

export class ImageError extends Error {}

export async function prepareProductImage(input: Buffer, { removeWhite }: { removeWhite: boolean }) {
  let meta: Metadata;
  try {
    meta = await sharp(input, { limitInputPixels: 80_000_000 }).metadata();
  } catch {
    throw new ImageError("Ce fichier n'est pas une image lisible.");
  }
  if (!meta.format || !ACCEPTED.has(meta.format)) {
    throw new ImageError("Format non accepté : envoyez une photo JPEG, PNG, WebP ou AVIF.");
  }

  const base = sharp(input, { limitInputPixels: 80_000_000 })
    .rotate()
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true });

  let pipeline: Sharp;
  if (removeWhite) {
    const { data, info } = await base.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    clearWhiteBackground(data, info.width, info.height);
    pipeline = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({ threshold: 1 });
  } else {
    pipeline = base;
  }

  const { data, info } = await pipeline.webp({ quality: 86, alphaQuality: 90, effort: 5 }).toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}
