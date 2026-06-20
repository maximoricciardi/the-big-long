import { normalizeError } from "@/lib/api/reliability";
import { fetchFinnhubQuote } from "@/lib/equity/providers/finnhub";
import { fetchRailwayEquityQuotes } from "@/lib/equity/providers/railway";
import { fetchYahooQuote } from "@/lib/equity/providers/yahoo";
import type { EquityQuoteBatchResult, NormalizedEquityQuote } from "@/lib/equity/quote-types";
import { isSpecialEquityExposure, normalizeEquitySymbol } from "@/lib/equity/symbols";

export {
  EQUITY_QUOTE_CACHE_SECONDS,
  EQUITY_QUOTE_STALE_SECONDS,
  type EquityQuoteAvailabilityStatus,
  type EquityQuoteBatchResult,
  type EquityQuoteChangeSource,
  type EquityQuoteConfidence,
  type EquityQuoteFreshnessStatus,
  type EquityQuoteVariationStatus,
  type NormalizedEquityQuote,
} from "@/lib/equity/quote-types";
export { isSpecialEquityExposure } from "@/lib/equity/symbols";

export function buildPrivateMarketQuote(symbol: string): NormalizedEquityQuote {
  const ticker = normalizeEquitySymbol(symbol);
  return {
    requestedSymbol: ticker,
    ticker,
    resolvedSymbol: null,
    price: null,
    change: null,
    changePct: null,
    changeSource: "unavailable",
    variationStatus: "not_applicable",
    high: null,
    low: null,
    open: null,
    previousClose: null,
    volume: null,
    currency: "USD",
    provider: "internal-classification",
    source: "private_market_exposure",
    fetchedAt: new Date().toISOString(),
    sourceUpdatedAt: null,
    ageSeconds: null,
    stale: false,
    availabilityStatus: "private_market_not_listed",
    freshnessStatus: "special",
    confidence: "high",
    fallbackUsed: false,
    unavailableReason: "SPCX represents private-market SpaceX exposure; no listed public equity quote is available.",
  };
}

export async function resolveEquityQuote(
  symbol: string,
  {
    finnhubKey,
    preferFinnhub = false,
  }: {
    finnhubKey?: string | null;
    preferFinnhub?: boolean;
  } = {}
): Promise<NormalizedEquityQuote> {
  if (isSpecialEquityExposure(symbol)) return buildPrivateMarketQuote(symbol);

  if (preferFinnhub && finnhubKey) {
    try {
      return await fetchFinnhubQuote(symbol, finnhubKey);
    } catch {
      return fetchYahooQuote(symbol, true);
    }
  }

  try {
    return await fetchYahooQuote(symbol, false);
  } catch (err) {
    if (!finnhubKey) throw err;
    const quote = await fetchFinnhubQuote(symbol, finnhubKey);
    return { ...quote, fallbackUsed: true };
  }
}

function unavailableQuote(symbol: string, error: { provider: string; message: string }): NormalizedEquityQuote {
  return {
    requestedSymbol: symbol,
    ticker: symbol,
    resolvedSymbol: null,
    price: null,
    change: null,
    changePct: null,
    changeSource: "unavailable",
    variationStatus: "unavailable",
    high: null,
    low: null,
    open: null,
    previousClose: null,
    volume: null,
    currency: "USD",
    provider: error.provider,
    source: "equity-quote-provider-chain",
    fetchedAt: new Date().toISOString(),
    sourceUpdatedAt: null,
    ageSeconds: null,
    stale: true,
    availabilityStatus: "provider_error",
    freshnessStatus: "unavailable",
    confidence: "low",
    fallbackUsed: true,
    unavailableReason: error.message,
  };
}

function storeQuote(
  symbol: string,
  quote: NormalizedEquityQuote,
  buckets: Pick<EquityQuoteBatchResult, "prices" | "quotes" | "special" | "unavailable">
) {
  buckets.quotes[symbol] = quote;
  if (quote.availabilityStatus === "private_market_not_listed") {
    buckets.special[symbol] = quote;
  } else if (quote.price != null && quote.price > 0) {
    buckets.prices[symbol] = quote;
  } else {
    buckets.unavailable[symbol] = quote;
  }
}

export async function fetchBatchEquityQuotes(
  symbols: string[],
  {
    finnhubKey = process.env.FINNHUB_KEY ?? null,
    preferFinnhub = false,
    batchSize = 20,
    useRailway = true,
  }: {
    finnhubKey?: string | null;
    preferFinnhub?: boolean;
    batchSize?: number;
    useRailway?: boolean;
  } = {}
): Promise<EquityQuoteBatchResult> {
  const uniqueSymbols = [...new Set(symbols.map(normalizeEquitySymbol).filter(Boolean))];
  const prices: Record<string, NormalizedEquityQuote> = {};
  const quotes: Record<string, NormalizedEquityQuote> = {};
  const unavailable: Record<string, NormalizedEquityQuote> = {};
  const special: Record<string, NormalizedEquityQuote> = {};
  const errors: EquityQuoteBatchResult["errors"] = [];
  const providerStatuses: EquityQuoteBatchResult["providerStatuses"] = [];

  uniqueSymbols.filter(isSpecialEquityExposure).forEach((symbol) => {
    storeQuote(symbol, buildPrivateMarketQuote(symbol), { prices, quotes, special, unavailable });
  });

  let remaining = uniqueSymbols.filter((symbol) => !isSpecialEquityExposure(symbol));

  if (useRailway && remaining.length > 0) {
    const railway = await fetchRailwayEquityQuotes(remaining);
    providerStatuses.push(railway.status);
    errors.push(...railway.errors);
    Object.entries(railway.quotes).forEach(([symbol, quote]) => {
      storeQuote(symbol, quote, { prices, quotes, special, unavailable });
    });
    remaining = remaining.filter((symbol) => !railway.quotes[symbol]);
  }

  if (remaining.length > 0) {
    providerStatuses.push({
      provider: finnhubKey
        ? preferFinnhub
          ? "Finnhub / Yahoo Finance"
          : "Yahoo Finance / Finnhub"
        : "Yahoo Finance",
      status: "fallback",
      message: useRailway ? "Used for symbols not covered by Railway Financial API." : undefined,
    });
  }

  for (let i = 0; i < remaining.length; i += batchSize) {
    const batch = remaining.slice(i, i + batchSize);
    const settled = await Promise.allSettled(
      batch.map(async (symbol) => resolveEquityQuote(symbol, { finnhubKey, preferFinnhub }))
    );

    settled.forEach((result, index) => {
      const symbol = batch[index];
      if (result.status === "fulfilled") {
        storeQuote(symbol, result.value, { prices, quotes, special, unavailable });
        return;
      }

      const normalized = normalizeError(result.reason, finnhubKey ? "Yahoo Finance / Finnhub" : "Yahoo Finance");
      errors.push({ ...normalized, symbol });
      storeQuote(symbol, unavailableQuote(symbol, normalized), { prices, quotes, special, unavailable });
    });

    if (i + batchSize < remaining.length) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  const standardTotal = uniqueSymbols.filter((symbol) => !isSpecialEquityExposure(symbol)).length;
  return {
    prices,
    quotes,
    unavailable,
    special,
    errors,
    providerStatuses,
    matched: Object.keys(prices).length,
    standardTotal,
    total: uniqueSymbols.length,
    fetchedAt: new Date().toISOString(),
  };
}
