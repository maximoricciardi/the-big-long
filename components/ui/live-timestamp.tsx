"use client";

import { useState, useEffect } from "react";
import type { ThemeTokens } from "@/types";
import { FB } from "@/lib/constants";

interface LiveTimestampProps {
  ts: number | null | undefined;
  t:  ThemeTokens;
}

export function LiveTimestamp({ ts, t }: LiveTimestampProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(x => x + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!ts) return null;

  const diff  = Math.round((Date.now() - ts) / 60_000);
  const label = diff < 1 ? "ahora" : diff < 60 ? `hace ${diff} min` : `hace ${Math.floor(diff / 60)}h`;

  return (
    <span style={{ fontFamily:FB, fontSize:9, color:t.fa, display:"inline-flex", alignItems:"center", gap:4 }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background: diff < 5 ? "#22c55e" : "#94a3b8", display:"inline-block" }} />
      Actualizado {label}
    </span>
  );
}
