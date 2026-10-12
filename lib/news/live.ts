import "server-only";
import { cache } from "react";
import type { UniverseSlug } from "@/types/content";
import { FEEDS, NEWS_REVALIDATE, type FeedSource } from "./feeds";
import { parseFeed } from "./rss";

export interface LiveItem {
  id: string;
  title: string;
  url: string;
  date: string | null;
  source: string;
  sourceUrl: string;
  lang: "fr" | "en";
  universe: UniverseSlug;
}

export interface LiveNews {
  items: LiveItem[];
  sources: { id: string; name: string; homepage: string; ok: boolean; count: number }[];
  fetchedAt: string;
}

async function fetchFeed(feed: FeedSource): Promise<LiveItem[]> {
  const res = await fetch(feed.url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; YORU-RSS/1.0)", accept: "application/rss+xml, application/xml, text/xml" },
    next: { revalidate: NEWS_REVALIDATE, tags: ["live-news"] },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${feed.id} → HTTP ${res.status}`);
  const xml = await res.text();
  return parseFeed(xml, 15).map((it, i) => ({
    id: `${feed.id}-${i}-${it.link}`,
    title: it.title,
    url: it.link,
    date: it.date,
    source: feed.name,
    sourceUrl: feed.homepage,
    lang: feed.lang,
    universe: feed.universe,
  }));
}

/**
 * Récupère et fusionne tous les flux (mise en cache 30 min). Une source en
 * panne n'empêche pas l'affichage des autres : elle est signalée comme indisponible.
 */
export const getLiveNews = cache(async (): Promise<LiveNews> => {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const seen = new Set<string>();
  const items: LiveItem[] = [];
  const sources = FEEDS.map((f, i) => {
    const r = results[i]!;
    if (r.status === "rejected") {
      console.warn("[news] source indisponible :", f.id, String(r.reason));
      return { id: f.id, name: f.name, homepage: f.homepage, ok: false, count: 0 };
    }
    for (const it of r.value) {
      if (seen.has(it.url)) continue;
      seen.add(it.url);
      items.push(it);
    }
    return { id: f.id, name: f.name, homepage: f.homepage, ok: true, count: r.value.length };
  });

  const now = Date.now();
  items.sort((a, b) => (b.date ? Date.parse(b.date) : 0) - (a.date ? Date.parse(a.date) : 0));
  return {
    // On écarte les dates aberrantes (dans le futur au-delà d'une heure).
    items: items.filter((i) => !i.date || Date.parse(i.date) < now + 3600_000),
    sources,
    fetchedAt: new Date().toISOString(),
  };
});
