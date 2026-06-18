"use client";

import { useState, useEffect } from "react";
import type { DolarData, FXRate, RiesgoPaisData } from "@/types";
import { FX_FALLBACK, RIESGO_PAIS_FALLBACK } from "@/lib/constants";

type UnknownRecord = Record<string, unknown>;

type FinancialFreshnessMeta = {
  sourceUpdatedAt?: string;
  fetchedAt?: string;
  generatedAt?: string;
  ageSeconds?: number;
  stale?: boolean;
  staleReason?: string | null;
  cached?: boolean;
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

function normalizeLookupKey(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function pickValue(records: UnknownRecord[], keys: string[]): unknown {
  for (const record of records) {
    for (const key of keys) {
      if (record[key] !== undefined) return record[key];
    }
  }
  return undefined;
}

function pickNumberFrom(records: UnknownRecord[], keys: string[]): number | null {
  for (const record of records) {
    const value = pickNumber(record, keys);
    if (value !== null) return value;
  }
  return null;
}

function pickStringFrom(records: UnknownRecord[], keys: string[]): string | undefined {
  for (const record of records) {
    const value = pickString(record, keys);
    if (value) return value;
  }
  return undefined;
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

const FX_RATE_ALIASES: Record<string, string[]> = {
  official: ["official", "oficial", "dolar oficial", "usd oficial"],
  blue: ["blue", "dolar blue", "usd blue"],
  mep: ["mep", "bolsa", "dolar mep", "usd mep", "dolar bolsa", "usd bolsa"],
  ccl: [
    "ccl",
    "contadoconliqui",
    "contado con liqui",
    "contado con liquidacion",
    "dolar ccl",
    "usd ccl",
  ],
  wholesale: ["wholesale", "mayorista", "dolar mayorista", "usd mayorista"],
};

function buildRateKeySet(keys: string[]): Set<string> {
  const target = new Set(keys.map(normalizeLookupKey).filter((key): key is string => Boolean(key)));

  for (const aliases of Object.values(FX_RATE_ALIASES)) {
    const normalizedAliases = aliases
      .map(normalizeLookupKey)
      .filter((key): key is string => Boolean(key));

    if (normalizedAliases.some((alias) => target.has(alias))) {
      normalizedAliases.forEach((alias) => target.add(alias));
    }
  }

  return target;
}

function findRateInArray(raw: unknown, keys: string[]): unknown {
  if (!Array.isArray(raw)) return undefined;

  const target = buildRateKeySet(keys);
  for (const item of raw) {
    if (!isRecord(item)) continue;

    const identifiers = [item.type, item.key, item.code, item.name, item.label, item.casa]
      .map(normalizeLookupKey)
      .filter((key): key is string => Boolean(key));

    if (identifiers.some((identifier) => target.has(identifier))) return item;
  }

  return undefined;
}

function pickRate(raw: unknown, dashboard: UnknownRecord, keys: string[]): unknown {
  const fromArray = findRateInArray(raw, keys);
  if (fromArray !== undefined) return fromArray;

  if (isRecord(raw)) {
    const direct = pickValue([raw], keys);
    if (direct !== undefined) return direct;
  }

  return pickValue([dashboard], keys);
}

function normalizeRate(raw: unknown, fallback: FXRate): FXRate {
  const scalarValue = toNumber(raw);
  if (scalarValue !== null) {
    return { ...fallback, compra: scalarValue, venta: scalarValue };
  }

  if (!isRecord(raw)) return fallback;

  const records = isRecord(raw.data) ? [raw.data, raw] : [raw];
  const singleValue = pickNumberFrom(records, ["value", "valor", "price", "rate", "last"]);
  const compra = pickNumberFrom(records, ["compra", "buy", "bid", "purchase", "bidPrice"]) ?? singleValue ?? fallback.compra;
  const venta = pickNumberFrom(records, ["venta", "sell", "ask", "sale", "askPrice"]) ?? singleValue ?? fallback.venta;
  const casa = pickStringFrom(records, ["casa", "name", "label", "source"]) ?? fallback.casa;

  return { ...fallback, compra, venta, casa };
}

function normalizeFreshness(raw: unknown): FinancialFreshnessMeta | null {
  if (!isRecord(raw)) return null;

  const source = isRecord(raw.meta) ? raw.meta : raw;
  const meta: FinancialFreshnessMeta = {};
  const sourceUpdatedAt = pickString(source, ["sourceUpdatedAt", "source_updated_at"]);
  const fetchedAt = pickString(source, ["fetchedAt", "fetched_at"]);
  const generatedAt = pickString(source, ["generatedAt", "generated_at"]);
  const ageSeconds = pickNumber(source, ["ageSeconds", "age_seconds"]);
  const stale = toBoolean(source.stale);
  const staleReason = pickString(source, ["staleReason", "stale_reason"]);
  const cached = toBoolean(source.cached);

  if (sourceUpdatedAt) meta.sourceUpdatedAt = sourceUpdatedAt;
  if (fetchedAt) meta.fetchedAt = fetchedAt;
  if (generatedAt) meta.generatedAt = generatedAt;
  if (ageSeconds !== null) meta.ageSeconds = ageSeconds;
  if (stale !== undefined) meta.stale = stale;
  if (staleReason !== undefined) meta.staleReason = staleReason;
  if (cached !== undefined) meta.cached = cached;

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
  const fxRaw = pickValue([dashboard], ["fx", "dolar", "dollars", "exchangeRates", "rates"]) ?? dashboard;

  const officialRaw = pickRate(fxRaw, dashboard, ["official", "oficial"]);
  const blueRaw = pickRate(fxRaw, dashboard, ["blue"]);
  const mepRaw = pickRate(fxRaw, dashboard, ["mep", "bolsa"]);
  const cclRaw = pickRate(fxRaw, dashboard, ["ccl", "contadoconliqui", "contadoConLiqui"]);
  const wholesaleRaw = pickRate(fxRaw, dashboard, ["wholesale", "mayorista"]);
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
        const res = await fetch("/api/financial-dashboard", { cache: "no-store", signal: ctrl.signal });
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
