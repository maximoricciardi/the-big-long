"use client";

import { Badge } from "./badge";
import type { KpiItem, ThemeTokens } from "@/types";
import { FB } from "@/lib/constants";

interface KpiChipProps {
  item: KpiItem;
  t:    ThemeTokens;
}

export function KpiChip({ item, t }: KpiChipProps) {
  return (
    <div style={{
      background:   t.alt,
      border:       `1px solid ${t.brd}`,
      borderRadius: 10,
      padding:      "10px 14px",
      fontFamily:   FB,
      minWidth:     120,
    }}>
      <div style={{ fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>
        {item.k}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
        <span style={{ fontSize:14, fontWeight:700, color:t.tx }}>{item.v}</span>
        <Badge c={item.bc} sm t={t}>{item.b}</Badge>
      </div>
    </div>
  );
}
