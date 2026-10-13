import { StoreError } from "@/lib/shop/store/types";

/**
 * Accès au dépôt GitHub depuis le navigateur (espace édition de la version en
 * ligne). Chaque enregistrement est un commit sur la branche publiée ; GitHub
 * Actions reconstruit ensuite le site.
 */

const API = (process.env.NEXT_PUBLIC_GITHUB_API || "https://api.github.com").replace(/\/$/, "");
export const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || "";
export const BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main";
export const CATALOG_PATH = "data/shop/catalog.json";

export interface CatalogDoc {
  version: 1;
  updatedAt: string;
  products: unknown[];
}

async function gh(token: string, path: string, init: RequestInit = {}): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
    });
  } catch {
    throw new StoreError("GitHub ne répond pas : vérifiez votre connexion internet.", "unavailable");
  }
  if (res.status === 401) throw new StoreError("Clé GitHub refusée (expirée ou révoquée) : verrouillez puis enregistrez une nouvelle clé.", "unavailable");
  if (res.status === 403 || res.status === 404) {
    throw new StoreError("La clé GitHub n'a pas accès en écriture à ce dépôt (permission « Contents : Read and write »).", "readonly");
  }
  if (res.status === 409 || res.status === 422) {
    throw new StoreError("Le catalogue a changé sur GitHub entre-temps (autre modification ?). Rechargez la page et recommencez.", "conflict");
  }
  if (!res.ok) throw new StoreError(`GitHub a refusé la demande (erreur ${res.status}).`, "unavailable");
  return res;
}

const toBase64 = (bytes: Uint8Array) => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const fromBase64 = (b64: string) => Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0));
const path = (p: string) => p.split("/").map(encodeURIComponent).join("/");

/** Vérifie la clé : compte, accès au dépôt et droit d'écriture. */
export async function checkAccess(token: string): Promise<{ login: string }> {
  if (!REPO) throw new StoreError("Dépôt GitHub non configuré (NEXT_PUBLIC_GITHUB_REPO).", "unavailable");
  const [user, repo] = await Promise.all([
    gh(token, "/user").then((r) => r.json() as Promise<{ login: string }>),
    gh(token, `/repos/${REPO}`).then((r) => r.json() as Promise<{ permissions?: { push?: boolean } }>),
  ]);
  if (repo.permissions && !repo.permissions.push) {
    throw new StoreError("Ce compte GitHub n'a pas le droit de modifier le dépôt.", "readonly");
  }
  return { login: user.login };
}

export async function readCatalog(token: string): Promise<{ doc: CatalogDoc; sha: string }> {
  const res = await gh(token, `/repos/${REPO}/contents/${path(CATALOG_PATH)}?ref=${encodeURIComponent(BRANCH)}`);
  const file = (await res.json()) as { content: string; sha: string };
  const doc = JSON.parse(new TextDecoder().decode(fromBase64(file.content))) as Partial<CatalogDoc>;
  if (!Array.isArray(doc.products)) throw new StoreError("Catalogue illisible sur GitHub.", "unavailable");
  return { doc: { version: 1, updatedAt: doc.updatedAt ?? new Date().toISOString(), products: doc.products }, sha: file.sha };
}

/** Enregistre le catalogue ; refusé si le fichier a changé depuis la lecture (`sha`). */
export async function writeCatalog(token: string, doc: CatalogDoc, sha: string, message: string) {
  const content = new TextEncoder().encode(JSON.stringify(doc, null, 2) + "\n");
  await gh(token, `/repos/${REPO}/contents/${path(CATALOG_PATH)}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: toBase64(content), sha, branch: BRANCH }),
  });
}

/** Ajoute un nouveau fichier (photo) au dépôt. */
export async function addFile(token: string, filePath: string, bytes: Uint8Array, message: string) {
  await gh(token, `/repos/${REPO}/contents/${path(filePath)}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: toBase64(bytes), branch: BRANCH }),
  });
}

/** Dernière publication (GitHub Actions) ; null si la clé n'a pas accès aux Actions. */
export async function latestPublication(token: string): Promise<{ status: string; conclusion: string | null; url: string; createdAt: string } | null> {
  try {
    const res = await gh(token, `/repos/${REPO}/actions/runs?branch=${encodeURIComponent(BRANCH)}&per_page=1`);
    const data = (await res.json()) as { workflow_runs: { status: string; conclusion: string | null; html_url: string; created_at: string }[] };
    const run = data.workflow_runs[0];
    return run ? { status: run.status, conclusion: run.conclusion, url: run.html_url, createdAt: run.created_at } : null;
  } catch {
    return null;
  }
}
