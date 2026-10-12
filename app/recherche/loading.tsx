/** Écran de chargement : les lettres de POP rebondissent à tour de rôle. */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden>
        {["P", "O", "P"].map((l, i) => (
          <span
            key={i}
            className="grid size-16 place-items-center border-[3px] border-ink font-display text-4xl shadow-pop-sm animate-[float_0.9s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.12}s`, background: ["var(--color-pink)", "var(--color-yellow)", "var(--color-cyan)"][i] }}
          >
            {l}
          </span>
        ))}
      </div>
      <p className="font-mono text-xs font-bold tracking-[0.3em] uppercase">Chargement…</p>
    </div>
  );
}
