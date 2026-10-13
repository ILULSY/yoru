import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Jeton de session de l'espace édition : `expiration.signature`, signé en
 * HMAC-SHA256. Sans dépendance à Next.js : utilisé par proxy.ts (vérification
 * rapide) et par lib/server/admin-auth.ts (vérification dans chaque action).
 *
 * La clé de signature dérive de ADMIN_SESSION_SECRET et du mot de passe :
 * changer l'un ou l'autre déconnecte toutes les sessions ouvertes.
 */

export const ADMIN_COOKIE = "yoru_admin";
export const SESSION_HOURS = 12;

const MIN_PASSWORD = 12;
const MIN_SECRET = 32;

export function adminSetupProblems(): string[] {
  const problems: string[] = [];
  const pwd = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!pwd) problems.push("ADMIN_PASSWORD n'est pas défini.");
  else if (pwd.length < MIN_PASSWORD) problems.push(`ADMIN_PASSWORD doit contenir au moins ${MIN_PASSWORD} caractères.`);
  if (!secret) problems.push("ADMIN_SESSION_SECRET n'est pas défini.");
  else if (secret.length < MIN_SECRET) problems.push(`ADMIN_SESSION_SECRET doit contenir au moins ${MIN_SECRET} caractères.`);
  return problems;
}

export function adminConfigured(): boolean {
  return adminSetupProblems().length === 0;
}

function signingKey(): Buffer | null {
  if (!adminConfigured()) return null;
  const pwdHash = createHash("sha256").update(process.env.ADMIN_PASSWORD!).digest("hex");
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(`yoru-admin:${pwdHash}`).digest();
}

function sign(payload: string, key: Buffer): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function createSessionToken(now = Date.now()): { token: string; expires: Date } {
  const key = signingKey();
  if (!key) throw new Error("Espace édition non configuré");
  const exp = now + SESSION_HOURS * 3600_000;
  const payload = String(exp);
  return { token: `${payload}.${sign(payload, key)}`, expires: new Date(exp) };
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  const key = signingKey();
  if (!key || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !/^\d{13}$/.test(payload)) return false;
  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  return Number(payload) > now;
}

/** Comparaison à durée constante (les empreintes ont toujours la même longueur). */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !adminConfigured()) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/** E-mail de connexion facultatif (ADMIN_EMAIL) : s'il est défini, il est demandé avec le mot de passe. */
export function adminEmailRequired(): boolean {
  return Boolean(process.env.ADMIN_EMAIL?.trim());
}

export function emailMatches(input: string): boolean {
  const expected = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!expected) return true;
  const a = createHash("sha256").update(input.trim().toLowerCase()).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
