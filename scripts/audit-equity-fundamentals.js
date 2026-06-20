#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const requiredInitial = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA", "MELI", "YPF", "SPCX"];
const requiredStatuses = [
  "available",
  "unavailable",
  "not_applicable",
  "estimated",
  "stale",
  "provider_error",
  "private_market_not_listed",
];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function extractInitialSymbols(source) {
  const match = source.match(/INITIAL_COMPANY_DETAIL_SYMBOLS\s*=\s*\[([\s\S]*?)\]\s+as const/);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map(([, symbol]) => symbol);
}

function extractCuratedProfileSymbols(source) {
  const block = source.match(/CURATED_COMPANY_PROFILES:[\s\S]*?=\s*\{([\s\S]*?)\};\n\nconst METRIC_KEYS/);
  if (!block) return [];
  return [...block[1].matchAll(/\n\s{2}([A-Z0-9.]+):\s*\{/g)].map(([, symbol]) => symbol);
}

const fundamentalsSource = read("lib/equity/fundamentals.ts");
const routeSource = read("app/api/equity-fundamentals/route.ts");
const screenerSource = read("components/renta-variable/renta-variable-view.tsx");
const equitiesSource = read("lib/data/equities.ts");

const initialSymbols = extractInitialSymbols(fundamentalsSource);
const curatedSymbols = extractCuratedProfileSymbols(fundamentalsSource);
const universeSymbols = [...equitiesSource.matchAll(/\{t:"([^"]+)"/g)].map(([, symbol]) => symbol);
const missingInitialSymbols = requiredInitial.filter((symbol) => !initialSymbols.includes(symbol));
const missingCuratedProfiles = requiredInitial.filter((symbol) => !curatedSymbols.includes(symbol));
const missingFromUniverse = requiredInitial.filter((symbol) => !universeSymbols.includes(symbol));
const missingStatuses = requiredStatuses.filter((status) => !fundamentalsSource.includes(`"${status}"`));

const report = {
  initialCompanyDetailSymbols: initialSymbols,
  initialCompaniesRequired: requiredInitial,
  initialCompaniesSupported: requiredInitial.length - missingInitialSymbols.length,
  missingInitialSymbols,
  curatedProfilesAvailable: requiredInitial.length - missingCuratedProfiles.length,
  missingCuratedProfiles,
  missingFromScreenerUniverse: missingFromUniverse,
  providerArchitecturePresent: fundamentalsSource.includes("getEquityFundamentals") && fundamentalsSource.includes("fetchFmpProfile"),
  routePresent: routeSource.includes("getEquityFundamentals") && routeSource.includes("Equity Fundamentals Provider Layer"),
  drawerPresent: screenerSource.includes("CompanyDetailDrawer") && screenerSource.includes("/api/equity-fundamentals"),
  availabilityStatusesRequired: requiredStatuses,
  missingAvailabilityStatuses: missingStatuses,
  spcxTreatment: {
    curatedProfile: curatedSymbols.includes("SPCX"),
    privateMarketStatus: fundamentalsSource.includes("private_market_not_listed"),
    noPublicQuoteLanguage: fundamentalsSource.includes("no public-company fundamentals") || fundamentalsSource.includes("no listed public equity quote"),
  },
};

console.log(JSON.stringify(report, null, 2));

if (
  missingInitialSymbols.length > 0 ||
  missingCuratedProfiles.length > 0 ||
  missingFromUniverse.length > 0 ||
  missingStatuses.length > 0 ||
  !report.providerArchitecturePresent ||
  !report.routePresent ||
  !report.drawerPresent ||
  !report.spcxTreatment.curatedProfile ||
  !report.spcxTreatment.privateMarketStatus
) {
  process.exitCode = 1;
}
