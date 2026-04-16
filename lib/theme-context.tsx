"use client";

import React, { createContext, useContext } from "react";
import { useTheme } from "next-themes";
import { TH } from "@/lib/theme";
import type { ThemeTokens } from "@/types";

const ThemeContext = createContext<ThemeTokens>(TH.l);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const t = resolvedTheme === "dark" ? TH.d : TH.l;

  return (
    <ThemeContext.Provider value={t}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Returns the current runtime theme tokens (TH.l or TH.d) */
export function useAppTheme(): ThemeTokens {
  return useContext(ThemeContext);
}
