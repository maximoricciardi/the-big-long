import { fetchJsonWithRetry } from "@/lib/api/reliability";
import { fundamentalsProviderTickerFor } from "@/lib/equity/symbols";

export type FmpProfile = {
  symbol?: string;
  companyName?: string;
  currency?: string;
  exchangeShortName?: string;
  industry?: string;
  sector?: string;
  country?: string;
  mktCap?: number;
  beta?: number;
  volAvg?: number;
  lastDiv?: number;
  range?: string;
  description?: string;
  price?: number;
};

export type FmpKeyMetrics = {
  marketCapTTM?: number;
  enterpriseValueTTM?: number;
  peRatioTTM?: number;
  priceToSalesRatioTTM?: number;
  pbRatioTTM?: number;
  enterpriseValueOverEBITDATTM?: number;
  dividendYieldTTM?: number;
  payoutRatioTTM?: number;
  netIncomePerShareTTM?: number;
  grossProfitMarginTTM?: number;
  operatingProfitMarginTTM?: number;
  netProfitMarginTTM?: number;
  returnOnEquityTTM?: number;
  returnOnAssetsTTM?: number;
  debtToEquityTTM?: number;
  freeCashFlowPerShareTTM?: number;
};

export function fmpKey(): string | null {
  return process.env.FMP_API_KEY
    ?? process.env.FINANCIAL_MODELING_PREP_API_KEY
    ?? process.env.FINANCIALMODELINGPREP_API_KEY
    ?? null;
}

export async function fetchFmpProfile(symbol: string, key: string): Promise<{ profile: FmpProfile | null; metrics: FmpKeyMetrics | null }> {
  const providerTicker = fundamentalsProviderTickerFor(symbol);
  const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(providerTicker)}?apikey=${encodeURIComponent(key)}`;
  const metricsUrl = `https://financialmodelingprep.com/api/v3/key-metrics-ttm/${encodeURIComponent(providerTicker)}?apikey=${encodeURIComponent(key)}`;

  const [profileResult, metricsResult] = await Promise.allSettled([
    fetchJsonWithRetry<FmpProfile[]>(profileUrl, { provider: "Financial Modeling Prep", timeoutMs: 8_000, retries: 1 }),
    fetchJsonWithRetry<FmpKeyMetrics[]>(metricsUrl, { provider: "Financial Modeling Prep", timeoutMs: 8_000, retries: 1 }),
  ]);

  return {
    profile: profileResult.status === "fulfilled" ? profileResult.value[0] ?? null : null,
    metrics: metricsResult.status === "fulfilled" ? metricsResult.value[0] ?? null : null,
  };
}
