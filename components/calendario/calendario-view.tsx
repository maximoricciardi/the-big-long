"use client";

import { useMemo } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { LECAP, SOBERANOS } from "@/lib/data/renta-fija";
import { FB, FH } from "@/lib/constants";

type CalItem = {
  tipo: "LECAP" | "Soberano";
  ticker: string;
  vtoStr: string;
  vto: Date;
  dias: number;
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseVtoFlexible(vto: string): Date | null {
  // dd/mm/yyyy
  if (vto.includes("/")) {
    const [dd, mm, yy] = vto.split("/").map(Number);
    if (!dd || !mm || !yy) return null;
    return new Date(yy, mm - 1, dd);
  }

  // "Oct 2027", "Ene 2038", etc (month + year)
  const m = vto.trim().match(/^([A-Za-zÁÉÍÓÚÜÑñ]+)\s+(\d{4})$/);
  if (!m) return null;

  const monRaw = m[1].toLowerCase();
  const year = Number(m[2]);

  const monthMap: Record<string, number> = {
    ene: 0, enero: 0,
    feb: 1, febrero: 1,
    mar: 2, marzo: 2,
    abr: 3, abril: 3,
    may: 4, mayo: 4,
    jun: 5, junio: 5,
    jul: 6, julio: 6,
    ago: 7, agosto: 7,
    sep: 8, sept: 8, septiembre: 8,
    oct: 9, octubre: 9,
    nov: 10, noviembre: 10,
    dic: 11, diciembre: 11,
  };

  const month = monthMap[monRaw];
  if (month == null || !Number.isFinite(year)) return null;
  return new Date(year, month, 1);
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  const t = useAppTheme();
  return (
    <th style={{ padding:"8px 12px", textAlign:right?"right":"left", fontSize:9, fontWeight:700, color:t.mu, letterSpacing:".08em", textTransform:"uppercase", borderBottom:`2px solid ${t.brd}`, background:t.alt, whiteSpace:"nowrap", position:"sticky", top:0, zIndex:5 }}>
      {children}
    </th>
  );
}

function Td({ children, right, bold, color }: { children: React.ReactNode; right?: boolean; bold?: boolean; color?: string }) {
  const t = useAppTheme();
  return (
    <td style={{ padding:"8px 12px", textAlign:right?"right":"left", fontSize:12, fontWeight:bold?700:400, color:color||t.tx, whiteSpace:"nowrap" }}>
      {children}
    </td>
  );
}

export function CalendarioView() {
  const t = useAppTheme();

  const items = useMemo<CalItem[]>(() => {
    const today = startOfDay(new Date());
    const to = new Date(today);
    to.setDate(to.getDate() + 90);

    const out: CalItem[] = [];

    // LECAP: each group shares a maturity date; include each ticker row
    for (const g of LECAP) {
      const vto = g.vto ? parseVtoFlexible(g.vto) : null;
      if (!vto) continue;
      const vtoDay = startOfDay(vto);
      if (vtoDay < today || vtoDay > to) continue;

      const dias = Math.max(0, Math.round((vtoDay.getTime() - today.getTime()) / 86400000));
      for (const row of g.rows) {
        out.push({ tipo:"LECAP", ticker: row.t, vtoStr: g.vto, vto: vtoDay, dias });
      }
    }

    // SOBERANOS: vto comes as month-year; we approximate day=1 for sorting/filtering
    for (const s of SOBERANOS) {
      const vto = parseVtoFlexible(s.vto);
      if (!vto) continue;
      const vtoDay = startOfDay(vto);
      if (vtoDay < today || vtoDay > to) continue;
      const dias = Math.max(0, Math.round((vtoDay.getTime() - today.getTime()) / 86400000));
      out.push({ tipo:"Soberano", ticker: s.t, vtoStr: s.vto, vto: vtoDay, dias });
    }

    out.sort((a, b) => a.vto.getTime() - b.vto.getTime() || a.ticker.localeCompare(b.ticker));
    return out;
  }, []);

  const tableCtr: React.CSSProperties = {
    background: t.srf,
    border: `1px solid ${t.brd}`,
    borderRadius: 14,
    overflow: "hidden",
    overflowX: "auto",
  };

  return (
    <div className="fade-up">
      <SectionLabel t={t}>CALENDARIO · VENCIMIENTOS (90 DÍAS)</SectionLabel>

      <Card t={t} style={{ marginTop: 14, marginBottom: 16 }}>
        <div style={{ padding:"14px 18px", display:"flex", alignItems:"baseline", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontFamily:FH, fontSize:18, fontWeight:800, color:t.tx }}>Próximos vencimientos</div>
            <div style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.6 }}>
              LECAPs y soberanos con vencimiento dentro de los próximos 90 días, ordenados por fecha.
            </div>
          </div>
          <div style={{ fontFamily:FB, fontSize:11, color:t.fa, fontVariantNumeric:"tabular-nums" }}>
            {items.length} instrumento{items.length === 1 ? "" : "s"}
          </div>
        </div>
      </Card>

      <div style={tableCtr}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Instrumento</Th>
              <Th>Ticker</Th>
              <Th right>Días</Th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding:"26px 14px", textAlign:"center", fontFamily:FB, color:t.mu }}>
                  No hay vencimientos de LECAPs ni soberanos dentro de los próximos 90 días.
                </td>
              </tr>
            ) : (
              items.map((it, i) => (
                <tr key={`${it.tipo}-${it.ticker}-${it.vtoStr}-${i}`} style={{ borderBottom:`1px solid ${t.brd}` }}>
                  <Td bold>{it.vtoStr}</Td>
                  <Td>
                    <span style={{
                      fontFamily: FB,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      borderRadius: 8,
                      border: `1px solid ${it.tipo === "LECAP" ? t.go + "55" : t.bl + "55"}`,
                      background: it.tipo === "LECAP" ? t.goBg : t.blBg,
                      color: it.tipo === "LECAP" ? t.go : t.bl,
                    }}>
                      {it.tipo}
                    </span>
                  </Td>
                  <Td bold><span style={{ fontFamily:"monospace" }}>{it.ticker}</span></Td>
                  <Td right bold color={it.dias <= 7 ? t.rd : it.dias <= 30 ? t.go : t.mu}>
                    {it.dias}d
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, textAlign:"center", marginTop:10 }}>
        Nota: en soberanos, el dataset trae mes/año (sin día); para ordenar/filtrar se aproxima al día 1 del mes.
      </p>
    </div>
  );
}

