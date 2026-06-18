// Calendario de balances via NASDAQ public API — sin API key
// Cubre las próximas 2 semanas

import { buildMeta, jsonWithMeta, normalizeError } from "@/lib/api/reliability";
import { resolveEarningsLogo } from "@/lib/equity/identity";

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
          const logo = resolveEarningsLogo(sym);
          allRows.push({
            symbol: sym,
            name:   row.name ?? sym,
            date,
            hour:   row.time?.includes("time-pre")  ? "bmo" :
                    row.time?.includes("time-after") ? "amc" : "—",
            epsEstimate: row.epsForecast
              ? parseFloat(row.epsForecast.replace(/[^0-9.-]/g,"")) || null
              : null,
            logo: logo.logo,
            companyDomain: logo.companyDomain,
            logoFallback: logo.logoFallback,
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
