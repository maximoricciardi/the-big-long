"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export interface PolyOutcome {
  label: string;
  prob:  number;
}

export interface PolyMarket {
  id:       string;
  title:    string;
  outcomes: PolyOutcome[];
  volume:   number;
  slug:     string;
  group:    string;
}

export interface PolyIndicator {
  id:          string;
  title:       string;
  probability: number;
  volume:      number;
  category:    string;
  score:       number;
  isArg:       boolean;
}

export interface PolymarketData {
  tracked:    PolyMarket[];
  argTracked: PolyMarket[];
  indicators: PolyIndicator[];
  status:     string;
  timestamp:  string;
  argNote:    string;
}

export function usePolymarket() {
  const { data, error, isLoading } = useSWR<PolymarketData>(
    "/api/polymarket",
    fetcher,
    { refreshInterval: 10 * 60 * 1000 } // refresh every 10 min
  );

  return {
    data,
    error,
    isLoading,
    status: error ? "error" : isLoading ? "loading" : "ok",
  };
}
