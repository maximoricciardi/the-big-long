import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UPSTREAM_TIMEOUT_MS = 12_000;
const CACHE_SECONDS = 60;
const STALE_SECONDS = 120;

type CedearQuote = { price: number; pct: number; vol: number };
type CedearRawRow = { symbol?: string; c?: number; pct_change?: number; v?: number };
type RailwayError = { provider?: string; message?: string; status?: number };

type RailwayCedearsResponse = {
  data?: {
    map?: Record<string, CedearQuote>;
    raw?: CedearRawRow[];
    count?: number;
    source?: string;
    sourceUpdatedAt?: string | null;
    fetchedAt?: string;
    stale?: boolean;
    staleReason?: string | null;
  };
  meta?: {
    generatedAt?: string;
    cached?: boolean;
    stale?: boolean;
    sources?: string[];
    errors?: RailwayError[];
  };
};

function buildCedearsUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/v1/market-data/argentina/cedears`;
}

function addAliases(map: Record<string, CedearQuote>, symbol: string, value: CedearQuote) {
  map[symbol] = value;
  map[symbol.toUpperCase()] = value;

  if (symbol.endsWith("D") && symbol.length > 2) {
    const noD = symbol.slice(0, -1);
    map[noD] = value;
    map[noD.toUpperCase()] = value;
  }

  const upper = symbol.toUpperCase();
  if (upper === "BRKBD" || upper === "BRKB") {
    map["BRK.B"] = value;
    map["BRK/B"] = value;
    map["BRKB"] = value;
  }
}

function normalizeErrors(errors: RailwayError[] | undefined): RailwayError[] {
  if (!Array.isArray(errors)) return [];
  return errors.slice(0, 5).map((error) => ({
    provider: typeof error.provider === "string" ? error.provider : "financial-data-api",
    message: typeof error.message === "string" ? error.message : "Upstream source error",
    ...(typeof error.status === "number" ? { status: error.status } : {}),
  }));
}

function normalizePayload(payload: RailwayCedearsResponse, startedAt: number) {
  const data = payload.data ?? {};
  const raw = Array.isArray(data.raw) ? data.raw : [];
  const map: Record<string, CedearQuote> = {};

  Object.entries(data.map ?? {}).forEach(([symbol, quote]) => {
    if (!symbol || quote?.price == null) return;
    addAliases(map, symbol, {
      price: quote.price,
      pct: quote.pct ?? 0,
      vol: quote.vol ?? 0,
    });
  });

  raw.forEach((row) => {
    if (!row.symbol || row.c == null) return;
    addAliases(map, row.symbol, {
      price: row.c,
      pct: row.pct_change ?? 0,
      vol: row.v ?? 0,
    });
  });

  const count = data.count ?? (raw.length || Object.keys(map).length);
  const upstreamErrors = normalizeErrors(payload.meta?.errors);
  const stale = Boolean(data.stale ?? payload.meta?.stale);
  const hasData = count > 0 && Object.keys(map).length > 0;
  let status: "ok" | "partial" | "empty" = "empty";
  if (hasData) status = stale || upstreamErrors.length > 0 ? "partial" : "ok";

  return {
    map,
    raw,
    count,
    sample: raw.slice(0, 3).map((row) => row.symbol).filter(Boolean),
    ts: Date.now(),
    _meta: {
      provider: data.source ?? "DATA912",
      source: data.source ?? "DATA912",
      upstream: "financial-data-api",
      status,
      fetchedAt: data.fetchedAt ?? payload.meta?.generatedAt ?? new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
      cacheSeconds: CACHE_SECONDS,
      staleAfterSeconds: STALE_SECONDS,
      sourceUpdatedAt: data.sourceUpdatedAt ?? null,
      stale,
      staleReason: data.staleReason ?? null,
      cached: Boolean(payload.meta?.cached),
      sources: payload.meta?.sources ?? [data.source ?? "DATA912"],
      errors: upstreamErrors,
    },
  };
}

function sanitizedError(startedAt: number, status = 502) {
  return NextResponse.json(
    {
      error: "CEDEARs data unavailable",
      map: {},
      raw: [],
      count: 0,
      sample: [],
      ts: Date.now(),
      _meta: {
        provider: "financial-data-api",
        source: "DATA912",
        upstream: "financial-data-api",
        status: "error",
        fetchedAt: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        cacheSeconds: 0,
        staleAfterSeconds: 0,
        sourceUpdatedAt: null,
        stale: true,
        staleReason: "upstream_unavailable",
        cached: false,
        sources: ["DATA912"],
        errors: [{ provider: "financial-data-api", message: "CEDEARs data unavailable" }],
      },
    },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

export async function GET() {
  const startedAt = Date.now();
  const baseUrl = process.env.FINANCIAL_API_URL;
  const token = process.env.FINANCIAL_API_TOKEN;

  if (!baseUrl || !token) {
    return sanitizedError(startedAt, 500);
  }

  try {
    const response = await fetch(buildCedearsUrl(baseUrl), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!response.ok) {
      return sanitizedError(startedAt);
    }

    const payload = await response.json() as RailwayCedearsResponse;
    if (!payload.data || !payload.data.map) {
      return sanitizedError(startedAt);
    }

    return NextResponse.json(normalizePayload(payload, startedAt), {
      headers: {
        "Cache-Control": `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      },
    });
  } catch {
    return sanitizedError(startedAt);
  }
}
