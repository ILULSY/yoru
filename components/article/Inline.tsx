import Link from "next/link";
import { Fragment } from "react";
import { frTypo } from "@/lib/text";

const TOKEN = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|_[^_]+_)/g;

/**
 * Rend le balisage inline des contenus : **gras**, _italique_, [lien](url).
 * Liens internes via next/link, liens externes ouverts dans un nouvel onglet.
 */
export function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          return href!.startsWith("/") ? (
            <Link key={i} href={href!}>
              {frTypo(label!)}
            </Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer">
              {frTypo(label!)}
            </a>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{frTypo(part.slice(2, -2))}</strong>;
        if (part.startsWith("_") && part.endsWith("_") && part.length > 2) return <em key={i}>{frTypo(part.slice(1, -1))}</em>;
        return <Fragment key={i}>{frTypo(part)}</Fragment>;
      })}
    </>
  );
}
