import { fetchJsonWithRetry, normalizeError } from "@/lib/api/reliability";
import { resolveEquityIdentity, type EquityAssetType } from "@/lib/equity/identity";
import { fetchBatchEquityQuotes, type NormalizedEquityQuote } from "@/lib/equity/quotes";

export const EQUITY_FUNDAMENTALS_CACHE_SECONDS = 6 * 60 * 60;
export const EQUITY_PROFILE_CACHE_SECONDS = 24 * 60 * 60;

export const INITIAL_COMPANY_DETAIL_SYMBOLS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "GOOGL",
  "AMZN",
  "META",
  "TSLA",
  "MELI",
  "YPF",
  "SPCX",
] as const;

export type EquityMetricAvailability =
  | "available"
  | "unavailable"
  | "not_applicable"
  | "estimated"
  | "stale"
  | "provider_error"
  | "private_market_not_listed";

export type EquityFundamentalsConfidence = "high" | "medium" | "low";

export type EquityFundamentalMetricKey =
  | "marketCap"
  | "enterpriseValue"
  | "peRatio"
  | "forwardPE"
  | "priceToSales"
  | "priceToBook"
  | "evToEbitda"
  | "beta"
  | "dividendYield"
  | "dividendRate"
  | "payoutRatio"
  | "eps"
  | "revenue"
  | "grossMargin"
  | "operatingMargin"
  | "netMargin"
  | "returnOnEquity"
  | "returnOnAssets"
  | "debtToEquity"
  | "freeCashFlow"
  | "averageVolume"
  | "sharesOutstanding"
  | "fiftyTwoWeekHigh"
  | "fiftyTwoWeekLow"
  | "nextEarningsDate"
  | "lastEarningsDate"
  | "analystTargetPrice"
  | "recommendation"
  | "description";

export interface EquityFundamentals {
  ticker: string;
  underlyingTicker: string;
  fundamentalsTicker: string;
  localTicker: string;
  companyName: string;
  displayName: string;
  assetType: EquityAssetType;
  market: string;
  exchange: string | null;
  country: string;
  currency: string;
  sector: string;
  industry: string;
  description: string | null;
  businessSummary: string | null;
  investorFocus: string | null;
  keyRisks: string | null;
  marketCap: number | null;
  enterpriseValue: number | null;
  peRatio: number | null;
  forwardPE: number | null;
  priceToSales: number | null;
  priceToBook: number | null;
  evToEbitda: number | null;
  beta: number | null;
  dividendYield: number | null;
  dividendRate: number | null;
  payoutRatio: number | null;
  eps: number | null;
  revenue: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
  returnOnEquity: number | null;
  returnOnAssets: number | null;
  debtToEquity: number | null;
  freeCashFlow: number | null;
  averageVolume: number | null;
  sharesOutstanding: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  nextEarningsDate: string | null;
  lastEarningsDate: string | null;
  analystTargetPrice: number | null;
  recommendation: string | null;
  quote: NormalizedEquityQuote | null;
  source: string;
  profileSource: string;
  fundamentalsSource: string;
  sourceUpdatedAt: string | null;
  fetchedAt: string;
  stale: boolean;
  confidence: EquityFundamentalsConfidence;
  availabilityStatus: EquityMetricAvailability;
  mappingConfidence: EquityFundamentalsConfidence;
  availability: Record<EquityFundamentalMetricKey, EquityMetricAvailability>;
  unavailableReason: string | null;
}

type CuratedCompanyProfile = {
  companyName: string;
  sector: string;
  industry: string;
  country: string;
  exchange: string | null;
  currency: string;
  description: string;
  businessSummary: string;
  investorFocus: string;
  keyRisks: string;
  updatedAt: string;
};

type FmpProfile = {
  symbol?: string;
  companyName?: string;
  currency?: string;
  exchangeShortName?: string;
  industry?: string;
  sector?: string;
  country?: string;
  mktCap?: number;
  beta?: number;
  volAvg?: number;
  lastDiv?: number;
  range?: string;
  description?: string;
  price?: number;
};

type FmpKeyMetrics = {
  marketCapTTM?: number;
  enterpriseValueTTM?: number;
  peRatioTTM?: number;
  priceToSalesRatioTTM?: number;
  pbRatioTTM?: number;
  enterpriseValueOverEBITDATTM?: number;
  dividendYieldTTM?: number;
  payoutRatioTTM?: number;
  netIncomePerShareTTM?: number;
  grossProfitMarginTTM?: number;
  operatingProfitMarginTTM?: number;
  netProfitMarginTTM?: number;
  returnOnEquityTTM?: number;
  returnOnAssetsTTM?: number;
  debtToEquityTTM?: number;
  freeCashFlowPerShareTTM?: number;
};

const CURATED_UPDATED_AT = "2026-06-20";

export const CURATED_COMPANY_PROFILES: Record<string, CuratedCompanyProfile> = {
  AAPL: {
    companyName: "Apple Inc.",
    sector: "Tecnologia",
    industry: "Consumer electronics / platforms",
    country: "Estados Unidos",
    exchange: "NASDAQ",
    currency: "USD",
    description: "Apple disena y vende iPhone, Mac, iPad, wearables y servicios digitales integrados alrededor de su ecosistema de hardware, software y distribucion.",
    businessSummary: "El negocio combina ventas de dispositivos premium con servicios recurrentes como App Store, iCloud, AppleCare, pagos y contenidos.",
    investorFocus: "Los inversores suelen seguir crecimiento de servicios, ciclo de iPhone, margenes brutos, recompra de acciones y adopcion de nuevos dispositivos.",
    keyRisks: "Sensibilidad al ciclo de consumo, concentracion en iPhone, regulacion de plataformas y dependencia de la cadena de suministro.",
    updatedAt: CURATED_UPDATED_AT,
  },
  MSFT: {
    companyName: "Microsoft Corporation",
    sector: "Tecnologia",
    industry: "Software / cloud infrastructure",
    country: "Estados Unidos",
    exchange: "NASDAQ",
    currency: "USD",
    description: "Microsoft provee software empresarial, sistemas operativos, infraestructura cloud, productividad, seguridad, gaming y plataformas de datos e inteligencia artificial.",
    businessSummary: "Sus motores principales son Azure, Microsoft 365, Windows, LinkedIn, Dynamics, seguridad, GitHub y Xbox.",
    investorFocus: "El mercado monitorea crecimiento de Azure, monetizacion de IA, margenes cloud, renovaciones enterprise y disciplina de gasto.",
    keyRisks: "Competencia cloud, gasto elevado en infraestructura de IA, regulacion antitrust y exposicion al ciclo de presupuestos corporativos.",
    updatedAt: CURATED_UPDATED_AT,
  },
  NVDA: {
    companyName: "NVIDIA Corporation",
    sector: "Tecnologia",
    industry: "Semiconductors / accelerated computing",
    country: "Estados Unidos",
    exchange: "NASDAQ",
    currency: "USD",
    description: "NVIDIA desarrolla GPUs, sistemas de computo acelerado, networking y software utilizados en IA, centros de datos, gaming, visualizacion profesional y automocion.",
    businessSummary: "El crecimiento reciente esta concentrado en data center, donde vende plataformas completas para entrenamiento e inferencia de inteligencia artificial.",
    investorFocus: "Los inversores siguen demanda de aceleradores de IA, capacidad de suministro, margenes, ciclo de hyperscalers y competencia ASIC/GPU.",
    keyRisks: "Ciclicidad de semiconductores, restricciones de exportacion, concentracion de clientes y normalizacion del gasto en infraestructura de IA.",
    updatedAt: CURATED_UPDATED_AT,
  },
  GOOGL: {
    companyName: "Alphabet Inc.",
    sector: "Comunicacion",
    industry: "Internet advertising / cloud",
    country: "Estados Unidos",
    exchange: "NASDAQ",
    currency: "USD",
    description: "Alphabet opera Google Search, YouTube, Android, Google Cloud y otras plataformas digitales financiadas principalmente por publicidad y servicios cloud.",
    businessSummary: "Sus ingresos dependen de busqueda y publicidad digital, con Google Cloud como segmento de crecimiento y Waymo/Other Bets como opciones de largo plazo.",
    investorFocus: "El seguimiento se centra en cuota de busqueda, monetizacion de IA, crecimiento cloud, trafico de YouTube y presion regulatoria.",
    keyRisks: "Riesgo antitrust, cambios en busqueda por IA, ciclos de publicidad digital y altos costos de infraestructura.",
    updatedAt: CURATED_UPDATED_AT,
  },
  AMZN: {
    companyName: "Amazon.com, Inc.",
    sector: "Consumo",
    industry: "E-commerce / cloud / advertising",
    country: "Estados Unidos",
    exchange: "NASDAQ",
    currency: "USD",
    description: "Amazon combina marketplace, retail propio, Prime, logistica, publicidad digital y AWS, su plataforma de infraestructura cloud.",
    businessSummary: "AWS y publicidad aportan margenes superiores, mientras marketplace y logistica escalan volumen, membresias y servicios para vendedores.",
    investorFocus: "El mercado mira crecimiento de AWS, expansion de margenes retail, advertising, capex logistico/cloud y conversion de flujo de caja.",
    keyRisks: "Competencia en cloud y e-commerce, presion salarial/logistica, regulacion de marketplace y sensibilidad del consumo.",
    updatedAt: CURATED_UPDATED_AT,
  },
  META: {
    companyName: "Meta Platforms, Inc.",
    sector: "Comunicacion",
    industry: "Social platforms / digital advertising",
    country: "Estados Unidos",
    exchange: "NASDAQ",
    currency: "USD",
    description: "Meta opera Facebook, Instagram, WhatsApp, Messenger y Reality Labs, monetizando audiencias globales principalmente mediante publicidad digital.",
    businessSummary: "El negocio principal es publicidad basada en engagement y herramientas para anunciantes, con inversiones relevantes en IA, recomendacion y realidad extendida.",
    investorFocus: "Los inversores siguen engagement, precios publicitarios, monetizacion de Reels/WhatsApp, eficiencia de gasto y avance de IA.",
    keyRisks: "Regulacion de privacidad, dependencia de publicidad, competencia por atencion y perdidas de Reality Labs.",
    updatedAt: CURATED_UPDATED_AT,
  },
  TSLA: {
    companyName: "Tesla, Inc.",
    sector: "Consumo",
    industry: "Electric vehicles / energy storage",
    country: "Estados Unidos",
    exchange: "NASDAQ",
    currency: "USD",
    description: "Tesla fabrica vehiculos electricos, baterias, sistemas de almacenamiento de energia y software asociado a conduccion asistida y gestion energetica.",
    businessSummary: "El negocio combina ventas de autos, leasing, servicios, creditos regulatorios, almacenamiento energetico y potencial monetizacion de software/autonomia.",
    investorFocus: "El foco esta en entregas, margenes automotrices, precios, adopcion de FSD, escala de energia y nuevos modelos.",
    keyRisks: "Competencia EV, presion de precios, ejecucion industrial, regulacion de autonomia y volatilidad de demanda.",
    updatedAt: CURATED_UPDATED_AT,
  },
  MELI: {
    companyName: "MercadoLibre, Inc.",
    sector: "Consumo",
    industry: "Latin American e-commerce / fintech",
    country: "Argentina",
    exchange: "NASDAQ",
    currency: "USD",
    description: "MercadoLibre opera el principal ecosistema de comercio electronico y fintech de America Latina, incluyendo marketplace, pagos, credito, logistica y publicidad.",
    businessSummary: "Sus motores son volumen bruto de mercaderia, penetracion de Mercado Pago, creditos, fulfillment y monetizacion de vendedores.",
    investorFocus: "Los inversores siguen crecimiento en Brasil, Mexico y Argentina, margenes, riesgo crediticio, take rate y expansion fintech.",
    keyRisks: "Riesgo macro latinoamericano, credito, competencia local/global, regulacion financiera y volatilidad cambiaria.",
    updatedAt: CURATED_UPDATED_AT,
  },
  YPF: {
    companyName: "YPF S.A.",
    sector: "Energia",
    industry: "Integrated oil & gas",
    country: "Argentina",
    exchange: "NYSE / BYMA",
    currency: "USD",
    description: "YPF es una compania energetica integrada argentina con operaciones de exploracion, produccion, refinacion, distribucion de combustibles y desarrollo de Vaca Muerta.",
    businessSummary: "El negocio depende de produccion upstream, precios de combustibles, refinacion, inversiones en shale oil/gas y condiciones regulatorias locales.",
    investorFocus: "El mercado sigue crecimiento de Vaca Muerta, capex, realizacion de precios, deuda, flujo de caja y politica energetica argentina.",
    keyRisks: "Regulacion local, controles de precios, riesgo cambiario, necesidades de inversion y exposicion a commodities.",
    updatedAt: CURATED_UPDATED_AT,
  },
  YPFD: {
    companyName: "YPF S.A.",
    sector: "Energia",
    industry: "Integrated oil & gas",
    country: "Argentina",
    exchange: "BYMA",
    currency: "ARS",
    description: "YPFD representa la accion local de YPF en BYMA. El analisis fundamental se referencia a la compania YPF y a su ADR cuando se usa informacion internacional.",
    businessSummary: "El negocio depende de produccion upstream, precios de combustibles, refinacion, inversiones en shale oil/gas y condiciones regulatorias locales.",
    investorFocus: "El mercado sigue crecimiento de Vaca Muerta, capex, realizacion de precios, deuda, flujo de caja y politica energetica argentina.",
    keyRisks: "Regulacion local, controles de precios, riesgo cambiario, necesidades de inversion y exposicion a commodities.",
    updatedAt: CURATED_UPDATED_AT,
  },
  SPCX: {
    companyName: "SpaceX",
    sector: "Aeroespacial",
    industry: "Private space technology",
    country: "Estados Unidos",
    exchange: null,
    currency: "USD",
    description: "SpaceX es una compania privada de tecnologia espacial. En The Big Long, SPCX se clasifica como exposicion privada/especial, no como accion publica listada.",
    businessSummary: "La compania desarrolla lanzadores reutilizables, servicios de lanzamiento, Starlink, satelites y sistemas espaciales; no publica estados financieros completos como una compania listada.",
    investorFocus: "El interes inversor suele estar vinculado a Starlink, cadencia de lanzamientos, reutilizacion, contratos gubernamentales y rondas privadas de valuacion.",
    keyRisks: "No hay cotizacion publica continua, la informacion financiera es limitada, la liquidez depende de mercados privados y las valuaciones pueden cambiar por rondas discretas.",
    updatedAt: CURATED_UPDATED_AT,
  },
};

const METRIC_KEYS: EquityFundamentalMetricKey[] = [
  "marketCap",
  "enterpriseValue",
  "peRatio",
  "forwardPE",
  "priceToSales",
  "priceToBook",
  "evToEbitda",
  "beta",
  "dividendYield",
  "dividendRate",
  "payoutRatio",
  "eps",
  "revenue",
  "grossMargin",
  "operatingMargin",
  "netMargin",
  "returnOnEquity",
  "returnOnAssets",
  "debtToEquity",
  "freeCashFlow",
  "averageVolume",
  "sharesOutstanding",
  "fiftyTwoWeekHigh",
  "fiftyTwoWeekLow",
  "nextEarningsDate",
  "lastEarningsDate",
  "analystTargetPrice",
  "recommendation",
  "description",
];

function metricAvailability(defaultStatus: EquityMetricAvailability): Record<EquityFundamentalMetricKey, EquityMetricAvailability> {
  return Object.fromEntries(METRIC_KEYS.map((key) => [key, defaultStatus])) as Record<EquityFundamentalMetricKey, EquityMetricAvailability>;
}

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function availabilityFor(value: unknown, availableStatus: EquityMetricAvailability = "available"): EquityMetricAvailability {
  return value === null || value === undefined || value === "" ? "unavailable" : availableStatus;
}

function fmpKey(): string | null {
  return process.env.FMP_API_KEY
    ?? process.env.FINANCIAL_MODELING_PREP_API_KEY
    ?? process.env.FINANCIALMODELINGPREP_API_KEY
    ?? null;
}

function parseRange(range: string | undefined): { high: number | null; low: number | null } {
  if (!range) return { high: null, low: null };
  const parts = range.split("-").map((part) => Number(part.trim())).filter((value) => Number.isFinite(value));
  if (parts.length !== 2) return { high: null, low: null };
  return { low: Math.min(parts[0], parts[1]), high: Math.max(parts[0], parts[1]) };
}

function providerTickerFor(symbol: string): string {
  const upper = symbol.trim().toUpperCase();
  if (upper === "BRKB") return "BRK.B";
  if (upper === "YPFD") return "YPF";
  if (upper === "BITF") return "KEEL";
  if (upper === "FI") return "FISV";
  if (upper === "MMC") return "MRSH";
  return upper;
}

async function fetchFmpProfile(symbol: string, key: string): Promise<{ profile: FmpProfile | null; metrics: FmpKeyMetrics | null }> {
  const providerTicker = providerTickerFor(symbol);
  const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(providerTicker)}?apikey=${encodeURIComponent(key)}`;
  const metricsUrl = `https://financialmodelingprep.com/api/v3/key-metrics-ttm/${encodeURIComponent(providerTicker)}?apikey=${encodeURIComponent(key)}`;

  const [profileResult, metricsResult] = await Promise.allSettled([
    fetchJsonWithRetry<FmpProfile[]>(profileUrl, { provider: "Financial Modeling Prep", timeoutMs: 8_000, retries: 1 }),
    fetchJsonWithRetry<FmpKeyMetrics[]>(metricsUrl, { provider: "Financial Modeling Prep", timeoutMs: 8_000, retries: 1 }),
  ]);

  return {
    profile: profileResult.status === "fulfilled" ? profileResult.value[0] ?? null : null,
    metrics: metricsResult.status === "fulfilled" ? metricsResult.value[0] ?? null : null,
  };
}

function emptyFundamentals(symbol: string, quote: NormalizedEquityQuote | null, providerError?: string): EquityFundamentals {
  const identity = resolveEquityIdentity({ ticker: symbol });
  const curated = CURATED_COMPANY_PROFILES[identity.localTicker] ?? CURATED_COMPANY_PROFILES[identity.underlyingTicker];
  const isPrivate = identity.assetType === "private_market_exposure";
  const defaultAvailability: EquityMetricAvailability = isPrivate
    ? "private_market_not_listed"
    : providerError
      ? "provider_error"
      : "unavailable";
  const availability = metricAvailability(defaultAvailability);
  if (curated) {
    availability.description = "available";
  }

  return {
    ticker: identity.localTicker,
    underlyingTicker: identity.underlyingTicker,
    fundamentalsTicker: providerTickerFor(identity.underlyingTicker),
    localTicker: identity.localTicker,
    companyName: curated?.companyName ?? identity.companyName,
    displayName: identity.displayName,
    assetType: identity.assetType,
    market: identity.market,
    exchange: curated?.exchange ?? null,
    country: curated?.country ?? identity.country,
    currency: curated?.currency ?? quote?.currency ?? "USD",
    sector: curated?.sector ?? identity.sector,
    industry: curated?.industry ?? identity.industry,
    description: curated?.description ?? null,
    businessSummary: curated?.businessSummary ?? null,
    investorFocus: curated?.investorFocus ?? null,
    keyRisks: curated?.keyRisks ?? null,
    marketCap: null,
    enterpriseValue: null,
    peRatio: null,
    forwardPE: null,
    priceToSales: null,
    priceToBook: null,
    evToEbitda: null,
    beta: null,
    dividendYield: null,
    dividendRate: null,
    payoutRatio: null,
    eps: null,
    revenue: null,
    grossMargin: null,
    operatingMargin: null,
    netMargin: null,
    returnOnEquity: null,
    returnOnAssets: null,
    debtToEquity: null,
    freeCashFlow: null,
    averageVolume: quote?.volume ?? null,
    sharesOutstanding: null,
    fiftyTwoWeekHigh: null,
    fiftyTwoWeekLow: null,
    nextEarningsDate: null,
    lastEarningsDate: null,
    analystTargetPrice: null,
    recommendation: null,
    quote,
    source: curated ? "curated_static" : "identity_static",
    profileSource: curated ? "curated_static" : "identity_static",
    fundamentalsSource: providerError ? "provider_error" : "unavailable",
    sourceUpdatedAt: curated?.updatedAt ?? null,
    fetchedAt: new Date().toISOString(),
    stale: false,
    confidence: curated ? "medium" : "low",
    availabilityStatus: isPrivate ? "private_market_not_listed" : curated ? "available" : defaultAvailability,
    mappingConfidence: identity.identityConfidence,
    availability: {
      ...availability,
      averageVolume: quote?.volume != null ? "available" : availability.averageVolume,
    },
    unavailableReason: isPrivate ? "Private-market exposure; no public-company fundamentals are available." : providerError ?? null,
  };
}

function mergeFmpFundamentals(
  symbol: string,
  quote: NormalizedEquityQuote | null,
  profile: FmpProfile | null,
  metrics: FmpKeyMetrics | null
): EquityFundamentals {
  const base = emptyFundamentals(symbol, quote);
  const range = parseRange(profile?.range);
  const marketCap = finiteNumber(profile?.mktCap) ?? finiteNumber(metrics?.marketCapTTM);
  const averageVolume = finiteNumber(profile?.volAvg) ?? quote?.volume ?? null;
  const description = profile?.description || base.description;
  const availability = {
    ...base.availability,
    marketCap: availabilityFor(marketCap),
    enterpriseValue: availabilityFor(metrics?.enterpriseValueTTM),
    peRatio: availabilityFor(metrics?.peRatioTTM),
    priceToSales: availabilityFor(metrics?.priceToSalesRatioTTM),
    priceToBook: availabilityFor(metrics?.pbRatioTTM),
    evToEbitda: availabilityFor(metrics?.enterpriseValueOverEBITDATTM),
    beta: availabilityFor(profile?.beta),
    dividendYield: availabilityFor(metrics?.dividendYieldTTM),
    dividendRate: availabilityFor(profile?.lastDiv),
    payoutRatio: availabilityFor(metrics?.payoutRatioTTM),
    eps: availabilityFor(metrics?.netIncomePerShareTTM),
    grossMargin: availabilityFor(metrics?.grossProfitMarginTTM),
    operatingMargin: availabilityFor(metrics?.operatingProfitMarginTTM),
    netMargin: availabilityFor(metrics?.netProfitMarginTTM),
    returnOnEquity: availabilityFor(metrics?.returnOnEquityTTM),
    returnOnAssets: availabilityFor(metrics?.returnOnAssetsTTM),
    debtToEquity: availabilityFor(metrics?.debtToEquityTTM),
    freeCashFlow: availabilityFor(metrics?.freeCashFlowPerShareTTM),
    averageVolume: availabilityFor(averageVolume),
    fiftyTwoWeekHigh: availabilityFor(range.high),
    fiftyTwoWeekLow: availabilityFor(range.low),
    description: availabilityFor(description),
  };

  if (base.assetType === "etf") {
    availability.enterpriseValue = "not_applicable";
    availability.evToEbitda = "not_applicable";
    availability.forwardPE = "not_applicable";
  }

  return {
    ...base,
    companyName: profile?.companyName ?? base.companyName,
    exchange: profile?.exchangeShortName ?? base.exchange,
    country: profile?.country ?? base.country,
    currency: profile?.currency ?? base.currency,
    sector: profile?.sector ?? base.sector,
    industry: profile?.industry ?? base.industry,
    description,
    marketCap,
    enterpriseValue: finiteNumber(metrics?.enterpriseValueTTM),
    peRatio: finiteNumber(metrics?.peRatioTTM),
    priceToSales: finiteNumber(metrics?.priceToSalesRatioTTM),
    priceToBook: finiteNumber(metrics?.pbRatioTTM),
    evToEbitda: finiteNumber(metrics?.enterpriseValueOverEBITDATTM),
    beta: finiteNumber(profile?.beta),
    dividendYield: finiteNumber(metrics?.dividendYieldTTM),
    dividendRate: finiteNumber(profile?.lastDiv),
    payoutRatio: finiteNumber(metrics?.payoutRatioTTM),
    eps: finiteNumber(metrics?.netIncomePerShareTTM),
    grossMargin: finiteNumber(metrics?.grossProfitMarginTTM),
    operatingMargin: finiteNumber(metrics?.operatingProfitMarginTTM),
    netMargin: finiteNumber(metrics?.netProfitMarginTTM),
    returnOnEquity: finiteNumber(metrics?.returnOnEquityTTM),
    returnOnAssets: finiteNumber(metrics?.returnOnAssetsTTM),
    debtToEquity: finiteNumber(metrics?.debtToEquityTTM),
    freeCashFlow: finiteNumber(metrics?.freeCashFlowPerShareTTM),
    averageVolume,
    fiftyTwoWeekHigh: range.high,
    fiftyTwoWeekLow: range.low,
    source: "financialmodelingprep",
    profileSource: profile ? "financialmodelingprep:profile" : base.profileSource,
    fundamentalsSource: metrics ? "financialmodelingprep:key-metrics-ttm" : "unavailable",
    sourceUpdatedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    confidence: profile ? "high" : base.confidence,
    availabilityStatus: profile || metrics ? "available" : base.availabilityStatus,
    availability,
    unavailableReason: null,
  };
}

export async function getEquityFundamentals(
  symbols: string[],
  {
    includeProviderFetch = true,
    includeQuotes = true,
  }: {
    includeProviderFetch?: boolean;
    includeQuotes?: boolean;
  } = {}
): Promise<{
  data: Record<string, EquityFundamentals>;
  providerStatuses: Array<{ provider: string; status: string; message?: string }>;
  errors: Array<{ provider: string; message: string; status?: number; symbol?: string }>;
}> {
  const uniqueSymbols = [...new Set(symbols.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean))];
  const errors: Array<{ provider: string; message: string; status?: number; symbol?: string }> = [];
  const providerStatuses: Array<{ provider: string; status: string; message?: string }> = [];
  const key = includeProviderFetch ? fmpKey() : null;
  const quoteBatch = includeQuotes ? await fetchBatchEquityQuotes(uniqueSymbols, { preferFinnhub: false }) : null;
  const data: Record<string, EquityFundamentals> = {};

  if (!key) {
    providerStatuses.push({
      provider: "Financial Modeling Prep",
      status: "unavailable",
      message: "No FMP API key configured; using curated/identity profiles only.",
    });
  }

  for (const symbol of uniqueSymbols) {
    const identity = resolveEquityIdentity({ ticker: symbol });
    const fundamentalsTicker = providerTickerFor(identity.underlyingTicker);
    const quote = quoteBatch?.quotes[symbol] ?? null;

    if (identity.assetType === "private_market_exposure" || !key) {
      data[symbol] = emptyFundamentals(symbol, quote, key ? undefined : "fundamentals_provider_not_configured");
      continue;
    }

    try {
      const { profile, metrics } = await fetchFmpProfile(fundamentalsTicker, key);
      data[symbol] = mergeFmpFundamentals(symbol, quote, profile, metrics);
    } catch (err) {
      const normalized = normalizeError(err, "Financial Modeling Prep");
      errors.push({ ...normalized, symbol });
      data[symbol] = emptyFundamentals(symbol, quote, normalized.message);
    }
  }

  if (key) {
    providerStatuses.push({
      provider: "Financial Modeling Prep",
      status: errors.length ? "partial" : "ok",
    });
  }

  return { data, providerStatuses, errors };
}
