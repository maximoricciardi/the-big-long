// Calendario de balances via NASDAQ public API — sin API key
// Cubre las próximas 2 semanas

import { buildMeta, jsonWithMeta, normalizeError } from "@/lib/api/reliability";

export const dynamic = "force-dynamic";

const EARNINGS_CACHE_SECONDS = 3600;
const WINDOW_DAYS = 14;

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Origin": "https://www.nasdaq.com",
  "Referer": "https://www.nasdaq.com/",
};

const DOMAIN_MAP: Record<string, string> = {
  AAPL:"apple.com",MSFT:"microsoft.com",GOOGL:"google.com",AMZN:"amazon.com",
  META:"meta.com",NVDA:"nvidia.com",TSLA:"tesla.com",NFLX:"netflix.com",
  JPM:"jpmorganchase.com",BAC:"bankofamerica.com",GS:"goldmansachs.com",
  V:"visa.com",MA:"mastercard.com",AMD:"amd.com",INTC:"intel.com",
  AVGO:"broadcom.com",ORCL:"oracle.com",ADBE:"adobe.com",CRM:"salesforce.com",
  QCOM:"qualcomm.com",IBM:"ibm.com",CSCO:"cisco.com",COST:"costco.com",
  WMT:"walmart.com",KO:"coca-cola.com",PEP:"pepsico.com",MCD:"mcdonalds.com",
  SBUX:"starbucks.com",NKE:"nike.com",DIS:"disney.com",
  XOM:"exxonmobil.com",CVX:"chevron.com",COP:"conocophillips.com",
  JNJ:"jnj.com",PFE:"pfizer.com",ABBV:"abbvie.com",UNH:"unitedhealthgroup.com",
  LLY:"lilly.com",ABT:"abbott.com",MRK:"merck.com",
  COIN:"coinbase.com",MSTR:"microstrategy.com",PLTR:"palantir.com",
  MELI:"mercadolibre.com",GLOB:"globant.com",BABA:"alibaba.com",
  SPGI:"spglobal.com",BX:"blackstone.com",KKR:"kkr.com",
  LMT:"lockheedmartin.com",NOC:"northropgrumman.com",RTX:"rtx.com",
  HON:"honeywell.com",BA:"boeing.com",CAT:"caterpillar.com",DE:"deere.com",
  HOOD:"robinhood.com",SCHW:"schwab.com",AMGN:"amgen.com",
  PYPL:"paypal.com",SNAP:"snap.com",UBER:"uber.com",SHOP:"shopify.com",
  TGT:"target.com",HD:"homedepot.com",LOW:"lowes.com",T:"att.com",
  VZ:"verizon.com",CMCSA:"comcast.com",TMUS:"t-mobile.com",
  GE:"ge.com",GEV:"gevernova.com",GM:"gm.com",F:"ford.com",
  DAL:"delta.com",UAL:"united.com",AAL:"aa.com",LUV:"southwest.com",
  MAR:"marriott.com",HLT:"hilton.com",BKNG:"bookingholdings.com",
  ABNB:"airbnb.com",DASH:"doordash.com",CMG:"chipotle.com",
  C:"citigroup.com",MS:"morganstanley.com",WFC:"wellsfargo.com",
  BLK:"blackrock.com",AXP:"americanexpress.com",COF:"capitalone.com",
  TSM:"tsmc.com",ASML:"asml.com",MU:"micron.com",TXN:"ti.com",
  NOW:"servicenow.com",PANW:"paloaltonetworks.com",CRWD:"crowdstrike.com",
  DDOG:"datadoghq.com",NET:"cloudflare.com",MDB:"mongodb.com",
  WDAY:"workday.com",SNOW:"snowflake.com",TEAM:"atlassian.com",
  ZS:"zscaler.com",ROKU:"roku.com",SPOT:"spotify.com",
  RBLX:"roblox.com",EA:"ea.com",TTWO:"take2games.com",
  PG:"pg.com",CL:"colgatepalmolive.com",KMB:"kimberly-clark.com",
  MO:"altria.com",PM:"pmi.com",EL:"esteelauder.com",
  TMO:"thermofisher.com",DHR:"danaher.com",ISRG:"intuitive.com",
  MDT:"medtronic.com",BMY:"bms.com",GILD:"gilead.com",
  REGN:"regeneron.com",VRTX:"vrtx.com",BIIB:"biogen.com",
};

function tickerLogoUrl(symbol: string): string {
  return `https://financialmodelingprep.com/image-stock/${encodeURIComponent(symbol)}.png`;
}

function domainLogoUrl(domain: string): string {
  return `https://logo.clearbit.com/${domain}`;
}

function dateStr(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

interface NasdaqRow {
  symbol: string; name: string; time: string;
  epsForecast: string; marketCap: string;
}

export async function GET() {
  const startedAt = Date.now();
  const dates = Array.from({ length: WINDOW_DAYS }, (_, i) => dateStr(i));
  const source = "https://api.nasdaq.com/api/calendar/earnings";
  const errors: Array<{ provider: string; message: string; status?: number }> = [];
  const allRows: Array<{
    symbol: string; name: string; date: string; hour: string;
    epsEstimate: number | null; logo: string | null; companyDomain: string | null; logoFallback: string | null;
  }> = [];

  await Promise.allSettled(
    dates.map(async (date) => {
      try {
        const res = await fetch(
          `${source}?date=${date}`,
          { headers: HEADERS, signal: AbortSignal.timeout(8000) }
        );
        if (!res.ok) {
          errors.push({ provider: "Nasdaq", message: `Provider returned HTTP ${res.status}`, status: res.status });
          return;
        }
        const json = await res.json();
        const rows: NasdaqRow[] = json?.data?.rows ?? [];
        for (const row of rows) {
          if (!row.symbol) continue;
          const sym = row.symbol.toUpperCase();
          allRows.push({
            symbol: sym,
            name:   row.name ?? sym,
            date,
            hour:   row.time?.includes("time-pre")  ? "bmo" :
                    row.time?.includes("time-after") ? "amc" : "—",
            epsEstimate: row.epsForecast
              ? parseFloat(row.epsForecast.replace(/[^0-9.-]/g,"")) || null
              : null,
            logo: DOMAIN_MAP[sym] ? domainLogoUrl(DOMAIN_MAP[sym]) : tickerLogoUrl(sym),
            companyDomain: DOMAIN_MAP[sym] ?? null,
            logoFallback: DOMAIN_MAP[sym] ? tickerLogoUrl(sym) : null,
          });
        }
      } catch (err) {
        errors.push(normalizeError(err, "Nasdaq"));
      }
    })
  );

  allRows.sort((a, b) => a.date.localeCompare(b.date));

  return jsonWithMeta(
    {
      earnings: allRows,
      count:    allRows.length,
      from:     dates[0],
      to:       dates[dates.length - 1],
      windowDays: WINDOW_DAYS,
      source: "Nasdaq public earnings calendar",
      logoStrategy: "Mapped domains, ticker image fallback, generated initials",
    },
    buildMeta({
      provider: "Nasdaq",
      source,
      status: allRows.length > 0 && errors.length === 0 ? "ok" : allRows.length > 0 ? "partial" : "empty",
      startedAt,
      cacheSeconds: EARNINGS_CACHE_SECONDS,
      staleAfterSeconds: EARNINGS_CACHE_SECONDS * 2,
      errors,
    }),
    { cacheSeconds: EARNINGS_CACHE_SECONDS, staleWhileRevalidateSeconds: EARNINGS_CACHE_SECONDS * 2 }
  );
}
