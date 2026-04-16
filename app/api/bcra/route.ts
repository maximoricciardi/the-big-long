import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // needs Date.now() for dynamic desde/hasta

export async function GET(req: NextRequest) {
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

    const r = await fetch(url, {
      headers: { Accept: "application/json", "Accept-Language": "es-AR" },
    });

    if (!r.ok) {
      return NextResponse.json({ error: `BCRA API returned ${r.status}` }, { status: r.status });
    }

    const data = await r.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
