import type { PriceMap } from "./types";
import {
  buildFixedIncomeMetadata,
  normalizeFixedIncomeTicker,
  type FixedIncomeMetadata,
  type InstrumentMetadata,
  type MetadataReviewStatus,
} from "./metadata";
export { normalizeFixedIncomeTicker } from "./metadata";

export type FixedIncomeCategoryId =
  | "lecap"
  | "boncap"
  | "dollar_linked"
  | "dual"
  | "bopreal"
  | "sovereign"
  | "cer"
  | "corporate";

export type FixedIncomeCategory = {
  id: FixedIncomeCategoryId;
  label: string;
  description: string;
  source: "static" | "live-inferred";
};

export type DiscoveredInstrument = {
  ticker: string;
  category: FixedIncomeCategoryId;
  label: string;
  price: number;
  pct?: number;
  source: "DATA912";
  confidence: "high" | "medium" | "low";
  maturity?: string;
  maturitySource?: "static" | "ticker-inferred";
  hasSchedule: boolean;
  reviewReasons: string[];
  metadata: FixedIncomeMetadata;
};

export type FixedIncomeUniverse = {
  all: DiscoveredInstrument[];
  byCategory: Record<FixedIncomeCategoryId, DiscoveredInstrument[]>;
  calendarEligible: DiscoveredInstrument[];
  curveEligible: DiscoveredInstrument[];
  calculationEligible: DiscoveredInstrument[];
  needsReview: DiscoveredInstrument[];
};

export const FIXED_INCOME_CATEGORIES: FixedIncomeCategory[] = [
  { id: "lecap", label: "LECAPs", description: "Letras capitalizables en pesos. Tasa fija corta.", source: "live-inferred" },
  { id: "boncap", label: "BONCAPs", description: "Bonos capitalizables en pesos. Duración mayor que LECAP.", source: "live-inferred" },
  { id: "dollar_linked", label: "Dólar Linked", description: "Instrumentos vinculados al tipo de cambio oficial.", source: "live-inferred" },
  { id: "dual", label: "Dual Bonds", description: "Instrumentos con payoff dual o alternativo.", source: "live-inferred" },
  { id: "bopreal", label: "BOPREAL", description: "Bonos para importadores y obligaciones BCRA.", source: "live-inferred" },
  { id: "sovereign", label: "Soberanos", description: "Globales/Bonares y deuda soberana hard-dollar.", source: "static" },
  { id: "cer", label: "CER", description: "Bonos ajustados por inflación.", source: "static" },
  { id: "corporate", label: "ONs / Crédito", description: "Obligaciones negociables y crédito no soberano detectado.", source: "live-inferred" },
];

const SOV_PREFIXES = ["AL", "GD", "AE", "AO", "AN"];
const STATIC_SOV = new Set(["AL29D", "AL30D", "AL35D", "AL41D", "GD29D", "GD30D", "GD35D", "GD38D", "GD41D", "GD46D", "AE38D", "AO27D", "AO28D", "AN29D"]);
const STATIC_CER = new Set(["TX26", "TX28", "TZX26", "TZX27", "TZX28", "TZXM6", "TZXO6", "TZXD6", "TZXM7", "TZXD7", "DICP", "PARP", "CUAP"]);
const MATURITY_MONTH: Record<string, number> = {
  E: 1,
  F: 2,
  M: 3,
  A: 4,
  Y: 5,
  J: 6,
  L: 7,
  G: 8,
  S: 9,
  O: 10,
  N: 11,
  D: 12,
};

export function inferMaturityFromTicker(ticker: string): string | null {
  const base = normalizeFixedIncomeTicker(ticker);
  const match = base.match(/(\d{1,2})([EFMAYJLGSOND])(\d)$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = MATURITY_MONTH[match[2]];
  const year = 2020 + Number(match[3]);
  if (!day || !month || !year) return null;

  const lastDay = new Date(year, month, 0).getDate();
  if (day < 1 || day > lastDay) return null;
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

export function classifyFixedIncomeTicker(ticker: string): {
  category: FixedIncomeCategoryId;
  confidence: "high" | "medium" | "low";
} {
  const t = ticker.toUpperCase();
  const base = normalizeFixedIncomeTicker(t);
  if (STATIC_SOV.has(t) || STATIC_SOV.has(base) || SOV_PREFIXES.some(prefix => t.startsWith(prefix))) return { category: "sovereign", confidence: "high" };
  if (STATIC_CER.has(t) || STATIC_CER.has(base) || /^TZX/.test(t) || /^TX\d/.test(t)) return { category: "cer", confidence: "high" };
  if (/^(BP|BPO|BU)/.test(t)) return { category: "bopreal", confidence: "medium" };
  if (/^(D|TZV)/.test(t)) return { category: "dollar_linked", confidence: "medium" };
  if (/^(TT|X)/.test(t)) return { category: "dual", confidence: "medium" };
  if (/^S/.test(t) || /^LB/.test(t)) return { category: "lecap", confidence: "medium" };
  if (/^T/.test(t)) return { category: "boncap", confidence: "medium" };
  return { category: "corporate", confidence: "low" };
}

export function discoverFixedIncomeUniverse(
  maps: { bonds: PriceMap; notes: PriceMap },
  metadataMap: Record<string, InstrumentMetadata> = {}
): DiscoveredInstrument[] {
  const rows: DiscoveredInstrument[] = [];
  for (const [ticker, quote] of Object.entries({ ...maps.bonds, ...maps.notes })) {
    if (!quote?.price || quote.price <= 0) continue;
    const { category, confidence } = classifyFixedIncomeTicker(ticker);
    const base = normalizeFixedIncomeTicker(ticker);
    const meta = metadataMap[ticker] ?? metadataMap[base];
    const inferredMaturity = inferMaturityFromTicker(ticker);
    const maturity = meta?.maturity ?? inferredMaturity ?? undefined;
    const instrumentMetadata = buildFixedIncomeMetadata({
      ticker,
      category: meta?.category ?? category,
      confidence,
      maturity,
      maturitySource: meta?.maturity ? "static" : inferredMaturity ? "ticker-inferred" : undefined,
      staticMetadata: meta,
    });
    const hasSchedule = instrumentMetadata.cashflowScheduleStatus === "reliable";
    const reviewReasons = [
      ...(confidence === "low" ? ["low_classification_confidence"] : []),
      ...(!maturity ? ["missing_maturity"] : []),
      ...(!hasSchedule ? ["missing_cashflow_schedule"] : []),
      ...instrumentMetadata.reviewReasons.filter(reason => reason === "metadata_inferred"),
    ];
    const def = FIXED_INCOME_CATEGORIES.find(c => c.id === instrumentMetadata.category.value);
    rows.push({
      ticker,
      category: instrumentMetadata.category.value,
      label: def?.label ?? "Otros",
      price: quote.price,
      pct: quote.pct,
      source: "DATA912",
      confidence,
      maturity,
      maturitySource: meta?.maturity ? "static" : inferredMaturity ? "ticker-inferred" : undefined,
      hasSchedule,
      reviewReasons: [...new Set(reviewReasons)],
      metadata: instrumentMetadata,
    });
  }
  return rows.sort((a, b) => a.category.localeCompare(b.category) || a.ticker.localeCompare(b.ticker));
}

export function countByCategory(rows: DiscoveredInstrument[]): Record<FixedIncomeCategoryId, number> {
  return rows.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + 1;
    return acc;
  }, {} as Record<FixedIncomeCategoryId, number>);
}

export function selectFixedIncomeUniverse(rows: DiscoveredInstrument[]): FixedIncomeUniverse {
  const byCategory = FIXED_INCOME_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = [];
    return acc;
  }, {} as Record<FixedIncomeCategoryId, DiscoveredInstrument[]>);

  for (const row of rows) byCategory[row.category].push(row);

  return {
    all: rows,
    byCategory,
    calendarEligible: rows.filter(row => Boolean(row.maturity)),
    curveEligible: rows.filter(row => Boolean(row.maturity) && row.confidence !== "low"),
    calculationEligible: rows.filter(row => Boolean(row.maturity) && row.hasSchedule),
    needsReview: rows.filter(row => row.reviewReasons.length > 0),
  };
}

export function reviewLabel(status: MetadataReviewStatus) {
  if (status === "verified") return "Verificado";
  if (status === "inferred") return "Inferido";
  if (status === "needs_review") return "Revisión";
  return "No disponible";
}
