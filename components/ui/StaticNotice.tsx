import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/** Message affiché à la place d'un service qui demande un serveur (version statique du site). */
export function StaticNotice({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div role="note" className={cn("border-[4px] border-ink bg-paper p-6 text-ink shadow-pop-lg", className)}>
      <p className="flex items-center gap-2 text-xl font-extrabold">
        <Info className="size-6 shrink-0" aria-hidden /> {title}
      </p>
      <div className="mt-2 leading-relaxed">{children}</div>
    </div>
  );
}
