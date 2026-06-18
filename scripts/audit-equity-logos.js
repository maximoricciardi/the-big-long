#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const root = process.cwd();
const allowedRealStatuses = new Set([
  "official_logo",
  "provider_logo",
  "curated_logo",
  "domain_logo",
  "local_asset_logo",
]);

function loadIdentityResolver() {
  const sourcePath = path.join(root, "lib/equity/identity.ts");
  const source = fs.readFileSync(sourcePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const sandbox = { exports: {}, module: { exports: {} }, require, console };
  vm.runInNewContext(transpiled, sandbox, { filename: sourcePath });
  return sandbox.module.exports.resolveEquityIdentity || sandbox.exports.resolveEquityIdentity;
}

function extractObjects(filePath, regex, mapEntry) {
  const source = fs.readFileSync(path.join(root, filePath), "utf8");
  return [...source.matchAll(regex)].map(mapEntry);
}

function uniqueByTicker(rows) {
  const out = new Map();
  rows.forEach((row) => {
    const key = `${row.scope}:${row.ticker}`;
    if (!out.has(key)) out.set(key, row);
  });
  return [...out.values()];
}

const resolveEquityIdentity = loadIdentityResolver();

const equities = extractObjects(
  "lib/data/equities.ts",
  /\{t:"([^"]+)",\s*e:"([^"]+)",[\s\S]*?mkt:"([^"]+)"/g,
  ([, ticker, name, market]) => ({ scope: "screener", ticker, name, market })
);

const cedears = extractObjects(
  "components/renta-variable/cedears-panel.tsx",
  /\{t:"([^"]+)",n:"([^"]+)",s:"([^"]+)"\}/g,
  ([, ticker, name, sector]) => ({ scope: "cedears", ticker, name, market: "CEDEAR", sector })
);

const topCedears = extractObjects(
  "components/renta-variable/renta-variable-view.tsx",
  /\{ t:"([^"]+)",\s+n:"([^"]+)",\s+sector:"([^"]+)" \}/g,
  ([, ticker, name, sector]) => ({ scope: "top_cedears", ticker, name, market: "CEDEAR", sector })
);

const universe = uniqueByTicker([...equities, ...cedears, ...topCedears]);
const rows = universe.map((item) => {
  const identity = resolveEquityIdentity({
    ticker: item.ticker,
    name: item.name,
    market: item.market,
    sector: item.sector,
    assetType: item.market === "ETF" ? "etf" : item.market === "CEDEAR" ? "cedear" : item.ticker === "SPCX" ? "private_market_exposure" : "stock",
  });
  const hasRealLogo = Boolean(identity.logoUrl) && allowedRealStatuses.has(identity.logoStatus);
  return { ...item, identity, hasRealLogo };
});

const missing = rows.filter((row) => !row.hasRealLogo);
const initials = rows.filter((row) => row.identity.logoStatus === "emergency_fallback" || !row.identity.logoUrl);
const screener = rows.filter((row) => row.scope === "screener");
const cedearRows = rows.filter((row) => row.scope === "cedears" || row.scope === "top_cedears");
const argRows = screener.filter((row) => row.market === "ARG");
const spcx = rows.find((row) => row.ticker === "SPCX");

const bySource = rows.reduce((acc, row) => {
  acc[row.identity.logoStatus] = (acc[row.identity.logoStatus] || 0) + 1;
  return acc;
}, {});

const report = {
  totalInstruments: rows.length,
  screenerInstruments: screener.length,
  cedearsChecked: cedearRows.length,
  argentineEquitiesChecked: argRows.length,
  instrumentsWithRealLogos: rows.length - missing.length,
  instrumentsUsingInitials: initials.length,
  missingOrBrokenPlannedLogos: missing.length,
  unresolvedTickers: missing.map((row) => `${row.scope}:${row.ticker}`),
  spcx: spcx ? {
    present: true,
    logoStatus: spcx.identity.logoStatus,
    logoSource: spcx.identity.logoSource,
    assetType: spcx.identity.assetType,
  } : { present: false },
  logoStatusBreakdown: bySource,
  logoSourceByTicker: Object.fromEntries(rows.map((row) => [
    `${row.scope}:${row.ticker}`,
    `${row.identity.logoStatus} ${row.identity.logoSource}`,
  ])),
};

console.log(JSON.stringify(report, null, 2));

if (missing.length > 0 || initials.length > 0 || !spcx) {
  process.exitCode = 1;
}
