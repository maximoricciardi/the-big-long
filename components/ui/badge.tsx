"use client";

import type { ThemeTokens } from "@/types";

type BadgeColor = "green" | "red" | "blue" | "gold" | "gray" | "purple";

interface BadgeProps {
  c?:       BadgeColor | string;
  sm?:      boolean;
  children: React.ReactNode;
  t:        ThemeTokens;
}

export function Badge({ c = "gray", sm, children, t }: BadgeProps) {
  const colors: Record<string, { bg: string; tx: string }> = {
    green:  t.badge.green,
    red:    t.badge.red,
    blue:   t.badge.blue,
    gold:   t.badge.gold,
    gray:   t.badge.gray,
    purple: t.badge.purple,
  };

  const col = colors[c as BadgeColor] ?? t.badge.gray;

  return (
    <span style={{
      display:       "inline-block",
      background:    col.bg,
      color:         col.tx,
      padding:       sm ? "1px 6px" : "2px 8px",
      borderRadius:  4,
      fontSize:      sm ? 9 : 10,
      fontWeight:    700,
      letterSpacing: ".04em",
      whiteSpace:    "nowrap",
      fontFamily:    "'IBM Plex Sans', sans-serif",
    }}>
      {children}
    </span>
  );
}
