import { getAllArticles } from "@/lib/content";
import { UNIVERSE_MAP } from "@/data/universes";
import { absoluteUrl, SITE } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Flux RSS 2.0 des 30 derniers articles. */
export async function GET() {
  const articles = (await getAllArticles()).slice(0, 30);
  const items = articles
    .map((a) => {
      const url = absoluteUrl(`/articles/${a.slug}`);
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <category>${esc(UNIVERSE_MAP[a.universe].name)}</category>
      <description>${esc(a.excerpt)}${a.demo ? " (Contenu de démonstration)" : ""}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} — ${esc(SITE.slogan)}</title>
    <link>${SITE.url}</link>
    <description>${esc(SITE.description)}</description>
    <language>fr-FR</language>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
