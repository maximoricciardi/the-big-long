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
  if (!base.includes(".")) {
    out.add(`${base}.BA`);
  }

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
              previousClose?: number;
              chartPreviousClose?: number;
            };
          }>;
        };
      };

      const meta = json.chart?.result?.[0]?.meta;
      const c = meta?.regularMarketPrice ?? 0;
      const d = meta?.regularMarketChange ?? 0;
      const dp = meta?.regularMarketChangePercent ?? 0;
      const h = meta?.regularMarketDayHigh ?? c;
      const l = meta?.regularMarketDayLow ?? c;
      const o = meta?.regularMarketOpen ?? c;
      const pc = meta?.previousClose ?? meta?.chartPreviousClose ?? c;
      if (c > 0) {
        return { c, d, dp, h, l, o, pc };
      }
      lastError = `No market price for ${candidate}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  throw new Error(lastError ?? "Unable to resolve quote");
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "Missing ?symbol=" }, { status: 400 });
  }

  const key = process.env.FINNHUB_KEY;
  try {
    if (key) {
      const r = await fetch(`https://finnhub.io/api/v1/quote?token=${key}&symbol=${encodeURIComponent(symbol)}`);
      const data = await r.json();
      return NextResponse.json(data, {
        headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=300" },
      });
    }

    const data = await fetchYahooQuote(symbol);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=300" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
