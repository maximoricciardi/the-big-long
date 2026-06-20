import type { NormalizedEquityQuote } from "@/lib/equity/quote-types";

export type LivePrice = NormalizedEquityQuote;

export interface LiveHist {
  s1: number;
  m1: number;
  ytd: number;
  distHi52: number;
}

export interface EquityLive {
  t: string;
  e: string;
  p: number | null;
  mkt: string;
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
  cur?: "ARS";
  _1d: number | null;
  _1dAbs: number | null;
  _d52: number | null;
  _isAtHigh: boolean;
  _upsideVsTarget: number | null;
  _upsideVs52H: number | null;
  _up: number | null;
  up: string | null;
}

export interface EquityDetailRecord {
  ticker: string;
  underlyingTicker: string;
  fundamentalsTicker: string;
  companyName: string;
  displayName: string;
  assetType: string;
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
  mainSegments?: string[];
  keyDrivers?: string[];
  riskSensitivities?: string[];
  whyInvestorsTrack?: string | null;
  metricsFocus?: string[];
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
  quote: LivePrice | null;
  source: string;
  sourceType?: string;
  profileSource: string;
  fundamentalsSource: string;
  sourceUpdatedAt: string | null;
  fetchedAt: string;
  stale: boolean;
  confidence: string;
  availabilityStatus: string;
  mappingConfidence: string;
  unavailableReason: string | null;
}
