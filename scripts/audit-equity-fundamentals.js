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
const qualityFields = ["mainSegments", "keyDrivers", "riskSensitivities", "metricsFocus"];
const requiredProfileFields = [
  "description",
  "businessSummary",
  "investorFocus",
  "keyRisks",
  "whyInvestorsTrack",
  "sourceType",
  "updatedAt",
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
  const block = source.match(/CURATED_COMPANY_PROFILES:[\s\S]*?=\s*\{([\s\S]*?)\};/);
  if (!block) return [];
  return [...block[1].matchAll(/\n\s{2}([A-Z0-9.]+):\s*\{/g)].map(([, symbol]) => symbol);
}

function extractProfileBlock(source, symbol) {
  const match = source.match(new RegExp(`\\n\\s{2}${symbol}:\\s*\\{([\\s\\S]*?)\\n\\s{2}\\},`));
  return match?.[1] ?? "";
}

function stringField(block, field) {
  const match = block.match(new RegExp(`${field}:\\s*"([^"]*)"`));
  return match?.[1] ?? "";
}

function arrayCount(block, field) {
  const match = block.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`));
  if (!match) return 0;
  return [...match[1].matchAll(/"([^"]+)"/g)].length;
}

function profileQualityIssues(source, symbol) {
  const block = extractProfileBlock(source, symbol);
  const issues = [];
  if (!block) return [`${symbol}: missing profile block`];

  requiredProfileFields.forEach((field) => {
    if (!block.includes(`${field}:`)) issues.push(`${symbol}: missing ${field}`);
  });

  const description = stringField(block, "description");
  const businessSummary = stringField(block, "businessSummary");
  const investorFocus = stringField(block, "investorFocus");
  const keyRisks = stringField(block, "keyRisks");
  const whyInvestorsTrack = stringField(block, "whyInvestorsTrack");

  if (description.length < 120) issues.push(`${symbol}: description too thin`);
  if (businessSummary.length < 120) issues.push(`${symbol}: businessSummary too thin`);
  if (investorFocus.length < 90) issues.push(`${symbol}: investorFocus too thin`);
  if (keyRisks.length < 80) issues.push(`${symbol}: keyRisks too thin`);
  if (whyInvestorsTrack.length < 70) issues.push(`${symbol}: whyInvestorsTrack too thin`);

  qualityFields.forEach((field) => {
    if (arrayCount(block, field) < 4) issues.push(`${symbol}: ${field} needs at least 4 items`);
  });

  if (!block.includes('sourceType: "curated_static"')) issues.push(`${symbol}: sourceType must be curated_static`);
  if (!block.includes("updatedAt: CURATED_UPDATED_AT")) issues.push(`${symbol}: updatedAt must use CURATED_UPDATED_AT`);
  if (/"(buy|sell|strong buy|price target|upside)"/i.test(block)) issues.push(`${symbol}: profile contains recommendation-like language`);

  return issues;
}

const fundamentalsSource = read("lib/equity/fundamentals.ts");
const profilesSource = read("lib/equity/company-profiles.ts");
const routeSource = read("app/api/equity-fundamentals/route.ts");
const drawerSource = read("components/equity/company-detail-drawer.tsx");
const equitiesSource = read("lib/data/equities.ts");

const initialSymbols = extractInitialSymbols(profilesSource);
const curatedSymbols = extractCuratedProfileSymbols(profilesSource);
const universeSymbols = [...equitiesSource.matchAll(/\{t:"([^"]+)"/g)].map(([, symbol]) => symbol);
const missingInitialSymbols = requiredInitial.filter((symbol) => !initialSymbols.includes(symbol));
const missingCuratedProfiles = requiredInitial.filter((symbol) => !curatedSymbols.includes(symbol));
const missingFromUniverse = requiredInitial.filter((symbol) => !universeSymbols.includes(symbol));
const missingStatuses = requiredStatuses.filter((status) => !fundamentalsSource.includes(`"${status}"`));
const qualityIssues = requiredInitial.flatMap((symbol) => profileQualityIssues(profilesSource, symbol));

const report = {
  initialCompanyDetailSymbols: initialSymbols,
  initialCompaniesRequired: requiredInitial,
  initialCompaniesSupported: requiredInitial.length - missingInitialSymbols.length,
  missingInitialSymbols,
  curatedProfilesAvailable: requiredInitial.length - missingCuratedProfiles.length,
  missingCuratedProfiles,
  missingFromScreenerUniverse: missingFromUniverse,
  profileQualityIssues: qualityIssues,
  providerArchitecturePresent:
    fundamentalsSource.includes("getEquityFundamentals") &&
    fundamentalsSource.includes("fetchFmpProfile") &&
    fundamentalsSource.includes("CURATED_COMPANY_PROFILES") &&
    !fundamentalsSource.includes("financialmodelingprep.com/api"),
  routePresent: routeSource.includes("getEquityFundamentals") && routeSource.includes("Equity Fundamentals Provider Layer"),
  drawerPresent:
    drawerSource.includes("CompanyDetailDrawer") &&
    drawerSource.includes("Business Overview") &&
    drawerSource.includes("Investor Lens") &&
    drawerSource.includes("Fundamentals Snapshot") &&
    drawerSource.includes("Data Quality"),
  lazyLoadPresent: read("components/renta-variable/renta-variable-view.tsx").includes("/api/equity-fundamentals?symbols=${encodeURIComponent(selectedTicker)}"),
  availabilityStatusesRequired: requiredStatuses,
  missingAvailabilityStatuses: missingStatuses,
  spcxTreatment: {
    curatedProfile: curatedSymbols.includes("SPCX"),
    privateMarketStatus: fundamentalsSource.includes("private_market_not_listed"),
    noPublicQuoteLanguage: fundamentalsSource.includes("no public-company fundamentals") || profilesSource.includes("no cotiza continuamente"),
  },
};

console.log(JSON.stringify(report, null, 2));

if (
  missingInitialSymbols.length > 0 ||
  missingCuratedProfiles.length > 0 ||
  missingFromUniverse.length > 0 ||
  missingStatuses.length > 0 ||
  qualityIssues.length > 0 ||
  !report.providerArchitecturePresent ||
  !report.routePresent ||
  !report.drawerPresent ||
  !report.lazyLoadPresent ||
  !report.spcxTreatment.curatedProfile ||
  !report.spcxTreatment.privateMarketStatus
) {
  process.exitCode = 1;
}
