import { BONOS_CER, DOLARLINKED, DUALES, LECAP, SOBERANOS, TAMAR } from "@/lib/data/renta-fija";
import { BOND_SCHEDULES, type BondFlow } from "@/lib/data/bonds-schedules";
import type { FixedIncomeCategoryId } from "./taxonomy";

export type MetadataConfidence = "high" | "medium" | "low";
export type MetadataReviewStatus = "verified" | "inferred" | "needs_review" | "unavailable";
export type MetadataSourceKind = "provider" | "static_schedule" | "static_snapshot" | "ticker_inference" | "unavailable";
export type CashflowScheduleStatus = "reliable" | "partial" | "maturity_only" | "unavailable";

export type FieldSource<T> = {
  value: T;
  source: MetadataSourceKind;
  confidence: MetadataConfidence;
};

export type FixedIncomeCashflowEvent = {
  date: string;
  eventType: "coupon" | "amortization" | "coupon_amortization" | "maturity";
  couponAmount?: number;
  amortizationAmount?: number;
  residualValue?: number;
  source: MetadataSourceKind;
  confidence: MetadataConfidence;
};

export type FixedIncomeMetadata = {
  ticker: string;
  normalizedTicker: string;
  name?: FieldSource<string>;
  issuer?: FieldSource<string>;
  instrumentType?: FieldSource<string>;
  creditSegment?: FieldSource<string>;
  category: FieldSource<FixedIncomeCategoryId>;
  currency?: FieldSource<"ARS" | "USD" | "EXT" | "UNKNOWN">;
  law?: FieldSource<"ARG" | "NY" | "UNKNOWN">;
  maturityDate?: FieldSource<string>;
  couponType?: FieldSource<string>;
  couponRate?: FieldSource<number>;
  amortizationType?: FieldSource<string>;
  residualValue?: FieldSource<number>;
  accruedInterest?: FieldSource<number>;
  paymentFrequency?: FieldSource<string>;
  nextPaymentDate?: FieldSource<string>;
  cashflowScheduleStatus: CashflowScheduleStatus;
  cashflows: FixedIncomeCashflowEvent[];
  metadataSource: MetadataSourceKind;
  metadataConfidence: MetadataConfidence;
  lastUpdated: string;
  reviewStatus: MetadataReviewStatus;
  reviewReasons: string[];
};

export type InstrumentMetadata = {
  maturity?: string;
  hasSchedule?: boolean;
  issuer?: string;
  name?: string;
  instrumentType?: string;
  category?: FixedIncomeCategoryId;
  currency?: "ARS" | "USD" | "EXT" | "UNKNOWN";
  law?: "ARG" | "NY" | "UNKNOWN";
  couponType?: string;
  couponRate?: number;
  amortizationType?: string;
  paymentFrequency?: string;
  cashflows?: BondFlow[];
};

export type MetadataProviderCapability = {
  provider: string;
  instrumentMaster: "yes" | "partial" | "no" | "unknown";
  cashflows: "yes" | "partial" | "no" | "unknown";
  residualValue: "yes" | "partial" | "no" | "unknown";
  accruedInterest: "yes" | "partial" | "no" | "unknown";
  couponAmortizationSchedule: "yes" | "partial" | "no" | "unknown";
  credentials: "required" | "not_required" | "unknown";
  productionFit: "high" | "medium" | "low" | "research_only";
};

export const METADATA_PROVIDER_CAPABILITIES: MetadataProviderCapability[] = [
  { provider: "Docta Capital API", instrumentMaster: "yes", cashflows: "yes", residualValue: "yes", accruedInterest: "yes", couponAmortizationSchedule: "yes", credentials: "required", productionFit: "high" },
  { provider: "BYMA Market Data APIs", instrumentMaster: "partial", cashflows: "unknown", residualValue: "unknown", accruedInterest: "unknown", couponAmortizationSchedule: "unknown", credentials: "required", productionFit: "high" },
  { provider: "A3 / ex-MAE", instrumentMaster: "unknown", cashflows: "unknown", residualValue: "unknown", accruedInterest: "unknown", couponAmortizationSchedule: "unknown", credentials: "required", productionFit: "medium" },
  { provider: "Bonistas", instrumentMaster: "partial", cashflows: "partial", residualValue: "partial", accruedInterest: "unknown", couponAmortizationSchedule: "partial", credentials: "unknown", productionFit: "research_only" },
  { provider: "Rava", instrumentMaster: "partial", cashflows: "no", residualValue: "unknown", accruedInterest: "unknown", couponAmortizationSchedule: "no", credentials: "unknown", productionFit: "research_only" },
  { provider: "DATA912", instrumentMaster: "no", cashflows: "no", residualValue: "no", accruedInterest: "no", couponAmortizationSchedule: "no", credentials: "not_required", productionFit: "medium" },
  { provider: "BCRA / ArgentinaDatos", instrumentMaster: "no", cashflows: "no", residualValue: "no", accruedInterest: "no", couponAmortizationSchedule: "no", credentials: "not_required", productionFit: "low" },
];

export interface FixedIncomeMetadataProvider {
  id: string;
  name: string;
  kind: "authoritative" | "reference" | "market_price";
  capabilities: MetadataProviderCapability;
  loadMetadata(tickers: string[]): Promise<Record<string, FixedIncomeMetadata>>;
}

export function normalizeFixedIncomeTicker(ticker: string) {
  const t = ticker.toUpperCase();
  return t.length > 4 ? t.replace(/[CD]$/, "") : t;
}

function field<T>(value: T | undefined, source: MetadataSourceKind, confidence: MetadataConfidence): FieldSource<T> | undefined {
  return value == null ? undefined : { value, source, confidence };
}

function inferCurrency(ticker: string): FieldSource<"ARS" | "USD" | "EXT" | "UNKNOWN"> {
  const t = ticker.toUpperCase();
  if (t.endsWith("D")) return { value: "USD", source: "ticker_inference", confidence: "medium" };
  if (t.endsWith("C")) return { value: "EXT", source: "ticker_inference", confidence: "low" };
  return { value: "ARS", source: "ticker_inference", confidence: "medium" };
}

function inferLaw(ticker: string, category: FixedIncomeCategoryId): FieldSource<"ARG" | "NY" | "UNKNOWN"> | undefined {
  const base = normalizeFixedIncomeTicker(ticker);
  if (category === "sovereign") {
    if (base.startsWith("GD")) return { value: "NY", source: "ticker_inference", confidence: "high" };
    if (/^(AL|AE|AO|AN)/.test(base)) return { value: "ARG", source: "ticker_inference", confidence: "high" };
  }
  return undefined;
}

function inferCreditSegment(ticker: string, category: FixedIncomeCategoryId): FieldSource<string> | undefined {
  const base = normalizeFixedIncomeTicker(ticker);
  if (category === "bopreal") return field("BOPREAL", "ticker_inference", "medium");
  if (category !== "corporate") return undefined;
  if (/^(BA|BB|BC|PBA|PM)/.test(base)) return field("Provincial / sub-soberano", "ticker_inference", "medium");
  if (/^(CO|PU|SF|ER)/.test(base)) return field("Provincial / sub-soberano", "ticker_inference", "low");
  return field("Corporate / ON u otro crédito", "ticker_inference", "low");
}

function cashflowsFromSchedule(flows: BondFlow[] | undefined): FixedIncomeCashflowEvent[] {
  return (flows ?? []).map((flow) => {
    const hasCoupon = flow.cpn > 0;
    const hasAmort = flow.amort > 0;
    return {
      date: flow.date,
      eventType: hasCoupon && hasAmort ? "coupon_amortization" : hasAmort ? "amortization" : hasCoupon ? "coupon" : "maturity",
      couponAmount: hasCoupon ? flow.cpn : undefined,
      amortizationAmount: hasAmort ? flow.amort : undefined,
      source: "static_schedule",
      confidence: "medium",
    };
  });
}

function nextPaymentFromCashflows(cashflows: FixedIncomeCashflowEvent[], now = new Date()) {
  return cashflows
    .filter((flow) => new Date(flow.date) > now)
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))[0]?.date;
}

export function buildStaticInstrumentMetadata(): Record<string, InstrumentMetadata> {
  const out: Record<string, InstrumentMetadata> = {};
  const add = (ticker: string, metadata: InstrumentMetadata) => {
    if (!ticker) return;
    out[ticker] = metadata;
    out[normalizeFixedIncomeTicker(ticker)] ??= metadata;
  };

  for (const group of LECAP) {
    for (const row of group.rows) add(row.t, { maturity: group.vto, hasSchedule: true, instrumentType: row.t.startsWith("S") ? "LECAP" : "BONCAP", category: row.t.startsWith("S") ? "lecap" : "boncap", currency: "ARS", amortizationType: "Bullet", paymentFrequency: "Al vencimiento" });
  }
  for (const row of DUALES) add(row.t, { maturity: row.vto, instrumentType: "Dual Bond", category: "dual", currency: "ARS" });
  for (const row of DOLARLINKED) add(row.t, { maturity: row.vto, instrumentType: "Dólar Linked", category: "dollar_linked", currency: "ARS" });
  for (const row of TAMAR) add(row.t, { maturity: row.vto, instrumentType: "TAMAR", currency: "ARS" });
  for (const row of BONOS_CER) add(row.t, { maturity: row.vto, name: row.desc, instrumentType: row.tipo, category: "cer", currency: "ARS", law: row.ley === "ARG" ? "ARG" : "UNKNOWN", couponRate: row.cupCer, amortizationType: row.amort });
  for (const row of SOBERANOS) {
    const flows = BOND_SCHEDULES[row.t];
    add(row.t, { maturity: row.vto, instrumentType: "Soberano hard-dollar", category: "sovereign", currency: "USD", law: row.ley === "NY" ? "NY" : "ARG", paymentFrequency: row.pago, cashflows: flows, hasSchedule: Boolean(flows?.length) });
  }

  return out;
}

export function buildFixedIncomeMetadata({
  ticker,
  category,
  confidence,
  maturity,
  maturitySource,
  staticMetadata,
  now = new Date(),
}: {
  ticker: string;
  category: FixedIncomeCategoryId;
  confidence: MetadataConfidence;
  maturity?: string;
  maturitySource?: "static" | "ticker-inferred";
  staticMetadata?: InstrumentMetadata;
  now?: Date;
}): FixedIncomeMetadata {
  const normalizedTicker = normalizeFixedIncomeTicker(ticker);
  const schedule = staticMetadata?.cashflows;
  const cashflows = cashflowsFromSchedule(schedule);
  const nextPaymentDate = nextPaymentFromCashflows(cashflows, now);
  const hasSchedule = Boolean(cashflows.length);
  const maturityKind: MetadataSourceKind = staticMetadata?.maturity ? "static_snapshot" : maturitySource === "ticker-inferred" ? "ticker_inference" : "unavailable";
  const source = hasSchedule ? "static_schedule" : staticMetadata ? "static_snapshot" : maturitySource === "ticker-inferred" ? "ticker_inference" : "unavailable";
  const scheduleStatus: CashflowScheduleStatus = hasSchedule ? "reliable" : maturity ? "maturity_only" : "unavailable";
  const reviewReasons = [
    ...(confidence === "low" ? ["low_classification_confidence"] : []),
    ...(!maturity ? ["missing_maturity"] : []),
    ...(!hasSchedule ? ["missing_cashflow_schedule"] : []),
    ...(source === "ticker_inference" ? ["metadata_inferred"] : []),
  ];
  const reviewStatus: MetadataReviewStatus = hasSchedule ? "verified" : source === "ticker_inference" || maturitySource === "ticker-inferred" ? "inferred" : reviewReasons.length ? "needs_review" : "verified";

  return {
    ticker,
    normalizedTicker,
    name: field(staticMetadata?.name, "static_snapshot", "medium"),
    issuer: field(staticMetadata?.issuer, "static_snapshot", "medium"),
    instrumentType: field(staticMetadata?.instrumentType, staticMetadata ? "static_snapshot" : "ticker_inference", staticMetadata?.instrumentType ? "medium" : "low") ?? field(category, "ticker_inference", "low"),
    creditSegment: inferCreditSegment(ticker, category),
    category: { value: staticMetadata?.category ?? category, source: staticMetadata?.category ? "static_snapshot" : "ticker_inference", confidence: staticMetadata?.category ? "medium" : confidence },
    currency: field(staticMetadata?.currency, "static_snapshot", "medium") ?? inferCurrency(ticker),
    law: field(staticMetadata?.law, "static_snapshot", "medium") ?? inferLaw(ticker, category),
    maturityDate: field(maturity, maturityKind, maturityKind === "ticker_inference" ? "medium" : staticMetadata?.maturity ? "medium" : "low"),
    couponType: field(staticMetadata?.couponType, "static_snapshot", "medium"),
    couponRate: field(staticMetadata?.couponRate, "static_snapshot", "medium"),
    amortizationType: field(staticMetadata?.amortizationType, "static_snapshot", "medium"),
    paymentFrequency: field(staticMetadata?.paymentFrequency, "static_snapshot", "medium"),
    nextPaymentDate: field(nextPaymentDate, "static_schedule", "medium"),
    cashflowScheduleStatus: scheduleStatus,
    cashflows,
    metadataSource: source,
    metadataConfidence: hasSchedule ? "medium" : confidence,
    lastUpdated: new Date().toISOString(),
    reviewStatus,
    reviewReasons,
  };
}
