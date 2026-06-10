import { NextRequest, NextResponse } from "next/server";
import { buildMeta, fetchJsonWithRetry, jsonError, jsonWithMeta } from "@/lib/api/reliability";

export const runtime = "nodejs"; // needs Date.now() for dynamic desde/hasta

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const { searchParams } = req.nextUrl;
  const id    = searchParams.get("id");
  const desde = searchParams.get("desde");
  const hasta = searchParams.get("hasta");
  const list  = searchParams.get("list");

  const BASE = "https://api.bcra.gob.ar/estadisticas/v4.0";

  try {
    let url: string;
    if (list) {
      url = `${BASE}/monetarias?limit=200`;
    } else if (id) {
      url = `${BASE}/monetarias/${id}`;
      const params: string[] = [];
      if (desde) params.push(`desde=${desde}`);
      if (hasta) params.push(`hasta=${hasta}`);
      if (!desde && !hasta) {
        const h = new Date().toISOString().split("T")[0];
        const d = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
        params.push(`desde=${d}`, `hasta=${h}`);
      }
      params.push("limit=100");
      if (params.length) url += `?${params.join("&")}`;
    } else {
      return NextResponse.json({ error: "Missing ?id= or ?list=1" }, { status: 400 });
    }

    const data = await fetchJsonWithRetry<Record<string, unknown>>(url, {
      provider: "BCRA",
      headers: { Accept: "application/json", "Accept-Language": "es-AR" },
      timeoutMs: 8_000,
      retries: 1,
    });

    return jsonWithMeta(
      data,
      buildMeta({
        provider: "BCRA",
        source: url,
        status: Array.isArray(data.results) && data.results.length === 0 ? "empty" : "ok",
        startedAt,
        cacheSeconds: 300,
        staleAfterSeconds: 600,
      }),
      { cacheSeconds: 300, staleWhileRevalidateSeconds: 600 }
    );
  } catch (err) {
    return jsonError({ provider: "BCRA", source: BASE, startedAt, error: err });
  }
}
