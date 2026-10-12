/**
 * Analyseur RSS 2.0 / Atom minimal, sans dépendance.
 * Il n'extrait que des champs texte (titre, lien, date) et n'interprète aucun
 * HTML : rien de ce qui vient d'un flux n'est injecté tel quel dans la page.
 */

export interface RawFeedItem {
  title: string;
  link: string;
  date: string | null;
}

const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
  eacute: "é",
  egrave: "è",
  agrave: "à",
  ccedil: "ç",
  ecirc: "ê",
  ocirc: "ô",
  laquo: "«",
  raquo: "»",
};

export function decodeEntities(s: string): string {
  // Deux passes : certains flux encodent deux fois (« &amp;#8217; »).
  let out = s;
  for (let i = 0; i < 2; i++) {
    out = out
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => safeChar(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => safeChar(parseInt(d, 10)))
      .replace(/&([a-z]+);/gi, (m, n: string) => NAMED[n.toLowerCase()] ?? m);
  }
  return out;
}

function safeChar(code: number): string {
  return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : "";
}

function textOf(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  if (!m) return null;
  return m[1]!.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function clean(text: string): string {
  return decodeEntities(text.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function safeUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(decodeEntities(url.trim()));
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export function parseFeed(xml: string, max = 15): RawFeedItem[] {
  const blocks = [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)].slice(0, max);
  const items: RawFeedItem[] = [];
  for (const [, , block] of blocks) {
    const title = textOf(block!, "title");
    let link = textOf(block!, "link");
    if (!link || link.startsWith("<")) {
      const href = block!.match(/<link[^>]*?href=["']([^"']+)["'][^>]*>/i);
      link = href?.[1] ?? null;
    }
    const url = safeUrl(link);
    if (!title || !url) continue;
    const rawDate = textOf(block!, "pubDate") ?? textOf(block!, "dc:date") ?? textOf(block!, "updated") ?? textOf(block!, "published");
    const time = rawDate ? Date.parse(rawDate) : NaN;
    items.push({
      title: clean(title).slice(0, 220),
      link: url,
      date: Number.isFinite(time) ? new Date(time).toISOString() : null,
    });
  }
  return items;
}
