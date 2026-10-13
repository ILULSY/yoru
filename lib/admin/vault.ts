/**
 * Accès à l'espace édition en ligne (GitHub Pages) par e-mail et mot de passe.
 *
 * Le site étant statique, il n'y a pas de serveur pour vérifier un mot de passe.
 * La clé GitHub (qui donne le droit d'écrire dans le dépôt) est donc chiffrée
 * (AES-GCM, clé dérivée du mot de passe par PBKDF2-SHA256, 600 000 itérations)
 * et rangée dans le dépôt, dans public/espace-edition.json. Seuls l'e-mail et le
 * mot de passe permettent de la déchiffrer, depuis n'importe quel appareil.
 * L'e-mail n'est jamais publié : seule son empreinte SHA-256 est stockée.
 */

export const ACCOUNTS_PATH = "public/espace-edition.json";
const ITERATIONS = 600_000;

export interface SealedAccount {
  /** Empreinte de l'e-mail (SHA-256). */
  id: string;
  salt: string;
  iv: string;
  data: string;
  iterations: number;
  /** Compte GitHub qui a créé l'accès (affichage). */
  login: string;
  createdAt: string;
}

export interface AccountsFile {
  v: 1;
  comptes: SealedAccount[];
}

const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const enc = (s: string) => new TextEncoder().encode(s);

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export async function emailId(email: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", enc(`yoru-espace-edition:${normalizeEmail(email)}`));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function deriveKey(password: string, salt: Uint8Array, iterations: number) {
  const base = await crypto.subtle.importKey("raw", enc(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** Règles du mot de passe : il protège une donnée publique, il doit donc résister aux essais en masse. */
export function passwordProblem(password: string, email: string): string | null {
  if (password.length < 12) return "Mot de passe : 12 caractères minimum.";
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z\d]/].filter((r) => r.test(password)).length;
  if (password.length < 16 && classes < 3) {
    return "Mot de passe trop simple : mélangez au moins trois types de caractères (minuscules, majuscules, chiffres, symboles), ou utilisez 16 caractères ou plus.";
  }
  const lower = password.toLowerCase();
  const local = normalizeEmail(email).split("@")[0] ?? "";
  if (/^(yoru|password|motdepasse)/.test(lower) && password.length < 16) return "Mot de passe trop facile à deviner.";
  if (local.length >= 4 && lower.includes(local)) return "Le mot de passe ne doit pas reprendre votre e-mail.";
  return null;
}

export async function sealAccount(token: string, email: string, password: string, login: string): Promise<SealedAccount> {
  const id = await emailId(email);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ITERATIONS);
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: enc(id) }, key, enc(token)));
  return { id, salt: b64(salt), iv: b64(iv), data: b64(data), iterations: ITERATIONS, login, createdAt: new Date().toISOString() };
}

/** Rend la clé GitHub, ou lève une erreur si l'e-mail ou le mot de passe est faux. */
export async function openAccount(file: AccountsFile, email: string, password: string): Promise<string> {
  const id = await emailId(email);
  const account = file.comptes.find((c) => c.id === id);
  if (!account) throw new Error("identifiants");
  const key = await deriveKey(password, unb64(account.salt), account.iterations);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: unb64(account.iv) as BufferSource, additionalData: enc(id) },
    key,
    unb64(account.data) as BufferSource,
  );
  return new TextDecoder().decode(plain);
}

/* ── Session de l'onglet (effacée à sa fermeture) ── */

const SESSION_KEY = "yoru-admin-session";

export function sessionToken(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(SESSION_KEY, token);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}
