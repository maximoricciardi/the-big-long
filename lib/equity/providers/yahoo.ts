import { fetchJsonWithRetry } from "@/lib/api/reliability";
import { freshnessFor, finiteNumber, finitePositive, lastFinite, normalizeDailyVariation, sourceTimeFromUnix } from "@/lib/equity/quote-normalization";
import type { NormalizedEquityQuote } from "@/lib/equity/quote-types";
import { normalizeEquitySymbol, yahooQuoteCandidates } from "@/lib/equity/symbols";

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        currency?: string;
        regularMarketPrice?: number;
        regularMarketChange?: number;
        regularMarketChangePercent?: number;
        regularMarketDayHigh?: number;
        regularMarketDayLow?: number;
        regularMarketOpen?: number;
        regularMarketTime?: number;
        previousClose?: number;
        chartPreviousClose?: number;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          volume?: Array<number | null>;
        }>;
      };
    }>;
  };
};

export async function fetchYahooQuote(symbol: string, fallbackUsed: boolean): Promise<NormalizedEquityQuote> {
  const ticker = normalizeEquitySymbol(symbol);
  let lastError: unknown = null;

  for (const candidate of yahooQuoteCandidates(symbol)) {
    try {
      const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(candidate)}`);
      url.searchParams.set("range", "5d");
      url.searchParams.set("interval", "1d");
      url.searchParams.set("includePrePost", "false");
      url.searchParams.set("events", "div,splits");

      const json = await fetchJsonWithRetry<YahooChartResponse>(url.toString(), {
        provider: "Yahoo Finance",
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        timeoutMs: 8_000,
        retries: 1,
      });

      const result = json.chart?.result?.[0];
      const meta = result?.meta;
      const price = finitePositive(meta?.regularMarketPrice);
      if (price === null) {
        lastError = new Error(`No market price for ${candidate}`);
        continue;
      }

      const previousClose = finitePositive(meta?.previousClose) ?? finitePositive(meta?.chartPreviousClose);
      const variation = normalizeDailyVariation({
        price,
        previousClose,
        change: meta?.regularMarketChange,
        changePct: meta?.regularMarketChangePercent,
      });
      const time = sourceTimeFromUnix(meta?.regularMarketTime ?? lastFinite(result?.timestamp) ?? undefined);

      return {
        requestedSymbol: ticker,
        ticker,
        resolvedSymbol: candidate,
        price,
        change: variation.change,
        changePct: variation.changePct,
        changeSource: variation.changeSource,
        variationStatus: variation.variationStatus,
        high: finiteNumber(meta?.regularMarketDayHigh),
        low: finiteNumber(meta?.regularMarketDayLow),
        open: finiteNumber(meta?.regularMarketOpen),
        previousClose,
        volume: lastFinite(result?.indicators?.quote?.[0]?.volume),
        currency: meta?.currency ?? "USD",
        provider: "Yahoo Finance",
        source: "https://query1.finance.yahoo.com/v8/finance/chart",
        fetchedAt: new Date().toISOString(),
        sourceUpdatedAt: time.sourceUpdatedAt,
        ageSeconds: time.ageSeconds,
        stale: time.stale,
        availabilityStatus: "available",
        freshnessStatus: freshnessFor("Yahoo Finance", time.ageSeconds, time.stale),
        confidence: time.stale ? "medium" : "high",
        fallbackUsed,
        unavailableReason: null,
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`No market price for ${ticker}`);
}
