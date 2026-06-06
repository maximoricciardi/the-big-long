// app/api/earnings/route.ts
// Calendario de balances via NASDAQ public API — sin API key
// Cubre las próximas 2 semanas

import { NextResponse } from "next/server";

export const revalidate = 3600;
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
};

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
  const dates = Array.from({ length: WINDOW_DAYS }, (_, i) => dateStr(i));
  const allRows: Array<{
    symbol: string; name: string; date: string; hour: string;
    epsEstimate: number | null; logo: string | null; companyDomain: string | null; logoFallback: string | null;
  }> = [];

  await Promise.allSettled(
    dates.map(async (date) => {
      try {
        const res = await fetch(
          `https://api.nasdaq.com/api/calendar/earnings?date=${date}`,
          { headers: HEADERS, signal: AbortSignal.timeout(8000) }
        );
        if (!res.ok) return;
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
            logo: DOMAIN_MAP[sym]
              ? `https://logo.clearbit.com/${DOMAIN_MAP[sym]}`
              : null,
            companyDomain: DOMAIN_MAP[sym] ?? null,
            logoFallback: DOMAIN_MAP[sym]
              ? `https://www.google.com/s2/favicons?domain=${DOMAIN_MAP[sym]}&sz=128`
              : null,
          });
        }
      } catch {}
    })
  );

  allRows.sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({
    earnings: allRows,
    count:    allRows.length,
    from:     dates[0],
    to:       dates[dates.length - 1],
    windowDays: WINDOW_DAYS,
    source: "Nasdaq public earnings calendar",
    logoStrategy: "Clearbit with Google favicon fallback",
  });
}
