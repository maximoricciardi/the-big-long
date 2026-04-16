/* ── FX / Dólar ─────────────────────────────────────────────── */
export interface FXRate {
  compra: number;
  venta:  number;
  casa?:  string;
}

export interface DolarData {
  oficial:          FXRate;
  blue:             FXRate;
  bolsa:            FXRate;
  contadoconliqui:  FXRate;
  mayorista:        FXRate;
}

export interface RiesgoPaisData {
  valor: number;
  fecha: string;
}

/* ── Finnhub quotes ──────────────────────────────────────────── */
export interface QuoteData {
  c:  number; // current price
  d:  number; // change
  dp: number; // change percent
  h:  number; // high
  l:  number; // low
  o:  number; // open
  pc: number; // previous close
}

export interface BatchPrice {
  price:     number;
  change:    number;
  changePct: number;
  high:      number;
  low:       number;
  open:      number;
}

export interface BatchResult {
  prices:  Record<string, BatchPrice>;
  matched: number;
  total:   number;
  ts:      number;
}

/* ── Live market (header ticker) ──────────────────────────── */
export interface LiveMarket {
  spy?:         { price: number; changePct: number };
  gold?:        { price: number; changePct: number };
  brent?:       { price: number; changePct: number };
  mervalARS?:   { value: number; changePct: number };
  topArgStock?: { ticker: string; price: number; changePct: number };
}

/* ── Renta Fija instruments ───────────────────────────────── */
export interface LecapRow {
  t:    string;
  pre:  string;
  r:    string;
  tna:  string;
  tem:  string;
  fxbe: string;
}

export interface LecapMes {
  mes:  string;
  vto:  string;
  dias: number;
  rows: LecapRow[];
}

export interface DualBond {
  t:       string;
  vto:     string;
  dias:    number;
  temFija: string;
  tnaFija: string;
  temVar:  string;
  tnaVar:  string;
  fxbe:    string;
}

export interface TamarBond {
  t:    string;
  vto:  string;
  dias: number;
  rend: string;
  tna:  string;
  tem:  string;
  fxbe: string;
}

export interface DolarLinkedBond {
  t:    string;
  vto:  string;
  dias: number;
  pre:  string;
  rend: string;
  tna:  string;
}

export interface CerBond {
  t:     string;
  desc:  string;
  vto:   string;
  cupCer: number;
  tipo:  string;
  ley:   string;
  amort: string;
}

export interface SoberanoBond {
  t:      string;
  vto:    string;
  p:      string;
  tir:    string;
  sprd:   string;
  cy:     string;
  dur:    number;
  pago:   string;
  ley:    string;
  par:    string;
  var1d:  string;
  var1w:  string;
  neg:    boolean;
}

/* ── Fondos / ETPs ────────────────────────────────────────── */
export interface Fondo {
  nombre:     string;
  ticker:     string;
  rescate:    string;
  tipo:       string;
  url:        string;
  note?:      string | undefined;
  destacado?: boolean | undefined;
}

export interface FondoCategory {
  cat:       string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon:      React.ComponentType<any>;
  color:     string;
  moneda:    string;
  desc:      string;
  destacado?: string;
  fondos:    Fondo[];
}

export interface ETPRend {
  m1:         number | null;
  m3:         number | null;
  m6:         number | null;
  y1:         number | null;
  ytd:        number | null;
  y2024:      number | null;
  sinceInc:   number | null;
}

export interface ETPTop3 {
  n: string;
  w: string;
}

export interface ETP {
  id:         string;
  nombre:     string;
  tipo:       string;
  perfil:     string;
  color:      string;
  tagline:    string;
  desc:       string;
  aum:        string;
  nav:        string;
  ytm:        string | null;
  duration:   string | null;
  fee:        string;
  rating:     string | null;
  isin:       string;
  inicio:     string;
  rend:       ETPRend;
  top3:       ETPTop3[];
  highlight:  string;
}

/* ── Perfiles de inversión ───────────────────────────────── */
export interface PerfilIdea {
  inst:  string;
  por:   string;
  note:  string;
  tipo:  string;
}

export interface Perfil {
  id:         string;
  label:      string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon:       React.ComponentType<any>;
  color:      string;
  desc:       string;
  ideas:      PerfilIdea[];
  retorno:    string;
  riesgo:     string;
  disclaimer: string;
}

/* ── Informes / Noticias ─────────────────────────────────── */
export interface Noticia {
  id:          string;
  fecha:       string;
  cat:         string;
  catColor:    string;
  seccion:     string;
  estrella?:   boolean;
  titulo:      string;
  subtitulo?:  string;
  emoji?:      string;
  relevancia?: string;
  cuerpo:      string;
}

/* ── Summaries / KPIs ─────────────────────────────────────── */
export interface KpiItem {
  k:   string;
  v:   string;
  b:   string;
  bc:  string;
}

export interface SummaryCard {
  icon?:     string;
  cat:       string;
  ac:        string;
  title:     string;
  note?:     string;
  rows?:     { l: string; v: string; b?: string; bc?: string }[];
  quote?:    string;
  quoteBy?:  string;
}

export interface IntlData {
  n:   string;
  v:   string;
  ch:  string;
  neg: boolean;
}

export interface Summary {
  id:             string;
  date:           string;
  label:          string;
  kpis:           KpiItem[];
  dato?:          string;
  cards:          SummaryCard[];
  intl?:          IntlData[] | null;
  intlNote?:      string;
  intlDestacados?: { t: string; ch: string; neg: boolean }[];
  alert?:         { type: string; text: string };
}

/* ── Micron earnings ─────────────────────────────────────── */
export interface MicronBeat {
  label: string;
  desc:  string;
}

export interface MicronRow {
  label: string;
  valor: string;
  badge?: string;
  bc?:   string;
}

export interface MicronGuidance {
  label:  string;
  valor:  string;
  est:    string;
  beat?:  string;
  isBar?: boolean;
}

export interface MicronData {
  ticker:       string;
  nombre:       string;
  exchange:     string;
  periodo:      string;
  reportado:    string;
  headline:     string;
  headlineSub:  string;
  beats:        MicronBeat[];
  resultados:   MicronRow[];
  rentabilidad: MicronRow[];
  guidance:     MicronGuidance[];
  analisis:     string;
}

/* ── Admin / Extra published content ─────────────────────── */
export interface ExtraItem {
  id:       string;
  date:     string;
  type:     string;
  title:    string;
  content:  string;
  kpis?:    KpiItem[];
}

/* ── Tab definition ──────────────────────────────────────── */
export interface TabDef {
  id:    string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon:  React.ComponentType<any>;
  desc:  string;
}

/* ── Theme tokens (runtime object) ──────────────────────── */
export interface ThemeTokens {
  bg:    string;
  srf:   string;
  alt:   string;
  brd:   string;
  tx:    string;
  mu:    string;
  fa:    string;
  go:    string;
  goBg:  string;
  goAcc: string;
  gr:    string;
  grBg:  string;
  grAcc: string;
  rd:    string;
  rdBg:  string;
  rdAcc: string;
  bl:    string;
  blBg:  string;
  blAcc: string;
  pu:    string;
  puBg:  string;
  hdr:   string;
  tick:  string;
  tickT: string;
  ft:    string;
  ftT:   string;
  sh:    string;
  badge: {
    green:  { bg: string; tx: string };
    red:    { bg: string; tx: string };
    blue:   { bg: string; tx: string };
    gold:   { bg: string; tx: string };
    gray:   { bg: string; tx: string };
    purple: { bg: string; tx: string };
  };
}
