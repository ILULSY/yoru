import type { Metadata } from "next";
import { Lock, TriangleAlert } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { absoluteUrl } from "@/lib/site";
import { adminSetupProblems } from "@/lib/server/admin-session";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Connexion" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { suite } = await searchParams;
  const problems = adminSetupProblems();

  return (
    <div className="grid min-h-svh place-items-center px-4 py-16">
      <div className="w-full max-w-md">
        <a href={absoluteUrl("/")} className="group mb-8 inline-flex items-center gap-3">
          <LogoMark className="size-12" />
          <span>
            <span className="display block text-3xl leading-none">Yoru</span>
            <span className="font-mono text-[11px] font-bold tracking-[0.25em] text-muted uppercase">Espace édition</span>
          </span>
        </a>

        <div className="border-[4px] border-ink bg-paper p-6 shadow-pop-lg sm:p-8">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold">
            <Lock className="size-6" aria-hidden /> Connexion
          </h1>

          {problems.length > 0 ? (
            <div className="mt-5 space-y-4">
              <p className="flex items-start gap-2 border-[3px] border-ink bg-yellow p-3 text-sm font-semibold">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                L&apos;espace édition n&apos;est pas encore configuré : personne ne peut s&apos;y connecter.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className="text-sm leading-relaxed text-muted">
                Ajoutez ces deux variables dans <code className="font-mono">.env.local</code> (ou chez votre hébergeur), puis
                redémarrez le serveur : <code className="font-mono">ADMIN_PASSWORD</code> (12 caractères minimum) et{" "}
                <code className="font-mono">ADMIN_SESSION_SECRET</code> (32 caractères aléatoires minimum).
              </p>
            </div>
          ) : (
            <LoginForm suite={typeof suite === "string" ? suite : ""} />
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Cet espace est réservé à la gestion de la boutique. <a href={absoluteUrl("/")} className="font-semibold underline">Retour au site</a>
        </p>
      </div>
    </div>
  );
}
