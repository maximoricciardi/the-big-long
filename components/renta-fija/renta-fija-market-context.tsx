"use client";

import { createContext, useContext } from "react";
import { useRentaFijaMarket } from "@/hooks/use-renta-fija-market";
import type { RentaFijaMarketSnapshot } from "@/lib/renta-fija";

const RentaFijaMarketContext = createContext<RentaFijaMarketSnapshot | null>(null);

export function RentaFijaMarketProvider({ children }: { children: React.ReactNode }) {
  const market = useRentaFijaMarket();
  return (
    <RentaFijaMarketContext.Provider value={market}>
      {children}
    </RentaFijaMarketContext.Provider>
  );
}

export function useRentaFijaMarketContext(): RentaFijaMarketSnapshot {
  const ctx = useContext(RentaFijaMarketContext);
  if (!ctx) {
    throw new Error("useRentaFijaMarketContext must be used within RentaFijaMarketProvider");
  }
  return ctx;
}
