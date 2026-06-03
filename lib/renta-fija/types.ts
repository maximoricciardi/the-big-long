export type PriceQuote = { price: number; pct?: number };
export type PriceMap = Record<string, PriceQuote>;

export type DataQualityFlag =
  | "stale_ref"
  | "bad_live"
  | "tna_outlier"
  | "tir_unavailable"
  | "tna_divergence";

export interface LecapComputed {
  ticker: string;
  mes: string;
  vto: string;
  pRef: number;
  pLive: number;
  vnVto: number;
  isLive: boolean;
  priceOk: boolean;
  diasRest: number;
  tnaRef: number;
  temRef: number;
  tnaLive: number | null;
  temLive: number | null;
  rendimiento: number | null;
  isBoncap: boolean;
  flags: DataQualityFlag[];
}

export interface SovComputed {
  ticker: string;
  vto: string;
  ley: "ARG" | "NY";
  pRef: number;
  pLive: number;
  isLive: boolean;
  priceOk: boolean;
  tirRef: number;
  durRef: number;
  cyRef: number;
  tirLive: number | null;
  par: string;
  var1d: string;
  var1w: string;
  neg: boolean;
  flags: DataQualityFlag[];
}

export interface RentaFijaMarketStatus {
  loading: boolean;
  bondsOk: boolean;
  notesOk: boolean;
  matchedSov: number;
  matchedLecap: number;
  lastUpdate: Date | null;
}

export interface RentaFijaMarketSnapshot {
  bondPrices: PriceMap;
  lecapLive: PriceMap;
  lecapRows: LecapComputed[];
  sovRows: SovComputed[];
  lecapByTicker: Record<string, LecapComputed>;
  sovByTicker: Record<string, SovComputed>;
  status: RentaFijaMarketStatus;
  reload: () => void;
}
