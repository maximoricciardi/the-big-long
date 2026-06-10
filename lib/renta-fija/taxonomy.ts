import type { PriceMap } from "./types";

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

export function classifyFixedIncomeTicker(ticker: string): {
  category: FixedIncomeCategoryId;
  confidence: "high" | "medium" | "low";
} {
  const t = ticker.toUpperCase();
  const base = t.length > 4 ? t.replace(/[CD]$/, "") : t;
  if (STATIC_SOV.has(t) || STATIC_SOV.has(base) || SOV_PREFIXES.some(prefix => t.startsWith(prefix))) return { category: "sovereign", confidence: "high" };
  if (STATIC_CER.has(t) || STATIC_CER.has(base) || /^TZX/.test(t) || /^TX\d/.test(t)) return { category: "cer", confidence: "high" };
  if (/^(BP|BPO|BU)/.test(t)) return { category: "bopreal", confidence: "medium" };
  if (/^(D|TZV)/.test(t)) return { category: "dollar_linked", confidence: "medium" };
  if (/^(TT|X)/.test(t)) return { category: "dual", confidence: "medium" };
  if (/^S/.test(t) || /^LB/.test(t)) return { category: "lecap", confidence: "medium" };
  if (/^T/.test(t)) return { category: "boncap", confidence: "medium" };
  return { category: "corporate", confidence: "low" };
}

export function discoverFixedIncomeUniverse(maps: { bonds: PriceMap; notes: PriceMap }): DiscoveredInstrument[] {
  const rows: DiscoveredInstrument[] = [];
  for (const [ticker, quote] of Object.entries({ ...maps.bonds, ...maps.notes })) {
    if (!quote?.price || quote.price <= 0) continue;
    const { category, confidence } = classifyFixedIncomeTicker(ticker);
    const def = FIXED_INCOME_CATEGORIES.find(c => c.id === category);
    rows.push({
      ticker,
      category,
      label: def?.label ?? "Otros",
      price: quote.price,
      pct: quote.pct,
      source: "DATA912",
      confidence,
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
