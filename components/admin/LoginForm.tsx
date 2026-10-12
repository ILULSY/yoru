"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { FieldError, inputClasses } from "@/components/ui/Field";
import { buttonClasses } from "@/components/ui/Button";

export function LoginForm({ suite }: { suite: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="mt-6 space-y-5">
      <input type="hidden" name="suite" value={suite} />
      <div>
        <label htmlFor="admin-password" className="mb-1.5 block text-sm font-bold">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="admin-password"
            name="password"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            autoFocus
            aria-invalid={Boolean(state.error)}
            aria-describedby={state.error ? "admin-password-error" : undefined}
            className={`${inputClasses(Boolean(state.error))} h-12 pr-12`}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center hover:bg-paper-2"
            aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {show ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
          </button>
        </div>
        <FieldError id="admin-password-error" message={state.error} />
      </div>
      <button type="submit" disabled={pending} className={buttonClasses("ink", "md", "w-full")}>
        {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : null}
        {pending ? "Vérification…" : "Se connecter"}
      </button>
      <p className="text-xs text-muted">Session de 12 heures, sur cet appareil uniquement.</p>
    </form>
  );
}
