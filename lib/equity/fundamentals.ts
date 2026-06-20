import { normalizeError } from "@/lib/api/reliability";
import { CURATED_COMPANY_PROFILES } from "@/lib/equity/company-profiles";
import { resolveEquityIdentity, type EquityAssetType } from "@/lib/equity/identity";
import { fetchFmpProfile, fmpKey, type FmpKeyMetrics, type FmpProfile } from "@/lib/equity/providers/fmp";
import { finiteNumber } from "@/lib/equity/quote-normalization";
import { fetchBatchEquityQuotes, type NormalizedEquityQuote } from "@/lib/equity/quotes";
import { fundamentalsProviderTickerFor } from "@/lib/equity/symbols";

export { INITIAL_COMPANY_DETAIL_SYMBOLS, CURATED_COMPANY_PROFILES } from "@/lib/equity/company-profiles";

export const EQUITY_FUNDAMENTALS_CACHE_SECONDS = 6 * 60 * 60;
export const EQUITY_PROFILE_CACHE_SECONDS = 24 * 60 * 60;

export type EquityMetricAvailability =
  | "available"
  | "unavailable"
  | "not_applicable"
  | "estimated"
  | "stale"
  | "provider_error"
  | "private_market_not_listed";

export type EquityFundamentalsConfidence = "high" | "medium" | "low";

export type EquityFundamentalMetricKey =
  | "marketCap"
  | "enterpriseValue"
  | "peRatio"
  | "forwardPE"
  | "priceToSales"
  | "priceToBook"
  | "evToEbitda"
  | "beta"
  | "dividendYield"
  | "dividendRate"
  | "payoutRatio"
  | "eps"
  | "revenue"
  | "grossMargin"
  | "operatingMargin"
  | "netMargin"
  | "returnOnEquity"
  | "returnOnAssets"
  | "debtToEquity"
  | "freeCashFlow"
  | "averageVolume"
  | "sharesOutstanding"
  | "fiftyTwoWeekHigh"
  | "fiftyTwoWeekLow"
  | "nextEarningsDate"
  | "lastEarningsDate"
  | "analystTargetPrice"
  | "recommendation"
  | "description";

export interface EquityFundamentals {
  ticker: string;
  underlyingTicker: string;
  fundamentalsTicker: string;
  localTicker: string;
  companyName: string;
  displayName: string;
  assetType: EquityAssetType;
  market: string;
  exchange: string | null;
  country: string;
  currency: string;
  sector: string;
  industry: string;
  description: string | null;
  businessSummary: string | null;
  investorFocus: string | null;
  keyRisks: string | null;
  mainSegments: string[];
  keyDrivers: string[];
  riskSensitivities: string[];
  whyInvestorsTrack: string | null;
  metricsFocus: string[];
  marketCap: number | null;
  enterpriseValue: number | null;
  peRatio: number | null;
  forwardPE: number | null;
  priceToSales: number | null;
  priceToBook: number | null;
  evToEbitda: number | null;
  beta: number | null;
  dividendYield: number | null;
  dividendRate: number | null;
  payoutRatio: number | null;
  eps: number | null;
  revenue: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
  returnOnEquity: number | null;
  returnOnAssets: number | null;
  debtToEquity: number | null;
  freeCashFlow: number | null;
  averageVolume: number | null;
  sharesOutstanding: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  nextEarningsDate: string | null;
  lastEarningsDate: string | null;
  analystTargetPrice: number | null;
  recommendation: string | null;
  quote: NormalizedEquityQuote | null;
  source: string;
  sourceType: string;
  profileSource: string;
  fundamentalsSource: string;
  sourceUpdatedAt: string | null;
  fetchedAt: string;
  stale: boolean;
  confidence: EquityFundamentalsConfidence;
  availabilityStatus: EquityMetricAvailability;
  mappingConfidence: EquityFundamentalsConfidence;
  availability: Record<EquityFundamentalMetricKey, EquityMetricAvailability>;
  unavailableReason: string | null;
}

const METRIC_KEYS: EquityFundamentalMetricKey[] = [
  "marketCap",
  "enterpriseValue",
  "peRatio",
  "forwardPE",
  "priceToSales",
  "priceToBook",
  "evToEbitda",
  "beta",
  "dividendYield",
  "dividendRate",
  "payoutRatio",
  "eps",
  "revenue",
  "grossMargin",
  "operatingMargin",
  "netMargin",
  "returnOnEquity",
  "returnOnAssets",
  "debtToEquity",
  "freeCashFlow",
  "averageVolume",
  "sharesOutstanding",
  "fiftyTwoWeekHigh",
  "fiftyTwoWeekLow",
  "nextEarningsDate",
  "lastEarningsDate",
  "analystTargetPrice",
  "recommendation",
  "description",
];

function metricAvailability(defaultStatus: EquityMetricAvailability): Record<EquityFundamentalMetricKey, EquityMetricAvailability> {
  return Object.fromEntries(METRIC_KEYS.map((key) => [key, defaultStatus])) as Record<EquityFundamentalMetricKey, EquityMetricAvailability>;
}

function availabilityFor(value: unknown, availableStatus: EquityMetricAvailability = "available"): EquityMetricAvailability {
  return value === null || value === undefined || value === "" ? "unavailable" : availableStatus;
}

function parseRange(range: string | undefined): { high: number | null; low: number | null } {
  if (!range) return { high: null, low: null };
  const parts = range.split("-").map((part) => Number(part.trim())).filter((value) => Number.isFinite(value));
  if (parts.length !== 2) return { high: null, low: null };
  return { low: Math.min(parts[0], parts[1]), high: Math.max(parts[0], parts[1]) };
}

function emptyFundamentals(symbol: string, quote: NormalizedEquityQuote | null, providerError?: string): EquityFundamentals {
  const identity = resolveEquityIdentity({ ticker: symbol });
  const curated = CURATED_COMPANY_PROFILES[identity.localTicker] ?? CURATED_COMPANY_PROFILES[identity.underlyingTicker];
  const isPrivate = identity.assetType === "private_market_exposure";
  const defaultAvailability: EquityMetricAvailability = isPrivate
    ? "private_market_not_listed"
    : providerError
      ? "provider_error"
      : "unavailable";
  const availability = metricAvailability(defaultAvailability);
  if (curated) {
    availability.description = "available";
  }

  return {
    ticker: identity.localTicker,
    underlyingTicker: identity.underlyingTicker,
    fundamentalsTicker: fundamentalsProviderTickerFor(identity.underlyingTicker),
    localTicker: identity.localTicker,
    companyName: curated?.companyName ?? identity.companyName,
    displayName: identity.displayName,
    assetType: identity.assetType,
    market: identity.market,
    exchange: curated?.exchange ?? null,
    country: curated?.country ?? identity.country,
    currency: curated?.currency ?? quote?.currency ?? "USD",
    sector: curated?.sector ?? identity.sector,
    industry: curated?.industry ?? identity.industry,
    description: curated?.description ?? null,
    businessSummary: curated?.businessSummary ?? null,
    investorFocus: curated?.investorFocus ?? null,
    keyRisks: curated?.keyRisks ?? null,
    mainSegments: curated?.mainSegments ?? [],
    keyDrivers: curated?.keyDrivers ?? [],
    riskSensitivities: curated?.riskSensitivities ?? [],
    whyInvestorsTrack: curated?.whyInvestorsTrack ?? null,
    metricsFocus: curated?.metricsFocus ?? [],
    marketCap: null,
    enterpriseValue: null,
    peRatio: null,
    forwardPE: null,
    priceToSales: null,
    priceToBook: null,
    evToEbitda: null,
    beta: null,
    dividendYield: null,
    dividendRate: null,
    payoutRatio: null,
    eps: null,
    revenue: null,
    grossMargin: null,
    operatingMargin: null,
    netMargin: null,
    returnOnEquity: null,
    returnOnAssets: null,
    debtToEquity: null,
    freeCashFlow: null,
    averageVolume: quote?.volume ?? null,
    sharesOutstanding: null,
    fiftyTwoWeekHigh: null,
    fiftyTwoWeekLow: null,
    nextEarningsDate: null,
    lastEarningsDate: null,
    analystTargetPrice: null,
    recommendation: null,
    quote,
    source: curated ? "curated_static" : "identity_static",
    sourceType: curated?.sourceType ?? "identity_static",
    profileSource: curated ? "curated_static" : "identity_static",
    fundamentalsSource: providerError ? "provider_error" : "unavailable",
    sourceUpdatedAt: curated?.updatedAt ?? null,
    fetchedAt: new Date().toISOString(),
    stale: false,
    confidence: curated ? "medium" : "low",
    availabilityStatus: isPrivate ? "private_market_not_listed" : curated ? "available" : defaultAvailability,
    mappingConfidence: identity.identityConfidence,
    availability: {
      ...availability,
      averageVolume: quote?.volume != null ? "available" : availability.averageVolume,
    },
    unavailableReason: isPrivate ? "Private-market exposure; no public-company fundamentals are available." : providerError ?? null,
  };
}

function mergeFmpFundamentals(
  symbol: string,
  quote: NormalizedEquityQuote | null,
  profile: FmpProfile | null,
  metrics: FmpKeyMetrics | null
): EquityFundamentals {
  const base = emptyFundamentals(symbol, quote);
  const range = parseRange(profile?.range);
  const marketCap = finiteNumber(profile?.mktCap) ?? finiteNumber(metrics?.marketCapTTM);
  const averageVolume = finiteNumber(profile?.volAvg) ?? quote?.volume ?? null;
  const description = profile?.description || base.description;
  const availability = {
    ...base.availability,
    marketCap: availabilityFor(marketCap),
    enterpriseValue: availabilityFor(metrics?.enterpriseValueTTM),
    peRatio: availabilityFor(metrics?.peRatioTTM),
    priceToSales: availabilityFor(metrics?.priceToSalesRatioTTM),
    priceToBook: availabilityFor(metrics?.pbRatioTTM),
    evToEbitda: availabilityFor(metrics?.enterpriseValueOverEBITDATTM),
    beta: availabilityFor(profile?.beta),
    dividendYield: availabilityFor(metrics?.dividendYieldTTM),
    dividendRate: availabilityFor(profile?.lastDiv),
    payoutRatio: availabilityFor(metrics?.payoutRatioTTM),
    eps: availabilityFor(metrics?.netIncomePerShareTTM),
    grossMargin: availabilityFor(metrics?.grossProfitMarginTTM),
    operatingMargin: availabilityFor(metrics?.operatingProfitMarginTTM),
    netMargin: availabilityFor(metrics?.netProfitMarginTTM),
    returnOnEquity: availabilityFor(metrics?.returnOnEquityTTM),
    returnOnAssets: availabilityFor(metrics?.returnOnAssetsTTM),
    debtToEquity: availabilityFor(metrics?.debtToEquityTTM),
    freeCashFlow: availabilityFor(metrics?.freeCashFlowPerShareTTM),
    averageVolume: availabilityFor(averageVolume),
    fiftyTwoWeekHigh: availabilityFor(range.high),
    fiftyTwoWeekLow: availabilityFor(range.low),
    description: availabilityFor(description),
  };

  if (base.assetType === "etf") {
    availability.enterpriseValue = "not_applicable";
    availability.evToEbitda = "not_applicable";
    availability.forwardPE = "not_applicable";
  }

  return {
    ...base,
    companyName: profile?.companyName ?? base.companyName,
    exchange: profile?.exchangeShortName ?? base.exchange,
    country: profile?.country ?? base.country,
    currency: profile?.currency ?? base.currency,
    sector: profile?.sector ?? base.sector,
    industry: profile?.industry ?? base.industry,
    description,
    marketCap,
    enterpriseValue: finiteNumber(metrics?.enterpriseValueTTM),
    peRatio: finiteNumber(metrics?.peRatioTTM),
    priceToSales: finiteNumber(metrics?.priceToSalesRatioTTM),
    priceToBook: finiteNumber(metrics?.pbRatioTTM),
    evToEbitda: finiteNumber(metrics?.enterpriseValueOverEBITDATTM),
    beta: finiteNumber(profile?.beta),
    dividendYield: finiteNumber(metrics?.dividendYieldTTM),
    dividendRate: finiteNumber(profile?.lastDiv),
    payoutRatio: finiteNumber(metrics?.payoutRatioTTM),
    eps: finiteNumber(metrics?.netIncomePerShareTTM),
    grossMargin: finiteNumber(metrics?.grossProfitMarginTTM),
    operatingMargin: finiteNumber(metrics?.operatingProfitMarginTTM),
    netMargin: finiteNumber(metrics?.netProfitMarginTTM),
    returnOnEquity: finiteNumber(metrics?.returnOnEquityTTM),
    returnOnAssets: finiteNumber(metrics?.returnOnAssetsTTM),
    debtToEquity: finiteNumber(metrics?.debtToEquityTTM),
    freeCashFlow: finiteNumber(metrics?.freeCashFlowPerShareTTM),
    averageVolume,
    fiftyTwoWeekHigh: range.high,
    fiftyTwoWeekLow: range.low,
    source: "financialmodelingprep",
    sourceType: profile ? "provider_profile" : base.sourceType,
    profileSource: profile ? "financialmodelingprep:profile" : base.profileSource,
    fundamentalsSource: metrics ? "financialmodelingprep:key-metrics-ttm" : "unavailable",
    sourceUpdatedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    confidence: profile ? "high" : base.confidence,
    availabilityStatus: profile || metrics ? "available" : base.availabilityStatus,
    availability,
    unavailableReason: null,
  };
}

export async function getEquityFundamentals(
  symbols: string[],
  {
    includeProviderFetch = true,
    includeQuotes = true,
  }: {
    includeProviderFetch?: boolean;
    includeQuotes?: boolean;
  } = {}
): Promise<{
  data: Record<string, EquityFundamentals>;
  providerStatuses: Array<{ provider: string; status: string; message?: string }>;
  errors: Array<{ provider: string; message: string; status?: number; symbol?: string }>;
}> {
  const uniqueSymbols = [...new Set(symbols.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean))];
  const errors: Array<{ provider: string; message: string; status?: number; symbol?: string }> = [];
  const providerStatuses: Array<{ provider: string; status: string; message?: string }> = [];
  const key = includeProviderFetch ? fmpKey() : null;
  const quoteBatch = includeQuotes ? await fetchBatchEquityQuotes(uniqueSymbols, { preferFinnhub: false }) : null;
  const data: Record<string, EquityFundamentals> = {};

  if (quoteBatch) {
    providerStatuses.push(...quoteBatch.providerStatuses);
  }

  if (!key) {
    providerStatuses.push({
      provider: "Financial Modeling Prep",
      status: "unavailable",
      message: "No FMP API key configured; using curated/identity profiles only.",
    });
  }

  for (const symbol of uniqueSymbols) {
    const identity = resolveEquityIdentity({ ticker: symbol });
    const fundamentalsTicker = fundamentalsProviderTickerFor(identity.underlyingTicker);
    const quote = quoteBatch?.quotes[symbol] ?? null;

    if (identity.assetType === "private_market_exposure" || !key) {
      data[symbol] = emptyFundamentals(symbol, quote, key ? undefined : "fundamentals_provider_not_configured");
      continue;
    }

    try {
      const { profile, metrics } = await fetchFmpProfile(fundamentalsTicker, key);
      data[symbol] = mergeFmpFundamentals(symbol, quote, profile, metrics);
    } catch (err) {
      const normalized = normalizeError(err, "Financial Modeling Prep");
      errors.push({ ...normalized, symbol });
      data[symbol] = emptyFundamentals(symbol, quote, normalized.message);
    }
  }

  if (key) {
    providerStatuses.push({
      provider: "Financial Modeling Prep",
      status: errors.length ? "partial" : "ok",
    });
  }

  return { data, providerStatuses, errors };
}
