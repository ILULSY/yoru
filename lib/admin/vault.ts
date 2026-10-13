/**
 * Coffre de la clé GitHub dans le navigateur : la clé est chiffrée (AES-GCM)
 * avec une clé dérivée du mot de passe (PBKDF2, 310 000 itérations). Sans le
 * mot de passe, la clé stockée est inutilisable.
 */

export interface Vault {
  v: 1;
  salt: string;
  iv: string;
  data: string;
  /** Compte GitHub associé (affichage). */
  login: string;
}

const ITERATIONS = 310_000;
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function deriveKey(password: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function sealToken(token: string, password: string, login: string): Promise<Vault> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(token)));
  return { v: 1, salt: b64(salt), iv: b64(iv), data: b64(data), login };
}

/** Rend la clé, ou lève une erreur si le mot de passe est faux. */
export async function openToken(vault: Vault, password: string): Promise<string> {
  const key = await deriveKey(password, unb64(vault.salt));
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(vault.iv) as BufferSource }, key, unb64(vault.data) as BufferSource);
  return new TextDecoder().decode(plain);
}

const VAULT_KEY = "yoru-admin-vault";
const SESSION_KEY = "yoru-admin-session";

export function loadVault(): Vault | null {
  try {
    const v = JSON.parse(localStorage.getItem(VAULT_KEY) ?? "null") as Vault | null;
    return v?.v === 1 ? v : null;
  } catch {
    return null;
  }
}

export function saveVault(v: Vault) {
  localStorage.setItem(VAULT_KEY, JSON.stringify(v));
}

export function forgetVault() {
  try {
    localStorage.removeItem(VAULT_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

/** Clé déverrouillée pour l'onglet en cours (effacée à la fermeture de l'onglet). */
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
