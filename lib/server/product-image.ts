import "server-only";
import sharp, { type Metadata, type Sharp } from "sharp";

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

/**
 * Rend transparent le fond clair relié aux bords de l'image (remplissage par
 * diffusion) : le blanc à l'intérieur du produit est conservé. Les pixels de
 * bordure sont adoucis pour éviter un liseré.
 */
function clearWhiteBackground(px: Buffer, w: number, h: number) {
  const n = w * h;
  const isLight = (i: number) => {
    const o = i * 4;
    const r = px[o]!,
      g = px[o + 1]!,
      b = px[o + 2]!;
    const min = Math.min(r, g, b);
    return px[o + 3]! < 16 || (min >= 228 && Math.max(r, g, b) - min <= 22);
  };
  const bg = new Uint8Array(n);
  const stack: number[] = [];
  const push = (i: number) => {
    if (!bg[i] && isLight(i)) {
      bg[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < n - w) push(i + w);
  }
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (bg[i]) {
      px[o + 3] = 0;
      continue;
    }
    const x = i % w;
    const edge = (x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || (i >= w && bg[i - w]) || (i < n - w && bg[i + w]);
    if (edge) {
      const min = Math.min(px[o]!, px[o + 1]!, px[o + 2]!);
      if (min > 170) px[o + 3] = Math.round(px[o + 3]! * Math.min(1, (255 - min) / 85));
    }
  }
}
