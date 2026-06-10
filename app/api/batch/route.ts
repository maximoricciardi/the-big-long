import { NextRequest, NextResponse } from "next/server";

function yahooCandidates(symbol: string): string[] {
  const base = symbol.trim().toUpperCase();
  const out = new Set<string>([base]);
  if (base === "YPFD") {
    out.add("YPF");
    out.add("YPF.BA");
  }
  if (base.endsWith("D") && base.length > 2) {
    const noD = base.slice(0, -1);
    out.add(noD);
    out.add(`${noD}.BA`);
  }
  if (!base.includes(".")) out.add(`${base}.BA`);
  return [...out];
}

async function fetchYahooQuote(symbol: string) {
  let lastError: string | null = null;

  for (const candidate of yahooCandidates(symbol)) {
    try {
      const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(candidate)}`);
      url.searchParams.set("range", "5d");
      url.searchParams.set("interval", "1d");
      url.searchParams.set("includePrePost", "false");
      url.searchParams.set("events", "div,splits");

      const r = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) {
        lastError = `Yahoo Finance returned ${r.status} for ${candidate}`;
        continue;
      }

      const json = await r.json() as {
        chart?: {
          result?: Array<{
            meta?: {
              regularMarketPrice?: number;
              regularMarketChange?: number;
              regularMarketChangePercent?: number;
              regularMarketDayHigh?: number;
              regularMarketDayLow?: number;
              regularMarketOpen?: number;
            };
          }>;
        };
      };

      const meta = json.chart?.result?.[0]?.meta;
      const price = meta?.regularMarketPrice ?? 0;
      if (price > 0) {
        return {
          price,
          change: meta?.regularMarketChange ?? 0,
          changePct: meta?.regularMarketChangePercent ?? 0,
          high: meta?.regularMarketDayHigh ?? price,
          low: meta?.regularMarketDayLow ?? price,
          open: meta?.regularMarketOpen ?? price,
        };
      }

      lastError = `No market price for ${candidate}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  throw new Error(lastError ?? "Unable to resolve quote");
}

async function fetchFinnhubQuote(symbol: string, key: string) {
  const r = await fetch(`https://finnhub.io/api/v1/quote?token=${key}&symbol=${encodeURIComponent(symbol)}`, { signal: AbortSignal.timeout(8000) });
  const d = await r.json() as { c?: number; d?: number; dp?: number; h?: number; l?: number; o?: number };
  return { price: d.c ?? 0, change: d.d ?? 0, changePct: d.dp ?? 0, high: d.h ?? 0, low: d.l ?? 0, open: d.o ?? 0 };
}

async function fetchQuote(symbol: string, key: string | null) {
  if (key) return fetchFinnhubQuote(symbol, key);
  return fetchYahooQuote(symbol);
}

export async function GET(req: NextRequest) {
  const symbols = req.nextUrl.searchParams.get("symbols");
  if (!symbols) {
    return NextResponse.json({ error: "Missing ?symbols=" }, { status: 400 });
  }

  const key = process.env.FINNHUB_KEY;
  const tickers = symbols.split(",").map((s) => s.trim()).filter(Boolean);
  if (tickers.length === 0) {
    return NextResponse.json({ error: "No valid symbols" }, { status: 400 });
  }

  const BATCH = 25;
  const results: Record<string, unknown> = {};

  for (let i = 0; i < tickers.length; i += BATCH) {
    const batch = tickers.slice(i, i + BATCH);
    const settled = await Promise.allSettled(batch.map(async (t) => {
      const d = await fetchQuote(t, key);
      return { t, d };
    }));

    settled.forEach((res) => {
      if (res.status !== "fulfilled") return;
      const { t, d } = res.value as { t: string; d: Record<string, number> };
      if ((d?.price ?? 0) > 0) {
        results[t] = d;
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
