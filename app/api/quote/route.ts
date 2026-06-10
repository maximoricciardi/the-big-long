import { NextRequest, NextResponse } from "next/server";
import { buildMeta, fetchJsonWithRetry, jsonError, jsonWithMeta } from "@/lib/api/reliability";

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

      const json = await fetchJsonWithRetry<{
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
      }>(url.toString(), {
        provider: "Yahoo Finance",
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        timeoutMs: 8_000,
        retries: 1,
      });

      const meta = json.chart?.result?.[0]?.meta;
      const c = meta?.regularMarketPrice ?? 0;
      const d = meta?.regularMarketChange ?? 0;
      const dp = meta?.regularMarketChangePercent ?? 0;
      const h = meta?.regularMarketDayHigh ?? c;
      const l = meta?.regularMarketDayLow ?? c;
      const o = meta?.regularMarketOpen ?? c;
      const pc = meta?.previousClose ?? meta?.chartPreviousClose ?? c;
      if (c > 0) {
        return { c, d, dp, h, l, o, pc, resolvedSymbol: candidate };
      }
      lastError = `No market price for ${candidate}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  throw new Error(lastError ?? "Unable to resolve quote");
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "Missing ?symbol=" }, { status: 400 });
  }

  const key = process.env.FINNHUB_KEY;
  try {
    if (key) {
      const source = "https://finnhub.io/api/v1/quote";
      const data = await fetchJsonWithRetry<Record<string, unknown>>(`${source}?token=${key}&symbol=${encodeURIComponent(symbol)}`, {
        provider: "Finnhub",
        timeoutMs: 8_000,
        retries: 1,
      });
      const price = typeof data.c === "number" ? data.c : 0;
      return jsonWithMeta(
        data,
        buildMeta({
          provider: "Finnhub",
          source,
          status: price > 0 ? "ok" : "empty",
          startedAt,
          cacheSeconds: 120,
          staleAfterSeconds: 300,
        }),
        { cacheSeconds: 120, staleWhileRevalidateSeconds: 300 }
      );
    }

    const data = await fetchYahooQuote(symbol);
    return jsonWithMeta(
      data,
      buildMeta({
        provider: "Yahoo Finance",
        source: String(data.resolvedSymbol),
        status: data.c > 0 ? "ok" : "empty",
        startedAt,
        cacheSeconds: 120,
        staleAfterSeconds: 300,
      }),
      { cacheSeconds: 120, staleWhileRevalidateSeconds: 300 }
    );
  } catch (err) {
    return jsonError({
      provider: key ? "Finnhub" : "Yahoo Finance",
      source: key ? "https://finnhub.io/api/v1/quote" : "Yahoo chart candidates",
      startedAt,
      error: err,
    });
  }
}
