import { fetchJsonWithRetry, normalizeError } from "@/lib/api/reliability";

export const EQUITY_QUOTE_CACHE_SECONDS = 90;
export const EQUITY_QUOTE_STALE_SECONDS = 4 * 24 * 60 * 60;

export type EquityQuoteAvailabilityStatus =
  | "available"
  | "unavailable"
  | "provider_error"
  | "private_market_not_listed";

export type EquityQuoteFreshnessStatus =
  | "live"
  | "delayed"
  | "recent"
  | "stale"
  | "special"
  | "unavailable";

export type EquityQuoteConfidence = "high" | "medium" | "low";

export interface NormalizedEquityQuote {
  requestedSymbol: string;
  ticker: string;
  resolvedSymbol: string | null;
  price: number | null;
  change: number | null;
  changePct: number | null;
  high: number | null;
  low: number | null;
  open: number | null;
  previousClose: number | null;
  volume: number | null;
  currency: "USD" | "ARS" | string;
  provider: string;
  source: string;
  fetchedAt: string;
  sourceUpdatedAt: string | null;
  ageSeconds: number | null;
  stale: boolean;
  availabilityStatus: EquityQuoteAvailabilityStatus;
  freshnessStatus: EquityQuoteFreshnessStatus;
  confidence: EquityQuoteConfidence;
  fallbackUsed: boolean;
  unavailableReason: string | null;
}

export interface EquityQuoteBatchResult {
  prices: Record<string, NormalizedEquityQuote>;
  quotes: Record<string, NormalizedEquityQuote>;
  unavailable: Record<string, NormalizedEquityQuote>;
  special: Record<string, NormalizedEquityQuote>;
  errors: Array<{ provider: string; message: string; status?: number; symbol?: string }>;
  matched: number;
  standardTotal: number;
  total: number;
  fetchedAt: string;
}

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

function normalizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

function normalizeProviderSymbol(symbol: string): string {
  const normalized = normalizeSymbol(symbol);
  if (normalized === "BRKB" || normalized === "BRK/B") return "BRK.B";
  if (normalized === "BITF") return "KEEL";
  if (normalized === "FI") return "FISV";
  if (normalized === "MMC") return "MRSH";
  return normalized;
}

export function isSpecialEquityExposure(symbol: string): boolean {
  return normalizeSymbol(symbol) === "SPCX";
}

function sourceTimeFromUnix(unixSeconds?: number): { sourceUpdatedAt: string | null; ageSeconds: number | null; stale: boolean } {
  if (!unixSeconds || unixSeconds <= 0) {
    return { sourceUpdatedAt: null, ageSeconds: null, stale: false };
  }
  const updatedAt = new Date(unixSeconds * 1000);
  const ageSeconds = Math.max(0, Math.floor((Date.now() - updatedAt.getTime()) / 1000));
  return {
    sourceUpdatedAt: updatedAt.toISOString(),
    ageSeconds,
    stale: ageSeconds > EQUITY_QUOTE_STALE_SECONDS,
  };
}

function freshnessFor(provider: string, ageSeconds: number | null, stale: boolean): EquityQuoteFreshnessStatus {
  if (stale) return "stale";
  if (ageSeconds === null) return provider === "Yahoo Finance" ? "delayed" : "recent";
  if (provider === "Finnhub" && ageSeconds <= 15 * 60) return "live";
  if (ageSeconds <= EQUITY_QUOTE_STALE_SECONDS) return provider === "Yahoo Finance" ? "delayed" : "recent";
  return "stale";
}

function lastFinite(values: Array<number | null | undefined> | undefined): number | null {
  if (!values) return null;
  for (let i = values.length - 1; i >= 0; i -= 1) {
    const value = values[i];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

function yahooCandidates(symbol: string): string[] {
  const base = normalizeProviderSymbol(symbol);
  const out = new Set<string>();

  if (base === "SPCX") return [];
  if (base === "MERV") {
    out.add("^MERV");
    out.add("MERV.BA");
    return [...out];
  }
  if (base === "BRK.B") {
    out.add("BRK-B");
    out.add("BRK.B");
    out.add("BRKB");
    return [...out];
  }
  if (base === "YPFD") {
    out.add("YPF");
    out.add("YPF.BA");
  }

  out.add(base);
  if (base.endsWith("D") && base.length > 2) {
    const noD = base.slice(0, -1);
    out.add(noD);
    out.add(`${noD}.BA`);
  }
  if (!base.includes(".") && !base.startsWith("^")) out.add(`${base}.BA`);
  return [...out];
}

function finnhubSymbol(symbol: string): string {
  const normalized = normalizeProviderSymbol(symbol);
  if (normalized === "MERV") return "^MERV";
  return normalized;
}

export function buildPrivateMarketQuote(symbol: string): NormalizedEquityQuote {
  const ticker = normalizeSymbol(symbol);
  return {
    requestedSymbol: ticker,
    ticker,
    resolvedSymbol: null,
    price: null,
    change: null,
    changePct: null,
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

async function fetchYahooQuote(symbol: string, fallbackUsed: boolean): Promise<NormalizedEquityQuote> {
  const ticker = normalizeSymbol(symbol);
  let lastError: unknown = null;

  for (const candidate of yahooCandidates(symbol)) {
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
      const price = meta?.regularMarketPrice ?? 0;
      if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
        lastError = new Error(`No market price for ${candidate}`);
        continue;
      }

      const time = sourceTimeFromUnix(meta?.regularMarketTime ?? lastFinite(result?.timestamp) ?? undefined);
      return {
        requestedSymbol: ticker,
        ticker,
        resolvedSymbol: candidate,
        price,
        change: meta?.regularMarketChange ?? null,
        changePct: meta?.regularMarketChangePercent ?? null,
        high: meta?.regularMarketDayHigh ?? null,
        low: meta?.regularMarketDayLow ?? null,
        open: meta?.regularMarketOpen ?? null,
        previousClose: meta?.previousClose ?? meta?.chartPreviousClose ?? null,
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

async function fetchFinnhubQuote(symbol: string, key: string): Promise<NormalizedEquityQuote> {
  const ticker = normalizeSymbol(symbol);
  const providerSymbol = finnhubSymbol(symbol);
  const source = "https://finnhub.io/api/v1/quote";
  const data = await fetchJsonWithRetry<FinnhubQuoteResponse>(
    `${source}?token=${key}&symbol=${encodeURIComponent(providerSymbol)}`,
    { provider: "Finnhub", timeoutMs: 8_000, retries: 1 }
  );

  const price = data.c ?? 0;
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    throw new Error(`No valid Finnhub price for ${providerSymbol}`);
  }

  const time = sourceTimeFromUnix(data.t);
  return {
    requestedSymbol: ticker,
    ticker,
    resolvedSymbol: providerSymbol,
    price,
    change: data.d ?? null,
    changePct: data.dp ?? null,
    high: data.h ?? null,
    low: data.l ?? null,
    open: data.o ?? null,
    previousClose: data.pc ?? null,
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

export async function fetchBatchEquityQuotes(
  symbols: string[],
  {
    finnhubKey = process.env.FINNHUB_KEY ?? null,
    preferFinnhub = false,
    batchSize = 20,
  }: {
    finnhubKey?: string | null;
    preferFinnhub?: boolean;
    batchSize?: number;
  } = {}
): Promise<EquityQuoteBatchResult> {
  const uniqueSymbols = [...new Set(symbols.map(normalizeSymbol).filter(Boolean))];
  const prices: Record<string, NormalizedEquityQuote> = {};
  const quotes: Record<string, NormalizedEquityQuote> = {};
  const unavailable: Record<string, NormalizedEquityQuote> = {};
  const special: Record<string, NormalizedEquityQuote> = {};
  const errors: EquityQuoteBatchResult["errors"] = [];

  for (let i = 0; i < uniqueSymbols.length; i += batchSize) {
    const batch = uniqueSymbols.slice(i, i + batchSize);
    const settled = await Promise.allSettled(
      batch.map(async (symbol) => resolveEquityQuote(symbol, { finnhubKey, preferFinnhub }))
    );

    settled.forEach((result, index) => {
      const symbol = batch[index];
      if (result.status === "fulfilled") {
        const quote = result.value;
        quotes[symbol] = quote;
        if (quote.availabilityStatus === "private_market_not_listed") {
          special[symbol] = quote;
        } else if (quote.price != null && quote.price > 0) {
          prices[symbol] = quote;
        } else {
          unavailable[symbol] = quote;
        }
        return;
      }

      const normalized = normalizeError(result.reason, finnhubKey ? "Yahoo Finance / Finnhub" : "Yahoo Finance");
      errors.push({ ...normalized, symbol });
      unavailable[symbol] = {
        requestedSymbol: symbol,
        ticker: symbol,
        resolvedSymbol: null,
        price: null,
        change: null,
        changePct: null,
        high: null,
        low: null,
        open: null,
        previousClose: null,
        volume: null,
        currency: "USD",
        provider: normalized.provider,
        source: "equity-quote-provider-chain",
        fetchedAt: new Date().toISOString(),
        sourceUpdatedAt: null,
        ageSeconds: null,
        stale: true,
        availabilityStatus: "provider_error",
        freshnessStatus: "unavailable",
        confidence: "low",
        fallbackUsed: Boolean(finnhubKey),
        unavailableReason: normalized.message,
      };
    });

    if (i + batchSize < uniqueSymbols.length) {
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
    matched: Object.keys(prices).length,
    standardTotal,
    total: uniqueSymbols.length,
    fetchedAt: new Date().toISOString(),
  };
}
