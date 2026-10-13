/**
 * Chargeur d'images de la version statique (GitHub Pages), sans optimiseur
 * Next.js : les photos Unsplash sont redimensionnées par leur CDN, les images
 * du site sont servies telles quelles, avec le préfixe du sous-dossier (/yoru).
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function staticImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // Photo envoyée depuis l'espace édition en ligne, pas encore publiée : aperçu local.
  const pending = (globalThis as { __yoruPendingImages?: Map<string, string> }).__yoruPendingImages?.get(src);
  if (pending) return pending;
  if (src.startsWith("https://images.unsplash.com/")) return `${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 70}`;
  if (src.startsWith("/")) return `${BASE}${src}`;
  return src;
}
