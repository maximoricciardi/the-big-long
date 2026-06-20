import { resolveEquityIdentity, type EquityIdentity } from "@/lib/equity/identity";

export type EquityMarket = "ARG" | "US" | "ETF" | "CEDEAR";
export type DataAvailability = "live" | "recent" | "stale" | "static" | "derived" | "special" | "unavailable";

export interface EquityQuoteLike {
  price?: number | null;
  changePct?: number | null;
  change?: number | null;
  volume?: number | null;
  high?: number | null;
  low?: number | null;
  open?: number | null;
  currency?: string | null;
  provider?: string | null;
  source?: string | null;
  fetchedAt?: string | null;
  sourceUpdatedAt?: string | null;
  stale?: boolean | null;
  freshnessStatus?: string | null;
  availabilityStatus?: string | null;
  unavailableReason?: string | null;
}

export interface EquityHistoryLike {
  s1?: number | null;
  m1?: number | null;
  ytd?: number | null;
  distHi52?: number | null;
}

export interface EquitySeedLike {
  t: string;
  e: string;
  p: number;
  mkt: "ARG" | "US" | "ETF";
  tg: number | null;
  an: string | null;
  fpe: number | null;
  rw: number | null;
  val: string | null;
  cal: string | null;
  mom: string;
  sc: number | null;
  s1: number | null;
  m1: number | null;
  ytd: number | null;
  ma: number | null;
  cur?: "ARS";
}

export interface CedearSeedLike {
  t: string;
  n: string;
  sector?: string;
}

export interface EquityIntelligenceRow {
  ticker: string;
  name: string;
  identity: EquityIdentity;
  underlyingTicker: string;
  logoUrl: string | null;
  logoFallbackUrl: string | null;
  logoSource: string;
  logoStatus: string;
  identityConfidence: string;
  fallbackInitials: string;
  market: EquityMarket;
  sector: string;
  industry: string;
  country: string;
  currency: "ARS" | "USD";
  price: number | null;
  changePct: number | null;
  volume: number | null;
  avgVolume: number | null;
  marketCap: number | null;
  beta: number | null;
  peForward: number | null;
  evEbitda: number | null;
  dividendYield: number | null;
  earningsDate: string | null;
  target: number | null;
  week1: number | null;
  month1: number | null;
  ytd: number | null;
  distance52wHigh: number | null;
  score: number | null;
  analyst: string | null;
  quality: string | null;
  valuation: string | null;
  momentum: string | null;
  liquidity: string | null;
  quoteSource: string | null;
  quoteProvider: string | null;
  quoteFreshness: string | null;
  quoteFetchedAt: string | null;
  quoteUnavailableReason: string | null;
  availability: Record<string, DataAvailability>;
  sourceNote: string;
}

export interface MarketMoverGroup {
  topGainers: EquityIntelligenceRow[];
  topLosers: EquityIntelligenceRow[];
  mostActive: EquityIntelligenceRow[];
  unusualMoves: EquityIntelligenceRow[];
}

export interface SectorIntelligence {
  sector: string;
  count: number;
  avgChangePct: number | null;
  leaders: EquityIntelligenceRow[];
  laggards: EquityIntelligenceRow[];
}

const SECTOR_BY_TICKER: Record<string, { sector: string; industry: string; country?: string }> = {
  AAPL: { sector: "Tecnologia", industry: "Consumer electronics" },
  MSFT: { sector: "Tecnologia", industry: "Software / cloud" },
  NVDA: { sector: "Tecnologia", industry: "Semiconductors" },
  AMD: { sector: "Tecnologia", industry: "Semiconductors" },
  AVGO: { sector: "Tecnologia", industry: "Semiconductors" },
  MU: { sector: "Tecnologia", industry: "Memory semiconductors" },
  INTC: { sector: "Tecnologia", industry: "Semiconductors" },
  ASML: { sector: "Tecnologia", industry: "Semiconductor equipment", country: "Paises Bajos" },
  TSM: { sector: "Tecnologia", industry: "Semiconductor foundry", country: "Taiwan" },
  QCOM: { sector: "Tecnologia", industry: "Semiconductors" },
  ARM: { sector: "Tecnologia", industry: "Semiconductor IP", country: "Reino Unido" },
  GOOGL: { sector: "Comunicacion", industry: "Internet / advertising" },
  META: { sector: "Comunicacion", industry: "Social platforms" },
  NFLX: { sector: "Comunicacion", industry: "Streaming" },
  AMZN: { sector: "Consumo", industry: "E-commerce / cloud" },
  TSLA: { sector: "Consumo", industry: "Electric vehicles" },
  MELI: { sector: "Consumo", industry: "E-commerce / fintech", country: "Argentina" },
  BABA: { sector: "Consumo", industry: "E-commerce", country: "China" },
  WMT: { sector: "Consumo", industry: "Retail" },
  COST: { sector: "Consumo", industry: "Retail" },
  MCD: { sector: "Consumo", industry: "Restaurants" },
  KO: { sector: "Consumo defensivo", industry: "Beverages" },
  PEP: { sector: "Consumo defensivo", industry: "Beverages / snacks" },
  PG: { sector: "Consumo defensivo", industry: "Household products" },
  JPM: { sector: "Financiero", industry: "Banking" },
  BAC: { sector: "Financiero", industry: "Banking" },
  GS: { sector: "Financiero", industry: "Investment banking" },
  MS: { sector: "Financiero", industry: "Investment banking" },
  WFC: { sector: "Financiero", industry: "Banking" },
  V: { sector: "Financiero", industry: "Payments" },
  MA: { sector: "Financiero", industry: "Payments" },
  AXP: { sector: "Financiero", industry: "Payments / credit" },
  BX: { sector: "Financiero", industry: "Alternative assets" },
  KKR: { sector: "Financiero", industry: "Alternative assets" },
  SCHW: { sector: "Financiero", industry: "Brokerage" },
  C: { sector: "Financiero", industry: "Banking" },
  GGAL: { sector: "Financiero", industry: "Argentine banking", country: "Argentina" },
  BMA: { sector: "Financiero", industry: "Argentine banking", country: "Argentina" },
  BBAR: { sector: "Financiero", industry: "Argentine banking", country: "Argentina" },
  SUPV: { sector: "Financiero", industry: "Argentine banking", country: "Argentina" },
  YPF: { sector: "Energia", industry: "Integrated oil & gas", country: "Argentina" },
  PAMP: { sector: "Energia", industry: "Power / utilities", country: "Argentina" },
  PAM: { sector: "Energia", industry: "Power / utilities", country: "Argentina" },
  VIST: { sector: "Energia", industry: "Oil & gas E&P", country: "Argentina" },
  CEPU: { sector: "Energia", industry: "Power generation", country: "Argentina" },
  EDN: { sector: "Utilities", industry: "Electric distribution", country: "Argentina" },
  TGS: { sector: "Energia", industry: "Gas midstream", country: "Argentina" },
  XOM: { sector: "Energia", industry: "Integrated oil & gas" },
  CVX: { sector: "Energia", industry: "Integrated oil & gas" },
  COP: { sector: "Energia", industry: "Oil & gas E&P" },
  EOG: { sector: "Energia", industry: "Oil & gas E&P" },
  OXY: { sector: "Energia", industry: "Oil & gas E&P" },
  SLB: { sector: "Energia", industry: "Oilfield services" },
  HAL: { sector: "Energia", industry: "Oilfield services" },
  DVN: { sector: "Energia", industry: "Oil & gas E&P" },
  LLY: { sector: "Salud", industry: "Pharmaceuticals" },
  JNJ: { sector: "Salud", industry: "Pharmaceuticals" },
  UNH: { sector: "Salud", industry: "Managed care" },
  ABBV: { sector: "Salud", industry: "Pharmaceuticals" },
  PFE: { sector: "Salud", industry: "Pharmaceuticals" },
  AMGN: { sector: "Salud", industry: "Biotechnology" },
  MRK: { sector: "Salud", industry: "Pharmaceuticals" },
  GLOB: { sector: "Tecnologia", industry: "IT services", country: "Argentina" },
  LOMA: { sector: "Materiales", industry: "Cement", country: "Argentina" },
  CRESY: { sector: "Real estate", industry: "Agribusiness / real estate", country: "Argentina" },
  IRS: { sector: "Real estate", industry: "Real estate", country: "Argentina" },
  TX: { sector: "Materiales", industry: "Steel", country: "Argentina" },
  VALE: { sector: "Materiales", industry: "Mining", country: "Brasil" },
  PBR: { sector: "Energia", industry: "Integrated oil & gas", country: "Brasil" },
  BBD: { sector: "Financiero", industry: "Banking", country: "Brasil" },
  NIO: { sector: "Consumo", industry: "Electric vehicles", country: "China" },
  SPY: { sector: "ETF", industry: "US broad market ETF" },
  QQQ: { sector: "ETF", industry: "US growth ETF" },
  XLE: { sector: "ETF", industry: "Energy ETF" },
  XLF: { sector: "ETF", industry: "Financials ETF" },
  XLK: { sector: "ETF", industry: "Technology ETF" },
  XLV: { sector: "ETF", industry: "Health care ETF" },
  GLD: { sector: "ETF", industry: "Gold ETF" },
  SLV: { sector: "ETF", industry: "Silver ETF" },
  EWZ: { sector: "ETF", industry: "Brazil ETF" },
  SMH: { sector: "ETF", industry: "Semiconductors ETF" },
};

function metaFor(ticker: string, market: EquityMarket, fallbackSector?: string) {
  const key = ticker.toUpperCase();
  const meta = SECTOR_BY_TICKER[key];
  return {
    sector: meta?.sector ?? fallbackSector ?? (market === "ETF" ? "ETF" : "Sin clasificar"),
    industry: meta?.industry ?? "No informado",
    country: meta?.country ?? (market === "ARG" ? "Argentina" : market === "ETF" ? "Estados Unidos" : "Estados Unidos"),
  };
}

function availability(value: unknown, fallback: DataAvailability): DataAvailability {
  return value === null || value === undefined ? "unavailable" : fallback;
}

function quoteAvailability(quote?: EquityQuoteLike): DataAvailability {
  if (!quote) return "unavailable";
  if (quote.availabilityStatus === "private_market_not_listed") return "special";
  if (quote.price == null || quote.price <= 0) return "unavailable";
  if (quote.stale) return "stale";
  if (quote.freshnessStatus === "delayed" || quote.freshnessStatus === "recent") return "recent";
  return "live";
}

function liquidityFromVolume(volume: number | null): string | null {
  if (volume === null || volume <= 0) return null;
  if (volume >= 1_000_000) return "Alta";
  if (volume >= 100_000) return "Media";
  return "Baja";
}

export function buildEquityIntelligenceRows(
  equities: EquitySeedLike[],
  quotes: Record<string, EquityQuoteLike>,
  history: Record<string, EquityHistoryLike>,
): EquityIntelligenceRow[] {
  return equities.map((equity) => {
    const quote = quotes[equity.t];
    const hist = history[equity.t];
    const metadata = metaFor(equity.t, equity.mkt);
    const identity = resolveEquityIdentity({
      ticker: equity.t,
      name: equity.e,
      market: equity.mkt,
      sector: metadata.sector,
      industry: metadata.industry,
      country: metadata.country,
      assetType: equity.mkt === "ETF" ? "etf" : equity.t === "MERV" ? "index" : "stock",
    });
    const seedPrice = equity.p > 0 ? equity.p : null;
    const price = quote?.price ?? seedPrice;
    const changePct = quote?.changePct ?? null;
    const distance52wHigh = hist?.distHi52 ?? equity.ma ?? null;

    return {
      ticker: equity.t,
      name: identity.displayName,
      identity,
      underlyingTicker: identity.underlyingTicker,
      logoUrl: identity.logoUrl,
      logoFallbackUrl: identity.logoFallbackUrl,
      logoSource: identity.logoSource,
      logoStatus: identity.logoStatus,
      identityConfidence: identity.identityConfidence,
      fallbackInitials: identity.fallbackInitials,
      market: equity.mkt,
      sector: identity.sector,
      industry: identity.industry,
      country: identity.country,
      currency: equity.cur === "ARS" ? "ARS" : "USD",
      price,
      changePct,
      volume: quote?.volume ?? null,
      avgVolume: null,
      marketCap: null,
      beta: null,
      peForward: equity.fpe,
      evEbitda: null,
      dividendYield: null,
      earningsDate: null,
      target: equity.tg,
      week1: hist?.s1 ?? equity.s1,
      month1: hist?.m1 ?? equity.m1,
      ytd: hist?.ytd ?? equity.ytd,
      distance52wHigh,
      score: equity.sc,
      analyst: equity.an,
      quality: equity.cal,
      valuation: equity.val,
      momentum: equity.mom,
      liquidity: liquidityFromVolume(quote?.volume ?? null),
      sourceNote: quote?.price != null
        ? `${quote.provider ?? "Proveedor"} · ${quote.freshnessStatus ?? "recent"} · fundamentales disponibles como snapshot interno.`
        : seedPrice != null
          ? "Precio semilla historico; sin cotizacion viva confirmada."
          : "Sin cotizacion viva confirmada; no se muestra precio ficticio.",
      quoteSource: quote?.source ?? null,
      quoteProvider: quote?.provider ?? null,
      quoteFreshness: quote?.freshnessStatus ?? null,
      quoteFetchedAt: quote?.fetchedAt ?? null,
      quoteUnavailableReason: quote?.unavailableReason ?? null,
      availability: {
        price: quoteAvailability(quote) === "unavailable" && seedPrice != null ? "static" : quoteAvailability(quote),
        changePct: availability(changePct, quote?.stale ? "stale" : "live"),
        volume: availability(quote?.volume, quote?.stale ? "stale" : "live"),
        marketCap: "unavailable",
        beta: "unavailable",
        peForward: availability(equity.fpe, "static"),
        evEbitda: "unavailable",
        dividendYield: "unavailable",
        earningsDate: "unavailable",
        history: hist ? "live" : "static",
        sector: metadata.sector === "Sin clasificar" ? "unavailable" : "static",
      },
    };
  });
}

export function buildCedearIntelligenceRows(
  cedears: CedearSeedLike[],
  quotes: Record<string, EquityQuoteLike>,
): EquityIntelligenceRow[] {
  return cedears.map((cedear) => {
    const quote = quotes[cedear.t];
    const metadata = metaFor(cedear.t, "CEDEAR", cedear.sector);
    const identity = resolveEquityIdentity({
      ticker: cedear.t,
      name: cedear.n,
      market: "CEDEAR",
      sector: metadata.sector,
      industry: metadata.industry,
      country: metadata.country,
      assetType: metadata.sector === "ETF" || cedear.sector === "ETF" ? "etf" : "cedear",
    });
    const volume = quote?.volume ?? null;

    return {
      ticker: cedear.t,
      name: identity.displayName,
      identity,
      underlyingTicker: identity.underlyingTicker,
      logoUrl: identity.logoUrl,
      logoFallbackUrl: identity.logoFallbackUrl,
      logoSource: identity.logoSource,
      logoStatus: identity.logoStatus,
      identityConfidence: identity.identityConfidence,
      fallbackInitials: identity.fallbackInitials,
      market: "CEDEAR",
      sector: identity.sector,
      industry: identity.industry,
      country: identity.country,
      currency: "ARS",
      price: quote?.price ?? null,
      changePct: quote?.changePct ?? null,
      volume,
      avgVolume: null,
      marketCap: null,
      beta: null,
      peForward: null,
      evEbitda: null,
      dividendYield: null,
      earningsDate: null,
      target: null,
      week1: null,
      month1: null,
      ytd: null,
      distance52wHigh: null,
      score: null,
      analyst: null,
      quality: null,
      valuation: null,
      momentum: null,
      liquidity: liquidityFromVolume(volume),
      quoteSource: quote?.source ?? null,
      quoteProvider: quote?.provider ?? null,
      quoteFreshness: quote?.freshnessStatus ?? null,
      quoteFetchedAt: quote?.fetchedAt ?? null,
      quoteUnavailableReason: quote?.unavailableReason ?? null,
      availability: {
        price: quoteAvailability(quote),
        changePct: availability(quote?.changePct, quote?.stale ? "stale" : "live"),
        volume: availability(volume, quote?.stale ? "stale" : "live"),
        marketCap: "unavailable",
        beta: "unavailable",
        peForward: "unavailable",
        evEbitda: "unavailable",
        dividendYield: "unavailable",
        earningsDate: "unavailable",
        history: "unavailable",
        sector: metadata.sector === "Sin clasificar" ? "unavailable" : "static",
      },
      sourceNote: quote?.price != null
        ? "Precio y volumen DATA912; metadata de compania clasificada internamente."
        : "Sin precio DATA912 disponible para el simbolo.",
    };
  });
}

function byChange(rows: EquityIntelligenceRow[], dir: 1 | -1): EquityIntelligenceRow[] {
  return rows
    .filter((row) => row.changePct !== null)
    .sort((a, b) => ((a.changePct ?? 0) - (b.changePct ?? 0)) * dir)
    .slice(0, 5);
}

export function buildMarketMovers(rows: EquityIntelligenceRow[]): MarketMoverGroup {
  const withVolume = rows.filter((row) => row.volume !== null && row.volume > 0);
  const withChange = rows.filter((row) => row.changePct !== null);
  return {
    topGainers: byChange(withChange, -1),
    topLosers: byChange(withChange, 1),
    mostActive: withVolume.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0)).slice(0, 5),
    unusualMoves: withChange
      .filter((row) => Math.abs(row.changePct ?? 0) >= 3)
      .sort((a, b) => Math.abs(b.changePct ?? 0) - Math.abs(a.changePct ?? 0))
      .slice(0, 5),
  };
}

export function buildSectorIntelligence(rows: EquityIntelligenceRow[]): SectorIntelligence[] {
  const bySector = new Map<string, EquityIntelligenceRow[]>();
  rows.forEach((row) => {
    if (row.sector === "Sin clasificar") return;
    const current = bySector.get(row.sector) ?? [];
    current.push(row);
    bySector.set(row.sector, current);
  });

  return Array.from(bySector.entries()).map(([sector, sectorRows]) => {
    const withChange = sectorRows.filter((row) => row.changePct !== null);
    const avgChangePct = withChange.length
      ? withChange.reduce((sum, row) => sum + (row.changePct ?? 0), 0) / withChange.length
      : null;
    return {
      sector,
      count: sectorRows.length,
      avgChangePct,
      leaders: byChange(withChange, -1).slice(0, 3),
      laggards: byChange(withChange, 1).slice(0, 3),
    };
  }).sort((a, b) => {
    if (a.avgChangePct === null && b.avgChangePct === null) return b.count - a.count;
    if (a.avgChangePct === null) return 1;
    if (b.avgChangePct === null) return -1;
    return b.avgChangePct - a.avgChangePct;
  });
}

export function formatUnavailable(label = "No disponible"): string {
  return label;
}
