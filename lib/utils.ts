/** Concatène des classes conditionnelles (sans dépendance externe). */
export function cn(...parts: Array<string | false | null | undefined | 0>): string {
  return parts.filter(Boolean).join(" ");
}

/** Pseudo-aléatoire déterministe (stable entre serveur et client) à partir d'une chaîne. */
export function seeded(str: string, salt = 0): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}
