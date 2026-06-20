export function formatLargeMoney(value: number | null, currency = "USD") {
  if (value === null || !Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const prefix = currency === "ARS" ? "$" : "US$";
  if (abs >= 1_000_000_000_000) return `${prefix}${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (abs >= 1_000_000_000) return `${prefix}${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  return `${prefix}${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}

export function formatNumberMetric(value: number | null, digits = 2) {
  if (value === null || !Number.isFinite(value)) return "—";
  return value.toLocaleString("es-AR", { maximumFractionDigits: digits });
}

export function formatPercentMetric(value: number | null, options: { signed?: boolean; normalizeRatio?: boolean } = {}) {
  if (value === null || !Number.isFinite(value)) return "—";
  const normalized = options.normalizeRatio && Math.abs(value) <= 1 ? value * 100 : value;
  const sign = options.signed === false ? "" : normalized >= 0 ? "+" : "";
  return `${sign}${normalized.toFixed(2)}%`;
}

export function formatPrice(value: number | null, currency = "USD") {
  if (value === null || !Number.isFinite(value) || value <= 0) return "—";
  const prefix = currency === "ARS" ? "$" : "US$";
  return `${prefix}${value.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`;
}

export function formatDailyChange(change: number | null, changePct: number | null, currency = "USD") {
  const abs = change === null || !Number.isFinite(change)
    ? "—"
    : `${change >= 0 ? "+" : "-"}${currency === "ARS" ? "$" : "US$"}${Math.abs(change).toLocaleString("es-AR", { maximumFractionDigits: 2 })}`;
  const pct = formatPercentMetric(changePct);
  return { abs, pct };
}
