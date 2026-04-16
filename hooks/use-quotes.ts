"use client";

import useSWR from "swr";
import type { BatchResult } from "@/types";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useQuotes(symbols: string[], enabled = true) {
  const key = enabled && symbols.length > 0
    ? `/api/batch?symbols=${symbols.join(",")}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<BatchResult>(
    key,
    fetcher,
    { refreshInterval: 90_000 }
  );

  return {
    prices:   data?.prices ?? {},
    matched:  data?.matched ?? 0,
    total:    data?.total ?? 0,
    ts:       data?.ts,
    error,
    isLoading,
    refetch: mutate,
  };
}

export function useSingleQuote(symbol: string | null) {
  const { data, error, isLoading } = useSWR(
    symbol ? `/api/quote?symbol=${symbol}` : null,
    fetcher,
    { refreshInterval: 60_000 }
  );

  return { quote: data, error, isLoading };
}
