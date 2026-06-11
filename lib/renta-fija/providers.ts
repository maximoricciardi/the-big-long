import type { PriceMap } from "./types";
import type { FixedIncomeMetadata, MetadataProviderCapability } from "./metadata";
import type { FixedIncomeUniverse } from "./taxonomy";

export type FixedIncomeProviderId = "data912" | "docta" | "byma" | "a3" | "future";

export type ProviderHealth = {
  providerId: FixedIncomeProviderId;
  status: "available" | "missing_credentials" | "unavailable" | "not_configured";
  checkedAt: string;
  message?: string;
};

export type FixedIncomeProviderContext = {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  baseUrl?: string;
};

export type FixedIncomeProviderResult<T> = {
  providerId: FixedIncomeProviderId;
  fetchedAt: string;
  data: T;
  health: ProviderHealth;
};

export interface FixedIncomeProviderAdapter {
  id: FixedIncomeProviderId;
  name: string;
  kind: "market_price" | "instrument_master" | "cashflow_master" | "full_service";
  capabilities: MetadataProviderCapability;
  health(context?: FixedIncomeProviderContext): Promise<ProviderHealth>;
  loadUniverse?(context?: FixedIncomeProviderContext): Promise<FixedIncomeProviderResult<FixedIncomeUniverse>>;
  loadPrices?(context?: FixedIncomeProviderContext): Promise<FixedIncomeProviderResult<{ bonds: PriceMap; notes: PriceMap }>>;
  loadInstrumentMaster?(tickers: string[], context?: FixedIncomeProviderContext): Promise<FixedIncomeProviderResult<Record<string, FixedIncomeMetadata>>>;
  loadCashflows?(tickers: string[], context?: FixedIncomeProviderContext): Promise<FixedIncomeProviderResult<Record<string, FixedIncomeMetadata["cashflows"]>>>;
}

function health(providerId: FixedIncomeProviderId, status: ProviderHealth["status"], message?: string): ProviderHealth {
  return { providerId, status, checkedAt: new Date().toISOString(), message };
}

export const DATA912Provider: FixedIncomeProviderAdapter = {
  id: "data912",
  name: "DATA912",
  kind: "market_price",
  capabilities: { provider: "DATA912", instrumentMaster: "no", cashflows: "no", residualValue: "no", accruedInterest: "no", couponAmortizationSchedule: "no", credentials: "not_required", productionFit: "medium" },
  async health() {
    return health("data912", "available", "Public market-price/discovery source only.");
  },
};

export const DoctaProvider: FixedIncomeProviderAdapter = {
  id: "docta",
  name: "Docta Capital API",
  kind: "full_service",
  capabilities: { provider: "Docta Capital API", instrumentMaster: "yes", cashflows: "yes", residualValue: "yes", accruedInterest: "yes", couponAmortizationSchedule: "yes", credentials: "required", productionFit: "high" },
  async health(context) {
    return context?.apiKey
      ? health("docta", "available", "Credentials configured; adapter ready for implementation.")
      : health("docta", "missing_credentials", "Bearer token required before loading instrument master/cashflows.");
  },
};

export const BYMAProvider: FixedIncomeProviderAdapter = {
  id: "byma",
  name: "BYMA Market Data APIs",
  kind: "instrument_master",
  capabilities: { provider: "BYMA Market Data APIs", instrumentMaster: "partial", cashflows: "unknown", residualValue: "unknown", accruedInterest: "unknown", couponAmortizationSchedule: "unknown", credentials: "required", productionFit: "high" },
  async health(context) {
    return context?.clientId && context.clientSecret
      ? health("byma", "available", "Credentials configured; adapter ready for market-data integration.")
      : health("byma", "missing_credentials", "Client credentials required for production BYMA access.");
  },
};

export const A3Provider: FixedIncomeProviderAdapter = {
  id: "a3",
  name: "A3 / ex-MAE",
  kind: "instrument_master",
  capabilities: { provider: "A3 / ex-MAE", instrumentMaster: "unknown", cashflows: "unknown", residualValue: "unknown", accruedInterest: "unknown", couponAmortizationSchedule: "unknown", credentials: "required", productionFit: "medium" },
  async health() {
    return health("a3", "not_configured", "Commercial access path not configured in this repository.");
  },
};

export const FutureProvider: FixedIncomeProviderAdapter = {
  id: "future",
  name: "Future Institutional Provider",
  kind: "full_service",
  capabilities: { provider: "Future Institutional Provider", instrumentMaster: "unknown", cashflows: "unknown", residualValue: "unknown", accruedInterest: "unknown", couponAmortizationSchedule: "unknown", credentials: "unknown", productionFit: "medium" },
  async health() {
    return health("future", "not_configured", "Placeholder adapter for future institutional source.");
  },
};

export const FIXED_INCOME_PROVIDERS = [
  DATA912Provider,
  DoctaProvider,
  BYMAProvider,
  A3Provider,
  FutureProvider,
] as const;
