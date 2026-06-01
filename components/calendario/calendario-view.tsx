"use client";

import { useMemo } from "react";
import { useAppTheme } from "@/lib/theme-context";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { LECAP, SOBERANOS } from "@/lib/data/renta-fija";
import { BOND_SCHEDULES } from "@/lib/data/bonds-schedules";
import { FB, FH } from "@/lib/constants";

type InstrumentoTipo = "LECAP" | "Soberano";
type EventoTipo = "Renta" | "Amortización" | "Renta + Amort.";

type CalendarEvent = {
  fecha: Date;
  fechaLabel: string;
  ticker: string;
  evento: EventoTipo;
  montoPor1000: number;
  instrumento: InstrumentoTipo;
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseDateDDMMYYYY(raw: string): Date | null {
  const [dd, mm, yy] = raw.split("/").map(Number);
  if (!dd || !mm || !yy) return null;
  return new Date(yy, mm - 1, dd);
}

function parseISODate(raw: string): Date | null {
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("es-AR", { month: "long", year: "numeric" }).toUpperCase();
}

function getEventoTipo(cpn: number, amort: number): EventoTipo | null {
  if (amort > 0 && cpn > 0) return "Renta + Amort.";
  if (amort > 0) return "Amortización";
  if (cpn > 0) return "Renta";
  return null;
}

function eventColor(t: ReturnType<typeof useAppTheme>, evento: EventoTipo) {
  if (evento === "Renta") return { fg: t.gr, bg: t.grBg, brd: `${t.gr}55` };
  if (evento === "Amortización") return { fg: t.go, bg: t.goBg, brd: `${t.go}55` };
  return { fg: t.tx, bg: t.alt, brd: `${t.brd}` };
}

function instrumentoColor(t: ReturnType<typeof useAppTheme>, instrumento: InstrumentoTipo) {
  if (instrumento === "LECAP") return { fg: t.go, bg: t.goBg, brd: `${t.go}55` };
  return { fg: t.bl, bg: t.blBg, brd: `${t.bl}55` };
}

type MonthGroup = {
  key: string;
  label: string;
  rows: CalendarEvent[];
};

function buildMonthGroups(events: CalendarEvent[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  for (const ev of events) {
    const key = monthKey(ev.fecha);
    const existing = map.get(key);
    if (existing) {
      existing.rows.push(ev);
    } else {
      map.set(key, { key, label: monthLabel(ev.fecha), rows: [ev] });
    }
  }
  return [...map.values()].sort((a, b) => a.rows[0].fecha.getTime() - b.rows[0].fecha.getTime());
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

  const events = useMemo<CalendarEvent[]>(() => {
    const today = startOfDay(new Date());
    const in90 = new Date(today);
    in90.setDate(in90.getDate() + 90);

    const out: CalendarEvent[] = [];

    // LECAP vencimientos: tratamos como amortización total al vencimiento.
    for (const g of LECAP) {
      const vto = g.vto ? parseDateDDMMYYYY(g.vto) : null;
      if (!vto) continue;
      const fecha = startOfDay(vto);
      if (fecha < today || fecha > in90) continue;
      for (const row of g.rows) {
        out.push({
          fecha,
          fechaLabel: g.vto,
          ticker: row.t,
          evento: "Amortización",
          montoPor1000: 1000,
          instrumento: "LECAP",
        });
      }
    }

    // Soberanos: usar cronogramas completos de cupones/amortización.
    for (const s of SOBERANOS) {
      const flows = BOND_SCHEDULES[s.t] ?? [];
      for (const flow of flows) {
        const fecha = parseISODate(flow.date);
        if (!fecha) continue;
        const f = startOfDay(fecha);
        if (f < today || f > in90) continue;
        const evento = getEventoTipo(flow.cpn, flow.amort);
        if (!evento) continue;
        out.push({
          fecha: f,
          fechaLabel: formatDate(f),
          ticker: s.t,
          evento,
          montoPor1000: (flow.cpn + flow.amort) * 10,
          instrumento: "Soberano",
        });
      }
    }

    out.sort((a, b) => a.fecha.getTime() - b.fecha.getTime() || a.ticker.localeCompare(b.ticker));
    return out;
  }, []);

  const monthGroups = useMemo(() => buildMonthGroups(events), [events]);

  const tableCtr: React.CSSProperties = {
    background: t.srf,
    border: `1px solid ${t.brd}`,
    borderRadius: 14,
    overflow: "hidden",
    overflowX: "auto",
  };

  return (
    <div className="fade-up">
      <SectionLabel t={t}>CALENDARIO · EVENTOS DE PAGO (90 DÍAS)</SectionLabel>

      <Card t={t} style={{ marginTop: 14, marginBottom: 16 }}>
        <div style={{ padding:"14px 18px", display:"flex", alignItems:"baseline", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontFamily:FH, fontSize:18, fontWeight:800, color:t.tx }}>Rentas, amortizaciones y vencimientos</div>
            <div style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.6 }}>
              Próximos 90 días de flujos para LECAPs y soberanos USD, ordenados por fecha y agrupados por mes.
            </div>
          </div>
          <div style={{ fontFamily:FB, fontSize:11, color:t.fa, fontVariantNumeric:"tabular-nums" }}>
            {events.length} evento{events.length === 1 ? "" : "s"}
          </div>
        </div>
      </Card>

      <div style={tableCtr}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Ticker</Th>
              <Th>Tipo de evento</Th>
              <Th right>Monto por c/$1.000 VN</Th>
              <Th>Instrumento</Th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding:"26px 14px", textAlign:"center", fontFamily:FB, color:t.mu }}>
                  No hay pagos ni vencimientos de LECAPs/soberanos dentro de los próximos 90 días.
                </td>
              </tr>
            ) : (
              monthGroups.flatMap(group => [
                <tr key={`month-${group.key}`} style={{ background: t.alt, borderTop:`1px solid ${t.brd}`, borderBottom:`1px solid ${t.brd}` }}>
                  <td colSpan={5} style={{ padding:"8px 12px", fontFamily:FB, fontSize:10, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:t.mu }}>
                    {group.label}
                  </td>
                </tr>,
                ...group.rows.map((ev, idx) => {
                  const evColor = eventColor(t, ev.evento);
                  const insColor = instrumentoColor(t, ev.instrumento);
                  return (
                    <tr key={`${group.key}-${ev.ticker}-${ev.fechaLabel}-${idx}`} style={{ borderBottom:`1px solid ${t.brd}` }}>
                      <Td bold>{ev.fechaLabel}</Td>
                      <Td bold><span style={{ fontFamily:"monospace" }}>{ev.ticker}</span></Td>
                      <Td>
                        <span style={{
                          fontFamily: FB,
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          padding: "3px 8px",
                          borderRadius: 8,
                          border: `1px solid ${evColor.brd}`,
                          background: evColor.bg,
                          color: evColor.fg,
                        }}>
                          {ev.evento}
                        </span>
                      </Td>
                      <Td right bold>
                        ${ev.montoPor1000.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Td>
                      <Td>
                        <span style={{
                          fontFamily: FB,
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          padding: "3px 8px",
                          borderRadius: 8,
                          border: `1px solid ${insColor.brd}`,
                          background: insColor.bg,
                          color: insColor.fg,
                        }}>
                          {ev.instrumento}
                        </span>
                      </Td>
                    </tr>
                  );
                }),
              ])
            )}
          </tbody>
        </table>
      </div>

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, textAlign:"center", marginTop:10 }}>
        Soberanos: flujos desde `BOND_SCHEDULES` (renta/amortización). LECAP: vencimiento tratado como amortización al 100% de VN.
      </p>
    </div>
  );
}

