#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const STALE_SECONDS = 4 * 24 * 60 * 60;

function extractEquities() {
  const source = fs.readFileSync(path.join(root, "lib/data/equities.ts"), "utf8");
  return [...source.matchAll(/\{t:"([^"]+)",\s*e:"([^"]+)",[\s\S]*?mkt:"([^"]+)"/g)]
    .map(([, ticker, name, market]) => ({ ticker, name, market }));
}

function normalizeSymbol(symbol) {
  return symbol.trim().toUpperCase();
}

function providerSymbol(symbol) {
  const normalized = normalizeSymbol(symbol);
  if (normalized === "BITF") return "KEEL";
  if (normalized === "FI") return "FISV";
  if (normalized === "MMC") return "MRSH";
  return normalized;
}

function isSpecial(symbol) {
  return normalizeSymbol(symbol) === "SPCX";
}

function positiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeVariation(price, previousClose, change, changePct) {
  const currentPrice = positiveNumber(price);
  const priorClose = positiveNumber(previousClose);
  if (currentPrice !== null && priorClose !== null) {
    const computedChange = currentPrice - priorClose;
    return {
      change: computedChange,
      changePct: computedChange / priorClose * 100,
      changeSource: "computed_from_previous_close",
      variationStatus: "available",
    };
  }

  const providerChange = finiteNumber(change);
  const providerChangePct = finiteNumber(changePct);
  if (providerChange !== null && providerChangePct !== null) {
    return {
      change: providerChange,
      changePct: providerChangePct,
      changeSource: "provider",
      variationStatus: "available",
    };
  }

  return {
    change: null,
    changePct: null,
    changeSource: "unavailable",
    variationStatus: "unavailable",
  };
}

function candidates(symbol) {
  const base = providerSymbol(symbol);
  const out = new Set();

  if (base === "SPCX") return [];
  if (base === "MERV") return ["^MERV", "MERV.BA"];
  if (base === "BRKB" || base === "BRK.B" || base === "BRK/B") return ["BRK-B", "BRK.B", "BRKB"];
  if (base === "YPFD") {
    out.add("YPF");
    out.add("YPF.BA");
  }

  out.add(base);
  if (base.endsWith("D") && base.length > 2) {
    const noD = base.slice(0, -1);
    out.add(noD);
    out.add(`${noD}.BA`);
  }
  if (!base.includes(".") && !base.startsWith("^")) out.add(`${base}.BA`);
  return [...out];
}

async function fetchYahoo(symbol) {
  let lastError = null;
  for (const candidate of candidates(symbol)) {
    try {
      const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(candidate)}`);
      url.searchParams.set("range", "5d");
      url.searchParams.set("interval", "1d");
      url.searchParams.set("includePrePost", "false");
      url.searchParams.set("events", "div,splits");
      const response = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) {
        lastError = `HTTP ${response.status} for ${candidate}`;
        continue;
      }
      const json = await response.json();
      const result = json.chart?.result?.[0];
      const meta = result?.meta;
      const price = meta?.regularMarketPrice;
      if (typeof price === "number" && Number.isFinite(price) && price > 0) {
        const previousClose = positiveNumber(meta?.previousClose) ?? positiveNumber(meta?.chartPreviousClose);
        const variation = normalizeVariation(
          price,
          previousClose,
          meta?.regularMarketChange,
          meta?.regularMarketChangePercent
        );
        const unixTime = meta?.regularMarketTime ?? result?.timestamp?.at?.(-1);
        const ageSeconds = unixTime ? Math.max(0, Math.floor((Date.now() - unixTime * 1000) / 1000)) : null;
        return {
          ok: true,
          resolvedSymbol: candidate,
          price,
          previousClose,
          change: variation.change,
          changePct: variation.changePct,
          changeSource: variation.changeSource,
          variationStatus: variation.variationStatus,
          currency: meta?.currency ?? "USD",
          ageSeconds,
          stale: ageSeconds !== null && ageSeconds > STALE_SECONDS,
        };
      }
      lastError = `No positive price for ${candidate}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "unknown error";
    }
  }
  return { ok: false, error: lastError ?? "No candidates resolved" };
}

async function run() {
  const equities = extractEquities();
  const rows = [];
  const batchSize = 20;

  for (let i = 0; i < equities.length; i += batchSize) {
    const batch = equities.slice(i, i + batchSize);
    const settled = await Promise.all(batch.map(async (item) => {
      if (isSpecial(item.ticker)) {
        return {
          ...item,
          status: "special",
          reason: "private_market_not_listed",
          resolvedSymbol: null,
        price: null,
        previousClose: null,
        change: null,
        changePct: null,
        variationStatus: "not_applicable",
        stale: false,
      };
      }
      const quote = await fetchYahoo(item.ticker);
      return {
        ...item,
        status: quote.ok ? "available" : "missing",
        reason: quote.ok ? null : quote.error,
        resolvedSymbol: quote.resolvedSymbol ?? null,
        price: quote.price ?? null,
        previousClose: quote.previousClose ?? null,
        change: quote.change ?? null,
        changePct: quote.changePct ?? null,
        changeSource: quote.changeSource ?? null,
        variationStatus: quote.variationStatus ?? "unavailable",
        currency: quote.currency ?? null,
        ageSeconds: quote.ageSeconds ?? null,
        stale: Boolean(quote.stale),
      };
    }));
    rows.push(...settled);
    if (i + batchSize < equities.length) await new Promise((resolve) => setTimeout(resolve, 250));
  }

  const standard = rows.filter((row) => row.status !== "special");
  const missing = standard.filter((row) => row.status === "missing");
  const stale = standard.filter((row) => row.stale);
  const missingDailyVariation = standard.filter((row) => row.status === "available" && row.variationStatus !== "available");
  const special = rows.filter((row) => row.status === "special");
  const report = {
    totalScreenerInstruments: rows.length,
    standardListedInstruments: standard.length,
    quoteAvailable: standard.length - missing.length,
    quoteMissing: missing.length,
    dailyVariationAvailable: standard.length - missing.length - missingDailyVariation.length,
    dailyVariationMissing: missingDailyVariation.length,
    staleQuote: stale.length,
    providerError: missing.length,
    specialNonListed: special.map((row) => row.ticker),
    unresolvedTickers: missing.map((row) => row.ticker),
    unresolvedDetails: missing.map((row) => ({ ticker: row.ticker, name: row.name, reason: row.reason })),
    variationMissingDetails: missingDailyVariation.map((row) => ({
      ticker: row.ticker,
      name: row.name,
      resolvedSymbol: row.resolvedSymbol,
      price: row.price,
      previousClose: row.previousClose,
      reason: "Missing defensible daily absolute and percentage variation",
    })),
    staleTickers: stale.map((row) => ({ ticker: row.ticker, resolvedSymbol: row.resolvedSymbol, ageSeconds: row.ageSeconds })),
    sample: rows.slice(0, 12).map((row) => ({
      ticker: row.ticker,
      status: row.status,
      resolvedSymbol: row.resolvedSymbol,
      price: row.price,
      previousClose: row.previousClose,
      change: row.change,
      changePct: row.changePct,
      changeSource: row.changeSource,
    })),
  };

  console.log(JSON.stringify(report, null, 2));

  if (missing.length > 0 || missingDailyVariation.length > 0) {
    process.exitCode = 1;
  }
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
