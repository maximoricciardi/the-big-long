import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const symbols = req.nextUrl.searchParams.get("symbols");
  if (!symbols) {
    return NextResponse.json({ error: "Missing ?symbols=" }, { status: 400 });
  }

  const key = process.env.FINNHUB_KEY;
  if (!key) {
    return NextResponse.json({ error: "FINNHUB_KEY not set" }, { status: 500 });
  }

  const tickers = symbols.split(",").map((s) => s.trim()).filter(Boolean);
  if (tickers.length === 0) {
    return NextResponse.json({ error: "No valid symbols" }, { status: 400 });
  }

  const BATCH = 25;
  const results: Record<string, unknown> = {};
  const errors: string[] = [];

  for (let i = 0; i < tickers.length; i += BATCH) {
    const batch = tickers.slice(i, i + BATCH);
    const settled = await Promise.allSettled(
      batch.map(async (t) => {
        const url = `https://finnhub.io/api/v1/quote?token=${key}&symbol=${t}`;
        const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
        const d = await r.json();
        return { t, d };
      })
    );

    settled.forEach((res) => {
      if (res.status === "fulfilled") {
        const { t, d } = res.value as { t: string; d: Record<string, number> };
        if (d?.c && d.c > 0) {
          results[t] = {
            price:     d.c,
            change:    d.d  ?? 0,
            changePct: d.dp ?? 0,
            high:      d.h,
            low:       d.l,
            open:      d.o,
          };
        }
      } else {
        errors.push((res.reason as Error)?.message ?? "unknown");
      }
    });

    // Small delay between batches to stay under 60 calls/min
    if (i + BATCH < tickers.length) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  return NextResponse.json(
    { prices: results, matched: Object.keys(results).length, total: tickers.length, ts: Date.now() },
    { headers: { "Cache-Control": "s-maxage=90, stale-while-revalidate=180" } }
  );
}
