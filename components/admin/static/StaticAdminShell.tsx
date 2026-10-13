"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, ExternalLink, KeyRound, LoaderCircle, Lock, Plus, RefreshCw, TriangleAlert } from "lucide-react";
import type { Product } from "@/types/shop";
import { checkAccess, fetchAccounts, latestPublication, readCatalog, REPO, saveAccount } from "@/lib/admin/github";
import { createGithubBackend } from "@/lib/admin/github-backend";
import { openAccount, passwordProblem, sealAccount, sessionToken, setSessionToken, type AccountsFile } from "@/lib/admin/vault";
import { validateCatalog } from "@/lib/shop/schema";
import { StoreError } from "@/lib/shop/store/types";
import { absoluteUrl } from "@/lib/site";
import { AdminBackendProvider } from "@/components/admin/backend";
import { LogoMark } from "@/components/ui/Logo";
import { FieldError, inputClasses } from "@/components/ui/Field";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Espace édition de la version en ligne (GitHub Pages).
 * Connexion par e-mail et mot de passe : ils déchiffrent la clé GitHub
 * personnelle (limitée au dépôt) rangée chiffrée dans le dépôt (lib/admin/vault.ts).
 * Sans cette clé, personne ne peut rien modifier.
 */

type CatalogState = { products: Product[]; problems: string[] };
const CatalogContext = createContext<CatalogState | null>(null);

export function useStaticCatalog(): CatalogState {
  const state = useContext(CatalogContext);
  if (!state) throw new Error("useStaticCatalog hors de StaticAdminShell");
  return state;
}

/* La clé déverrouillée vit dans sessionStorage ; ce petit magasin prévient React des changements. */
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const updateSession = (token: string | null) => {
  setSessionToken(token);
  listeners.forEach((l) => l());
};

export function StaticAdminShell({ children }: { children: React.ReactNode }) {
  // undefined : pas encore lu (rendu statique) ; null : verrouillé.
  const token = useSyncExternalStore(subscribe, sessionToken, () => undefined);
  if (token === undefined) return <Centered><LoaderCircle className="mx-auto size-8 animate-spin" aria-label="Chargement" /></Centered>;
  if (!token) return <Gate onUnlock={(t) => updateSession(t)} />;
  return <Unlocked token={token}>{children}</Unlocked>;
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh place-items-center px-4 py-16">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

/* ── Connexion par e-mail et mot de passe, ou création de l'accès (une seule fois) ── */

function Gate({ onUnlock }: { onUnlock: (token: string) => void }) {
  // undefined : lecture en cours ; null : aucun accès créé pour l'instant.
  const [accounts, setAccounts] = useState<AccountsFile | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "setup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetchAccounts()
      .then((file) => {
        setAccounts(file);
        if (!file?.comptes.length) setMode("setup");
      })
      .catch((e: unknown) => setLoadError(e instanceof StoreError ? e.message : "Impossible de lire les accès."));
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accounts) return;
    setPending(true);
    setError(null);
    try {
      onUnlock(await openAccount(accounts, email, password));
    } catch {
      // Petite attente : ralentit les essais en série (le calcul PBKDF2 prend déjà du temps).
      await new Promise((r) => setTimeout(r, 400));
      setError("E-mail ou mot de passe incorrect.");
      setPending(false);
    }
  };

  const setup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Adresse e-mail invalide.");
    const weak = passwordProblem(password, email);
    if (weak) return setError(weak);
    if (password !== confirm) return setError("Les deux mots de passe ne correspondent pas.");
    setPending(true);
    try {
      const token = key.trim();
      const { login: githubLogin } = await checkAccess(token);
      await saveAccount(token, await sealAccount(token, email, password, githubLogin));
      onUnlock(token);
    } catch (err) {
      setError(err instanceof StoreError ? err.message : "Cette clé n'a pas pu être vérifiée auprès de GitHub.");
      setPending(false);
    }
  };

  const field = (id: string, label: string, input: React.ReactNode, hint?: string) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {label}
      </label>
      {input}
      {hint && <p className="pt-1 text-sm text-muted">{hint}</p>}
    </div>
  );

  return (
    <Centered>
      <a href={absoluteUrl("/")} className="mb-8 inline-flex items-center gap-3">
        <LogoMark className="size-12" />
        <span>
          <span className="display block text-3xl leading-none">Yoru</span>
          <span className="font-mono text-[11px] font-bold tracking-[0.25em] text-muted uppercase">Espace édition</span>
        </span>
      </a>
      <div className="border-[4px] border-ink bg-paper p-6 shadow-pop-lg sm:p-8">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <Lock className="size-6" aria-hidden /> {mode === "login" ? "Connexion" : "Créer votre accès"}
        </h1>

        {loadError ? (
          <p role="alert" className="mt-5 flex items-start gap-2 border-[3px] border-ink bg-pink p-3 text-sm font-semibold">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden /> {loadError}
          </p>
        ) : accounts === undefined ? (
          <p className="mt-5 flex items-center gap-2 text-sm font-semibold">
            <LoaderCircle className="size-4 animate-spin" aria-hidden /> Chargement…
          </p>
        ) : mode === "login" ? (
          <form onSubmit={login} className="mt-6 space-y-5">
            {field(
              "email",
              "E-mail",
              <input id="email" type="email" autoFocus required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={cn(inputClasses(Boolean(error)), "h-12")} />,
            )}
            {field(
              "pw",
              "Mot de passe",
              <input id="pw" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={cn(inputClasses(Boolean(error)), "h-12")} />,
            )}
            <FieldError id="login-error" message={error ?? undefined} />
            <button type="submit" disabled={pending} className={buttonClasses("ink", "md", "w-full")}>
              {pending && <LoaderCircle className="size-5 animate-spin" aria-hidden />} {pending ? "Connexion…" : "Se connecter"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("setup");
                setError(null);
              }}
              className="w-full text-center text-sm font-semibold underline"
            >
              Mot de passe oublié ou nouvel accès ? (clé GitHub nécessaire)
            </button>
          </form>
        ) : (
          <form onSubmit={setup} className="mt-6 space-y-5">
            <div className="space-y-2 text-sm leading-relaxed">
              <p>
                Le site en ligne n&apos;a pas de serveur : vos modifications sont enregistrées dans le dépôt GitHub <strong>{REPO}</strong>.
                Pour créer votre accès, il faut <strong>une seule fois</strong> une clé GitHub :
              </p>
              <ol className="list-decimal space-y-1 pl-5">
                <li>
                  Ouvrez{" "}
                  <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                    la création de clé sur GitHub <ExternalLink className="inline size-3.5" aria-hidden />
                  </a>
                  .
                </li>
                <li>Nom : « Espace édition YORU » ; expiration : 1 an.</li>
                <li>
                  Accès : <em>Only select repositories</em> → <strong>{REPO.split("/")[1] ?? "le dépôt"}</strong>.
                </li>
                <li>
                  Permissions : <strong>Contents</strong> → <em>Read and write</em> (et <strong>Actions</strong> → <em>Read-only</em> pour suivre
                  les publications).
                </li>
                <li>Générez la clé et collez-la ci-dessous, avec l&apos;e-mail et le mot de passe que vous utiliserez ensuite.</li>
              </ol>
            </div>
            {field(
              "key",
              "Clé GitHub",
              <input id="key" type="password" required autoComplete="off" spellCheck={false} value={key} onChange={(e) => setKey(e.target.value)} placeholder="github_pat_…" className={cn(inputClasses(), "h-12 font-mono text-sm")} />,
            )}
            {field(
              "email-new",
              "Votre e-mail",
              <input id="email-new" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={cn(inputClasses(), "h-12")} />,
              "Sert d'identifiant ; il n'est ni publié ni envoyé à personne (seule une empreinte est enregistrée).",
            )}
            {field(
              "pw-new",
              "Choisissez un mot de passe",
              <input id="pw-new" type="password" required minLength={12} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={cn(inputClasses(), "h-12")} />,
              "12 caractères minimum, avec au moins trois types de caractères (ou 16 caractères et plus).",
            )}
            {field(
              "pw-confirm",
              "Confirmez le mot de passe",
              <input id="pw-confirm" type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={cn(inputClasses(), "h-12")} />,
            )}
            {error && (
              <p role="alert" className="flex items-start gap-2 border-[3px] border-ink bg-pink p-3 text-sm font-semibold">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden /> {error}
              </p>
            )}
            <button type="submit" disabled={pending} className={buttonClasses("ink", "md", "w-full")}>
              {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : <KeyRound className="size-5" aria-hidden />}
              {pending ? "Vérification auprès de GitHub…" : "Créer mon accès"}
            </button>
            {accounts?.comptes.length ? (
              <button type="button" onClick={() => setMode("login")} className="w-full text-center text-sm font-semibold underline">
                J&apos;ai déjà un accès : me connecter
              </button>
            ) : null}
            <p className="text-xs text-muted">
              La clé est chiffrée avec votre mot de passe puis rangée dans le dépôt : elle n&apos;est lisible qu&apos;avec votre e-mail et votre
              mot de passe. Choisissez un mot de passe que vous n&apos;utilisez nulle part ailleurs. Vous pouvez révoquer la clé à tout
              moment dans les réglages de GitHub.
            </p>
          </form>
        )}
      </div>
    </Centered>
  );
}

/* ── Espace déverrouillé ── */

function Unlocked({ token, children }: { token: string; children: React.ReactNode }) {
  const backend = useMemo(() => createGithubBackend(token), [token]);
  const [state, setState] = useState<{ data?: CatalogState; error?: string; version: number }>({ version: 0 });
  const reload = useCallback(() => setState((s) => ({ version: s.version + 1 })), []);

  useEffect(() => {
    let alive = true;
    readCatalog(token)
      .then(({ doc }) => alive && setState((s) => ({ ...s, data: validateCatalog(doc.products) })))
      .catch((e: unknown) => alive && setState((s) => ({ ...s, error: e instanceof StoreError ? e.message : "Catalogue illisible." })));
    return () => {
      alive = false;
    };
  }, [token, state.version]);

  return (
    <AdminBackendProvider value={backend}>
      <header className="sticky top-0 z-40 border-b-[4px] border-ink bg-ink text-paper">
        <div className="mx-auto flex h-16 max-w-[88rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link href={backend.listHref} className="flex items-center gap-2.5">
            <LogoMark className="size-9" ring />
            <span className="leading-none">
              <span className="display block text-2xl">Yoru</span>
              <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-violet uppercase">Espace édition</span>
            </span>
          </Link>
          <nav aria-label="Espace édition" className="ml-auto flex items-center gap-2">
            <Link href={backend.newHref()} className={buttonClasses("yellow", "sm", "hidden sm:inline-flex")}>
              <Plus className="size-4" aria-hidden /> Nouveau produit
            </Link>
            <a href={absoluteUrl("/boutique")} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-1.5 border-2 border-paper/40 px-3 text-sm font-semibold hover:border-paper">
              Boutique <ArrowUpRight className="size-4" aria-hidden />
              <span className="sr-only">(nouvel onglet)</span>
            </a>
            <button
              type="button"
              onClick={() => updateSession(null)}
              className="inline-flex h-10 items-center gap-1.5 border-2 border-paper/40 px-3 text-sm font-semibold hover:border-pink hover:bg-pink hover:text-ink"
            >
              <Lock className="size-4" aria-hidden /> <span className="hidden sm:inline">Verrouiller</span>
              <span className="sr-only sm:hidden">Verrouiller</span>
            </button>
          </nav>
        </div>
      </header>
      <PublicationStatus token={token} />
      <div className="mx-auto max-w-[88rem] px-4 py-8 sm:px-6 lg:px-8">
        {state.error ? (
          <div role="alert" className="border-[3px] border-ink bg-pink p-4 font-semibold">
            <p className="flex items-start gap-2">
              <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden /> {state.error}
            </p>
            <button type="button" onClick={reload} className="mt-3 inline-flex items-center gap-1.5 underline">
              <RefreshCw className="size-4" aria-hidden /> Réessayer
            </button>
          </div>
        ) : state.data ? (
          <CatalogContext.Provider value={state.data}>{children}</CatalogContext.Provider>
        ) : (
          <p className="flex items-center gap-2 font-semibold">
            <LoaderCircle className="size-5 animate-spin" aria-hidden /> Lecture du catalogue sur GitHub…
          </p>
        )}
      </div>
    </AdminBackendProvider>
  );
}

/** État de la dernière publication du site (si la clé a accès aux Actions). */
function PublicationStatus({ token }: { token: string }) {
  const [run, setRun] = useState<Awaited<ReturnType<typeof latestPublication>>>(null);
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      const r = await latestPublication(token);
      if (!alive) return;
      setRun(r);
      if (r && r.status !== "completed") timer = setTimeout(poll, 15_000);
    };
    void poll();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [token]);
  if (!run) return null;
  const busy = run.status !== "completed";
  const failedRun = !busy && run.conclusion !== "success";
  return (
    <div className={cn("border-b-[3px] border-ink", busy ? "bg-yellow" : failedRun ? "bg-pink" : "bg-lime")}>
      <p className="mx-auto flex max-w-[88rem] items-center gap-2 px-4 py-2 text-sm font-semibold sm:px-6 lg:px-8" aria-live="polite">
        {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
        {busy ? "Publication du site en cours…" : failedRun ? "La dernière publication a échoué." : "Site en ligne à jour."}
        <a href={run.url} target="_blank" rel="noopener noreferrer" className="ml-auto underline">
          Détails sur GitHub
        </a>
      </p>
    </div>
  );
}
