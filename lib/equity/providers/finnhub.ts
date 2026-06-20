import { fetchJsonWithRetry } from "@/lib/api/reliability";
import { freshnessFor, finiteNumber, finitePositive, normalizeDailyVariation, sourceTimeFromUnix } from "@/lib/equity/quote-normalization";
import type { NormalizedEquityQuote } from "@/lib/equity/quote-types";
import { finnhubQuoteSymbol, normalizeEquitySymbol } from "@/lib/equity/symbols";

type FinnhubQuoteResponse = {
  c?: number;
  d?: number;
  dp?: number;
  h?: number;
  l?: number;
  o?: number;
  pc?: number;
  t?: number;
};

export async function fetchFinnhubQuote(symbol: string, key: string): Promise<NormalizedEquityQuote> {
  const ticker = normalizeEquitySymbol(symbol);
  const providerSymbol = finnhubQuoteSymbol(symbol);
  const source = "https://finnhub.io/api/v1/quote";
  const data = await fetchJsonWithRetry<FinnhubQuoteResponse>(
    `${source}?token=${key}&symbol=${encodeURIComponent(providerSymbol)}`,
    { provider: "Finnhub", timeoutMs: 8_000, retries: 1 }
  );

  const price = finitePositive(data.c);
  if (price === null) {
    throw new Error(`No valid Finnhub price for ${providerSymbol}`);
  }

  const previousClose = finitePositive(data.pc);
  const variation = normalizeDailyVariation({
    price,
    previousClose,
    change: data.d,
    changePct: data.dp,
  });
  const time = sourceTimeFromUnix(data.t);

  return {
    requestedSymbol: ticker,
    ticker,
    resolvedSymbol: providerSymbol,
    price,
    change: variation.change,
    changePct: variation.changePct,
    changeSource: variation.changeSource,
    variationStatus: variation.variationStatus,
    high: finiteNumber(data.h),
    low: finiteNumber(data.l),
    open: finiteNumber(data.o),
    previousClose,
    volume: null,
    currency: "USD",
    provider: "Finnhub",
    source,
    fetchedAt: new Date().toISOString(),
    sourceUpdatedAt: time.sourceUpdatedAt,
    ageSeconds: time.ageSeconds,
    stale: time.stale,
    availabilityStatus: "available",
    freshnessStatus: freshnessFor("Finnhub", time.ageSeconds, time.stale),
    confidence: time.stale ? "medium" : "high",
    fallbackUsed: false,
    unavailableReason: null,
  };
}
