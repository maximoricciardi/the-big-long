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
export type EquityQuoteChangeSource = "provider" | "computed_from_previous_close" | "unavailable";
export type EquityQuoteVariationStatus = "available" | "unavailable" | "not_applicable";

export interface NormalizedEquityQuote {
  requestedSymbol: string;
  ticker: string;
  resolvedSymbol: string | null;
  price: number | null;
  change: number | null;
  changePct: number | null;
  changeSource: EquityQuoteChangeSource;
  variationStatus: EquityQuoteVariationStatus;
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
  providerStatuses: Array<{ provider: string; status: string; message?: string }>;
  matched: number;
  standardTotal: number;
  total: number;
  fetchedAt: string;
}
