export interface Equity {
  t:   string;         // ticker
  e:   string;         // company name
  p:   number;         // last known price (static seed)
  mkt: "ARG" | "US" | "ETF";
  tg:  number | null;  // analyst target
  an:  "BUY" | "HOLD" | null;
  fpe: number | null;  // forward P/E
  fpg: number | null;  // PEG ratio
  rw:  number | null;  // ROIC − WACC
  ma:  number | null;  // % vs 52-week high (static)
  up:  string | null;  // upside category
  cal: string | null;  // quality
  val: string | null;  // valuation
  mom: string;         // momentum
  sc:  number | null;  // composite score 0–100
  s1:  number | null;  // 1-week return %
  m1:  number | null;  // 1-month return %
  a1:  number | null;  // annualised return %
  ytd: number | null;  // year-to-date %
  cur?: "ARS";         // if absent → USD
}

const TV_NASDAQ = new Set(["NVDA","AMD","AAPL","MSFT","AMZN","META","GOOGL","TSLA","NFLX","ADBE","ORCL","INTC","AVGO","QCOM","ARM","ASML","COST","COIN","MSTR","PLTR","MELI","NIO","NBIS"]);
const TV_AMEX   = new Set(["SPY","QQQ","XLE","XLF","XLK","XLV","GLD","SLV","EWZ","SMH"]);

export function tvUrl(ticker: string): string {
  if (ticker === "MERV")       return "https://www.tradingview.com/chart/?symbol=BYMA:MERV";
  if (TV_AMEX.has(ticker))    return `https://www.tradingview.com/chart/?symbol=AMEX:${ticker}`;
  if (TV_NASDAQ.has(ticker))  return `https://www.tradingview.com/chart/?symbol=NASDAQ:${ticker}`;
  return `https://www.tradingview.com/chart/?symbol=NYSE:${ticker}`;
}

/* ═══════════════════════════════════════════════════════════════
   EQUITY SCREENER DATA  —  19 MAR 2026 · CIERRE NYC
   Precios vivos via /api/batch · Historia via /api/candle
═══════════════════════════════════════════════════════════════ */
export const EQUITIES: Equity[] = [
  // ── ARGENTINA — ADRs NYSE/NASDAQ ──────────────────────────────
  {t:"MERV",e:"Índice Merval (BYMA)",       p:2380000,mkt:"ARG",tg:null,  an:null,  fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:null,       val:null,       mom:"MUY FUERTE",sc:null, s1:null,  m1:null,  a1:null,  ytd:null, cur:"ARS"},
  {t:"GGAL", e:"Gpo. Financiero Galicia",   p:49.52,  mkt:"ARG",tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"MUY FUERTE",sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"BMA",  e:"Banco Macro",               p:78.50,  mkt:"ARG",tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"MUY FUERTE",sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"BBAR", e:"BBVA Argentina",            p:14.10,  mkt:"ARG",tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"MEDIA",    val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"SUPV", e:"Grupo Supervielle",         p:10.52,  mkt:"ARG",tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"MEDIA",    val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"YPF",  e:"YPF S.A.",                  p:38.23,  mkt:"ARG",tg:48.53, an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"PAM",  e:"Pampa Energía",             p:87.15,  mkt:"ARG",tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"CEPU", e:"Central Puerto",            p:14.60,  mkt:"ARG",tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"EDN",  e:"Edenor",                    p:32.19,  mkt:"ARG",tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"MEDIA",    val:null,       mom:"MUY FUERTE",sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"TGS",  e:"Transportadora Gas Sur",    p:30.82,  mkt:"ARG",tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"VIST", e:"Vista Energy",              p:73.60,  mkt:"ARG",tg:77.45, an:"BUY", fpe:11.37,fpg:1.44,rw:7.5,  ma:35.52, up:"MEDIO",    cal:"MEDIA",    val:"RAZONABLE",mom:"MUY FUERTE",sc:91.48,s1:11.31, m1:29.95, a1:53.03, ytd:49.94},
  {t:"LOMA", e:"Loma Negra",                p:10.70,  mkt:"ARG",tg:null,  an:"HOLD",fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"MEDIA",    val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"GLOB", e:"Globant",                   p:61.20,  mkt:"ARG",tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"MELI", e:"MercadoLibre",              p:1670.0, mkt:"ARG",tg:2624.01,an:"BUY",fpe:31.47,fpg:0.9, rw:11.27,ma:-32.5, up:"MUY ALTO", cal:"ALTA",     val:"BARATA",   mom:"DÉBIL",     sc:48.09,s1:-2.05, m1:-18.58,a1:-18.85,ytd:-17.24},
  {t:"TEO",  e:"Telecom Argentina",         p:12.89,  mkt:"ARG",tg:null,  an:"HOLD",fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"MEDIA",    val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"CRESY",e:"Cresud S.A.",               p:11.20,  mkt:"ARG",tg:14.0,  an:"BUY", fpe:null, fpg:null,rw:null, ma:-8.4,  up:"ALTO",     cal:"MEDIA",    val:null,       mom:"DÉBIL",     sc:null, s1:-2.4,  m1:-4.8,  a1:null,  ytd:null},
  {t:"IRS",  e:"IRSA Inversiones",          p:8.80,   mkt:"ARG",tg:12.0,  an:"BUY", fpe:null, fpg:null,rw:null, ma:-4.8,  up:"ALTO",     cal:"MEDIA",    val:null,       mom:"FUERTE",    sc:null, s1:3.8,   m1:8.4,   a1:null,  ytd:null},
  {t:"TX",   e:"Ternium S.A.",              p:27.80,  mkt:"ARG",tg:38.0,  an:"BUY", fpe:null, fpg:null,rw:null, ma:-18.4, up:"MUY ALTO", cal:"MEDIA",    val:null,       mom:"DÉBIL",     sc:null, s1:-4.8,  m1:-12.4, a1:null,  ytd:null},
  // ── ESTADOS UNIDOS ────────────────────────────────────────────
  {t:"MU",   e:"Micron Technology",         p:448.20, mkt:"US", tg:501.78,an:"BUY", fpe:7.88, fpg:0.03,rw:57.05,ma:50.64, up:"ALTO",     cal:"EXCELENTE",val:"BARATA",   mom:"MUY FUERTE",sc:90.90,s1:-0.76, m1:0.46,  a1:319.25,ytd:55.66},
  {t:"NVDA", e:"NVIDIA Corp.",              p:179.17, mkt:"US", tg:264.57,an:"BUY", fpe:21.44,fpg:0.43,rw:81.24,ma:0.16,  up:"MUY ALTO", cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",     sc:74.86,s1:-4.19, m1:-8.13, a1:49.75, ytd:-4.26},
  {t:"AVGO", e:"Broadcom Inc.",             p:319.84, mkt:"US", tg:467.02,an:"BUY", fpe:27.93,fpg:0.48,rw:19.0, ma:-1.63, up:"MUY ALTO", cal:"ALTA",     val:"BARATA",   mom:"DÉBIL",     sc:74.3, s1:-3.62, m1:-6.9,  a1:58.18, ytd:-7.59},
  {t:"AMAT", e:"Applied Materials",         p:357.21, mkt:"US", tg:407.73,an:"BUY", fpe:32.36,fpg:1.55,rw:19.11,ma:32.87, up:"MEDIO",    cal:"ALTA",     val:"RAZONABLE",mom:"MUY FUERTE",sc:72.37,s1:4.55,  m1:-3.31, a1:120.19,ytd:39.0},
  {t:"AMD",  e:"Advanced Micro Dev.",       p:203.27, mkt:"US", tg:280.14,an:"BUY", fpe:31.08,fpg:0.52,rw:-0.21,ma:6.32,  up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"NEUTRO",    sc:62.27,s1:4.11,  m1:0.6,   a1:81.75, ytd:-4.15},
  {t:"INTC", e:"Intel Corp.",               p:45.77,  mkt:"US", tg:46.07, an:"HOLD",fpe:88.83,fpg:1.49,rw:-6.52,ma:25.24, up:"BAJO",     cal:"BAJA",     val:"RAZONABLE",mom:"FUERTE",    sc:51.68,s1:null,  m1:-4.88, a1:82.11, ytd:22.03},
  {t:"ASML", e:"ASML Holding",              p:1376.3, mkt:"US", tg:1444.7,an:"BUY", fpe:39.37,fpg:1.63,rw:34.12,ma:26.03, up:"MEDIO",    cal:"EXCELENTE",val:"RAZONABLE",mom:"FUERTE",    sc:71.42,s1:-2.11, m1:-10.31,a1:79.31, ytd:27.72},
  {t:"TSM",  e:"Taiwan Semiconductor",      p:330.0,  mkt:"US", tg:410.08,an:"BUY", fpe:23.48,fpg:0.77,rw:17.55,ma:16.63, up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"FUERTE",    sc:69.8, s1:-2.68, m1:-9.11, a1:88.98, ytd:11.48},
  {t:"QCOM", e:"Qualcomm",                  p:129.9,  mkt:"US", tg:161.77,an:"HOLD",fpe:11.77,fpg:0.0, rw:20.96,ma:-21.85,up:"ALTO",     cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",     sc:40.63,s1:0.06,  m1:-9.31, a1:-17.91,ytd:-23.25},
  {t:"ARM",  e:"ARM Holdings",              p:132.35, mkt:"US", tg:149.7, an:"BUY", fpe:74.33,fpg:4.69,rw:5.52, ma:-6.27, up:"MEDIO",    cal:"MEDIA",    val:"CARA",     mom:"DÉBIL",     sc:40.71,s1:14.34, m1:4.02,  a1:6.70,  ytd:18.76},
  {t:"AAPL", e:"Apple Inc.",                p:248.96, mkt:"US", tg:291.24,an:"BUY", fpe:29.05,fpg:2.35,rw:71.6, ma:0.95,  up:"ALTO",     cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",     sc:60.03,s1:-0.85, m1:-6.19, a1:15.44, ytd:-8.42},
  {t:"MSFT", e:"Microsoft Corp.",           p:389.02, mkt:"US", tg:595.55,an:"BUY", fpe:23.57,fpg:1.34,rw:23.92,ma:-23.23,up:"MUY ALTO", cal:"EXCELENTE",val:"RAZONABLE",mom:"FUERTE",    sc:49.32,s1:1.94,  m1:-1.79, a1:0.50,  ytd:-18.99},
  {t:"AMZN", e:"Amazon.com Inc.",           p:208.76, mkt:"US", tg:279.13,an:"BUY", fpe:26.91,fpg:1.60,rw:7.16, ma:-7.23, up:"MUY ALTO", cal:"MEDIA",    val:"RAZONABLE",mom:"FUERTE",    sc:47.69,s1:2.48,  m1:2.71,  a1:5.66,  ytd:-9.08},
  {t:"META", e:"Meta Platforms",            p:606.7,  mkt:"US", tg:855.97,an:"BUY", fpe:20.23,fpg:1.05,rw:18.64,ma:-14.2, up:"MUY ALTO", cal:"ALTA",     val:"RAZONABLE",mom:"DÉBIL",     sc:51.4, s1:-3.27, m1:-7.7,  a1:4.56,  ytd:-8.09},
  {t:"GOOGL",e:"Alphabet Inc.",             p:307.13, mkt:"US", tg:359.64,an:"BUY", fpe:26.8, fpg:1.98,rw:27.83,ma:15.92, up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE",mom:"FUERTE",    sc:66.8, s1:-0.42, m1:-0.77, a1:84.93, ytd:-1.88},
  {t:"TSLA", e:"Tesla Inc.",                p:380.3,  mkt:"US", tg:402.7, an:"HOLD",fpe:186.79,fpg:7.52,rw:-2.52,ma:-3.8, up:"MEDIO",    cal:"BAJA",     val:"CARA",     mom:"DÉBIL",     sc:35.44,s1:-5.94, m1:-10.54,a1:61.47, ytd:-15.44},
  {t:"NFLX", e:"Netflix Inc.",              p:91.74,  mkt:"US", tg:114.16,an:"BUY", fpe:29.2, fpg:1.29,rw:19.15,ma:-18.32,up:"ALTO",     cal:"ALTA",     val:"RAZONABLE",mom:"DÉBIL",     sc:53.55,s1:-3.66, m1:17.73, a1:-1.74, ytd:-2.15},
  {t:"ADBE", e:"Adobe Inc.",                p:248.15, mkt:"US", tg:324.77,an:"BUY", fpe:10.41,fpg:0.82,rw:27.45,ma:-36.37,up:"MUY ALTO", cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",     sc:53.6, s1:-0.47, m1:-5.71, a1:-35.76,ytd:-29.72},
  {t:"ORCL", e:"Oracle Corp.",              p:155.5,  mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:1.15,  m1:null,  a1:null,  ytd:null},
  {t:"PLTR", e:"Palantir Tech.",            p:155.68, mkt:"US", tg:189.88,an:"BUY", fpe:117.08,fpg:2.08,rw:30.04,ma:-5.05,up:"MUY ALTO", cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",     sc:66.02,s1:null,  m1:11.37, a1:76.42, ytd:-12.4},
  // financials
  {t:"JPM",  e:"JPMorgan Chase",            p:287.97, mkt:"US", tg:338.17,an:"BUY", fpe:13.01,fpg:1.43,rw:-5.86,ma:-4.61, up:"ALTO",     cal:"BAJA",     val:"RAZONABLE",mom:"DÉBIL",     sc:49.58,s1:1.1,   m1:-7.2,  a1:19.82, ytd:-10.63},
  {t:"GS",   e:"Goldman Sachs",             p:809.5,  mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"EXCELENTE",val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"BAC",  e:"Bank of America",           p:47.01,  mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:1.00,  m1:null,  a1:null,  ytd:null},
  {t:"MS",   e:"Morgan Stanley",            p:158.54, mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"WFC",  e:"Wells Fargo",               p:77.40,  mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"V",    e:"Visa Inc.",                 p:299.71, mkt:"US", tg:400.28,an:"BUY", fpe:23.3, fpg:1.83,rw:91.88,ma:-13.26,up:"MUY ALTO", cal:"EXCELENTE",val:"RAZONABLE",mom:"DÉBIL",     sc:51.85,s1:null,  m1:-5.83, a1:-11.95,ytd:-14.54},
  {t:"MA",   e:"Mastercard",                p:491.14, mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"EXCELENTE",val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"AXP",  e:"American Express",          p:298.00, mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"EXCELENTE",val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  // energía / industrial
  {t:"GEV",  e:"GE Vernova",                p:880.22, mkt:"US", tg:866.83,an:"BUY", fpe:59.6, fpg:0.8, rw:24.06,ma:28.05, up:"BAJO",     cal:"EXCELENTE",val:"BARATA",   mom:"FUERTE",    sc:82.14,s1:5.72,  m1:4.1,   a1:149.11,ytd:34.25},
  {t:"XOM",  e:"Exxon Mobil",               p:158.15, mkt:"US", tg:152.31,an:"BUY", fpe:20.71,fpg:2.11,rw:4.99, ma:23.34, up:"BAJO",     cal:"BAJA",     val:"CARA",     mom:"FUERTE",    sc:66.58,s1:2.33,  m1:6.02,  a1:36.26, ytd:31.43},
  {t:"CVX",  e:"Chevron Corp.",             p:201.43, mkt:"US", tg:193.93,an:"BUY", fpe:18.99,fpg:1.51,rw:-1.19,ma:20.89, up:"BAJO",     cal:"BAJA",     val:"RAZONABLE",mom:"FUERTE",    sc:57.92,s1:2.49,  m1:9.71,  a1:21.65, ytd:32.17},
  {t:"GE",   e:"GE Aerospace",              p:291.61, mkt:"US", tg:361.03,an:"BUY", fpe:39.15,fpg:2.5, rw:18.58,ma:-0.01, up:"MUY ALTO", cal:"ALTA",     val:"CARA",     mom:"DÉBIL",     sc:51.19,s1:-4.3,  m1:-12.98,a1:41.53, ytd:-5.33},
  {t:"RTX",  e:"RTX Corp.",                 p:200.73, mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"CAT",  e:"Caterpillar Inc.",          p:688.65, mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"UBER", e:"Uber Technologies",         p:73.89,  mkt:"US", tg:104.41,an:"BUY", fpe:22.24,fpg:5.27,rw:10.0, ma:-16.56,up:"MUY ALTO", cal:"MEDIA",    val:"CARA",     mom:"DÉBIL",     sc:36.51,s1:0.76,  m1:1.54,  a1:5.85,  ytd:-7.8},
  // salud / pharma
  {t:"LLY",  e:"Eli Lilly",                 p:917.5,  mkt:"US", tg:1201.43,an:"BUY",fpe:26.51,fpg:0.85,rw:36.46,ma:2.84,  up:"MUY ALTO", cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",     sc:82.66,s1:-7.96, m1:-11.16,a1:9.56,  ytd:-14.63},
  {t:"JNJ",  e:"Johnson & Johnson",         p:237.6,  mkt:"US", tg:239.61,an:"BUY", fpe:20.58,fpg:2.62,rw:14.16,ma:18.45, up:"BAJO",     cal:"ALTA",     val:"CARA",     mom:"FUERTE",    sc:65.8, s1:-2.55, m1:-3.93, a1:46.33, ytd:14.81},
  {t:"UNH",  e:"UnitedHealth Group",        p:275.59, mkt:"US", tg:363.47,an:"BUY", fpe:15.74,fpg:2.04,rw:4.96, ma:-12.31,up:"MUY ALTO", cal:"BAJA",     val:"CARA",     mom:"DÉBIL",     sc:39.63,s1:-2.3,  m1:-4.38, a1:-43.39,ytd:-15.05},
  {t:"ABBV", e:"AbbVie Inc.",               p:206.21, mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:5.21,  m1:null,  a1:null,  ytd:null},
  {t:"PFE",  e:"Pfizer Inc.",               p:26.97,  mkt:"US", tg:28.76, an:"HOLD",fpe:9.2,  fpg:0.0, rw:2.5,  ma:7.9,   up:"MEDIO",    cal:"BAJA",     val:"BARATA",   mom:"NEUTRO",    sc:47.74,s1:1.5,   m1:-1.42, a1:4.85,  ytd:10.08},
  {t:"AMGN", e:"Amgen Inc.",                p:358.65, mkt:"US", tg:null,  an:"HOLD",fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"MRK",  e:"Merck & Co.",               p:114.23, mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:1.19,  m1:null,  a1:null,  ytd:null},
  // consumo
  {t:"WMT",  e:"Walmart Inc.",              p:121.09, mkt:"US", tg:134.9, an:"BUY", fpe:41.33,fpg:3.81,rw:8.06, ma:11.03, up:"MEDIO",    cal:"MEDIA",    val:"CARA",     mom:"NEUTRO",    sc:53.16,s1:-5.93, m1:-6.0,  a1:40.56, ytd:8.69},
  {t:"MCD",  e:"McDonald's Corp.",          p:319.42, mkt:"US", tg:346.68,an:"BUY", fpe:23.4, fpg:2.71,rw:17.92,ma:0.35,  up:"MEDIO",    cal:"ALTA",     val:"CARA",     mom:"DÉBIL",     sc:48.92,s1:null,  m1:-5.81, a1:2.90,  ytd:1.29},
  {t:"KO",   e:"Coca-Cola Co.",             p:75.55,  mkt:"US", tg:83.53, an:"BUY", fpe:23.36,fpg:3.19,rw:27.24,ma:5.97,  up:"MEDIO",    cal:"EXCELENTE",val:"CARA",     mom:"NEUTRO",    sc:60.94,s1:-3.35, m1:-5.96, a1:9.82,  ytd:8.07},
  {t:"PEP",  e:"PepsiCo Inc.",              p:150.04, mkt:"US", tg:170.52,an:"HOLD",fpe:17.69,fpg:2.8, rw:13.81,ma:4.14,  up:"MEDIO",    cal:"ALTA",     val:"CARA",     mom:"DÉBIL",     sc:43.83,s1:-6.15, m1:-8.73, a1:3.78,  ytd:6.42},
  {t:"PG",   e:"Procter & Gamble",          p:144.85, mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"EXCELENTE",val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"COST", e:"Costco Wholesale",          p:974.78, mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"EXCELENTE",val:null,       mom:"FUERTE",    sc:null, s1:1.63,  m1:null,  a1:null,  ytd:null},
  {t:"HD",   e:"Home Depot Inc.",           p:328.21, mkt:"US", tg:null,  an:"BUY", fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:"EXCELENTE",val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"NKE",  e:"Nike Inc.",                 p:52.37,  mkt:"US", tg:75.93, an:"BUY", fpe:34.56,fpg:4.45,rw:3.92, ma:-26.02,up:"MUY ALTO", cal:"BAJA",     val:"CARA",     mom:"DÉBIL",     sc:28.11,s1:-2.98, m1:-20.11,a1:-27.18,ytd:-16.12},
  {t:"DIS",  e:"Walt Disney Co.",           p:99.51,  mkt:"US", tg:130.3, an:"BUY", fpe:14.87,fpg:1.29,rw:-0.7, ma:-13.4, up:"MUY ALTO", cal:"BAJA",     val:"RAZONABLE",mom:"DÉBIL",     sc:36.47,s1:0.21,  m1:-7.1,  a1:-0.52, ytd:-12.81},
  {t:"BABA", e:"Alibaba Group",             p:122.41, mkt:"US", tg:192.05,an:"BUY", fpe:25.1, fpg:6.89,rw:-6.41,ma:-17.17,up:"MUY ALTO", cal:"BAJA",     val:"CARA",     mom:"DÉBIL",     sc:25.84,s1:-9.47, m1:-21.42,a1:-14.49,ytd:-14.79},
  {t:"IBM",  e:"IBM Corp.",                 p:241.77, mkt:"US", tg:305.0, an:"BUY", fpe:20.16,fpg:2.57,rw:6.25, ma:-11.9, up:"MUY ALTO", cal:"MEDIA",    val:"CARA",     mom:"DÉBIL",     sc:40.21,s1:-1.83, m1:-7.29, a1:-0.66, ytd:-15.48},
  // emergentes / commodities
  {t:"VALE", e:"Vale S.A.",                 p:12.17,  mkt:"US", tg:16.32, an:"BUY", fpe:7.39, fpg:0.08,rw:6.29, ma:17.2,  up:"ALTO",     cal:"MEDIA",    val:"BARATA",   mom:"FUERTE",    sc:71.24,s1:-4.29, m1:-12.19,a1:38.37, ytd:12.28},
  {t:"PBR",  e:"Petrobras",                 p:20.74,  mkt:"US", tg:16.89, an:"BUY", fpe:6.56, fpg:2.47,rw:10.82,ma:35.2,  up:"BAJO",     cal:"ALTA",     val:"CARA",     mom:"MUY FUERTE",sc:63.5, s1:null,  m1:22.96, a1:41.66, ytd:66.92},
  {t:"BBD",  e:"Banco Bradesco",            p:3.41,   mkt:"US", tg:4.13,  an:"BUY", fpe:7.41, fpg:0.44,rw:-6.8, ma:5.51,  up:"ALTO",     cal:"BAJA",     val:"BARATA",   mom:"NEUTRO",    sc:59.05,s1:-3.4,  m1:-14.32,a1:54.64, ytd:6.31},
  {t:"NIO",  e:"NIO Inc.",                  p:5.43,   mkt:"US", tg:6.7,   an:"BUY", fpe:0.0,  fpg:0.0, rw:16.81,ma:9.97,  up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"NEUTRO",    sc:62.71,s1:-7.34, m1:10.59, a1:10.74, ytd:15.49},
  // crypto / alternative
  {t:"COIN", e:"Coinbase",                  p:197.5,  mkt:"US", tg:255.46,an:"BUY", fpe:59.29,fpg:3.44,rw:12.57,ma:-41.08,up:"MUY ALTO", cal:"ALTA",     val:"CARA",     mom:"DÉBIL",     sc:36.32,s1:1.01,  m1:20.39, a1:1.79,  ytd:-10.27},
  {t:"MSTR", e:"MicroStrategy",             p:135.66, mkt:"US", tg:355.07,an:"BUY", fpe:3.7,  fpg:0.03,rw:-14.13,ma:-94.88,up:"MUY ALTO",cal:"BAJA",     val:"BARATA",   mom:"DÉBIL",     sc:21.55,s1:-2.87, m1:8.35,  a1:-55.99,ytd:-9.02},
  {t:"HUT",  e:"Hut 8 Corp.",               p:47.46,  mkt:"US", tg:64.07, an:"BUY", fpe:0.0,  fpg:0.0, rw:-18.79,ma:24.69, up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"FUERTE",    sc:45.76,s1:-1.78, m1:-11.48,a1:263.96,ytd:9.14},
  {t:"GPRK", e:"Genie Energy",              p:9.80,   mkt:"US", tg:10.47, an:"BUY", fpe:7.03, fpg:0.15,rw:13.76,ma:29.33, up:"MEDIO",    cal:"ALTA",     val:"BARATA",   mom:"FUERTE",    sc:74.38,s1:11.74, m1:18.07, a1:25.32, ytd:37.52},
  {t:"NBIS", e:"Nebius Group",              p:117.62, mkt:"US", tg:166.39,an:"BUY", fpe:0.00, fpg:0.00,rw:-9.14,ma:30.09, up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"MUY FUERTE",sc:60.61,s1:4.13,  m1:15.54, a1:349.36,ytd:45.18},
  {t:"NU",   e:"Nu Holdings",               p:13.94,  mkt:"US", tg:19.62, an:"BUY", fpe:15.97,fpg:0.45,rw:-10.09,ma:-7.26,up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"DÉBIL",     sc:41.62,s1:0.36,  m1:-18.81,a1:22.28, ytd:-15.41},
  {t:"BITF", e:"Bitfarms Ltd.",             p:2.22,   mkt:"US", tg:5.64,  an:"BUY", fpe:0.00, fpg:0.00,rw:-19.33,ma:3.84,  up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"DÉBIL",     sc:40.64,s1:-3.12, m1:5.34,  a1:108.65,ytd:1.70},
  {t:"BRK.B",e:"Berkshire Hathaway B",      p:480.94, mkt:"US", tg:529.50,an:"BUY", fpe:23.07,fpg:8.30,rw:-6.44,ma:-2.04, up:"MEDIO",    cal:"BAJA",     val:"CARA",     mom:"DÉBIL",     sc:30.89,s1:-1.81, m1:-3.59, a1:-9.00, ytd:-4.21},
  // energía post-conflicto
  {t:"COP",  e:"ConocoPhillips",            p:116.8,  mkt:"US", tg:130.0, an:"BUY", fpe:13.2, fpg:1.8, rw:14.5, ma:12.3,  up:"MEDIO",    cal:"ALTA",     val:"RAZONABLE",mom:"MUY FUERTE",sc:72.1, s1:4.1,   m1:18.3,  a1:28.5,  ytd:24.7},
  {t:"EOG",  e:"EOG Resources",             p:134.2,  mkt:"US", tg:155.0, an:"BUY", fpe:10.4, fpg:1.2, rw:16.8, ma:8.9,   up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"MUY FUERTE",sc:74.5, s1:3.8,   m1:21.4,  a1:31.2,  ytd:27.3},
  {t:"OXY",  e:"Occidental Petroleum",      p:69.8,   mkt:"US", tg:73.0,  an:"HOLD",fpe:11.1, fpg:1.5, rw:9.2,  ma:6.4,   up:"BAJO",     cal:"BAJA",     val:"RAZONABLE",mom:"MUY FUERTE",sc:55.3, s1:2.9,   m1:22.1,  a1:36.0,  ytd:31.5},
  {t:"SLB",  e:"SLB (Schlumberger)",        p:47.8,   mkt:"US", tg:58.0,  an:"BUY", fpe:14.2, fpg:1.1, rw:11.3, ma:10.2,  up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"MUY FUERTE",sc:68.4, s1:3.4,   m1:16.7,  a1:22.4,  ytd:19.8},
  {t:"HAL",  e:"Halliburton Co.",           p:29.1,   mkt:"US", tg:38.0,  an:"BUY", fpe:12.8, fpg:0.9, rw:8.7,  ma:14.3,  up:"MUY ALTO", cal:"ALTA",     val:"BARATA",   mom:"FUERTE",    sc:66.2, s1:2.7,   m1:14.5,  a1:18.9,  ytd:16.4},
  {t:"DVN",  e:"Devon Energy",              p:44.9,   mkt:"US", tg:55.0,  an:"BUY", fpe:9.1,  fpg:0.8, rw:12.4, ma:17.6,  up:"ALTO",     cal:"MEDIA",    val:"BARATA",   mom:"MUY FUERTE",sc:63.7, s1:4.5,   m1:19.8,  a1:14.3,  ytd:18.2},
  // defensa
  {t:"LMT",  e:"Lockheed Martin",           p:528.4,  mkt:"US", tg:620.0, an:"BUY", fpe:18.3, fpg:2.4, rw:null, ma:3.2,   up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE",mom:"MUY FUERTE",sc:76.3, s1:5.8,   m1:14.2,  a1:22.1,  ytd:18.9},
  {t:"NOC",  e:"Northrop Grumman",          p:543.7,  mkt:"US", tg:650.0, an:"BUY", fpe:19.8, fpg:2.6, rw:null, ma:2.4,   up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE",mom:"MUY FUERTE",sc:74.1, s1:5.2,   m1:15.8,  a1:26.4,  ytd:21.7},
  // industrials
  {t:"HON",  e:"Honeywell Intl.",           p:201.8,  mkt:"US", tg:228.0, an:"BUY", fpe:22.1, fpg:2.8, rw:14.2, ma:-4.3,  up:"MEDIO",    cal:"EXCELENTE",val:"RAZONABLE",mom:"DÉBIL",     sc:58.4, s1:-2.1,  m1:-3.8,  a1:4.2,   ytd:-3.1},
  {t:"BA",   e:"Boeing Co.",                p:168.2,  mkt:"US", tg:210.0, an:"HOLD",fpe:null, fpg:null,rw:null, ma:-18.4, up:"ALTO",     cal:"BAJA",     val:"RAZONABLE",mom:"DÉBIL",     sc:34.2, s1:-1.4,  m1:-8.2,  a1:-12.3, ytd:-9.7},
  {t:"DE",   e:"John Deere & Co.",          p:387.6,  mkt:"US", tg:430.0, an:"BUY", fpe:17.8, fpg:2.1, rw:18.4, ma:-6.2,  up:"MEDIO",    cal:"EXCELENTE",val:"RAZONABLE",mom:"DÉBIL",     sc:52.7, s1:-1.8,  m1:-5.3,  a1:3.8,   ytd:-4.2},
  {t:"MMM",  e:"3M Company",                p:117.4,  mkt:"US", tg:130.0, an:"HOLD",fpe:14.8, fpg:1.9, rw:6.3,  ma:-8.4,  up:"MEDIO",    cal:"MEDIA",    val:"RAZONABLE",mom:"DÉBIL",     sc:41.5, s1:-3.2,  m1:-7.1,  a1:-4.8,  ytd:-5.9},
  // healthcare adicional
  {t:"ABT",  e:"Abbott Laboratories",       p:121.8,  mkt:"US", tg:145.0, an:"BUY", fpe:22.3, fpg:2.4, rw:15.7, ma:-2.8,  up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE",mom:"DÉBIL",     sc:59.8, s1:-1.9,  m1:-4.2,  a1:8.7,   ytd:-2.4},
  {t:"MDT",  e:"Medtronic PLC",             p:87.9,   mkt:"US", tg:95.0,  an:"HOLD",fpe:15.8, fpg:2.1, rw:8.4,  ma:-3.7,  up:"BAJO",     cal:"ALTA",     val:"RAZONABLE",mom:"NEUTRO",    sc:44.8, s1:-0.8,  m1:-2.4,  a1:1.3,   ytd:-1.8},
  {t:"CVS",  e:"CVS Health Corp.",          p:78.3,   mkt:"US", tg:102.0, an:"BUY", fpe:8.2,  fpg:0.6, rw:3.8,  ma:-24.8, up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"FUERTE",    sc:60.2, s1:6.8,   m1:12.4,  a1:-8.4,  ytd:9.7},
  {t:"BMY",  e:"Bristol-Myers Squibb",      p:47.8,   mkt:"US", tg:62.0,  an:"BUY", fpe:7.1,  fpg:0.5, rw:5.2,  ma:-19.4, up:"MUY ALTO", cal:"ALTA",     val:"BARATA",   mom:"NEUTRO",    sc:54.3, s1:-0.6,  m1:4.8,   a1:-14.2, ytd:3.2},
  // ciberseguridad / cloud
  {t:"CRWD", e:"CrowdStrike Holdings",      p:309.8,  mkt:"US", tg:380.0, an:"BUY", fpe:64.8, fpg:2.1, rw:18.4, ma:-12.3, up:"ALTO",     cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",     sc:62.4, s1:4.2,   m1:-3.8,  a1:38.4,  ytd:-9.7},
  {t:"PANW", e:"Palo Alto Networks",        p:165.7,  mkt:"US", tg:220.0, an:"BUY", fpe:44.8, fpg:1.8, rw:22.4, ma:-11.8, up:"MUY ALTO", cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",     sc:60.8, s1:3.8,   m1:-4.2,  a1:12.4,  ytd:-7.8},
  {t:"NET",  e:"Cloudflare Inc.",           p:89.4,   mkt:"US", tg:120.0, an:"BUY", fpe:null, fpg:null,rw:8.4,  ma:-24.8, up:"MUY ALTO", cal:"ALTA",     val:"CARA",     mom:"DÉBIL",     sc:47.8, s1:2.4,   m1:-8.4,  a1:-18.4, ytd:-14.2},
  {t:"SNOW", e:"Snowflake Inc.",            p:135.4,  mkt:"US", tg:175.0, an:"BUY", fpe:null, fpg:null,rw:4.2,  ma:-28.4, up:"MUY ALTO", cal:"MEDIA",    val:"CARA",     mom:"DÉBIL",     sc:42.3, s1:1.8,   m1:-12.4, a1:-22.4, ytd:-18.7},
  {t:"NOW",  e:"ServiceNow Inc.",           p:948.7,  mkt:"US", tg:1100.0,an:"BUY", fpe:57.8, fpg:2.8, rw:32.4, ma:-8.4,  up:"ALTO",     cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",     sc:63.4, s1:-1.2,  m1:-6.8,  a1:24.8,  ytd:-7.4},
  {t:"DDOG", e:"Datadog Inc.",              p:118.4,  mkt:"US", tg:148.0, an:"BUY", fpe:null, fpg:null,rw:12.4, ma:-22.4, up:"ALTO",     cal:"ALTA",     val:"CARA",     mom:"DÉBIL",     sc:51.2, s1:3.2,   m1:-9.4,  a1:4.8,   ytd:-12.4},
  // consumer adicional
  {t:"SBUX", e:"Starbucks Corp.",           p:90.8,   mkt:"US", tg:115.0, an:"BUY", fpe:20.4, fpg:1.8, rw:null, ma:-4.8,  up:"ALTO",     cal:"ALTA",     val:"CARA",     mom:"FUERTE",    sc:56.8, s1:3.4,   m1:8.2,   a1:2.8,   ytd:6.4},
  {t:"TGT",  e:"Target Corp.",             p:95.8,   mkt:"US", tg:110.0, an:"HOLD",fpe:12.8, fpg:1.4, rw:4.2,  ma:-28.4, up:"MEDIO",    cal:"MEDIA",    val:"RAZONABLE",mom:"DÉBIL",     sc:36.8, s1:-3.8,  m1:-14.2, a1:-32.4, ytd:-18.7},
  {t:"CMG",  e:"Chipotle Mexican Grill",   p:51.2,   mkt:"US", tg:65.0,  an:"BUY", fpe:39.8, fpg:2.2, rw:28.4, ma:-16.4, up:"MUY ALTO", cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",     sc:55.4, s1:-0.8,  m1:-8.4,  a1:-12.4, ytd:-9.8},
  {t:"LOW",  e:"Lowe's Companies",         p:219.4,  mkt:"US", tg:255.0, an:"BUY", fpe:18.8, fpg:1.9, rw:null, ma:-8.4,  up:"ALTO",     cal:"ALTA",     val:"RAZONABLE",mom:"DÉBIL",     sc:51.4, s1:-2.4,  m1:-6.4,  a1:-4.8,  ytd:-5.2},
  {t:"YUM",  e:"Yum! Brands",              p:134.8,  mkt:"US", tg:148.0, an:"BUY", fpe:21.8, fpg:2.4, rw:null, ma:-4.2,  up:"MEDIO",    cal:"ALTA",     val:"CARA",     mom:"NEUTRO",    sc:49.8, s1:-1.4,  m1:-2.8,  a1:4.8,   ytd:1.2},
  // financiero alternativo
  {t:"BX",   e:"Blackstone Inc.",          p:121.8,  mkt:"US", tg:148.0, an:"BUY", fpe:22.4, fpg:1.6, rw:null, ma:-12.4, up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE",mom:"DÉBIL",     sc:56.4, s1:-2.8,  m1:-8.4,  a1:-4.8,  ytd:-7.4},
  {t:"KKR",  e:"KKR & Co. Inc.",           p:117.4,  mkt:"US", tg:148.0, an:"BUY", fpe:24.8, fpg:1.8, rw:null, ma:-14.8, up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE",mom:"DÉBIL",     sc:54.8, s1:-3.2,  m1:-9.8,  a1:4.2,   ytd:-8.4},
  {t:"SCHW", e:"Charles Schwab Corp.",     p:77.2,   mkt:"US", tg:94.0,  an:"BUY", fpe:17.8, fpg:1.2, rw:null, ma:-8.4,  up:"ALTO",     cal:"ALTA",     val:"RAZONABLE",mom:"DÉBIL",     sc:48.4, s1:-2.4,  m1:-4.2,  a1:-8.4,  ytd:-3.8},
  {t:"C",    e:"Citigroup Inc.",           p:70.4,   mkt:"US", tg:88.0,  an:"BUY", fpe:9.8,  fpg:0.7, rw:null, ma:-12.4, up:"ALTO",     cal:"BAJA",     val:"RAZONABLE",mom:"DÉBIL",     sc:46.4, s1:-3.8,  m1:-8.4,  a1:-4.8,  ytd:-6.8},
  // utilities
  {t:"NEE",  e:"NextEra Energy",           p:62.8,   mkt:"US", tg:78.0,  an:"BUY", fpe:20.8, fpg:2.1, rw:6.4,  ma:-4.8,  up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE",mom:"NEUTRO",    sc:53.4, s1:-0.8,  m1:2.4,   a1:-8.4,  ytd:3.8},
  {t:"SO",   e:"Southern Company",        p:82.4,   mkt:"US", tg:90.0,  an:"BUY", fpe:19.8, fpg:2.8, rw:4.8,  ma:-2.4,  up:"MEDIO",    cal:"ALTA",     val:"CARA",     mom:"NEUTRO",    sc:47.8, s1:-0.4,  m1:1.8,   a1:4.8,   ytd:3.2},
  // telecom / media
  {t:"T",    e:"AT&T Inc.",               p:21.8,   mkt:"US", tg:26.0,  an:"BUY", fpe:9.8,  fpg:1.2, rw:1.4,  ma:-2.4,  up:"ALTO",     cal:"BAJA",     val:"BARATA",   mom:"FUERTE",    sc:48.2, s1:1.8,   m1:4.8,   a1:22.4,  ytd:18.4},
  {t:"VZ",   e:"Verizon Comm.",           p:38.8,   mkt:"US", tg:44.0,  an:"HOLD",fpe:9.2,  fpg:1.8, rw:0.8,  ma:-4.8,  up:"MEDIO",    cal:"BAJA",     val:"BARATA",   mom:"NEUTRO",    sc:39.8, s1:-0.4,  m1:2.4,   a1:8.4,   ytd:6.2},
  {t:"CMCSA",e:"Comcast Corp.",           p:38.4,   mkt:"US", tg:48.0,  an:"BUY", fpe:9.8,  fpg:1.1, rw:8.4,  ma:-14.8, up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"DÉBIL",     sc:52.4, s1:-2.4,  m1:-4.8,  a1:-18.4, ytd:-8.4},
  // ── ETFs SECTORIALES ──────────────────────────────────────────
  {t:"SPY",  e:"S&P 500 ETF",            p:648.57, mkt:"ETF",tg:null,  an:null,  fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:0.93,  m1:null,  a1:null,  ytd:null},
  {t:"QQQ",  e:"Nasdaq 100 ETF",         p:585.72, mkt:"ETF",tg:null,  an:null,  fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:1.18,  m1:null,  a1:null,  ytd:null},
  {t:"XLE",  e:"Energy Sector SPDR",     p:55.92,  mkt:"ETF",tg:null,  an:null,  fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:0.78,  m1:null,  a1:null,  ytd:null},
  {t:"XLF",  e:"Financial Sector SPDR",  p:48.99,  mkt:"ETF",tg:null,  an:null,  fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"XLK",  e:"Technology SPDR",        p:139.5,  mkt:"ETF",tg:null,  an:null,  fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"XLV",  e:"Health Care SPDR",       p:160.2,  mkt:"ETF",tg:null,  an:null,  fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"GLD",  e:"SPDR Gold Shares",       p:433.5,  mkt:"ETF",tg:null,  an:null,  fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:null,       val:null,       mom:"MUY FUERTE",sc:null, s1:3.14,  m1:null,  a1:null,  ytd:null},
  {t:"SLV",  e:"iShares Silver",         p:66.8,   mkt:"ETF",tg:null,  an:null,  fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:4.12,  m1:null,  a1:null,  ytd:null},
  {t:"EWZ",  e:"iShares Brazil",         p:40.24,  mkt:"ETF",tg:null,  an:null,  fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
  {t:"SMH",  e:"VanEck Semiconductors",  p:195.0,  mkt:"ETF",tg:null,  an:null,  fpe:null, fpg:null,rw:null, ma:null,  up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,  ytd:null},
];
