import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Titre révélé mot par mot en CSS pur : l'animation démarre au premier rendu,
 * sans attendre le JavaScript (idéal pour les H1, candidats au LCP).
 */
export function CssSplit({
  text,
  as: Tag = "h1",
  className,
  id,
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  id?: string;
  /** Décalage de départ, en nombre de « pas » de 85 ms. */
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <Tag id={id} className={cn(className)}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word-mask">
            <span className="word-rise" style={{ "--i": i + delay } as React.CSSProperties}>
              {w}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
