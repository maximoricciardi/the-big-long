"use client";

import type React from "react";
import type { ThemeTokens } from "@/types";

interface CardProps {
  children:  React.ReactNode;
  t:         ThemeTokens;
  style?:    React.CSSProperties;
  className?: string;
}

export function Card({ children, t, style = {}, className }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background:   t.srf,
        border:       `1px solid ${t.brd}`,
        borderRadius: 12,
        boxShadow:    t.sh,
        overflow:     "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
