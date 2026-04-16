import type { MicronData } from "@/types";

export const MICRON: MicronData = {
  ticker:      "MU",
  nombre:      "Micron Technology",
  exchange:    "NASDAQ",
  periodo:     "Q2 FY2025",
  reportado:   "18 MAR 2026",
  headline:    "Beat en todas las líneas clave",
  headlineSub: "Revenue, EPS y Outlook superaron ampliamente las estimaciones del consenso",
  beats: [
    {label:"+19,7%",desc:"Rev."},
    {label:"+32,5%",desc:"EPS"},
    {label:"+63,6%",desc:"Guid."},
  ],
  resultados: [
    {label:"Revenue reportado", valor:"$23,86B", badge:"+19,7%", bc:"green"},
    {label:"Estimado consenso",  valor:"$19,94B"},
    {label:"Diferencia absoluta",valor:"+$3,92B",  bc:"green"},
  ],
  rentabilidad: [
    {label:"Adj. EPS reportado", valor:"$12,20",  badge:"+32,5%", bc:"green"},
    {label:"Adj. EPS estimado",  valor:"$9,21"},
    {label:"Net Income",          valor:"$13,79B"},
    {label:"Adj. Net Income",     valor:"$14,02B"},
  ],
  guidance: [
    {label:"REVENUE Q3",      valor:"$33,50B", est:"Est: $23,80B", beat:"+40,8%"},
    {label:"ADJ. EPS Q3",     valor:"$19,15",  est:"Est: $11,70",  beat:"+63,7%"},
    {label:"EPS Q3",          valor:"$18,90",  est:"Guidance"},
    {label:"GROSS MARGIN Q3", valor:"81%",     est:"Proyectado",   isBar:true},
  ],
  analisis: `Micron reportó un trimestre <strong>excepcionalmente fuerte</strong>, superando estimaciones por márgenes inusuales en todos los frentes. El dato más relevante es el <strong>guidance de Q3: Revenue de $33,50B contra un consenso de $23,80B</strong>, un beat forward del <span style="display:inline-block;background:#DCFCE7;color:#166534;padding:1px 7px;border-radius:4px;font-weight:700">+40,8%</span>. Esto sugiere que la demanda de memoria — especialmente <strong>HBM (High Bandwidth Memory) para infraestructura de IA</strong> — está acelerando a un ritmo que el mercado subestimó significativamente.<br/><br/>El <strong>Gross Margin proyectado del 81%</strong> para Q3 refleja poder de fijación de precios sólido y mix favorable hacia productos premium. Si el guidance se materializa, Micron estaría encaminada a convertirse en uno de los mayores beneficiarios del ciclo de inversión en IA. <strong>Riesgo clave:</strong> ejecución en capacidad de HBM y posibles restricciones de exportación hacia China.`,
};
