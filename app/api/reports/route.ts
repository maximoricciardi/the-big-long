import { NextResponse } from "next/server";
import { REPORT_CATALOG } from "@/lib/data/reports";
import type { CuratedReport } from "@/types";

export const revalidate = 21_600;

function toPublishedLabel(value: string): string {
  const published = new Date(value);
  if (Number.isNaN(published.getTime())) return "Sin fecha";

  return published.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function toFreshnessDays(value: string): number {
  const published = new Date(value);
  if (Number.isNaN(published.getTime())) return 999;

  const diff = Date.now() - published.getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

function normalizeReport(report: (typeof REPORT_CATALOG)[number]): CuratedReport {
  return {
    ...report,
    publishedLabel: toPublishedLabel(report.publishedAt),
    freshnessDays: toFreshnessDays(report.publishedAt),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source")?.trim().toLowerCase() ?? "";
  const type = searchParams.get("type")?.trim().toLowerCase() ?? "";
  const region = searchParams.get("region")?.trim().toLowerCase() ?? "";
  const tag = searchParams.get("tag")?.trim().toLowerCase() ?? "";
  const featuredOnly = searchParams.get("featured") === "true";
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? "12") || 12, 1), 24);

  const reports = REPORT_CATALOG
    .map(normalizeReport)
    .filter((report) => !source || report.source.toLowerCase() === source)
    .filter((report) => !type || report.reportType.toLowerCase() === type)
    .filter((report) => !region || report.regions.some((item) => item.toLowerCase() === region))
    .filter((report) => !tag || report.tags.some((item) => item.toLowerCase() === tag))
    .filter((report) => !featuredOnly || report.featured)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    });

  const items = reports.slice(0, limit);

  return NextResponse.json(
    {
      reports: items,
      count: items.length,
      total: reports.length,
      filters: {
        sources: [...new Set(REPORT_CATALOG.map((report) => report.source))],
        types: [...new Set(REPORT_CATALOG.map((report) => report.reportType))],
        regions: [...new Set(REPORT_CATALOG.flatMap((report) => report.regions))],
        tags: [...new Set(REPORT_CATALOG.flatMap((report) => report.tags))],
      },
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "s-maxage=21600, stale-while-revalidate=43200",
      },
    }
  );
}
