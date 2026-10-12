import { NextResponse, type NextRequest } from "next/server";
import { UNIVERSE_SLUGS, type UniverseSlug } from "@/types/content";
import { searchArticles } from "@/lib/search";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

export async function GET(request: NextRequest) {
  const limit = rateLimit(`search:${clientIp(request.headers)}`, 120, 60 * 1000);
  if (!limit.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const params = request.nextUrl.searchParams;
  const q = params.get("q") ?? "";
  const u = params.get("univers");
  const universe = u && (UNIVERSE_SLUGS as readonly string[]).includes(u) ? (u as UniverseSlug) : undefined;
  const lim = Math.min(30, Math.max(1, Number(params.get("limit")) || 12));

  const data = await searchArticles(q, { universe, limit: lim });
  return NextResponse.json(data, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
}
