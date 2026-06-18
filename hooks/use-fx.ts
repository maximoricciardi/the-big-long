"use client";

import { useState, useEffect } from "react";
import type { DolarData, FXRate, RiesgoPaisData } from "@/types";
import { FX_FALLBACK, RIESGO_PAIS_FALLBACK } from "@/lib/constants";

type UnknownRecord = Record<string, unknown>;

type FinancialFreshnessMeta = {
  sourceUpdatedAt?: string;
  fetchedAt?: string;
  ageSeconds?: number;
  stale?: boolean;
  staleReason?: string | null;
};

type FinancialDashboardMeta = {
  dashboard: FinancialFreshnessMeta | null;
  fx: Record<string, FinancialFreshnessMeta | null>;
  riesgoPais: FinancialFreshnessMeta | null;
};

interface UseFXResult {
  dolar:       DolarData | null;
  riesgoPais:  RiesgoPaisData | null;
  fxError:     boolean;
  loading:     boolean;
  financialMeta: FinancialDashboardMeta | null;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;

  const normalized = value.trim().replace(/\s/g, "");
  if (!normalized) return null;

  const parsed = normalized.includes(",")
    ? Number(normalized.replace(/\./g, "").replace(",", "."))
    : Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function toString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function toBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function pickRecord(record: UnknownRecord, keys: string[]): UnknownRecord | null {
  for (const key of keys) {
    const value = record[key];
    if (isRecord(value)) return value;
  }
  return null;
}

function pickValue(records: UnknownRecord[], keys: string[]): unknown {
  for (const record of records) {
    for (const key of keys) {
      if (record[key] !== undefined) return record[key];
    }
  }
  return undefined;
}

function normalizeFxArray(raw: unknown): UnknownRecord | null {
  if (!Array.isArray(raw)) return null;

  const out: UnknownRecord = {};
  raw.forEach((entry) => {
    if (!isRecord(entry)) return;
    const key = pickString(entry, ["key", "code", "type", "name", "label", "slug"]);
    if (!key) return;

    const normalized = key.toLowerCase().replace(/[\s_-]+/g, "");
    if (["official", "oficial", "dolaroficial"].includes(normalized)) out.official = entry;
    if (["blue", "dolarblue"].includes(normalized)) out.blue = entry;
    if (["mep", "bolsa", "dolarbolsa"].includes(normalized)) out.mep = entry;
    if (["ccl", "contadoconliqui", "contadoconliquidacion"].includes(normalized)) out.ccl = entry;
    if (["wholesale", "mayorista"].includes(normalized)) out.wholesale = entry;
  });

  return Object.keys(out).length > 0 ? out : null;
}

function pickNumber(record: UnknownRecord, keys: string[]): number | null {
  for (const key of keys) {
    const value = toNumber(record[key]);
    if (value !== null) return value;
  }
  return null;
}

function pickString(record: UnknownRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = toString(record[key]);
    if (value) return value;
  }
  return undefined;
}

function normalizeRate(raw: unknown, fallback: FXRate): FXRate {
  const scalarValue = toNumber(raw);
  if (scalarValue !== null) {
    return { ...fallback, compra: scalarValue, venta: scalarValue };
  }

  if (!isRecord(raw)) return fallback;

  const singleValue = pickNumber(raw, ["value", "valor", "price", "rate", "last"]);
  const compra = pickNumber(raw, ["compra", "buy", "bid", "purchase", "bidPrice"]) ?? singleValue ?? fallback.compra;
  const venta = pickNumber(raw, ["venta", "sell", "ask", "sale", "askPrice"]) ?? singleValue ?? fallback.venta;
  const casa = pickString(raw, ["casa", "name", "label", "source"]) ?? fallback.casa;

  return { ...fallback, compra, venta, casa };
}

function normalizeFreshness(raw: unknown): FinancialFreshnessMeta | null {
  if (!isRecord(raw)) return null;

  const source = isRecord(raw.meta) ? raw.meta : raw;
  const meta: FinancialFreshnessMeta = {};
  const sourceUpdatedAt = pickString(source, ["sourceUpdatedAt", "source_updated_at"]);
  const fetchedAt = pickString(source, ["fetchedAt", "fetched_at"]);
  const ageSeconds = pickNumber(source, ["ageSeconds", "age_seconds"]);
  const stale = toBoolean(source.stale);
  const staleReason = pickString(source, ["staleReason", "stale_reason"]);

  if (sourceUpdatedAt) meta.sourceUpdatedAt = sourceUpdatedAt;
  if (fetchedAt) meta.fetchedAt = fetchedAt;
  if (ageSeconds !== null) meta.ageSeconds = ageSeconds;
  if (stale !== undefined) meta.stale = stale;
  if (staleReason !== undefined) meta.staleReason = staleReason;

  return Object.keys(meta).length > 0 ? meta : null;
}

function getDashboardRoot(payload: unknown): UnknownRecord {
  if (!isRecord(payload)) return {};
  const data = isRecord(payload.data) ? payload.data : payload;
  return isRecord(data.dashboard) ? data.dashboard : data;
}

function buildDolarData(payload: unknown): { dolar: DolarData; meta: FinancialDashboardMeta } {
  const root = isRecord(payload) ? payload : {};
  const dashboard = getDashboardRoot(payload);
  const fxArrayRoot = normalizeFxArray(dashboard.fx);
  const fxRoot = fxArrayRoot ?? pickRecord(dashboard, ["fx", "dolar", "dollars", "exchangeRates", "rates"]) ?? dashboard;
  const sources = fxRoot === dashboard ? [fxRoot] : [fxRoot, dashboard];

  const officialRaw = pickValue(sources, ["official", "oficial"]);
  const blueRaw = pickValue(sources, ["blue"]);
  const mepRaw = pickValue(sources, ["mep", "bolsa"]);
  const cclRaw = pickValue(sources, ["ccl", "contadoconliqui", "contadoConLiqui"]);
  const wholesaleRaw = pickValue(sources, ["wholesale", "mayorista"]);
  const riesgoPaisRaw = pickValue(
    [dashboard, root],
    ["countryRisk", "riesgoPais", "riesgo_pais", "riskCountry", "risk"]
  );

  return {
    dolar: {
      oficial: normalizeRate(officialRaw, FX_FALLBACK.oficial),
      blue: normalizeRate(blueRaw, FX_FALLBACK.blue),
      bolsa: normalizeRate(mepRaw, FX_FALLBACK.bolsa),
      contadoconliqui: normalizeRate(cclRaw, FX_FALLBACK.contadoconliqui),
      mayorista: normalizeRate(wholesaleRaw, FX_FALLBACK.mayorista),
    },
    meta: {
      dashboard:
        normalizeFreshness(root.meta) ??
        normalizeFreshness(dashboard.meta) ??
        normalizeFreshness(root) ??
        normalizeFreshness(dashboard),
      fx: {
        official: normalizeFreshness(officialRaw),
        blue: normalizeFreshness(blueRaw),
        mep: normalizeFreshness(mepRaw),
        ccl: normalizeFreshness(cclRaw),
        wholesale: normalizeFreshness(wholesaleRaw),
      },
      riesgoPais: normalizeFreshness(riesgoPaisRaw),
    },
  };
}

function buildRiesgoPaisData(payload: unknown): RiesgoPaisData {
  const root = isRecord(payload) ? payload : {};
  const dashboard = getDashboardRoot(payload);
  const raw = pickValue(
    [dashboard, root],
    ["countryRisk", "riesgoPais", "riesgo_pais", "riskCountry", "risk"]
  );

  if (!isRecord(raw)) {
    const value = toNumber(raw);
    return value !== null ? { valor: value, fecha: "" } : RIESGO_PAIS_FALLBACK;
  }

  const valor = pickNumber(raw, ["valor", "value", "risk", "countryRisk"]) ?? RIESGO_PAIS_FALLBACK.valor;
  const fecha = pickString(raw, ["fecha", "date", "sourceUpdatedAt", "fetchedAt"]) ?? RIESGO_PAIS_FALLBACK.fecha;

  return { valor, fecha };
}

export function useFX(): UseFXResult {
  const [dolar,      setDolar]      = useState<DolarData | null>(null);
  const [riesgoPais, setRiesgoPais] = useState<RiesgoPaisData | null>(null);
  const [fxError,    setFxError]    = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [financialMeta, setFinancialMeta] = useState<FinancialDashboardMeta | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 8_000);

      try {
        const res = await fetch("/api/financial-dashboard", { signal: ctrl.signal });
        if (!res.ok) throw new Error(`Financial dashboard HTTP ${res.status}`);

        const payload: unknown = await res.json();
        const { dolar: nextDolar, meta } = buildDolarData(payload);
        setDolar(nextDolar);
        setRiesgoPais(buildRiesgoPaisData(payload));
        setFinancialMeta(meta);
        setFxError(false);
      } catch {
        setDolar(FX_FALLBACK as DolarData);
        setRiesgoPais(RIESGO_PAIS_FALLBACK);
        setFinancialMeta(null);
        setFxError(true);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { dolar, riesgoPais, fxError, loading, financialMeta };
}
