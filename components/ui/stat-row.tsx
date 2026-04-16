"use client";

import { Badge } from "./badge";
import type { ThemeTokens } from "@/types";
import { FB } from "@/lib/constants";

interface StatRowProps {
  label: string;
  value: string;
  badge?: string;
  bc?:   string;
  t:     ThemeTokens;
}

export function StatRow({ label, value, badge, bc, t }: StatRowProps) {
  return (
    <div style={{
      display:        "flex",
      justifyContent: "space-between",
      alignItems:     "center",
      padding:        "8px 0",
      borderBottom:   `1px solid ${t.brd}`,
      fontFamily:     FB,
    }}>
      <span style={{ fontSize:12, color:t.mu }}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
        <span style={{ fontSize:13, fontWeight:600, color:t.tx }}>{value}</span>
        {badge && <Badge c={bc ?? "gray"} sm t={t}>{badge}</Badge>}
      </div>
    </div>
  );
}
