"use client";

import useSWR from "swr";
import type { CuratedReport } from "@/types";

const REFRESH_MS = 6 * 60 * 60 * 1000;

type ReportsResponse = {
  reports?: CuratedReport[];
  updatedAt?: string;
  count?: number;
  total?: number;
  filters?: {
    sources: string[];
    types: string[];
    regions: string[];
    tags: string[];
  };
};

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<ReportsResponse>;
};

type ReportsFilters = {
  source?: string;
  type?: string;
  region?: string;
  tag?: string;
  featured?: boolean;
  limit?: number;
};

export function useCuratedReports(filters: ReportsFilters = {}) {
  const params = new URLSearchParams();

  if (filters.source) params.set("source", filters.source);
  if (filters.type) params.set("type", filters.type);
  if (filters.region) params.set("region", filters.region);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.featured) params.set("featured", "true");
  if (filters.limit) params.set("limit", String(filters.limit));

  const key = `/api/reports${params.size ? `?${params.toString()}` : ""}`;
  const { data, error, isLoading } = useSWR(key, fetcher, {
    refreshInterval: REFRESH_MS,
    dedupingInterval: 120_000,
    revalidateOnFocus: false,
  });

  return {
    reports: data?.reports ?? [],
    filters: data?.filters ?? { sources: [], types: [], regions: [], tags: [] },
    count: data?.count ?? 0,
    total: data?.total ?? 0,
    lastUpdate: data?.updatedAt ? new Date(data.updatedAt) : null,
    status: error ? "error" : isLoading && !data ? "loading" : "ok",
  } as const;
}

