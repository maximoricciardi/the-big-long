#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const root = process.cwd();
const allowedRealStatuses = new Set([
  "official_logo",
  "curated_logo",
  "provider_verified_logo",
  "issuer_logo",
  "local_asset_logo",
]);
const allowedQualityStatuses = new Set([
  "verified_high_quality",
  "verified_acceptable",
  "issuer_acceptable",
]);
const allowedSharedLogoUrls = new Map([
  [
    "https://cdn.prod.website-files.com/6697a441a50c6b926e1972e0/682f4f060a306e6d3804523d_BYMA-isologo.svg",
    "MERV is an index and BYMA is the official market identity behind the local index presentation.",
  ],
]);

function loadIdentityResolver() {
  const sourcePath = path.join(root, "lib/equity/identity.ts");
  const source = fs.readFileSync(sourcePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const sandbox = { exports: {}, module: { exports: {} }, require, console };
  vm.runInNewContext(transpiled, sandbox, { filename: sourcePath });
  return {
    resolveEquityIdentity: sandbox.module.exports.resolveEquityIdentity || sandbox.exports.resolveEquityIdentity,
    resolveEarningsLogo: sandbox.module.exports.resolveEarningsLogo || sandbox.exports.resolveEarningsLogo,
  };
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

const { resolveEquityIdentity, resolveEarningsLogo } = loadIdentityResolver();

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

const representativeQaTickers = "AAPL MSFT NVDA GOOGL AMZN META TSLA AVGO TSM LLY JPM V MA WMT COST XOM PG JNJ KO PEP MCD NFLX CRM ORCL AMD ADBE QCOM SPGI MELI BRKB BRK.B ASML SAP NVO SHEL TM BABA SHOP UBER ABNB RACE SONY HSBC TTE AZN RIO SPCX YPF YPFD GGAL BMA SUPV PAMP CEPU TGSU2 TRAN EDN BYMA VALO TXAR ALUA LOMA COME MIRG METR CRES IRSA BBAR TGNO4 AGRO HAVA AUSO CAPX".split(/\s+/);
const argRepresentativeTickers = new Set("YPF YPFD GGAL BMA SUPV PAMP CEPU TGSU2 TRAN EDN BYMA VALO TXAR ALUA LOMA COME MIRG METR CRES IRSA BBAR TGNO4 AGRO HAVA AUSO CAPX".split(/\s+/));
const representativeEarningsTickers = "ACN MU NKE FDX LEN DRI KMX GIS PAYX CCL WBA CAG STZ RPM LEVI HELE SMPL AAPL MSFT NVDA GOOGL AMZN META TSLA CRM ORCL ADBE".split(/\s+/);
const representativeQa = representativeQaTickers.map((ticker) => ({
  scope: "representative_qa",
  ticker,
  name: ticker,
  market: argRepresentativeTickers.has(ticker) ? "ARG" : "US",
}));

const universe = uniqueByTicker([...equities, ...cedears, ...topCedears, ...representativeQa]);
const rows = universe.map((item) => {
  const identity = resolveEquityIdentity({
    ticker: item.ticker,
    name: item.name,
    market: item.market,
    sector: item.sector,
    assetType: item.market === "ETF" ? "etf" : item.market === "CEDEAR" ? "cedear" : item.ticker === "SPCX" ? "private_market_exposure" : "stock",
  });
  const hasRealLogo = Boolean(identity.logoUrl) && allowedRealStatuses.has(identity.logoStatus);
  const hasApprovedQuality = allowedQualityStatuses.has(identity.logoQuality);
  const sourceIsFragileFavicon = String(identity.logoSource).includes("clearbit") || identity.logoStatus === "domain_logo";
  const hasVisualApproval = hasRealLogo && hasApprovedQuality && !sourceIsFragileFavicon;
  const failureReasons = [
    !identity.logoUrl ? "missing_logo_url" : null,
    !allowedRealStatuses.has(identity.logoStatus) ? `unapproved_status:${identity.logoStatus}` : null,
    !hasApprovedQuality ? `unapproved_quality:${identity.logoQuality}` : null,
    sourceIsFragileFavicon ? `fragile_favicon_source:${identity.logoSource}` : null,
  ].filter(Boolean);
  return { ...item, identity, hasRealLogo, hasApprovedQuality, hasVisualApproval, failureReasons };
});

const earningsRows = representativeEarningsTickers.map((ticker) => {
  const logo = resolveEarningsLogo(ticker);
  const hasLogo = Boolean(logo.logo || logo.logoFallback);
  const primary = logo.logo ?? "";
  const fallback = logo.logoFallback ?? "";
  const usesProviderFallback = /financialmodelingprep|finnhub/i.test(primary) || /financialmodelingprep|finnhub/i.test(fallback);
  const usesEmergencyInitials = !hasLogo;
  const suspicious = !hasLogo || /clearbit/i.test(primary) || /clearbit/i.test(fallback);
  return { ticker, ...logo, hasLogo, usesProviderFallback, usesEmergencyInitials, suspicious };
});
const earningsMissing = earningsRows.filter((row) => !row.hasLogo);
const earningsSuspicious = earningsRows.filter((row) => row.suspicious);

const missing = rows.filter((row) => !row.hasVisualApproval);
const initials = rows.filter((row) => row.identity.logoStatus === "emergency_fallback" || !row.identity.logoUrl);
const screener = rows.filter((row) => row.scope === "screener");
const cedearRows = rows.filter((row) => row.scope === "cedears" || row.scope === "top_cedears");
const argRows = screener.filter((row) => row.market === "ARG");
const spcx = rows.find((row) => row.ticker === "SPCX");

const bySource = rows.reduce((acc, row) => {
  acc[row.identity.logoStatus] = (acc[row.identity.logoStatus] || 0) + 1;
  return acc;
}, {});

const byQuality = rows.reduce((acc, row) => {
  acc[row.identity.logoQuality] = (acc[row.identity.logoQuality] || 0) + 1;
  return acc;
}, {});

const byLogoUrl = rows.reduce((acc, row) => {
  if (!row.identity.logoUrl) return acc;
  if (!acc[row.identity.logoUrl]) acc[row.identity.logoUrl] = [];
  acc[row.identity.logoUrl].push(`${row.scope}:${row.ticker}->${row.identity.underlyingTicker}`);
  return acc;
}, {});
const allLogoCollisions = Object.entries(byLogoUrl)
  .filter(([, entries]) => {
    const underlyings = new Set(entries.map((entry) => entry.split("->")[1]));
    return underlyings.size > 1;
  })
  .map(([logoUrl, entries]) => ({ logoUrl, entries }));
const allowedLogoCollisions = allLogoCollisions
  .filter((collision) => allowedSharedLogoUrls.has(collision.logoUrl))
  .map((collision) => ({ ...collision, reason: allowedSharedLogoUrls.get(collision.logoUrl) }));
const suspiciousLogoCollisions = allLogoCollisions
  .filter((collision) => !allowedSharedLogoUrls.has(collision.logoUrl));
const providerOnlyLogos = rows.filter((row) => row.identity.logoStatus === "provider_verified_logo" && !row.identity.logoFallbackUrl);
const domainFaviconOnlyLogos = rows.filter((row) => String(row.identity.logoSource).includes("clearbit") || row.identity.logoStatus === "domain_logo");
const suspiciousLogoCount = missing.length + suspiciousLogoCollisions.length + domainFaviconOnlyLogos.length;
const manualReviewTickers = [
  ...missing.map((row) => `${row.scope}:${row.ticker}`),
  ...suspiciousLogoCollisions.flatMap((collision) => collision.entries),
  ...domainFaviconOnlyLogos.map((row) => `${row.scope}:${row.ticker}`),
];

const report = {
  totalInstruments: rows.length,
  screenerInstruments: screener.length,
  cedearsChecked: cedearRows.length,
  representativeQaChecked: rows.filter((row) => row.scope === "representative_qa").length,
  argentineEquitiesChecked: argRows.length,
  instrumentsWithApprovedVisualLogos: rows.length - missing.length,
  earningsTickersChecked: earningsRows.length,
  earningsLogosPresent: earningsRows.length - earningsMissing.length,
  earningsMissingLogos: earningsMissing.length,
  earningsEmergencyFallbacks: earningsRows.filter((row) => row.usesEmergencyInitials).length,
  earningsSuspiciousLogos: earningsSuspicious.length,
  earningsProviderFallbackLogos: earningsRows.filter((row) => row.usesProviderFallback).length,
  earningsTickersRequiringManualReview: earningsSuspicious.map((row) => row.ticker),
  instrumentsUsingInitials: initials.length,
  missingOrVisuallyUnapprovedLogos: missing.length,
  suspiciousLogos: suspiciousLogoCount,
  duplicateLogoUrls: suspiciousLogoCollisions.length,
  providerOnlyLogos: providerOnlyLogos.length,
  domainFaviconOnlyLogos: domainFaviconOnlyLogos.length,
  tickersRequiringManualReview: manualReviewTickers,
  unresolvedTickers: missing.map((row) => `${row.scope}:${row.ticker}`),
  unresolvedDetails: missing.map((row) => ({
    instrument: `${row.scope}:${row.ticker}`,
    logoStatus: row.identity.logoStatus,
    logoQuality: row.identity.logoQuality,
    logoSource: row.identity.logoSource,
    reasons: row.failureReasons,
  })),
  spcx: spcx ? {
    present: true,
    logoStatus: spcx.identity.logoStatus,
    logoQuality: spcx.identity.logoQuality,
    logoSource: spcx.identity.logoSource,
    assetType: spcx.identity.assetType,
  } : { present: false },
  logoStatusBreakdown: bySource,
  logoQualityBreakdown: byQuality,
  suspiciousLogoCollisions,
  allowedLogoCollisions,
  visualQualityRules: [
    "No Clearbit/domain favicon source may pass as a planned equity logo.",
    "Approved logos must be official, curated, provider-verified, issuer, or local asset logos.",
    "Approved logos must carry verified_high_quality, verified_acceptable, or issuer_acceptable quality.",
    "Initials are allowed only as runtime emergency fallback, never as planned identity.",
  ],
  logoSourceByTicker: Object.fromEntries(rows.map((row) => [
    `${row.scope}:${row.ticker}`,
    `${row.identity.logoStatus} ${row.identity.logoQuality} ${row.identity.logoSource}`,
  ])),
};

console.log(JSON.stringify(report, null, 2));

if (missing.length > 0 || initials.length > 0 || !spcx || suspiciousLogoCollisions.length > 0 || earningsMissing.length > 0 || earningsSuspicious.length > 0) {
  process.exitCode = 1;
}
