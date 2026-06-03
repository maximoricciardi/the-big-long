"use client";

import { useAppTheme } from "@/lib/theme-context";
import { FB } from "@/lib/constants";
import type { DataQualityFlag } from "@/lib/renta-fija";

type BadgeKind = "LIVE" | "REF" | "REVISAR";

function resolveKind(flags: DataQualityFlag[], isLive: boolean): BadgeKind {
  if (flags.includes("bad_live") || flags.includes("tna_outlier")) return "REVISAR";
  if (isLive && !flags.includes("stale_ref")) return "LIVE";
  return "REF";
}

export function DataQualityBadge({
  flags,
  isLive,
}: {
  flags: DataQualityFlag[];
  isLive: boolean;
}) {
  const t = useAppTheme();
  const kind = resolveKind(flags, isLive);

  const styles: Record<BadgeKind, { fg: string; bg: string; brd: string }> = {
    LIVE: { fg: t.gr, bg: t.grBg, brd: `${t.gr}55` },
    REF: { fg: t.mu, bg: t.alt, brd: t.brd },
    REVISAR: { fg: t.rd, bg: t.rdBg, brd: `${t.rd}55` },
  };
  const s = styles[kind];

  return (
    <span
      style={{
        fontFamily: FB,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        padding: "2px 6px",
        borderRadius: 5,
        border: `1px solid ${s.brd}`,
        background: s.bg,
        color: s.fg,
        marginLeft: 6,
      }}
    >
      {kind}
    </span>
  );
}
