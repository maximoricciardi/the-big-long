import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UPSTREAM_TIMEOUT_MS = 8_000;

function buildDashboardUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/v1/dashboard`;
}

function sanitizedError(status = 502) {
  return NextResponse.json(
    { error: "Financial dashboard unavailable" },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function GET() {
  const baseUrl = process.env.FINANCIAL_API_URL;
  const token = process.env.FINANCIAL_API_TOKEN;

  if (!baseUrl || !token) {
    return sanitizedError(500);
  }

  try {
    const response = await fetch(buildDashboardUrl(baseUrl), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!response.ok) {
      return sanitizedError();
    }

    const payload = await response.json();

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return sanitizedError();
  }
}
