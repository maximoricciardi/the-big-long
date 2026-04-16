"use client";

import type React from "react";
import type { ThemeTokens } from "@/types";
import { FB } from "@/lib/constants";

interface SectionLabelProps {
  children: React.ReactNode;
  t:        ThemeTokens;
}

export function SectionLabel({ children, t }: SectionLabelProps) {
  return (
    <div style={{
      fontFamily:    FB,
      fontSize:      9,
      fontWeight:    700,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color:         t.fa,
      marginBottom:  12,
    }}>
      {children}
    </div>
  );
}
