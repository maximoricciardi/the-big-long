import { useState, useEffect, useRef, useCallback } from "react";

/* ════════════════════════════════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════════════════════════════════ */
const TH = {
  l: {
    bg:"#FAF9F6", srf:"#FFFFFF", alt:"#F3F1EB", brd:"#E6E2D9",
    tx:"#0C1B30", mu:"#64748B", fa:"#94A3B8",
    go:"#B0782A", goBg:"#FEF9EC", goAcc:"#F59E0B",
    gr:"#166534", grBg:"#F0FDF4", grAcc:"#22C55E",
    rd:"#B91C1C", rdBg:"#FEF2F2", rdAcc:"#EF4444",
    bl:"#1E40AF", blBg:"#EFF6FF", blAcc:"#3B82F6",
    pu:"#6D28D9", puBg:"#F5F3FF",
    hdr:"#FFFFFF", tick:"#0C1B30", tickT:"#94A3B8",
    ft:"#0C1B30", ftT:"#E2E8F0",
    sh:"0 1px 3px rgba(0,0,0,.04), 0 6px 20px rgba(0,0,0,.05)",
    badge:{green:{bg:"#DCFCE7",tx:"#166534"},red:{bg:"#FEE2E2",tx:"#B91C1C"},blue:{bg:"#DBEAFE",tx:"#1E40AF"},gold:{bg:"#FEF3C7",tx:"#92400E"},gray:{bg:"#F3F4F6",tx:"#374151"},purple:{bg:"#EDE9FE",tx:"#6D28D9"}},
  },
  d: {
    bg:"#0D1117", srf:"#161B22", alt:"#1C2128", brd:"#30363D",
    tx:"#E6EDF3", mu:"#8B949E", fa:"#6E7681",
    go:"#D4A853", goBg:"#1A1500", goAcc:"#F59E0B",
    gr:"#3FB950", grBg:"#0A2012", grAcc:"#22C55E",
    rd:"#F85149", rdBg:"#1F0D0D", rdAcc:"#F87171",
    bl:"#58A6FF", blBg:"#0B1A30", blAcc:"#60A5FA",
    pu:"#A371F7", puBg:"#1A1240",
    hdr:"#161B22", tick:"#010409", tickT:"#6E7681",
    ft:"#010409", ftT:"#E6EDF3",
    sh:"0 1px 3px rgba(0,0,0,.3), 0 6px 20px rgba(0,0,0,.2)",
    badge:{green:{bg:"#0A2012",tx:"#3FB950"},red:{bg:"#1F0D0D",tx:"#F85149"},blue:{bg:"#0B1A30",tx:"#58A6FF"},gold:{bg:"#1A1500",tx:"#D4A853"},gray:{bg:"#21262D",tx:"#8B949E"},purple:{bg:"#1A1240",tx:"#A371F7"}},
  }
};

const FH = "'Cormorant Garamond',serif";
const FB = "'DM Sans',sans-serif";

const CONTACT = {
  name: "Máximo Ricciardi",
  title: "Asesor Financiero",
  phone: "(+54) 11 4050-0087",
  email: "mricciardi@balanz.com",
};

/* ════════════════════════════════════════════════════════════════
   FONTS & GLOBAL CSS
════════════════════════════════════════════════════════════════ */
function useFonts(dark) {
  useEffect(() => {
    if (!document.getElementById("mr-fonts")) {
      const l = document.createElement("link");
      l.id = "mr-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
    let s = document.getElementById("mr-css");
    if (!s) { s = document.createElement("style"); s.id = "mr-css"; document.head.appendChild(s); }
    s.textContent = `
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:${dark?"#0D1117":"#FAF9F6"};transition:background .3s}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px}
      @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
      .fade-up{animation:fadeUp .45s ease both}
      .fade-up-1{animation-delay:.05s}.fade-up-2{animation-delay:.1s}.fade-up-3{animation-delay:.15s}.fade-up-4{animation-delay:.2s}
      button:focus-visible,a:focus-visible{outline:2px solid #B0782A;outline-offset:2px}
      .mobile-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
      @media(max-width:640px){
        .hide-mobile{display:none!important}
        .mobile-px{padding-left:14px!important;padding-right:14px!important}
        .mobile-stack{flex-direction:column!important}
        .mobile-full{width:100%!important;min-width:0!important}
        .mobile-text-sm{font-size:11px!important}
        .mobile-hero-title{font-size:34px!important}
        .mobile-tab-label{display:none}
        .mobile-tab-icon{display:inline!important}
      }
    `;
  }, [dark]);
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const days = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return {
    time: now.toLocaleTimeString("es-AR", { hour:"2-digit", minute:"2-digit", second:"2-digit" }),
    date: `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
    dateShort: `${now.getDate()} ${months[now.getMonth()]}`,
  };
}

function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

/* ════════════════════════════════════════════════════════════════
   STATIC DATA
════════════════════════════════════════════════════════════════ */
const SUMMARIES = [
  {
    id:"s20", date:"20 MAR 2026", label:"CIERRE DE MERCADO",
    kpis:[
      {k:"DÓLAR OFICIAL",    v:"$1.394",      b:"estable",      bc:"blue"},
      {k:"BANCOS",           v:"+4/+6%",      b:"líderes",      bc:"green"},
      {k:"RESERVAS VENC.",   v:"USD 9.000M",  b:"cubiertos",    bc:"green"},
      {k:"CONFIANZA CONS.",  v:"-5%",         b:"marzo",        bc:"red"},
      {k:"ORO SPOT",         v:"<USD 4.700",  b:"cae",          bc:"gold"},
      {k:"FED TASAS",        v:"sin baja",    b:"todo 2026",    bc:"gold"},
    ],
    dato:"📊 <b>Dato del día:</b> Bancos habilitados a distribuir hasta el <b>60% de sus ganancias</b> como dividendos. Principal catalizador de la suba bursátil.",
    cards:[
      { cat:"RENTA VARIABLE", icon:"📈", title:"Fuerte suba de acciones a contramano del mundo",
        ac:"#16A34A",
        rows:[
          {l:"Bancos",       v:"+4% / +6%",   b:"green"},
          {l:"YPF",          v:"impulso propio",b:"blue"},
          {l:"Tendencia",    v:"liderando"},
        ],
        note:"Mientras los mercados globales caían, las acciones argentinas <b>subieron con fuerza</b>, con los bancos liderando. YPF se destacó por novedades judiciales positivas en el frente del juicio por la expropiación.",
      },
      { cat:"DEUDA · CONFIANZA", icon:"💰", title:"El gobierno muestra músculo financiero ante los mercados",
        ac:"#1D4ED8",
        rows:[
          {l:"Fondos vencimientos", v:"USD 9.000M", b:"green"},
          {l:"Fuente",             v:"Caputo (Min. Economía)"},
          {l:"Dólar oficial",      v:"$1.394 estable"},
        ],
        note:"El ministro confirmó fondos suficientes para cubrir próximos vencimientos, <b>reduciendo el riesgo de refinanciamiento</b> y generando calma en el mercado de deuda.",
      },
      { cat:"SISTEMA FINANCIERO", icon:"🏦", title:"Bancos habilitados a distribuir hasta el 60% de ganancias",
        ac:"#7C3AED",
        rows:[
          {l:"Distribución habilitada", v:"hasta 60%",  b:"blue"},
          {l:"Impacto bursátil",        v:"principal catalizador"},
          {l:"Subas",                   v:"hasta 6%",   b:"green"},
        ],
        note:"El regulador habilitó a las entidades financieras a distribuir hasta el <b>60% de sus utilidades</b> como dividendos, mejorando significativamente las expectativas del sector.",
      },
      { cat:"ECONOMÍA REAL", icon:"📉", title:"Señales mixtas: comercio débil y consumidor menos optimista",
        ac:"#B45309",
        rows:[
          {l:"Confianza consumidor", v:"-5% marzo",   b:"red"},
          {l:"Comercio exterior",   v:"desaceleración"},
          {l:"Meta inflación",      v:"< 1% agosto"},
        ],
        note:"Exportaciones e importaciones cayeron en términos interanuales. El índice de confianza del consumidor cayó <b>5% en marzo</b>. El gobierno mantiene el objetivo de llevar la inflación por debajo del 1% mensual hacia agosto.",
      },
    ],
    intl:[
      {n:"S&P 500",  v:"6.530",   ch:"-1,51%",   neg:true},
      {n:"Nasdaq",   v:"21.830",  ch:"-2,01%",   neg:true},
      {n:"Dow Jones",v:"45.815",  ch:"-0,96%",   neg:true},
      {n:"VIX",      v:"26,50",   ch:"+10,1%",   neg:true},
      {n:"Brent",    v:"USD 108,5",ch:"+3,2%",   neg:false},
      {n:"WTI",      v:"USD 96,7", ch:"+2,8%",   neg:false},
      {n:"Oro",      v:"USD 4.495",ch:"-2,48%",  neg:true},
    ],
    intlNote:"S&P 500 acumula su <b>cuarta semana consecutiva en rojo</b> — la racha más larga en un año. Fuertes pérdidas en <b>Tesla, Meta, Nvidia y Apple</b>. Trump dijo que <b>no quiere un alto el fuego con Irán</b>. El vencimiento masivo de opciones ('triple witching') por USD 5,7 billones amplificó la volatilidad al cierre. El mercado descuenta que la Fed <b>no recortará tasas en todo 2026</b>. Europa, Reino Unido y Japón mantuvieron tasas sin cambios.",
  },
  {
    id:"s19", date:"19 MAR 2026", label:"CIERRE DE MERCADO",
    kpis:[
      {k:"DÓLAR MAYORISTA",v:"$1.400",    b:"contenido",    bc:"blue"},
      {k:"BCRA COMPRAS",   v:"USD 58M",   b:"acumulando",   bc:"green"},
      {k:"TASA 1D",        v:"~20% TNA",  b:"piso",         bc:"blue"},
      {k:"MERVAL USD",     v:"+1,4%",     b:"sube",         bc:"green"},
      {k:"DESEMPLEO Q4",   v:"7,5%",      b:"vs 6,6%",      bc:"red"},
      {k:"YPF · APELACIÓN",v:"suspendida",b:"mercado calmo",bc:"gold"},
    ],
    dato:"📊 <b>Datos del día:</b> Balanza comercial de febrero · Índice de confianza del consumidor de marzo.",
    cards:[
      { cat:"FX · RESERVAS", icon:"💱", title:"Dólar mayorista contenido en $1.400",
        ac:"#1D4ED8",
        rows:[
          {l:"Dólar mayorista",        v:"$1.400"},
          {l:"Compra BCRA (día)",      v:"USD 58M",  b:"blue"},
          {l:"Intervención futuros",   v:"activa",    b:"blue"},
        ],
        note:"El BCRA habría intervenido en futuros para <b>ponerle techo al tipo de cambio</b>, manteniendo la estabilidad del peso.",
      },
      { cat:"TASAS · LIQUIDEZ", icon:"💹", title:"Tasas planchadas, liquidez en máximos",
        ac:"#16A34A",
        rows:[
          {l:"Tasa 1D",             v:"~20% TNA (piso)"},
          {l:"Liquidez del sistema",v:"máximos desde dic.",b:"green"},
          {l:"Próxima licitación",  v:"fin de mes"},
        ],
        note:"Sin movimientos esperados hasta la <b>próxima licitación del Tesoro a fin de mes</b>. Exceso de pesos en el sistema.",
      },
      { cat:"RENTA VARIABLE · BONOS", icon:"📈", title:"Merval al alza a contramano de emergentes",
        ac:"#16A34A",
        rows:[
          {l:"Merval (USD)",  v:"+1,4%",             b:"green"},
          {l:"Bonos en USD",  v:"baja",               b:"red"},
          {l:"Contexto EM",   v:"presión generalizada",b:"red"},
        ],
        note:"Los bonos en dólares cayeron en línea con mercados emergentes, pero el <b>Merval se diferenció</b> y cerró en positivo.",
      },
      { cat:"ECONOMÍA REAL", icon:"📊", title:"Sube el desempleo en el Q4 2025",
        ac:"#DC2626",
        rows:[
          {l:"Desempleo Q4 2025",v:"7,5%",    b:"red"},
          {l:"Desempleo Q3 2025",v:"6,6%"},
          {l:"Variación",        v:"+0,9 p.p.",b:"red"},
        ],
        note:"La <b>subocupación también creció</b> en el trimestre. Señal de enfriamiento en el mercado laboral.",
      },
      { cat:"JUDICIAL · YPF", icon:"⚖️", title:"Cámara de Apelaciones de NY suspende la ejecución del fallo",
        ac:"#B45309",
        rows:[],
        note:"La Cámara de Apelaciones de Nueva York <b>suspendió la ejecución del fallo de primera instancia</b> hasta que se resuelva la apelación presentada por Argentina. <b>El mercado reaccionó con calma.</b> La suspensión da margen de tiempo al Estado para continuar con el proceso de apelación sin ejecución inmediata.",
      },
    ],
    intl:null,
    alert:{ type:"gold", text:"⚖️ <b>YPF · Fallo:</b> La Cámara de Apelaciones de NY suspende la ejecución del fallo de primera instancia. Apelación sigue su curso. Mercado lo tomó con calma." },
  },
  {
    id:"s18", date:"18 MAR 2026", label:"CIERRE DE MERCADO",
    kpis:[
      {k:"MERVAL USD",v:"USD 1.810",b:"+0,55%",bc:"green"},
      {k:"S&P 500",v:"-1,36%",b:"cierre",bc:"red"},
      {k:"BCRA COMPRAS",v:"USD 58M",b:"reservas USD 44.495M",bc:"blue"},
      {k:"RIESGO PAÍS",v:"610 pb",b:"cierre",bc:"red"},
      {k:"BRENT",v:"+5,78%",b:"geopolítica",bc:"gold"},
      {k:"INFLACIÓN FEB.",v:"1,0%",b:"mín. desde may.",bc:"green"},
    ],
    cards:[
      {cat:"TASAS · LIQUIDEZ", icon:"💹", title:"Tasas en mínimos desde diciembre",
       note:"Lecap corta comprimió con fuerza. La tasa a 1 día se estabilizó en el <b>piso del 20% TNA</b> fijado por el BCRA. El Central absorbió liquidez vía repo, alcanzando <b>máximos recientes de pasivos remunerados</b>. Tasas proyectadas planchadas hasta la próxima licitación.",
       ac:"#16A34A",rows:[{l:"Caución 3D",v:"20,5% TNA"},{l:"Lecap TEM máx. 2026",v:"< 2,4% TEM",b:"gold"},{l:"Curva CER (TIR)",v:"8,6% / -6,2%",b:"gray"},{l:"REPO BCRA",v:"absorción activa"}]},
      {cat:"FX · RESERVAS", icon:"💱", title:"Tipos de cambio al cierre",
       note:"El BCRA compró <b>USD 58M</b> en la rueda. Las reservas brutas cerraron en <b>USD 44.495M</b>, con una caída de USD 226M respecto a la jornada previa, explicada por vencimientos de deuda.",
       ac:"#1D4ED8",rows:[
         {l:"Oficial",v:"$1.418,17",b:"-0,28%",bc:"gold"},
         {l:"MEP",v:"$1.422,57",b:"+0,25%",bc:"green"},
         {l:"CCL",v:"$1.470,27",b:"+0,12%",bc:"green"},
         {l:"Compras BCRA (día)",v:"USD 58M",b:"blue"},
         {l:"Reservas brutas",v:"USD 44.495M",b:"gray"},
       ]},
      {cat:"RENTA VARIABLE · BONOS", icon:"📈", title:"Merval positivo; soberanos a la baja",
       note:"El Merval cerró en <b>USD 1.810,52 (+0,55%)</b>. Lideró YPF con +4,07% y EDN con +3,09%. En el extremo negativo, TRAN cayó <b>-7,08%</b>. Los soberanos cerraron a la baja en línea con el clima externo adverso.",
       ac:"#16A34A",rows:[
         {l:"Merval USD",v:"1.810,52",b:"+0,55%",bc:"green"},
         {l:"YPFD",v:"+4,07%",b:"green"},{l:"EDN",v:"+3,09%",b:"green"},
         {l:"TRAN",v:"-7,08%",b:"red"},{l:"Riesgo país",v:"610 pb",b:"red"},
         {l:"Soberanos USD",v:"a la baja",b:"red"},
       ]},
      {cat:"DATO ECONÓMICO", icon:"📊", title:"Inflación mayorista: mínimo desde mayo",
       note:"",
       ac:"#059669",rows:[{l:"IPIM febrero",v:"1,0% mensual",b:"green"},{l:"Referencia",v:"mín. desde mayo"},{l:"Importados",v:"deflación",b:"green"}]},
    ],
    intl:[
      {n:"S&P 500",   v:"—",       ch:"-1,36%", neg:true},
      {n:"Nasdaq",    v:"—",       ch:"-1,30%", neg:true},
      {n:"Dow Jones", v:"—",       ch:"-1,65%", neg:true},
      {n:"Russell 2000",v:"—",     ch:"-1,63%", neg:true},
      {n:"Brent",     v:"106,23",  ch:"+5,78%", neg:false},
      {n:"Oro (GLD)", v:"444,83",  ch:"-3,14%", neg:true},
      {n:"Plata (SLV)",v:"68,72",  ch:"-4,10%", neg:true},
      {n:"Soja",      v:"1.163",   ch:"+6,72%", neg:false},
      {n:"Bitcoin",   v:"70.636",  ch:"-4,40%", neg:true},
      {n:"VIX",       v:"24,90",   ch:"+11,54%",neg:true},
      {n:"Treasury 10Y",v:"4,265%",ch:"+1,55%", neg:true},
      {n:"DXY",       v:"100,17",  ch:"+0,61%", neg:true},
    ],
    intlNote:"Jornada de <b>risk-off global</b>: todos los índices americanos cayeron más del 1,3%. El VIX trepó +11,5% a 24,90 puntos. Sectores defensivos como Energía (+0,36%) fueron la excepción; Materiales lideró las bajas con -3,29%. En acciones individuales, <b>MU +1,02%</b> (impacto positivo del earnings de la jornada anterior) e <b>INTC +2,80%</b>. En commodities, el Brent escaló +5,78% por tensión en Irán, mientras el oro y la plata retrocedieron con fuerza en la toma de ganancias.",
    intlDestacados:[
      {t:"INTC",ch:"+2,80%",neg:false},{t:"MU",ch:"+1,02%",neg:false},
      {t:"MSFT",ch:"-2,10%",neg:true},{t:"AMZN",ch:"-2,90%",neg:true},
      {t:"XLE (Energía)",ch:"+0,36%",neg:false},{t:"XLB (Materiales)",ch:"-3,29%",neg:true},
    ],
    alert:{type:"red",text:"⚠️ <b>Risk-off:</b> VIX 24,90 (+11,5%). S&P -1,36% · Dow -1,65%. Oro cede terreno; Brent sube +5,78% por Irán. Bitcoin -4,4%."},
  },
  {
    id:"s17", date:"17 MAR 2026", label:"CIERRE DE MERCADO",
    kpis:[
      {k:"LECAP MAYO",v:"2,33% TEM",b:"mínimo",bc:"gold"},
      {k:"DÓLAR BCRA",v:"-0,3%",b:"USD 50M",bc:"blue"},
      {k:"BONOS USD",v:"-0,4%",b:"sem.",bc:"red"},
      {k:"RIESGO PAÍS",v:">600 pts",b:"↑ máx. dic.",bc:"red"},
      {k:"SUPERÁVIT FEB.",v:"0,4% PBI",b:"primario",bc:"green"},
    ],
    dato:"📊 <b>Dato del día:</b> INDEC publica hoy a las 16hs la <b>inflación mayorista de febrero</b>.",
    cards:[
      {cat:"TASAS EN PESOS", icon:"💹", title:"Tasa fija en mínimos desde diciembre",
       note:"El mercado apuesta a que las tasas se <b>mantendrán bajas por período prolongado</b>. Niveles no vistos desde diciembre.",
       ac:"#16A34A",rows:[{l:"Lecap mayo (cierre)",v:"2,33% TEM",b:"green"},{l:"Referencia",v:"mín. desde dic."},{l:"Curva",v:"comprimiendo"}]},
      {cat:"FX · BONOS USD", icon:"💱", title:"Dólar firme, bonos bajo presión",
       note:"La caída de la <b>soja en Chicago</b> contribuyó al mal clima externo. Riesgo país supera 600 pts por primera vez desde diciembre.",
       ac:"#DC2626",rows:[{l:"Variación dólar",v:"-0,3%",b:"gold"},{l:"Compra BCRA",v:"USD 50M",b:"blue"},{l:"Bonos USD",v:"-0,4%",b:"red"},{l:"Riesgo país",v:">600 pts",b:"red"}]},
      {cat:"RESULTADO FISCAL", icon:"📊", title:"Superávit primario en febrero",
       note:"El gobierno acumula <b>24 de 26 meses con resultado positivo</b> desde el inicio de gestión.",
       ac:"#16A34A",rows:[{l:"Superávit feb.",v:"0,4% PBI",b:"green"},{l:"Meses positivos",v:"24 de 26"},{l:"Período",v:"Gestión Milei"}]},
      {cat:"CONTEXTO POLÍTICO", icon:"🎤", title:"Milei en Córdoba",
       note:"El Presidente brindó declaraciones con proyecciones optimistas sobre dinámica inflacionaria.",
       ac:"#1E40AF",quote:'"Para agosto la inflación podría comenzar con cero"',quoteBy:"Javier Milei, Presidente",rows:[]},
    ],
    intl:[{n:"S&P 500",v:"6.678",ch:"-0,15%",neg:true},{n:"Nasdaq",v:"22.350",ch:"-0,10%",neg:false},{n:"Brent",v:"USD 72,4",ch:"-0,8%",neg:true},{n:"Soja",v:"USD 374/t",ch:"-1,2%",neg:true}],
    intlNote:"Mal clima en commodities agrícolas. La soja en Chicago <b>presiona negativamente</b> sobre el ingreso de divisas.",
    alert:{type:"green",text:"📊 <b>INDEC</b> publica hoy a las 16:00hs la inflación mayorista de febrero (IPIM). Señal adelantada del IPC."},
  },
  {
    id:"s16", date:"16 MAR 2026", label:"APERTURA DE MERCADO",
    kpis:[
      {k:"SPOT ARS/USD",v:"$1.400",b:"estable",bc:"green"},
      {k:"CAUCIÓN 3D",v:"20,5% TNA",b:"tasa fija",bc:"blue"},
      {k:"MERVAL USD",v:"+1,1%",b:"sem.",bc:"green"},
      {k:"GLOBALES",v:"-0,9%",b:"sem.",bc:"red"},
      {k:"COMPRAS BCRA",v:"USD 295M",b:"sem.",bc:"blue"},
    ],
    dato:"📋 <b>Agenda:</b> Ministerio de Economía publica resultado fiscal de febrero. Ref. enero: superávit primario <b>0,3% del PBI</b> · financiero <b>0,1% del PBI</b>.",
    cards:[
      {cat:"TASAS · LIQUIDEZ", icon:"💹", title:"Compresión en tasa fija",
       note:"Curva de tasa fija comprimió con fuerza tras la licitación del Tesoro. <b>No quedan bonos de tasa fija por encima del 2,5% TEM.</b>",
       ac:"#16A34A",rows:[{l:"Caución 3D",v:"20,5% TNA"},{l:"Lecap 2026 TEM máx.",v:"< 2,5% TEM",b:"gold"},{l:"REPO BCRA",v:"~$2,4B"}]},
      {cat:"FX · BCRA", icon:"💱", title:"Peso estable, BCRA comprador",
       note:"Peso con mayor resiliencia vs. pares LATAM. Aumento del interés abierto en futuros sugiere <b>presencia oficial activa</b>.",
       ac:"#1D4ED8",rows:[{l:"Compra viernes",v:"USD 45M",b:"blue"},{l:"Acumulado sem.",v:"USD 295M"},{l:"Spot cierre",v:"$1.400"}]},
      {cat:"MERCADOS · PERFORMANCE", icon:"📈", title:"Activos locales vs. sell-off global",
       note:"<b>Outperformance relativa.</b> Globales cedieron menos que la deuda EM. El Merval recortó ganancias pero mostró mayor resiliencia.",
       ac:"#B45309",rows:[{l:"Globales (sem.)",v:"-0,9%",b:"red"},{l:"Deuda emergente",v:"-1,4%",b:"red"},{l:"Merval USD (sem.)",v:"+1,1%",b:"green"}]},
      {cat:"SISTEMA FINANCIERO", icon:"🏛️", title:"Mora en máximos de dos décadas",
       note:"<b>15° mes consecutivo</b> de deterioro. Tasas altas y mayor volatilidad crediticia como factores clave.",
       ac:"#DC2626",rows:[{l:"Familias (ene.)",v:"10,6%",b:"red"},{l:"Ent. no financ.",v:">27%",b:"red"},{l:"Tendencia",v:"deterioro"}]},
    ],
    intl:[{n:"S&P 500",v:"6.720",ch:"+0,57%",neg:false},{n:"Nasdaq",v:"22.540",ch:"+0,82%",neg:false},{n:"Brent",v:"USD 74,1",ch:"+1,1%",neg:false},{n:"Oro",v:"USD 3.020",ch:"+0,4%",neg:false}],
    intlNote:"El sell-off en deuda emergente global presionó sobre los globales argentinos, aunque <b>en menor medida que al resto</b>.",
    alert:{type:"gold",text:"📋 <b>Licitación AO27:</b> Segunda vuelta completada. Colocado USD 100M. Prorrateo 46,5%. Tasa: 5,50% TNA."},
  },
];

const MICRON = {
  ticker:"MU", nombre:"Micron Technology", exchange:"NASDAQ",
  periodo:"Q2 FY2025", reportado:"18 MAR 2026",
  headline:"Beat en todas las líneas clave",
  headlineSub:"Revenue, EPS y Outlook superaron ampliamente las estimaciones del consenso",
  beats:[{label:"+19,7%",desc:"Rev."},{label:"+32,5%",desc:"EPS"},{label:"+63,6%",desc:"Guid."}],
  resultados:[
    {label:"Revenue reportado",valor:"$23,86B",badge:"+19,7%",bc:"green"},
    {label:"Estimado consenso",valor:"$19,94B"},
    {label:"Diferencia absoluta",valor:"+$3,92B",bc:"green"},
  ],
  rentabilidad:[
    {label:"Adj. EPS reportado",valor:"$12,20",badge:"+32,5%",bc:"green"},
    {label:"Adj. EPS estimado",valor:"$9,21"},
    {label:"Net Income",valor:"$13,79B"},
    {label:"Adj. Net Income",valor:"$14,02B"},
  ],
  guidance:[
    {label:"REVENUE Q3",valor:"$33,50B",est:"Est: $23,80B",beat:"+40,8%"},
    {label:"ADJ. EPS Q3",valor:"$19,15",est:"Est: $11,70",beat:"+63,7%"},
    {label:"EPS Q3",valor:"$18,90",est:"Guidance"},
    {label:"GROSS MARGIN Q3",valor:"81%",est:"Proyectado",isBar:true},
  ],
  analisis:`Micron reportó un trimestre <strong>excepcionalmente fuerte</strong>, superando estimaciones por márgenes inusuales en todos los frentes. El dato más relevante es el <strong>guidance de Q3: Revenue de $33,50B contra un consenso de $23,80B</strong>, un beat forward del <span style="display:inline-block;background:#DCFCE7;color:#166534;padding:1px 7px;border-radius:4px;font-weight:700">+40,8%</span>. Esto sugiere que la demanda de memoria — especialmente <strong>HBM (High Bandwidth Memory) para infraestructura de IA</strong> — está acelerando a un ritmo que el mercado subestimó significativamente.<br/><br/>El <strong>Gross Margin proyectado del 81%</strong> para Q3 refleja poder de fijación de precios sólido y mix favorable hacia productos premium. Si el guidance se materializa, Micron estaría encaminada a convertirse en uno de los mayores beneficiarios del ciclo de inversión en IA. <strong>Riesgo clave:</strong> ejecución en capacidad de HBM y posibles restricciones de exportación hacia China.`,
};

// ── LECAP (Tasa Fija) — 19 MAR 2026 10:45hs ─────────────────
const LECAP = [
  {mes:"Abril",     vto:"17/04/2026", dias:29,  rows:[{t:"S17A6", pre:"$107,82",r:"2,14%", tna:"26,91%", tem:"2,21%", fxbe:"$1.452"}]},
  {mes:"Abril",     vto:"30/04/2026", dias:42,  rows:[{t:"S30A6", pre:"$123,83",r:"2,96%", tna:"25,69%", tem:"2,10%", fxbe:"$1.463"}]},
  {mes:"Mayo",      vto:"29/05/2026", dias:71,  rows:[{t:"S29Y6", pre:"$124,96",r:"5,67%", tna:"29,12%", tem:"2,36%", fxbe:"$1.502"}]},
  {mes:"Junio",     vto:"30/06/2026", dias:103, rows:[{t:"T30J6", pre:"$134,20",r:"7,97%", tna:"28,24%", tem:"2,26%", fxbe:"$1.535"}]},
  {mes:"Julio",     vto:"31/07/2026", dias:134, rows:[{t:"S31L6", pre:"$106,81",r:"10,18%",tna:"27,73%", tem:"2,19%", fxbe:"$1.566"}]},
  {mes:"Agosto",    vto:"31/08/2026", dias:165, rows:[{t:"S31G6", pre:"$112,28",r:"13,16%",tna:"29,12%", tem:"2,27%", fxbe:"$1.609"}]},
  {mes:"Septiembre",vto:"30/09/2026", dias:195, rows:[{t:"S30S6", pre:"$101,30",r:"16,03%",tna:"30,01%", tem:"2,31%", fxbe:"$1.649"}]},
  {mes:"Octubre",   vto:"30/10/2026", dias:225, rows:[{t:"S30O6", pre:"$114,00",r:"18,67%",tna:"30,28%", tem:"2,31%", fxbe:"$1.687"}]},
  {mes:"Noviembre", vto:"30/11/2026", dias:256, rows:[{t:"S30N6", pre:"$106,68",r:"21,75%",tna:"31,02%", tem:"2,33%", fxbe:"$1.731"}]},
  {mes:"Ene 2027",  vto:"15/01/2027", dias:302, rows:[{t:"T15E7", pre:"$127,45",r:"26,41%",tna:"31,91%", tem:"2,36%", fxbe:"$1.797"}]},
  {mes:"Abr 2027",  vto:"30/04/2027", dias:407, rows:[{t:"T30A7", pre:"$115,15",r:"36,64%",tna:"32,86%", tem:"2,33%", fxbe:"$1.942"}]},
  {mes:"May 2027",  vto:"31/05/2027", dias:438, rows:[{t:"T31Y7", pre:"$108,00",r:"40,34%",tna:"33,61%", tem:"2,35%", fxbe:"$1.995"}]},
  {mes:"Jun 2027",  vto:"30/06/2027", dias:468, rows:[{t:"T30J7", pre:"$110,25",r:"41,53%",tna:"32,39%", tem:"2,25%", fxbe:"$2.012"}]},
  {mes:"May 2030",  vto:"30/05/2030", dias:1533,rows:[{t:"TY30P", pre:"$118,55",r:"108,49%",tna:"25,83%",tem:"1,45%",fxbe:"$2.964"}]},
];

// ── BONOS DUALES — 19 MAR 2026 ──────────────────────────────
const DUALES = [
  {t:"TTJ26", vto:"30/06/2026", dias:103, temFija:"-1,29%", tnaFija:"-15,40%", temVar:"3,08%", tnaVar:"38,83%", fxbe:"$1.360"},
  {t:"TTS26", vto:"15/09/2026", dias:180, temFija:"0,33%",  tnaFija:"4,00%",   temVar:"3,28%", tnaVar:"43,28%", fxbe:"$1.450"},
  {t:"TTD26", vto:"15/12/2026", dias:271, temFija:"0,92%",  tnaFija:"11,66%",  temVar:"3,26%", tnaVar:"45,33%", fxbe:"$1.545"},
];

// ── LETRAS TAMAR — 19 MAR 2026 ──────────────────────────────
const TAMAR = [
  {t:"M30A6", vto:"30/04/2026", dias:42,  rend:"4,49%",  tna:"39,94%", tem:"3,26%", fxbe:"$1.485"},
  {t:"M31G6", vto:"31/08/2026", dias:165, rend:"19,23%", tna:"42,79%", tem:"3,27%", fxbe:"$1.695"},
];

// ── DÓLAR LINKED — 19 MAR 2026 ──────────────────────────────
const DOLARLINKED = [
  {t:"D30A6", vto:"30/04/2026", dias:42,  pre:"$1.383",rend:"1,17%",  tna:"10,18%"},
  {t:"TZV26", vto:"30/06/2026", dias:103, pre:"$1.412",rend:"-0,87%", tna:"-3,09%"},
  {t:"TZV27", vto:"30/06/2027", dias:468, pre:"$1.310",rend:"6,84%",  tna:"5,33%"},
];

// ── SOBERANOS EN USD — 19 MAR 2026 ──────────────────────────
const SOBERANOS = [
  // ley argentina
  {t:"AO27D",vto:"Oct 2027",p:"$102,20",tir:"4,90%", sprd:"—",    cy:"5,87%",dur:1.56,pago:"Mensual", ley:"ARG",par:"101,84%",var1d:"+0,25%",var1w:"+1,29%",neg:false},
  {t:"AL29D",vto:"Jul 2029",p:"$61,99", tir:"8,38%", sprd:"-2,62%",cy:"1,21%",dur:1.69,pago:"Semestral",ley:"ARG",par:"77,34%", var1d:"-0,18%",var1w:"+1,46%",neg:true},
  {t:"AN29D",vto:"Nov 2029",p:"$94,14", tir:"9,15%", sprd:"—",    cy:"6,67%",dur:3.30,pago:"Semestral",ley:"ARG",par:"92,50%", var1d:"-0,12%",var1w:"+0,68%",neg:true},
  {t:"AL30D",vto:"Jul 2030",p:"$60,67", tir:"9,47%", sprd:"-2,41%",cy:"0,94%",dur:2.12,pago:"Semestral",ley:"ARG",par:"75,73%", var1d:"-0,61%",var1w:"+0,12%",neg:true},
  {t:"AL35D",vto:"Jul 2035",p:"$74,62", tir:"10,31%",sprd:"-1,28%",cy:"5,52%",dur:5.72,pago:"Semestral",ley:"ARG",par:"74,03%", var1d:"-0,64%",var1w:"-1,03%",neg:true},
  {t:"AE38D",vto:"Ene 2038",p:"$76,92", tir:"10,73%",sprd:"-2,95%",cy:"6,50%",dur:4.85,pago:"Semestral",ley:"ARG",par:"76,18%", var1d:"-0,54%",var1w:"-0,88%",neg:true},
  {t:"AL41D",vto:"Jul 2041",p:"$68,70", tir:"10,51%",sprd:"-1,86%",cy:"5,09%",dur:6.13,pago:"Semestral",ley:"ARG",par:"68,24%", var1d:"-0,89%",var1w:"-2,14%",neg:true},
  // ley nueva york
  {t:"GD29D",vto:"Jul 2029",p:"$63,66", tir:"6,72%", sprd:"+2,69%",cy:"1,18%",dur:1.71,pago:"Semestral",ley:"NY", par:"79,42%", var1d:"0,00%", var1w:"+0,89%",neg:false},
  {t:"GD30D",vto:"Jul 2030",p:"$62,17", tir:"8,24%", sprd:"+2,47%",cy:"0,92%",dur:2.14,pago:"Semestral",ley:"NY", par:"77,60%", var1d:"-0,38%",var1w:"-0,69%",neg:true},
  {t:"GD35D",vto:"Jul 2035",p:"$75,59", tir:"10,07%",sprd:"+1,30%",cy:"5,45%",dur:5.75,pago:"Semestral",ley:"NY", par:"74,99%", var1d:"-1,19%",var1w:"-2,97%",neg:true},
  {t:"GD38D",vto:"Ene 2038",p:"$79,26", tir:"10,06%",sprd:"+3,04%",cy:"6,31%",dur:4.92,pago:"Semestral",ley:"NY", par:"78,50%", var1d:"-0,60%",var1w:"-2,27%",neg:true},
  {t:"GD41D",vto:"Jul 2041",p:"$70,00", tir:"10,18%",sprd:"+1,89%",cy:"5,00%",dur:6.18,pago:"Semestral",ley:"NY", par:"69,53%", var1d:"-0,72%",var1w:"-3,05%",neg:true},
  {t:"GD46D",vto:"Jul 2046",p:"$67,07", tir:"—",     sprd:"—",    cy:"—",   dur:6.32,pago:"Semestral",ley:"NY", par:"—",       var1d:"0,00%", var1w:"-2,51%",neg:true},
];

const PERFILES = [
  {
    id:"conservador", label:"Conservador", icon:"🛡️", color:"blue",
    desc:"Preservación de capital con rendimiento real positivo. Horizonte corto-mediano plazo.",
    ideas:[
      {inst:"LECAP Corta (S29Y6)",por:"35%",note:"TEM 2,33% | Vto. Mayo 2026"},
      {inst:"LECAP Julio (S31L6)",por:"25%",note:"TNA 29,43% | Liquidez moderada"},
      {inst:"Caución 3D",por:"20%",note:"20,5% TNA | Liquidez inmediata"},
      {inst:"Dólar MEP",por:"20%",note:"Cobertura cambiaria"},
    ],
    retorno:"TEM ~2,3% — TNA ~27-30%",
    riesgo:"Bajo",
    disclaimer:"Solo a modo orientativo. Consultar asesor antes de invertir.",
  },
  {
    id:"moderado", label:"Moderado", icon:"⚖️", color:"gold",
    desc:"Equilibrio entre cobertura inflacionaria y rendimiento en dólares. Horizonte 6-12 meses.",
    ideas:[
      {inst:"Bono CER (TX26)",por:"30%",note:"Cobertura inflación + spread real"},
      {inst:"LECAP Mayo-Junio",por:"25%",note:"Tasa fija ~ 2,3-2,5% TEM"},
      {inst:"Cedear XOM / KO",por:"20%",note:"Defensivos con dividendo en USD"},
      {inst:"Oro (GLD / GOLD)",por:"15%",note:"Refugio geopolítico"},
      {inst:"Dólar MEP",por:"10%",note:"Liquidez en divisa"},
    ],
    retorno:"Mixto ARS/USD | Apunta a CER + 3-5%",
    riesgo:"Moderado",
    disclaimer:"Solo a modo orientativo. Consultar asesor antes de invertir.",
  },
  {
    id:"dinamico", label:"Dinámico", icon:"🚀", color:"purple",
    desc:"Exposición a activos de mayor beta con potencial de compresión de riesgo país. Horizonte 12-18m.",
    ideas:[
      {inst:"Globales XD (GD38)",por:"30%",note:"Rendimiento ~10% | Ley NY"},
      {inst:"Merval — GGAL / YPF",por:"25%",note:"Blue chips locales con momentum"},
      {inst:"Cedear NVDA / AMD",por:"25%",note:"Exposición al ciclo de IA"},
      {inst:"Oro (cobertura)",por:"10%",note:"Refugio ante volatilidad"},
      {inst:"Cash USD",por:"10%",note:"Táctica y rebalanceo"},
    ],
    retorno:"Potencial alfa USD | Alta variabilidad",
    riesgo:"Moderado-Alto",
    disclaimer:"Solo a modo orientativo. Consultar asesor antes de invertir.",
  },
];

const NOTICIAS = [
  {
    id:"n7", fecha:"20 MAR 2026", cat:"EMPRESAS · $BIOX", catColor:"red",
    titulo:"Bioceres (BIOX) en riesgo de desliste en Nasdaq: cotizó debajo de US$1 durante 30 ruedas",
    cuerpo:`<strong>Bioceres Crop Solutions ($BIOX)</strong> recibió una advertencia formal del Nasdaq por cotizar debajo del <strong>mínimo de US$1</strong> durante 30 ruedas hábiles consecutivas. La compañía tiene plazo hasta <strong>septiembre de 2026</strong> para recuperar el umbral mínimo exigido por el mercado.

Para evitar el desliste, la acción deberá mantenerse <strong>por encima de US$1 durante al menos 10 ruedas hábiles consecutivas</strong>. De no lograrlo, quedará expuesta a un proceso formal de exclusión del mercado.

<em>Dato vs. interpretación:</em> el caso BIOX es un ejemplo contundente de la importancia del análisis fundamental previo a cualquier decisión de inversión. Entender el valor agregado real de una empresa, su estructura financiera y sus fundamentos operativos es la única forma de separar una oportunidad de una trampa de valor. El FOMO y las redes sociales nunca son sustitutos del trabajo de research.`,
    relevancia:"alta",
  },
  {
    id:"n8", fecha:"20 MAR 2026", cat:"AGENDA · MERCADOS", catColor:"blue",
    titulo:"Semana que viene: petróleo volátil, Fed habla, PMIs globales y cumbre del G7",
    cuerpo:`La semana que comienza el <strong>23 de marzo</strong> concentra una agenda densa para los mercados internacionales:

<strong>🛢️ Petróleo:</strong> los precios seguirán dependiendo de los titulares de Medio Oriente y los datos de oferta. Semana clave para monitorear la evolución del conflicto en Irán y el estrecho de Ormuz.

<strong>🏦 Reserva Federal habla:</strong> varios funcionarios de la Fed darán discursos durante la semana, incluyendo la vicepresidencia de supervisión y presidentes de reservas regionales. El mercado estará atento a señales sobre tasas — cualquier lectura hawkish amplificará la presión sobre activos de riesgo.

<strong>📊 PMIs globales (martes):</strong> primer termómetro del impacto económico del conflicto en Medio Oriente sobre la actividad global. Dato clave para evaluar si el shock energético ya está afectando el ciclo.

<strong>🌎 G7 (jueves):</strong> los cancilleres del G7 se reúnen para discutir la guerra en Irán. Evento político relevante — cualquier señal de coordinación o escalada definirá el tono de la segunda parte de la semana.

<em>Dato vs. interpretación:</em> semana de alta densidad informativa. El dato más movedor del mercado será el PMI del martes y los discursos Fed. Si los PMIs muestran deterioro + Fed hawkish, el risk-off seguirá presionando activos de riesgo.`,
    relevancia:"alta",
  },
  {
    id:"n1", fecha:"18 MAR 2026", cat:"POLÍTICA MONETARIA · EEUU", catColor:"blue",
    titulo:"Fed mantiene tasas en 3,75% con primer voto disidente a favor de un recorte",
    cuerpo:`La Reserva Federal dejó sin cambios su tasa de referencia en <strong>3,75%</strong>, en línea con lo esperado por el mercado. Sin embargo, la reunión dejó señales que vale la pena leer con atención.

El elemento más relevante fue la presencia de un <strong>voto disidente</strong> dentro del comité, que solicitó una baja de 25 puntos básicos. Esto confirma que el debate interno sobre el inicio del ciclo de recortes ya está abierto — ya no es una posibilidad remota, sino una discusión activa.

En materia de proyecciones, la Fed <strong>elevó su estimación de PBI 2026 al 2,4%</strong>, señal de resiliencia del ciclo económico, pero también ajustó al alza la inflación esperada al <strong>2,7%</strong>, incorporando el impacto de la tensión geopolítica en Medio Oriente y la dinámica del petróleo. El mercado interpretó el comunicado de forma constructiva: los bonos relajaron rendimientos post-reunión y el mercado de futuros descuenta con mayor convicción un <strong>recorte completo de 25 pbs para diciembre de 2026</strong>.

<em>Dato vs. interpretación:</em> el dato es la tasa sin cambios y el voto disidente; la interpretación es que la Fed está más cerca del pivote de lo que su postura oficial sugiere.`,
    relevancia:"alta",
  },
  {
    id:"n2", fecha:"18 MAR 2026", cat:"ENERGÍA · ARGENTINA", catColor:"green",
    titulo:"Bank of America: Vaca Muerta podría duplicar su producción en cinco a siete años",
    cuerpo:`Un informe de <strong>Bank of America</strong> posiciona a Vaca Muerta como uno de los desarrollos de shale más relevantes a escala global, con potencial para que Argentina ingrese al grupo de los <strong>20 principales productores de petróleo y gas del mundo</strong>.

El análisis destaca que la inclusión de proyectos upstream en el <strong>RIGI</strong> podría acelerar significativamente la perforación a nivel nacional. Sin embargo, el banco advierte que los <strong>costos operativos siguen siendo un 30% a 40% más elevados que en EEUU</strong>, lo que condiciona la velocidad de escala y la rentabilidad de los proyectos.

Los factores clave identificados para sostener el crecimiento son dos: <strong>economías de escala</strong> — que solo se logran con volúmenes sostenidos de perforación — y <strong>previsibilidad regulatoria</strong>, elemento que históricamente ha sido el talón de Aquiles del sector energético argentino.

<em>Dato vs. interpretación:</em> el potencial técnico está reconocido por uno de los bancos de inversión más importantes del mundo; el condicionante es institucional y de costos, no geológico.`,
    relevancia:"alta",
  },
  {
    id:"n3", fecha:"18 MAR 2026", cat:"JUDICIAL · YPF", catColor:"red",
    titulo:"Justicia de EEUU suspende demandas contra Argentina hasta resolver la cuestión de fondo",
    cuerpo:`La Justicia de Estados Unidos <strong>suspendió las demandas en curso contra la Argentina</strong> en el marco del juicio por la expropiación de YPF S.A., hasta tanto se resuelva la cuestión de fondo del caso.

La medida implica un compás de espera procesal que, en principio, reduce la presión de ejecución inmediata sobre activos soberanos argentinos en el exterior. El litigio, que involucra montos que superan los <strong>USD 16.000 millones</strong> según las estimaciones de los demandantes, es uno de los factores de riesgo de cola más relevantes para los activos argentinos.

<em>Dato vs. interpretación:</em> la suspensión es un hecho procesal, no una resolución de fondo. No implica un fallo favorable para Argentina — simplemente posterga el cronograma. El riesgo sigue latente y su evolución merece seguimiento estrecho.`,
    relevancia:"alta",
  },
  {
    id:"n4", fecha:"18 MAR 2026", cat:"TECNOLOGÍA · ENERGÍA", catColor:"purple",
    titulo:"IMPSA exportará componentes nucleares a EEUU: primera vasija de reactor modular del continente",
    cuerpo:`En un hecho que pasó prácticamente desapercibido durante el <strong>Argentina Week 2026</strong>, IMPSA — recientemente privatizada — anunció que exportará componentes nucleares al mercado estadounidense, apuntando directamente al segmento de <strong>reactores modulares pequeños (SMR)</strong>.

El CEO Jorge Salcedo explicó que la <strong>vasija de presión del CAREM 25</strong> — el reactor nuclear de diseño nacional — funcionará como carta de presentación ante desarrolladores de SMR en EEUU, que proyectan construir entre 15 y 30 unidades cada uno. IMPSA tiene capacidad de fabricar entre <strong>3 y 4 vasijas por año</strong>, lo que la posiciona como proveedor de componentes críticos a escala global.

Salcedo también anticipó una próxima asociación con una empresa americana en el área hidroeléctrica para la región latinoamericana. El hito técnico es significativo: <strong>Argentina terminaría la primera vasija de presión de un reactor modular en todo el continente americano</strong>, combinando la ingeniería de CNEA con la capacidad manufacturera de IMPSA.

<em>Dato vs. interpretación:</em> se trata de exportación de manufactura de alta tecnología con uso dual (civil y energético), en un contexto donde la demanda global de SMR está en plena expansión. Es una noticia de largo plazo con potencial impacto sobre la imagen inversora del país.`,
    relevancia:"media",
  },
  {
    id:"n5", fecha:"18 MAR 2026", cat:"MACRO · ARGENTINA", catColor:"red",
    titulo:"INDEC: el desempleo trepó al 7,5% en el cuarto trimestre de 2025",
    cuerpo:`El <strong>INDEC</strong> publicó los datos oficiales del mercado laboral correspondientes al <strong>cuarto trimestre de 2025</strong>: la tasa de desempleo ascendió al <strong>7,5%</strong>, marcando un deterioro respecto a trimestres anteriores.

El dato se da en un contexto de recuperación económica gradual, pero refleja que el mercado de trabajo aún no absorbe el impacto del ajuste macroeconómico. Históricamente, el empleo es el indicador que más demora en reaccionar ante una estabilización: primero mejoran los precios, luego la actividad, y por último el empleo.

<em>Dato vs. interpretación:</em> el 7,5% es un número elevado en términos históricos recientes para Argentina, aunque dentro de los rangos observados en procesos de estabilización previos. La velocidad de recuperación del empleo será uno de los indicadores políticos y económicos más seguidos durante 2026.`,
    relevancia:"alta",
  },
  {
    id:"n6", fecha:"18 MAR 2026", cat:"EMPRESAS · $CEPU", catColor:"green",
    titulo:"Central Puerto invertirá USD 40M en un mega aserradero en Corrientes bajo beneficios del RIGI provincial",
    cuerpo:`<strong>Central Puerto ($CEPU)</strong> anunció una inversión de <strong>USD 40 millones</strong> en un mega aserradero en la provincia de Corrientes, proyecto que comenzará a ejecutarse durante 2026 bajo los beneficios de la ley provincial 5470, que otorga <strong>seguridad jurídica y exenciones impositivas por 15 años</strong>.

El movimiento marca una diversificación significativa para la compañía, tradicionalmente asociada al negocio energético. La apuesta forestal en Corrientes se enmarca en el desarrollo productivo de una provincia con fuerte potencial maderero.

En paralelo, el gobernador de Corrientes aprovechó la oportunidad para reiterar su pedido de <strong>reducir el umbral mínimo de USD 200 millones del RIGI nacional</strong>, buscando que el régimen sea accesible para proyectos de menor escala, característicos de las economías regionales del interior del país.

<em>Dato vs. interpretación:</em> para $CEPU, es una señal de diversificación fuera del core energético. Para el debate político, refuerza la tensión entre un RIGI diseñado para megaproyectos y la necesidad de herramientas para inversiones medianas en el interior.`,
    relevancia:"media",
  },
];

/* ════════════════════════════════════════════════════════════════
   BCRA DATA — 20 MAR 2026
   Fuente: BCRA Informe Monetario / La Macro (último dato disponible)
════════════════════════════════════════════════════════════════ */
const BCRA_DATA = {
  fecha: "20 MAR 2026",
  tamar:     { val: "26,56%", nota: "TNA · Bcos. Privados" },
  badlar:    { val: "26,25%", nota: "TNA · Bcos. Privados" },
  comprasUSD:{ val: "USD 172M", nota: "Compra de divisas del día" },
  reservas:  { val: "USD 43.808M", nota: "Reservas brutas" },
  mayorista: { val: "$1.414", nota: "Tipo de cambio minorista" },
  nota: "El BCRA aceleró compras a USD 172M en la rueda del viernes. Reservas brutas en USD 43.808M, presionadas por la baja del oro en la semana.",
};

/* ════════════════════════════════════════════════════════════════
   UI PRIMITIVES
════════════════════════════════════════════════════════════════ */
function Badge({ c, sm, children, t }) {
  const M = t.badge[c] || t.badge.gray;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      background:M.bg, color:M.tx,
      fontSize:sm?9:11, fontWeight:700, fontFamily:FB,
      padding:sm?"2px 6px":"3px 9px", borderRadius:20, letterSpacing:".02em",
      whiteSpace:"nowrap",
    }}>{children}</span>
  );
}

function SectionLabel({ children, t }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
      <div style={{ width:3, height:20, background:t.go, borderRadius:2 }} />
      <span style={{ fontSize:10, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", fontFamily:FB }}>{children}</span>
    </div>
  );
}

function Card({ children, t, style={} }) {
  return (
    <div style={{
      background:t.srf, borderRadius:14, border:`1px solid ${t.brd}`,
      boxShadow:t.sh, overflow:"hidden", ...style,
    }}>{children}</div>
  );
}

function StatRow({ label, value, badge, bc, t }) {
  return (
    <div style={{
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"8px 0", borderBottom:`1px solid ${t.brd}`,
      fontFamily:FB,
    }}>
      <span style={{ fontSize:12, color:t.mu }}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
        <span style={{ fontSize:13, fontWeight:600, color:t.tx }}>{value}</span>
        {badge && <Badge c={bc||"gray"} sm t={t}>{badge}</Badge>}
      </div>
    </div>
  );
}

function KpiChip({ item, t }) {
  return (
    <div style={{
      background:t.alt, border:`1px solid ${t.brd}`, borderRadius:10,
      padding:"10px 14px", fontFamily:FB, minWidth:120,
    }}>
      <div style={{ fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>{item.k}</div>
      <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
        <span style={{ fontSize:14, fontWeight:700, color:t.tx }}>{item.v}</span>
        <Badge c={item.bc} sm t={t}>{item.b}</Badge>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SUMMARY CARD
════════════════════════════════════════════════════════════════ */
function SummaryCard({ s, t }) {
  if (!s) return null;
  const alertColors = {
    blue:{bg:t.blBg, brd:t.blAcc, tx:t.bl},
    green:{bg:t.grBg, brd:t.grAcc, tx:t.gr},
    gold:{bg:t.goBg, brd:t.goAcc, tx:t.go},
    red:{bg:t.rdBg, brd:t.rdAcc, tx:t.rd},
  };
  const alC = alertColors[s.alert?.type] || alertColors.blue;

  return (
    <div className="fade-up">
      {/* Header banner */}
      <div style={{
        background:`linear-gradient(135deg, ${t.tx} 0%, #1F3560 100%)`,
        borderRadius:14, padding:"28px 28px 24px", marginBottom:20,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", right:-20, top:-20, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.03)" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.5)", letterSpacing:".12em", textTransform:"uppercase", fontFamily:FB, marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:FH, fontSize:44, fontWeight:700, color:"#FFFFFF", lineHeight:1, letterSpacing:"-.01em" }}>
              {s.date.split(" ")[0]} <span style={{ color:t.go }}>{s.date.split(" ").slice(1).join(" ")}</span>
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,.08)", borderRadius:10, padding:"8px 16px", border:"1px solid rgba(255,255,255,.12)" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.5)", fontFamily:FB, letterSpacing:".08em", textTransform:"uppercase", marginBottom:2 }}>ACTUALIZACIÓN</div>
            <div style={{ fontFamily:FB, fontSize:11, fontWeight:600, color:"rgba(255,255,255,.8)" }}>19 MAR 2026</div>
          </div>
        </div>
        {/* KPIs */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:20 }}>
          {s.kpis.map((k,i) => (
            <div key={i} style={{
              background:"rgba(255,255,255,.07)", borderRadius:8, padding:"8px 12px",
              border:"1px solid rgba(255,255,255,.1)", fontFamily:FB,
            }}>
              <div style={{ fontSize:8, color:"rgba(255,255,255,.45)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:3 }}>{k.k}</div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#FFFFFF" }}>{k.v}</span>
                <Badge c={k.bc} sm t={t}>{k.b}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dato/Agenda banner */}
      {s.dato && (
        <div style={{ background:t.goBg, border:`1px solid ${t.goAcc}33`, borderRadius:10, padding:"12px 16px", marginBottom:16, fontFamily:FB, fontSize:13, color:t.tx, lineHeight:1.6 }}
          dangerouslySetInnerHTML={{ __html: s.dato }} />
      )}

      {/* Cards grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14, marginBottom:16 }}>
        {s.cards.map((c2, i) => (
          <Card key={i} t={t}>
            <div style={{ padding:"16px 16px 0", borderBottom:`3px solid ${c2.ac}` }}>
              <div style={{ fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em", fontFamily:FB, marginBottom:4 }}>
                {c2.icon} {c2.cat}
              </div>
              <h3 style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:t.tx, marginBottom:14, lineHeight:1.2 }}>{c2.title}</h3>
            </div>
            <div style={{ padding:"14px 16px 16px" }}>
              {c2.rows?.map((r,j) => <StatRow key={j} label={r.l} value={r.v} badge={r.b} bc={r.b?r.b:undefined} t={t} />)}
              {c2.quote && (
                <div style={{ background:t.alt, borderRadius:8, padding:"10px 14px", margin:"10px 0", fontFamily:FH, fontSize:17, fontStyle:"italic", color:t.tx, lineHeight:1.5 }}>
                  {c2.quote}
                  <div style={{ fontSize:11, fontFamily:FB, fontStyle:"normal", color:t.mu, marginTop:6 }}>— {c2.quoteBy}</div>
                </div>
              )}
              {c2.note && <p style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.7, marginTop:c2.rows?.length?12:4 }} dangerouslySetInnerHTML={{ __html:c2.note }} />}
            </div>
          </Card>
        ))}
      </div>

      {/* Internacional */}
      {s.intl && (
        <Card t={t} style={{ marginBottom:14 }}>
          <div style={{ padding:"16px 20px" }}>
            <SectionLabel t={t}>MERCADOS INTERNACIONALES</SectionLabel>

            {/* Indices + commodities grid */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:14 }}>
              {s.intl.map((m,i) => (
                <div key={i} style={{
                  background:m.neg ? t.rdBg : t.grBg,
                  borderRadius:8, padding:"10px 14px", fontFamily:FB,
                  border:`1px solid ${m.neg ? t.rdAcc+"33" : t.grAcc+"33"}`,
                  minWidth:100,
                }}>
                  <div style={{ fontSize:9, color:t.mu, marginBottom:3, textTransform:"uppercase", letterSpacing:".06em" }}>{m.n}</div>
                  {m.v !== "—" && <div style={{ fontSize:13, fontWeight:700, color:t.tx, marginBottom:1 }}>{m.v}</div>}
                  <div style={{ fontSize:12, fontWeight:700, color:m.neg?t.rd:t.gr }}>{m.ch}</div>
                </div>
              ))}
            </div>

            {/* Acciones destacadas si existen */}
            {s.intlDestacados && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>MOVIMIENTOS DESTACADOS</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {s.intlDestacados.map((d,i) => (
                    <div key={i} style={{
                      background:t.alt, borderRadius:8, padding:"6px 12px",
                      display:"flex", alignItems:"center", gap:8, fontFamily:FB,
                    }}>
                      <span style={{ fontSize:12, fontWeight:700, color:t.tx, fontFamily:"monospace" }}>{d.t}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:d.neg?t.rd:t.gr }}>{d.ch}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {s.intlNote && <p style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.7 }} dangerouslySetInnerHTML={{ __html:s.intlNote }} />}
          </div>
        </Card>
      )}

      {/* Alert */}
      {s.alert && (
        <div style={{
          background:alC.bg, border:`1px solid ${alC.brd}44`,
          borderRadius:10, padding:"12px 18px",
          fontFamily:FB, fontSize:13, color:alC.tx, lineHeight:1.6,
        }} dangerouslySetInnerHTML={{ __html:s.alert.text }} />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   EARNINGS CARD
════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════
   INFORMES VIEW — Balances · Informes de empresas
════════════════════════════════════════════════════════════════ */
function InformesView({ t }) {
  const [sub, setSub] = useState("balances");

  const SUBTABS = [
    { id:"balances",  label:"📊 Balances" },
    { id:"informes",  label:"🔬 Informes" },
  ];

  return (
    <div className="fade-up">
      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {SUBTABS.map(s => (
          <button key={s.id} onClick={()=>setSub(s.id)} style={{
            padding:"9px 22px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:600,
            cursor:"pointer", transition:"all .18s",
            border:`2px solid ${sub===s.id?t.go:t.brd}`,
            background:sub===s.id?t.go+"18":"transparent",
            color:sub===s.id?t.go:t.mu,
          }}>{s.label}</button>
        ))}
      </div>

      {/* ── BALANCES ── */}
      {sub === "balances" && (
        <div>
          <p style={{ fontFamily:FB, fontSize:11, color:t.mu, marginBottom:16, lineHeight:1.6 }}>
            Resultados trimestrales con análisis de ingresos, rentabilidad y guidance. Reportados por Máximo Ricciardi · Balanz Capital.
          </p>
          <EarningsCard t={t} />
        </div>
      )}

      {/* ── INFORMES ── */}
      {sub === "informes" && (
        <div>
          <p style={{ fontFamily:FB, fontSize:11, color:t.mu, marginBottom:16, lineHeight:1.6 }}>
            Análisis fundamental de empresas con perspectiva de inversión. Research Desk · Balanz Capital.
          </p>
          <VISTInformeCard t={t} />
        </div>
      )}
    </div>
  );
}

/* ── Informe VIST ─────────────────────────────────────────────── */
function VISTInformeCard({ t }) {
  return (
    <div className="fade-up">
      <Card t={t} style={{ borderLeft:`4px solid ${t.gr}` }}>
        <div style={{ padding:"24px 26px" }}>

          {/* Header */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:52, height:52, borderRadius:12,
                background:"linear-gradient(135deg,#1a3a1a,#2d6a2d)",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:"#4ade80", fontFamily:FB, fontWeight:900, fontSize:14 }}>VIST</span>
              </div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                  <span style={{ fontFamily:FH, fontSize:24, fontWeight:800, color:t.tx }}>Vista Energy</span>
                  <Badge c="green" sm t={t}>🔬 ANÁLISIS FUNDAMENTAL</Badge>
                </div>
                <span style={{ fontFamily:FB, fontSize:12, color:t.mu }}>
                  E&P Shale · NYSE: VIST · Vaca Muerta · Earnings: 21 ABR 2026
                </span>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:FH, fontSize:34, fontWeight:800, color:t.tx, lineHeight:1 }}>$73.60</div>
              <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>
                NYSE · 20 MAR 2026 · <span style={{color:t.gr,fontWeight:700}}>Score #1 universo 🔥</span>
              </div>
            </div>
          </div>

          {/* Tesis */}
          <div style={{ background:t.grBg, border:`1px solid ${t.gr}22`, borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
            <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.gr, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>
              📌 Tesis de inversión
            </div>
            <p style={{ fontFamily:FB, fontSize:13, color:t.tx, lineHeight:1.75, margin:0 }}>
              Vista Energy es el <strong>pure-play más eficiente de Vaca Muerta</strong>. Con operación casi 100% shale, márgenes EBITDA superiores al 60% y producción creciendo a doble dígito, cotiza a un <strong>Fwd P/E de ~9x</strong> — descuento flagrante frente a pares que operan a 12–15x. El próximo catalizador es el <strong>earnings del 21 ABR 2026</strong>, con potencial de revisión de targets al alza.
            </p>
          </div>

          {/* Métricas clave */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:10, marginBottom:20 }}>
            {[
              { l:"Fwd P/E",       v:"9.19x",    note:"Descuento vs peers ~12-15x", c:t.gr },
              { l:"EBITDA (TTM)",  v:"$1.877B",  note:"Margen EBITDA ~63,7%",       c:t.bl },
              { l:"Revenue (TTM)", v:"$2.474B",  note:"+25% YoY estimado",          c:t.bl },
              { l:"ROE (TTM)",     v:"34,99%",   note:"Retorno sobre equity",        c:t.gr },
              { l:"Margen Neto",   v:"29,2%",    note:"Alta calidad de resultados",  c:t.gr },
              { l:"Score RD",      v:"91.48",    note:"#1 universo Research Desk",   c:t.go },
            ].map((m,i) => (
              <div key={i} style={{ background:t.alt, borderRadius:10, padding:"13px 15px" }}>
                <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>{m.l}</div>
                <div style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:m.c, lineHeight:1 }}>{m.v}</div>
                <div style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:4, lineHeight:1.4 }}>{m.note}</div>
              </div>
            ))}
          </div>

          {/* Fortalezas / Riesgos */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
            <div style={{ background:t.grBg, border:`1px solid ${t.gr}22`, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.gr, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>✅ Fortalezas</div>
              {[
                "Vaca Muerta — segundo play shale más grande fuera de EE.UU.",
                "Producción shale oil >70Kboe/d creciendo a ~15% CAGR.",
                "EBITDA margin >60% — estructura de costos entre las más bajas del sector.",
                "Contratos de exportación en USD — cobertura natural cambiaria.",
                "Management track-record impecable (Galuccio, ex-CEO YPF).",
              ].map((p,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                  <span style={{ color:t.gr, fontWeight:700, flexShrink:0 }}>·</span>
                  <span style={{ fontFamily:FB, fontSize:11, color:t.tx, lineHeight:1.5 }}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{ background:t.rdBg, border:`1px solid ${t.rd}22`, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.rd, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>⚠️ Riesgos</div>
              {[
                "Precio del petróleo: caída bajo $65–70 presionaría márgenes.",
                "Riesgo regulatorio argentino: retenciones a exportaciones de crudo.",
                "Deuda neta elevada (D/E 117%) — expansión CAPEX en curso.",
                "Liquidez: ADR con menor volumen vs pares globales.",
                "Ejecución: integración La Amarga Chica debe mostrar sinergias.",
              ].map((p,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                  <span style={{ color:t.rd, fontWeight:700, flexShrink:0 }}>·</span>
                  <span style={{ fontFamily:FB, fontSize:11, color:t.tx, lineHeight:1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Targets analistas */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:16 }}>
            <span style={{ fontFamily:FB, fontSize:11, color:t.mu }}>Targets:</span>
            {[
              { bank:"Goldman Sachs", target:"$66.90", date:"4 MAR 2026" },
              { bank:"Jefferies",     target:"BUY",    date:"26 FEB 2026" },
              { bank:"HSBC",          target:"BUY",    date:"18 MAR 2026" },
              { bank:"Research Desk", target:"$77.45", date:"20 MAR 2026" },
            ].map((a,i) => (
              <span key={i} style={{ background:t.alt, border:`1px solid ${t.brd}`, borderRadius:8, padding:"4px 12px", fontFamily:FB, fontSize:11 }}>
                <strong style={{ color:t.tx }}>{a.bank}</strong>
                <span style={{ color:t.gr, marginLeft:6, fontWeight:700 }}>{a.target}</span>
                <span style={{ color:t.fa, marginLeft:4 }}>· {a.date}</span>
              </span>
            ))}
          </div>

          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, margin:0, lineHeight:1.5 }}>
            * Análisis orientativo. No constituye recomendación de inversión. Consultar asesor antes de operar. · Máximo Ricciardi · Balanz Capital
          </p>
        </div>
      </Card>
    </div>
  );
}

function EarningsCard({ t }) {
  const m = MICRON;
  return (
    <div className="fade-up">
      <Card t={t} style={{ marginBottom:16 }}>
        <div style={{ padding:"22px 24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:52, height:52, borderRadius:12, background:t.tx, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:t.go, fontFamily:FB, fontWeight:800, fontSize:16 }}>{m.ticker}</span>
              </div>
              <div>
                <h2 style={{ fontFamily:FH, fontSize:26, fontWeight:700, color:t.tx, marginBottom:4 }}>{m.nombre}</h2>
                <div style={{ display:"flex", gap:6 }}>
                  <Badge c="gray" sm t={t}>${m.ticker}</Badge>
                  <Badge c="blue" sm t={t}>{m.exchange}</Badge>
                </div>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".08em", textTransform:"uppercase" }}>{m.periodo} · EARNINGS</div>
              <div style={{ fontFamily:FB, fontSize:11, fontWeight:600, color:t.mu, marginTop:2 }}>Reported {m.reportado}</div>
            </div>
          </div>

          {/* Headline beat */}
          <div style={{ background:t.grBg, border:`1px solid ${t.grAcc}44`, borderRadius:12, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:t.gr, flexShrink:0 }} />
              <div>
                <div style={{ fontFamily:FB, fontWeight:700, fontSize:15, color:t.gr }}>{m.headline}</div>
                <div style={{ fontFamily:FB, fontSize:12, color:t.mu, marginTop:2 }}>{m.headlineSub}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {m.beats.map((b,i) => (
                <div key={i} style={{ background:t.grAcc+"22", border:`1px solid ${t.grAcc}55`, borderRadius:8, padding:"6px 12px", textAlign:"center" }}>
                  <div style={{ fontFamily:FB, fontWeight:800, fontSize:14, color:t.gr }}>{b.label}</div>
                  <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".06em" }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Q2 Results */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Card t={t}>
          <div style={{ padding:"18px 20px" }}>
            <SectionLabel t={t}>📊 INGRESOS (REVENUE)</SectionLabel>
            {m.resultados.map((r,i) => <StatRow key={i} label={r.label} value={r.valor} badge={r.badge} bc={r.bc} t={t} />)}
          </div>
        </Card>
        <Card t={t}>
          <div style={{ padding:"18px 20px" }}>
            <SectionLabel t={t}>💰 RENTABILIDAD</SectionLabel>
            {m.rentabilidad.map((r,i) => <StatRow key={i} label={r.label} value={r.valor} badge={r.badge} bc={r.bc} t={t} />)}
          </div>
        </Card>
      </div>

      {/* Guidance Q3 */}
      <Card t={t} style={{ marginBottom:14 }}>
        <div style={{ padding:"18px 20px" }}>
          <div style={{ fontSize:9, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", fontFamily:FB, marginBottom:14 }}>
            GUIDANCE Q3 — EL DATO QUE MUEVE EL MERCADO
          </div>
          <div style={{ background:t.blBg, border:`1px solid ${t.blAcc}33`, borderRadius:12, padding:"18px 20px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:t.bl, letterSpacing:".08em", textTransform:"uppercase", fontFamily:FB, marginBottom:14 }}>
              🚀 PROYECCIÓN Q3 FY2025 — GUIDANCE VS. CONSENSO
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
              {m.guidance.map((g,i) => (
                <div key={i} style={{ background:t.srf, borderRadius:10, padding:"14px 16px", border:`1px solid ${t.brd}` }}>
                  <div style={{ fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", fontFamily:FB, marginBottom:6 }}>{g.label}</div>
                  <div style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:t.tx, lineHeight:1 }}>{g.valor}</div>
                  <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4 }}>{g.est}</div>
                  {g.beat && <div style={{ marginTop:6 }}><Badge c="green" sm t={t}>▲ {g.beat}</Badge></div>}
                  {g.isBar && (
                    <div style={{ marginTop:8, height:6, borderRadius:3, background:t.brd, overflow:"hidden" }}>
                      <div style={{ width:"81%", height:"100%", background:t.gr, borderRadius:3 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Análisis */}
      <Card t={t}>
        <div style={{ padding:"18px 20px" }}>
          <div style={{ fontSize:9, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", fontFamily:FB, marginBottom:14 }}>
            PROYECCIÓN & CONTEXTO
          </div>
          <div style={{ background:t.alt, borderRadius:10, padding:"18px 20px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:t.go, textTransform:"uppercase", letterSpacing:".08em", fontFamily:FB, marginBottom:12 }}>
              ✨ ¿QUÉ IMPLICA ESTE RESULTADO?
            </div>
            <p style={{ fontFamily:FB, fontSize:13, color:t.tx, lineHeight:1.85 }} dangerouslySetInnerHTML={{ __html: m.analisis }} />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   EQUITY SCREENER DATA  —  19 MAR 2026 · CIERRE NYC
   ARG ADRs: Google Finance (PAM/GGAL pages) live 19 MAR 2026
   US Mega-cap: Robinhood / TradingView / MacroTrends 19 MAR 2026
   NVDA $180.25 · AAPL $249.94 · VIST $57.00 · MELI $2,079
   Scores/Research: "Café con la Mesa" — Daily IR (19 MAR 2026)
════════════════════════════════════════════════════════════════ */
const EQUITIES = [
  // ── ARGENTINA — ADRs NYSE/NASDAQ · Google Finance 19 MAR ─────
  {t:"GGAL", e:"Gpo. Financiero Galicia",  p:49.52,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"MUY FUERTE",sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"BMA",  e:"Banco Macro",              p:78.50,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"MUY FUERTE",sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"BBAR", e:"BBVA Argentina",           p:14.10,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"MEDIA",    val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"SUPV", e:"Grupo Supervielle",        p:10.52,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"MEDIA",    val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"YPF",  e:"YPF S.A.",                p:38.23,   mkt:"ARG",tg:48.53,  an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"PAM",  e:"Pampa Energía",            p:87.15,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"CEPU", e:"Central Puerto",           p:14.60,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"EDN",  e:"Edenor",                   p:32.19,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"MEDIA",    val:null,       mom:"MUY FUERTE",sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"TGS",  e:"Transportadora Gas Sur",   p:30.82,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"VIST", e:"Vista Energy",             p:73.6,   mkt:"ARG",tg:77.45,  an:"BUY", fpe:11.37, fpg:1.44, rw:7.5,  ma:35.52,  up:"MEDIO",    cal:"MEDIA",    val:"RAZONABLE", mom:"MUY FUERTE",sc:91.48,s1:11.31,m1:29.95,a1:53.03, ytd:49.94},
  {t:"LOMA", e:"Loma Negra",              p:10.70,   mkt:"ARG",tg:null,   an:"HOLD",fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"MEDIA",    val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"GLOB", e:"Globant",                 p:61.20,   mkt:"ARG",tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"MELI", e:"MercadoLibre",           p:1670.0, mkt:"ARG",tg:2624.01,an:"BUY", fpe:31.47, fpg:0.9, rw:11.27, ma:-32.5, up:"MUY ALTO",  cal:"ALTA",     val:"BARATA",   mom:"DÉBIL",     sc:48.09,s1:-2.05,m1:-18.58,a1:-18.85,ytd:-17.24},
  {t:"TEO",  e:"Telecom Argentina",       p:12.89,   mkt:"ARG",tg:null,   an:"HOLD",fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"MEDIA",    val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  // ── ESTADOS UNIDOS · Robinhood/TradingView 19 MAR 2026 ──────
  {t:"MU",   e:"Micron Technology",      p:448.20,  mkt:"US", tg:501.78, an:"BUY", fpe:7.88,  fpg:0.03, rw:57.05, ma:50.64,  up:"ALTO",     cal:"EXCELENTE",val:"BARATA",   mom:"MUY FUERTE",sc:90.90,s1:-0.76,m1:0.46,  a1:319.25,ytd:55.66},
  {t:"NVDA", e:"NVIDIA Corp.",           p:179.17,  mkt:"US", tg:264.57, an:"BUY", fpe:21.44, fpg:0.43, rw:81.24, ma:0.16,   up:"MUY ALTO", cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",    sc:74.86,s1:-4.19, m1:-8.13, a1:49.75, ytd:-4.26},
  {t:"AVGO", e:"Broadcom Inc.",          p:319.84,  mkt:"US", tg:467.02, an:"BUY", fpe:27.93, fpg:0.48, rw:19.0, ma:-1.63,  up:"MUY ALTO", cal:"ALTA",     val:"BARATA",   mom:"DÉBIL",    sc:74.3,s1:-3.62, m1:-6.9, a1:58.18, ytd:-7.59},
  {t:"AMAT", e:"Applied Materials",      p:357.21,  mkt:"US", tg:407.73, an:"BUY", fpe:32.36, fpg:1.55, rw:19.11, ma:32.87,  up:"MEDIO",     cal:"ALTA",     val:"RAZONABLE", mom:"MUY FUERTE",sc:72.37,s1:4.55, m1:-3.31, a1:120.19,ytd:39.0},
  {t:"AMD",  e:"Advanced Micro Dev.",    p:203.27,  mkt:"US", tg:280.14, an:"BUY", fpe:31.08, fpg:0.52, rw:-0.21, ma:6.32,   up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"NEUTRO",    sc:62.27,s1:4.11, m1:0.6, a1:81.75, ytd:-4.15},
  {t:"INTC", e:"Intel Corp.",            p:45.77,   mkt:"US", tg:46.07,  an:"HOLD",fpe:88.83, fpg:1.49, rw:-6.52, ma:25.24,  up:"BAJO",     cal:"BAJA",     val:"RAZONABLE", mom:"FUERTE",    sc:51.68,s1:null, m1:-4.88, a1:82.11, ytd:22.03},
  {t:"ASML", e:"ASML Holding",          p:1376.3, mkt:"US", tg:1444.7,an:"BUY", fpe:39.37, fpg:1.63, rw:34.12, ma:26.03,  up:"MEDIO",    cal:"EXCELENTE",val:"RAZONABLE", mom:"FUERTE",    sc:71.42,s1:-2.11, m1:-10.31, a1:79.31, ytd:27.72},
  {t:"TSM",  e:"Taiwan Semiconductor",   p:330.0,  mkt:"US", tg:410.08, an:"BUY", fpe:23.48, fpg:0.77, rw:17.55, ma:16.63,  up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"FUERTE",    sc:69.8,s1:-2.68, m1:-9.11, a1:88.98, ytd:11.48},
  {t:"QCOM", e:"Qualcomm",              p:129.9,  mkt:"US", tg:161.77, an:"HOLD",fpe:11.77, fpg:0.0,  rw:20.96, ma:-21.85, up:"ALTO",     cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",     sc:40.63,s1:0.06, m1:-9.31, a1:-17.91,ytd:-23.25},
  {t:"ARM",  e:"ARM Holdings",          p:132.35,  mkt:"US", tg:149.7, an:"BUY", fpe:74.33, fpg:4.69, rw:5.52,  ma:-6.27,  up:"MEDIO",     cal:"MEDIA",    val:"CARA",     mom:"DÉBIL",    sc:40.71,s1:14.34, m1:4.02, a1:6.70,  ytd:18.76},
  // mega-cap tech
  {t:"AAPL", e:"Apple Inc.",            p:248.96,  mkt:"US", tg:291.24, an:"BUY", fpe:29.05, fpg:2.35, rw:71.6, ma:0.95,   up:"ALTO",     cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",    sc:60.03,s1:-0.85, m1:-6.19, a1:15.44, ytd:-8.42},
  {t:"MSFT", e:"Microsoft Corp.",       p:389.02,  mkt:"US", tg:595.55, an:"BUY", fpe:23.57, fpg:1.34, rw:23.92, ma:-23.23, up:"MUY ALTO", cal:"EXCELENTE",val:"RAZONABLE", mom:"FUERTE",    sc:49.32,s1:1.94, m1:-1.79, a1:0.50,  ytd:-18.99},
  {t:"AMZN", e:"Amazon.com Inc.",       p:208.76,  mkt:"US", tg:279.13, an:"BUY", fpe:26.91, fpg:1.60, rw:7.16,  ma:-7.23,  up:"MUY ALTO", cal:"MEDIA",    val:"RAZONABLE", mom:"FUERTE",    sc:47.69,s1:2.48, m1:2.71,  a1:5.66,  ytd:-9.08},
  {t:"META", e:"Meta Platforms",        p:606.7,  mkt:"US", tg:855.97, an:"BUY", fpe:20.23, fpg:1.05, rw:18.64, ma:-14.2, up:"MUY ALTO", cal:"ALTA",     val:"RAZONABLE", mom:"DÉBIL",    sc:51.4,s1:-3.27, m1:-7.7, a1:4.56,  ytd:-8.09},
  {t:"GOOGL",e:"Alphabet Inc.",         p:307.13,  mkt:"US", tg:359.64, an:"BUY", fpe:26.8, fpg:1.98, rw:27.83, ma:15.92,  up:"ALTO",     cal:"EXCELENTE",val:"RAZONABLE", mom:"FUERTE",    sc:66.8,s1:-0.42, m1:-0.77,  a1:84.93, ytd:-1.88},
  {t:"TSLA", e:"Tesla Inc.",            p:380.3,  mkt:"US", tg:402.7, an:"HOLD",fpe:186.79,fpg:7.52, rw:-2.52, ma:-3.8,  up:"MEDIO",    cal:"BAJA",     val:"CARA",     mom:"DÉBIL",    sc:35.44,s1:-5.94, m1:-10.54, a1:61.47, ytd:-15.44},
  {t:"NFLX", e:"Netflix Inc.",          p:91.74,   mkt:"US", tg:114.16, an:"BUY", fpe:29.2, fpg:1.29, rw:19.15, ma:-18.32, up:"ALTO",     cal:"ALTA",     val:"RAZONABLE", mom:"DÉBIL",     sc:53.55,s1:-3.66, m1:17.73, a1:-1.74, ytd:-2.15},
  {t:"ADBE", e:"Adobe Inc.",            p:248.15,  mkt:"US", tg:324.77, an:"BUY", fpe:10.41, fpg:0.82, rw:27.45, ma:-36.37, up:"MUY ALTO", cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",     sc:53.6,s1:-0.47, m1:-5.71, a1:-35.76,ytd:-29.72},
  {t:"ORCL", e:"Oracle Corp.",          p:155.5,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:1.15, m1:null,  a1:null,   ytd:null},
  {t:"PLTR", e:"Palantir Tech.",        p:155.68,  mkt:"US", tg:189.88, an:"BUY", fpe:117.08,fpg:2.08, rw:30.04, ma:-5.05,  up:"MUY ALTO", cal:"EXCELENTE",val:"CARA",     mom:"DÉBIL",    sc:66.02,s1:null, m1:11.37, a1:76.42, ytd:-12.4},
  // financials
  {t:"JPM",  e:"JPMorgan Chase",        p:287.97,  mkt:"US", tg:338.17, an:"BUY", fpe:13.01, fpg:1.43, rw:-5.86, ma:-4.61,  up:"ALTO",     cal:"BAJA",     val:"RAZONABLE", mom:"DÉBIL",    sc:49.58,s1:1.1, m1:-7.2, a1:19.82, ytd:-10.63},
  {t:"GS",   e:"Goldman Sachs",         p:809.5,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"BAC",  e:"Bank of America",       p:47.01,   mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:1.00, m1:null,  a1:null,   ytd:null},
  {t:"MS",   e:"Morgan Stanley",        p:158.54,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"WFC",  e:"Wells Fargo",           p:77.40,   mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"V",    e:"Visa Inc.",             p:299.71,  mkt:"US", tg:400.28, an:"BUY", fpe:23.3, fpg:1.83, rw:91.88, ma:-13.26, up:"MUY ALTO", cal:"EXCELENTE",val:"RAZONABLE", mom:"DÉBIL",    sc:51.85,s1:null, m1:-5.83, a1:-11.95,ytd:-14.54},
  {t:"MA",   e:"Mastercard",            p:491.14,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"AXP",  e:"American Express",      p:298.00,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  // energía / industrial
  {t:"GEV",  e:"GE Vernova",            p:880.22,  mkt:"US", tg:866.83, an:"BUY", fpe:59.6, fpg:0.8, rw:24.06, ma:28.05,  up:"BAJO",     cal:"EXCELENTE",val:"BARATA",   mom:"FUERTE",    sc:82.14,s1:5.72, m1:4.1,  a1:149.11,ytd:34.25},
  {t:"XOM",  e:"Exxon Mobil",           p:158.15,  mkt:"US", tg:152.31, an:"BUY", fpe:20.71, fpg:2.11, rw:4.99,  ma:23.34,  up:"BAJO",     cal:"BAJA",     val:"CARA",     mom:"FUERTE",    sc:66.58,s1:2.33, m1:6.02,  a1:36.26, ytd:31.43},
  {t:"CVX",  e:"Chevron Corp.",         p:201.43,  mkt:"US", tg:193.93, an:"BUY", fpe:18.99, fpg:1.51, rw:-1.19, ma:20.89,  up:"BAJO",     cal:"BAJA",     val:"RAZONABLE",     mom:"FUERTE",    sc:57.92,s1:2.49, m1:9.71, a1:21.65, ytd:32.17},
  {t:"GE",   e:"GE Aerospace",          p:291.61,  mkt:"US", tg:361.03, an:"BUY", fpe:39.15, fpg:2.5, rw:18.58, ma:-0.01,   up:"MUY ALTO",     cal:"ALTA",     val:"CARA",     mom:"DÉBIL",    sc:51.19,s1:-4.3, m1:-12.98,a1:41.53, ytd:-5.33},
  {t:"RTX",  e:"RTX Corp.",             p:200.73,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"CAT",  e:"Caterpillar Inc.",      p:688.65,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"UBER", e:"Uber Technologies",     p:73.89,   mkt:"US", tg:104.41, an:"BUY", fpe:22.24, fpg:5.27, rw:10.0, ma:-16.56, up:"MUY ALTO", cal:"MEDIA",     val:"CARA",     mom:"DÉBIL",    sc:36.51,s1:0.76, m1:1.54,  a1:5.85,  ytd:-7.8},
  // salud / pharma
  {t:"LLY",  e:"Eli Lilly",            p:917.5,  mkt:"US", tg:1201.43,an:"BUY", fpe:26.51, fpg:0.85, rw:36.46, ma:2.84,   up:"MUY ALTO", cal:"EXCELENTE",val:"BARATA",   mom:"DÉBIL",    sc:82.66,s1:-7.96, m1:-11.16,a1:9.56,  ytd:-14.63},
  {t:"JNJ",  e:"Johnson & Johnson",    p:237.6,  mkt:"US", tg:239.61, an:"BUY", fpe:20.58, fpg:2.62, rw:14.16, ma:18.45,  up:"BAJO",     cal:"ALTA",     val:"CARA",     mom:"FUERTE",    sc:65.8,s1:-2.55, m1:-3.93, a1:46.33, ytd:14.81},
  {t:"UNH",  e:"UnitedHealth Group",   p:275.59,  mkt:"US", tg:363.47, an:"BUY", fpe:15.74, fpg:2.04, rw:4.96,  ma:-12.31, up:"MUY ALTO", cal:"BAJA",     val:"CARA",     mom:"DÉBIL",    sc:39.63,s1:-2.3, m1:-4.38, a1:-43.39,ytd:-15.05},
  {t:"ABBV", e:"AbbVie Inc.",          p:206.21,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:5.21, m1:null,  a1:null,   ytd:null},
  {t:"PFE",  e:"Pfizer Inc.",          p:26.97,   mkt:"US", tg:28.76,  an:"HOLD",fpe:9.2,  fpg:0.0,  rw:2.5,  ma:7.9,   up:"MEDIO",     cal:"BAJA",     val:"BARATA",   mom:"NEUTRO",    sc:47.74,s1:1.5, m1:-1.42,  a1:4.85,  ytd:10.08},
  {t:"AMGN", e:"Amgen Inc.",           p:358.65,  mkt:"US", tg:null,   an:"HOLD",fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"MRK",  e:"Merck & Co.",          p:114.23,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"ALTA",     val:null,       mom:"FUERTE",    sc:null, s1:1.19, m1:null,  a1:null,   ytd:null},
  // consumo
  {t:"WMT",  e:"Walmart Inc.",         p:121.09,  mkt:"US", tg:134.9, an:"BUY", fpe:41.33, fpg:3.81, rw:8.06,  ma:11.03,  up:"MEDIO",    cal:"MEDIA",    val:"CARA",     mom:"NEUTRO",    sc:53.16,s1:-5.93, m1:-6.0, a1:40.56, ytd:8.69},
  {t:"MCD",  e:"McDonald's Corp.",     p:319.42,  mkt:"US", tg:346.68, an:"BUY", fpe:23.4, fpg:2.71, rw:17.92, ma:0.35,   up:"MEDIO",    cal:"ALTA",     val:"CARA",     mom:"DÉBIL",    sc:48.92,s1:null, m1:-5.81, a1:2.90,  ytd:1.29},
  {t:"KO",   e:"Coca-Cola Co.",        p:75.55,   mkt:"US", tg:83.53,  an:"BUY", fpe:23.36, fpg:3.19, rw:27.24, ma:5.97,   up:"MEDIO",    cal:"EXCELENTE",val:"CARA",     mom:"NEUTRO",    sc:60.94,s1:-3.35, m1:-5.96, a1:9.82,  ytd:8.07},
  {t:"PEP",  e:"PepsiCo Inc.",         p:150.04,  mkt:"US", tg:170.52, an:"HOLD",fpe:17.69, fpg:2.8, rw:13.81, ma:4.14,   up:"MEDIO",    cal:"ALTA",     val:"CARA",     mom:"DÉBIL",    sc:43.83,s1:-6.15, m1:-8.73, a1:3.78,  ytd:6.42},
  {t:"PG",   e:"Procter & Gamble",     p:144.85,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"COST", e:"Costco Wholesale",     p:974.78,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"FUERTE",    sc:null, s1:1.63, m1:null,  a1:null,   ytd:null},
  {t:"HD",   e:"Home Depot Inc.",      p:328.21,  mkt:"US", tg:null,   an:"BUY", fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:"EXCELENTE",val:null,       mom:"NEUTRO",    sc:null, s1:null,  m1:null,  a1:null,   ytd:null},
  {t:"NKE",  e:"Nike Inc.",            p:52.37,   mkt:"US", tg:75.93,  an:"BUY", fpe:34.56, fpg:4.45, rw:3.92,  ma:-26.02, up:"MUY ALTO", cal:"BAJA",     val:"CARA",     mom:"DÉBIL",     sc:28.11,s1:-2.98, m1:-20.11,a1:-27.18,ytd:-16.12},
  {t:"DIS",  e:"Walt Disney Co.",      p:99.51,  mkt:"US", tg:130.3, an:"BUY", fpe:14.87, fpg:1.29, rw:-0.7, ma:-13.4, up:"MUY ALTO", cal:"BAJA",     val:"RAZONABLE", mom:"DÉBIL",    sc:36.47,s1:0.21, m1:-7.1, a1:-0.52, ytd:-12.81},
  {t:"BABA", e:"Alibaba Group",        p:122.41,  mkt:"US", tg:192.05, an:"BUY", fpe:25.1, fpg:6.89, rw:-6.41, ma:-17.17,  up:"MUY ALTO", cal:"BAJA",     val:"CARA",     mom:"DÉBIL",    sc:25.84,s1:-9.47, m1:-21.42,a1:-14.49,ytd:-14.79},
  {t:"IBM",  e:"IBM Corp.",            p:241.77,  mkt:"US", tg:305.0, an:"BUY", fpe:20.16, fpg:2.57, rw:6.25,  ma:-11.9, up:"MUY ALTO",     cal:"MEDIA",    val:"CARA",     mom:"DÉBIL",    sc:40.21,s1:-1.83, m1:-7.29, a1:-0.66, ytd:-15.48},
  // emergentes / commodities
  {t:"VALE", e:"Vale S.A.",            p:12.17,   mkt:"US", tg:16.32,  an:"BUY", fpe:7.39,  fpg:0.08, rw:6.29,  ma:17.2,  up:"ALTO",     cal:"MEDIA",    val:"BARATA",   mom:"FUERTE",    sc:71.24,s1:-4.29, m1:-12.19,a1:38.37, ytd:12.28},
  {t:"PBR",  e:"Petrobras",            p:20.74,   mkt:"US", tg:16.89,  an:"BUY", fpe:6.56,  fpg:2.47, rw:10.82, ma:35.2,  up:"BAJO",     cal:"ALTA",     val:"CARA",     mom:"MUY FUERTE",sc:63.5,s1:null, m1:22.96, a1:41.66, ytd:66.92},
  {t:"BBD",  e:"Banco Bradesco",       p:3.41,    mkt:"US", tg:4.13,   an:"BUY", fpe:7.41,  fpg:0.44, rw:-6.8, ma:5.51,   up:"ALTO",     cal:"BAJA",     val:"BARATA",   mom:"NEUTRO",    sc:59.05,s1:-3.4, m1:-14.32,a1:54.64, ytd:6.31},
  {t:"NIO",  e:"NIO Inc.",             p:5.43,    mkt:"US", tg:6.7,   an:"BUY", fpe:0.0,     fpg:0.0,    rw:16.81, ma:9.97,   up:"ALTO",     cal:"ALTA",     val:"BARATA",   mom:"NEUTRO",    sc:62.71,s1:-7.34, m1:10.59, a1:10.74, ytd:15.49},
  // crypto / alternative
  {t:"COIN", e:"Coinbase",             p:197.5,  mkt:"US", tg:255.46, an:"BUY", fpe:59.29, fpg:3.44, rw:12.57, ma:-41.08, up:"MUY ALTO", cal:"ALTA",     val:"CARA",     mom:"DÉBIL",    sc:36.32,s1:1.01, m1:20.39, a1:1.79,  ytd:-10.27},
  {t:"MSTR", e:"MicroStrategy",        p:135.66,  mkt:"US", tg:355.07, an:"BUY", fpe:3.7,  fpg:0.03, rw:-14.13,ma:-94.88, up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"DÉBIL",    sc:21.55,s1:-2.87, m1:8.35,  a1:-55.99,ytd:-9.02},
  {t:"HUT",  e:"Hut 8 Corp.",          p:47.46,   mkt:"US", tg:64.07,  an:"BUY", fpe:0.0,     fpg:0.0,    rw:-18.79,ma:24.69,  up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"FUERTE",    sc:45.76,s1:-1.78, m1:-11.48,a1:263.96,ytd:9.14},
  {t:"GPRK", e:"Genie Energy",         p:9.80,    mkt:"US", tg:10.47,  an:"BUY", fpe:7.03, fpg:0.15, rw:13.76, ma:29.33,  up:"MEDIO",    cal:"ALTA",     val:"BARATA",   mom:"FUERTE",    sc:74.38,s1:11.74,m1:18.07, a1:25.32, ytd:37.52},
  {t:"NBIS", e:"Nebius Group",         p:117.62,  mkt:"US", tg:166.39, an:"BUY", fpe:0.00, fpg:0.00, rw:-9.14, ma:30.09,  up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"MUY FUERTE",sc:60.61,s1:4.13, m1:15.54, a1:349.36,ytd:45.18},
  {t:"NU",   e:"Nu Holdings",          p:13.94,   mkt:"US", tg:19.62,  an:"BUY", fpe:15.97,fpg:0.45, rw:-10.09,ma:-7.26,  up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"DÉBIL",     sc:41.62,s1:0.36, m1:-18.81,a1:22.28, ytd:-15.41},
  {t:"BITF", e:"Bitfarms Ltd.",        p:2.22,    mkt:"US", tg:5.64,   an:"BUY", fpe:0.00, fpg:0.00, rw:-19.33,ma:3.84,   up:"MUY ALTO", cal:"BAJA",     val:"BARATA",   mom:"DÉBIL",     sc:40.64,s1:-3.12,m1:5.34,  a1:108.65,ytd:1.70},
  {t:"BRK.B", e:"Berkshire Hathaway B", p:480.94,  mkt:"US", tg:529.50, an:"BUY", fpe:23.07,fpg:8.30, rw:-6.44, ma:-2.04,  up:"MEDIO",    cal:"BAJA",     val:"CARA",     mom:"DÉBIL",     sc:30.89,s1:-1.81,m1:-3.59, a1:-9.00, ytd:-4.21},
  // ── ETFs SECTORIALES ────────────────────────────────────────
  {t:"SPY",  e:"S&P 500 ETF",          p:648.57,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:0.93, m1:null,  a1:null,   ytd:null},
  {t:"QQQ",  e:"Nasdaq 100 ETF",       p:585.72,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:1.18, m1:null,  a1:null,   ytd:null},
  {t:"XLE",  e:"Energy Sector SPDR",   p:55.92,   mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:0.78, m1:null,  a1:null,   ytd:null},
  {t:"XLF",  e:"Financial Sector SPDR",p:48.99,   mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null, m1:null,  a1:null,   ytd:null},
  {t:"XLK",  e:"Technology SPDR",      p:139.5,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null, m1:null,  a1:null,   ytd:null},
  {t:"XLV",  e:"Health Care SPDR",     p:160.2,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null, m1:null,  a1:null,   ytd:null},
  {t:"GLD",  e:"SPDR Gold Shares",     p:433.5,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"MUY FUERTE",sc:null, s1:3.14, m1:null,  a1:null,   ytd:null},
  {t:"SLV",  e:"iShares Silver",       p:66.8,   mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:4.12, m1:null,  a1:null,   ytd:null},
  {t:"EWZ",  e:"iShares Brazil",       p:40.24,   mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null, m1:null,  a1:null,   ytd:null},
  {t:"SMH",  e:"VanEck Semiconductors",p:195.0,  mkt:"ETF",tg:null,   an:null,  fpe:null,  fpg:null, rw:null,  ma:null,   up:null,       cal:null,       val:null,       mom:"FUERTE",    sc:null, s1:null, m1:null,  a1:null,   ytd:null},
];

const calColor  = {EXCELENTE:"green",ALTA:"blue",MEDIA:"gold",BAJA:"red"};
const valColor  = {BARATA:"green",RAZONABLE:"blue",CARA:"red"};
const momColor  = {"MUY FUERTE":"green",FUERTE:"blue",NEUTRO:"gray",DÉBIL:"red"};
const upColor   = {"MUY ALTO":"green",ALTO:"blue",MEDIO:"gold",BAJO:"gray"};

/* ════════════════════════════════════════════════════════════════
   EQUITY SCREENER COMPONENT
════════════════════════════════════════════════════════════════ */
const FINNHUB_KEY = "d6uv5a9r01qig5460670d6uv5a9r01qig546067g";

function EquityScreener({ t }) {
  // ── Filtros & sort ────────────────────────────────────────────
  const [sortCol, setSortCol] = useState("sc");
  const [sortDir, setSortDir] = useState(-1);
  const [fMkt,  setFMkt]  = useState("Todos");
  const [fCal,  setFCal]  = useState("Todas");
  const [fVal,  setFVal]  = useState("Todas");
  const [fMom,  setFMom]  = useState("Todos");
  const [fAn,   setFAn]   = useState("Todos");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("perf"); // "perf" | "fund"

  // ── Live data ─────────────────────────────────────────────────
  const [livePrices,  setLivePrices]  = useState({});
  const [liveHistory, setLiveHistory] = useState({});
  const [liveStatus,  setLiveStatus]  = useState("loading");
  const [histStatus,  setHistStatus]  = useState("loading");
  const [quotesComplete, setQuotesComplete] = useState(false);
  const livePricesRef = useRef({});

  // Phase 1 — Quotes (precio en vivo + cambio 1D)
  useEffect(() => {
    let cancelled = false;
    const tickers = EQUITIES.map(e => e.t);
    let firstHit = false;
    const run = async () => {
      for (let i = 0; i < tickers.length; i++) {
        if (cancelled) return;
        try {
          const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${tickers[i]}&token=${FINNHUB_KEY}`);
          const d = await r.json();
          if (d.c && d.c > 0) {
            const entry = { price: d.c, change: d.d, changePct: d.dp };
            livePricesRef.current = { ...livePricesRef.current, [tickers[i]]: entry };
            setLivePrices(prev => ({ ...prev, [tickers[i]]: entry }));
            if (!firstHit) { firstHit = true; setLiveStatus("ok"); }
          }
        } catch {}
        if (i < tickers.length - 1) await new Promise(r => setTimeout(r, 820));
      }
      if (!cancelled) {
        if (!firstHit) setLiveStatus("error");
        setQuotesComplete(true);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  // Phase 2 — Candles semanales (1S, 1M, YTD, 52H) — arranca cuando terminan los quotes
  useEffect(() => {
    if (!quotesComplete) return;
    let cancelled = false;
    const tickers = EQUITIES.map(e => e.t);
    const NOW     = Math.floor(Date.now() / 1000);
    const W52_AGO = NOW - 366 * 86400;
    const JAN1    = 1735689600; // 1 ene 2026
    const M1_AGO  = NOW - 30  * 86400;
    const W1_AGO  = NOW - 7   * 86400;

    const findClose = (times, closes, targetTs) => {
      for (let j = 1; j < times.length; j++) {
        if (times[j] > targetTs) return closes[j - 1];
      }
      return closes[closes.length - 1];
    };

    const run = async () => {
      let firstHit = false;
      for (let i = 0; i < tickers.length; i++) {
        if (cancelled) return;
        try {
          const url = `https://finnhub.io/api/v1/stock/candle?symbol=${tickers[i]}&resolution=W&from=${W52_AGO}&to=${NOW}&token=${FINNHUB_KEY}`;
          const r = await fetch(url);
          const d = await r.json();
          if (d.s === "ok" && d.c?.length > 1) {
            const closes = d.c, times = d.t;
            const cur    = livePricesRef.current[tickers[i]]?.price ?? closes[closes.length - 1];
            const hi52   = Math.max(...closes);
            const s1Base = findClose(times, closes, W1_AGO);
            const m1Base = findClose(times, closes, M1_AGO);
            const ytdBase= findClose(times, closes, JAN1);
            setLiveHistory(prev => ({
              ...prev,
              [tickers[i]]: {
                s1:      (cur - s1Base)  / s1Base  * 100,
                m1:      (cur - m1Base)  / m1Base  * 100,
                ytd:     (cur - ytdBase) / ytdBase * 100,
                distHi52:(cur - hi52)    / hi52    * 100,
              }
            }));
            if (!firstHit) { firstHit = true; setHistStatus("ok"); }
          }
        } catch {}
        if (i < tickers.length - 1) await new Promise(r => setTimeout(r, 950));
      }
      if (!cancelled && !firstHit) setHistStatus("error");
    };
    run();
    return () => { cancelled = true; };
  }, [quotesComplete]);

  // ── Helpers ───────────────────────────────────────────────────
  const getUpCategory = (uPct) => {
    if (uPct === null) return null;
    if (uPct > 40)  return "MUY ALTO";
    if (uPct > 20)  return "ALTO";
    if (uPct > 5)   return "MEDIO";
    return "BAJO";
  };

  // Merge live data into equities for filtering & sorting
  const equitiesLive = EQUITIES.map(e => {
    const lp   = livePrices[e.t];
    const hist = liveHistory[e.t];
    const price = lp?.price ?? e.p;
    const upside = e.tg ? (e.tg / price - 1) * 100 : null;
    return {
      ...e,
      p:    price,
      _1d:  lp?.changePct ?? null,
      s1:   hist?.s1   ?? e.s1,
      m1:   hist?.m1   ?? e.m1,
      ytd:  hist?.ytd  ?? e.ytd,
      _d52: hist?.distHi52 ?? e.ma,
      _up:  upside,
      up:   upside !== null ? getUpCategory(upside) : e.up,
    };
  });

  const sort = (col) => {
    if (sortCol === col) setSortDir(d => -d);
    else { setSortCol(col); setSortDir(col === "sc" ? -1 : 1); }
  };

  const filtered = equitiesLive.filter(e => {
    if (fMkt !== "Todos" && e.mkt !== fMkt) return false;
    if (fAn  !== "Todos" && e.an  !== fAn)  return false;
    if (fCal !== "Todas" && e.cal !== fCal) return false;
    if (fVal !== "Todas" && e.val !== fVal) return false;
    if (fMom !== "Todos" && e.mom !== fMom) return false;
    if (search && !e.t.toLowerCase().includes(search.toLowerCase())
               && !e.e.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const av = a[sortCol], bv = b[sortCol];
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    if (typeof av === "string") return av.localeCompare(bv) * sortDir;
    return (av > bv ? 1 : -1) * sortDir;
  });

  // ── Sub-helpers ───────────────────────────────────────────────
  const mktBadge = {
    ARG:{ bg:"#FEF3C7", tx:"#92400E", label:"🇦🇷" },
    US: { bg:"#DBEAFE", tx:"#1E40AF", label:"🇺🇸" },
    ETF:{ bg:"#EDE9FE", tx:"#6D28D9", label:"📦"  },
  };

  const perfColor = (v) => v === null ? t.fa : v >= 0 ? t.gr : t.rd;
  const perfFmt   = (v) => v === null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;

  // Skeleton for cells still loading
  const Skel = () => (
    <div style={{
      width:40, height:9, borderRadius:4,
      background:t.brd, opacity:0.6,
      animation:"blink 1.4s ease-in-out infinite",
    }}/>
  );

  const PerfCell = ({ val, loading }) => (
    <td style={{ padding:"7px 10px", textAlign:"right", whiteSpace:"nowrap" }}>
      {loading ? <Skel /> :
        <span style={{ fontSize:12, fontWeight:600, color:perfColor(val) }}>
          {perfFmt(val)}
        </span>
      }
    </td>
  );

  const Th = ({ label, col, tip, right, center }) => {
    const active = sortCol === col;
    return (
      <th onClick={() => sort(col)} title={tip} style={{
        padding:"9px 10px", textAlign:center?"center":right?"right":"left",
        fontSize:9, fontWeight:700,
        color: active ? t.go : t.mu,
        letterSpacing:".07em", textTransform:"uppercase",
        borderBottom:`2px solid ${t.brd}`,
        background:t.alt, cursor:"pointer", whiteSpace:"nowrap",
        userSelect:"none", position:"sticky", top:0, zIndex:5,
        transition:"color .15s",
      }}>
        {label}{active ? (sortDir === 1 ? " ↑" : " ↓") : ""}
      </th>
    );
  };

  // Pill filter button
  const Pill = ({ label, active, onClick, color }) => (
    <button onClick={onClick} style={{
      padding:"5px 12px", borderRadius:20, fontFamily:FB, fontSize:11,
      fontWeight:active?700:400, cursor:"pointer", transition:"all .15s",
      border:`1.5px solid ${active?(color||t.go)+"88":(t.brd)}`,
      background:active?(color||t.go)+"18":"transparent",
      color:active?(color||t.go):t.mu,
    }}>{label}</button>
  );

  const clearAll = () => {
    setFMkt("Todos"); setFCal("Todas"); setFVal("Todas");
    setFMom("Todos"); setFAn("Todos"); setSearch("");
  };
  const hasFilters = fMkt!=="Todos"||fCal!=="Todas"||fVal!=="Todas"||fMom!=="Todos"||fAn!=="Todos"||search;

  return (
    <div className="fade-up">

      {/* ── STATUS BAR ────────────────────────────────────────── */}
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        {/* Prices */}
        <div style={{
          display:"flex", alignItems:"center", gap:7, padding:"7px 14px",
          borderRadius:8, fontFamily:FB, fontSize:11, whiteSpace:"nowrap",
          border:`1px solid ${liveStatus==="ok"?t.grAcc+"55":liveStatus==="error"?t.rdAcc+"44":t.brd}`,
          background:liveStatus==="ok"?t.grBg:liveStatus==="error"?t.rdBg:t.alt,
          color:liveStatus==="ok"?t.gr:liveStatus==="error"?t.rd:t.mu,
        }}>
          <span style={{ width:7, height:7, borderRadius:"50%", display:"inline-block", flexShrink:0,
            background:liveStatus==="ok"?"#22c55e":liveStatus==="error"?"#ef4444":"#94a3b8",
            boxShadow:liveStatus==="ok"?"0 0 6px #22c55e":"none",
            animation:liveStatus==="loading"?"blink 1s infinite":"none",
          }}/>
          {liveStatus==="loading" && "Cargando precios..."}
          {liveStatus==="ok"      && `Precios en vivo · ${Object.keys(livePrices).length}/${EQUITIES.length} tickers`}
          {liveStatus==="error"   && "Sin conexión · Precios estáticos"}
        </div>
        {/* History */}
        <div style={{
          display:"flex", alignItems:"center", gap:7, padding:"7px 14px",
          borderRadius:8, fontFamily:FB, fontSize:11, whiteSpace:"nowrap",
          border:`1px solid ${histStatus==="ok"?t.blBg:t.brd}`,
          background:histStatus==="ok"?t.blBg:t.alt,
          color:histStatus==="ok"?t.bl:t.mu,
        }}>
          <span style={{ width:7, height:7, borderRadius:"50%", display:"inline-block", flexShrink:0,
            background:histStatus==="ok"?"#3b82f6":histStatus==="error"?"#ef4444":"#94a3b8",
            animation:(histStatus==="loading"||(!quotesComplete))?"blink 1s infinite":"none",
          }}/>
          {!quotesComplete         && "Historial: esperando precios..."}
          {quotesComplete && histStatus==="loading" && `Historial: cargando... ${Object.keys(liveHistory).length}/${EQUITIES.length}`}
          {histStatus==="ok"       && `1S · 1M · YTD · 52H en vivo · ${Object.keys(liveHistory).length}/${EQUITIES.length}`}
          {histStatus==="error"    && "Historial: usando datos estáticos"}
        </div>
        <div style={{ flex:1, fontFamily:FB, fontSize:10, color:t.fa, textAlign:"right" }}>
          ⚠️ Uso interno · No constituye asesoramiento de inversión
        </div>
      </div>

      {/* ── FILTROS ───────────────────────────────────────────── */}
      <div style={{ marginBottom:14 }}>
        {/* Búsqueda + mercado */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginBottom:8 }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.mu, fontSize:13 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar ticker o empresa..."
              style={{
                fontFamily:FB, fontSize:12, padding:"7px 10px 7px 30px",
                borderRadius:10, border:`1.5px solid ${t.brd}`,
                background:t.srf, color:t.tx, width:200, outline:"none",
              }}
              onFocus={e=>e.target.style.borderColor=t.go}
              onBlur={e=>e.target.style.borderColor=t.brd}
            />
          </div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            <Pill label="🇦🇷 ARG" active={fMkt==="ARG"} onClick={()=>setFMkt(fMkt==="ARG"?"Todos":"ARG")} color="#92400E"/>
            <Pill label="🇺🇸 US"  active={fMkt==="US"}  onClick={()=>setFMkt(fMkt==="US" ?"Todos":"US")}  color="#1E40AF"/>
            <Pill label="📦 ETF" active={fMkt==="ETF"} onClick={()=>setFMkt(fMkt==="ETF"?"Todos":"ETF")} color="#6D28D9"/>
          </div>
          {/* View mode */}
          <div style={{ marginLeft:"auto", display:"flex", gap:4 }}>
            {[{id:"perf",label:"Performance"},{id:"fund",label:"Fundamentals"}].map(v=>(
              <button key={v.id} onClick={()=>setViewMode(v.id)} style={{
                padding:"6px 14px", borderRadius:8, fontFamily:FB, fontSize:11, cursor:"pointer",
                border:`1.5px solid ${viewMode===v.id?t.go:t.brd}`,
                background:viewMode===v.id?t.go+"18":"transparent",
                color:viewMode===v.id?t.go:t.mu, fontWeight:viewMode===v.id?700:400,
              }}>{v.label}</button>
            ))}
          </div>
        </div>

        {/* Filtros categóricos */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".06em" }}>CALIDAD:</span>
          {["EXCELENTE","ALTA","MEDIA","BAJA"].map(v=>(
            <Pill key={v} label={v} active={fCal===v} onClick={()=>setFCal(fCal===v?"Todas":v)}
              color={v==="EXCELENTE"?t.gr:v==="ALTA"?t.bl:v==="MEDIA"?t.go:t.rd}/>
          ))}
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".06em", marginLeft:8 }}>VAL:</span>
          {["BARATA","RAZONABLE","CARA"].map(v=>(
            <Pill key={v} label={v} active={fVal===v} onClick={()=>setFVal(fVal===v?"Todas":v)}
              color={v==="BARATA"?t.gr:v==="RAZONABLE"?t.bl:t.rd}/>
          ))}
          <span style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".06em", marginLeft:8 }}>ANALISTAS:</span>
          {["BUY","HOLD"].map(v=>(
            <Pill key={v} label={v} active={fAn===v} onClick={()=>setFAn(fAn===v?"Todos":v)}
              color={v==="BUY"?t.gr:t.go}/>
          ))}
          {hasFilters && (
            <button onClick={clearAll} style={{
              marginLeft:4, padding:"5px 12px", borderRadius:20,
              border:`1px solid ${t.brd}`, background:"transparent",
              fontFamily:FB, fontSize:11, color:t.rd, cursor:"pointer",
            }}>✕ Limpiar</button>
          )}
          <span style={{ marginLeft:"auto", fontFamily:FB, fontSize:11, color:t.fa }}>
            {filtered.length} de {EQUITIES.length} instrumentos
          </span>
        </div>
      </div>

      {/* ── TABLA ─────────────────────────────────────────────── */}
      <Card t={t}>
        <div style={{ overflowX:"auto", maxHeight:"72vh", overflowY:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB, fontSize:12 }}>
            <thead>
              <tr>
                <Th label="#"       col="_rank" tip="Ranking" />
                <Th label="Ticker"  col="t"     tip="Símbolo · Empresa · Mercado" />
                <Th label="Precio"  col="p"     tip="Precio en vivo · Finnhub" right />
                <Th label="Hoy"     col="_1d"   tip="Variación del día %" right />
                <Th label="Score"   col="sc"    tip="Score compuesto 0–100" right />

                {viewMode === "perf" ? (<>
                  <Th label="1 Sem" col="s1"  tip="Retorno última semana" right />
                  <Th label="1 Mes" col="m1"  tip="Retorno último mes" right />
                  <Th label="YTD"   col="ytd" tip="Retorno año hasta hoy" right />
                  <Th label="vs 52H" col="_d52" tip="% vs máximo 52 semanas" right />
                  <Th label="Target" col="tg" tip="Precio objetivo" right />
                  <Th label="Potencial" col="_up" tip="Upside al target" right />
                </>) : (<>
                  <Th label="Target"   col="tg"  tip="Precio objetivo consenso" right />
                  <Th label="Potencial" col="_up" tip="Upside al target" right />
                  <Th label="Fwd P/E"  col="fpe" tip="Precio / ganancias est. fwd" right />
                  <Th label="ROIC−WACC" col="rw" tip="Creación de valor económico" right />
                  <Th label="Calidad"  col="cal" tip="Calidad del negocio" center />
                  <Th label="Valuación" col="val" tip="Múltiplos vs histórico" center />
                </>)}

                <Th label="Momentum" col="mom" tip="Impulso de precio" center />
                <Th label="Analistas" col="an" tip="Consenso Wall St." center />
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const mb      = mktBadge[e.mkt] || mktBadge.US;
                const lp      = livePrices[e.t];
                const hasHist = !!liveHistory[e.t];
                const histLoading = !hasHist && quotesComplete && histStatus !== "error";
                const ud      = e._up;
                const udStr   = ud !== null ? `${ud >= 0 ? "+" : ""}${ud.toFixed(1)}%` : null;
                const upCat   = e.up;

                return (
                  <tr key={e.t}
                    style={{ borderBottom:`1px solid ${t.brd}44`, transition:"background .1s" }}
                    onMouseEnter={ev=>ev.currentTarget.style.background=t.alt}
                    onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>

                    {/* # */}
                    <td style={{ padding:"7px 8px", fontSize:10, color:t.fa, textAlign:"center", width:30 }}>
                      {e.sc ? i+1 : "—"}
                    </td>

                    {/* Ticker + empresa + mercado */}
                    <td style={{ padding:"7px 10px", minWidth:170 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{
                          width:28, height:28, borderRadius:6, flexShrink:0,
                          background:mb.bg, display:"flex", alignItems:"center",
                          justifyContent:"center", fontSize:14,
                        }}>{mb.label}</div>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <span style={{ fontSize:12, fontWeight:700, color:t.tx }}>{e.t}</span>
                            {lp && <span style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} title="Precio en vivo"/>}
                          </div>
                          <div style={{ fontSize:10, color:t.mu, maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.e}</div>
                        </div>
                      </div>
                    </td>

                    {/* Precio */}
                    <td style={{ padding:"7px 10px", textAlign:"right", whiteSpace:"nowrap" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:t.tx }}>
                        {e.cur==="ARS" ? `$${e.p.toLocaleString("es-AR")}` : `$${e.p.toFixed(2)}`}
                      </div>
                    </td>

                    {/* Hoy 1D% */}
                    <td style={{ padding:"7px 10px", textAlign:"right" }}>
                      {e._1d !== null
                        ? <span style={{ fontSize:12, fontWeight:600, color:perfColor(e._1d) }}>{perfFmt(e._1d)}</span>
                        : <span style={{ color:t.fa }}>—</span>}
                    </td>

                    {/* Score */}
                    <td style={{ padding:"7px 10px", textAlign:"right" }}>
                      {e.sc !== null ? (
                        <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"flex-end" }}>
                          <div style={{ width:32, height:4, borderRadius:3, background:t.brd, overflow:"hidden" }}>
                            <div style={{ width:`${e.sc}%`, height:"100%", borderRadius:3,
                              background:e.sc>=70?t.grAcc:e.sc>=40?t.go:t.rdAcc }} />
                          </div>
                          <span style={{ fontSize:12, fontWeight:800, color:e.sc>=70?t.gr:e.sc>=40?t.go:t.rd }}>
                            {e.sc.toFixed(1)}
                          </span>
                        </div>
                      ) : <span style={{ color:t.fa }}>—</span>}
                    </td>

                    {/* PERFORMANCE VIEW */}
                    {viewMode === "perf" ? (<>
                      <PerfCell val={e.s1}   loading={histLoading && e.s1===null} />
                      <PerfCell val={e.m1}   loading={histLoading && e.m1===null} />
                      <PerfCell val={e.ytd}  loading={histLoading && e.ytd===null} />
                      <PerfCell val={e._d52} loading={histLoading && e._d52===null} />
                      {/* Target */}
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12, color:t.mu }}>
                        {e.tg ? `$${e.tg.toFixed(2)}` : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* Potencial */}
                      <td style={{ padding:"7px 10px", textAlign:"right" }}>
                        {udStr ? (
                          <div>
                            <span style={{ fontSize:12, fontWeight:700, color:ud>=0?t.gr:t.rd }}>{udStr}</span>
                            {upCat && <div style={{ fontSize:9, color:t.mu, marginTop:1 }}>{upCat}</div>}
                          </div>
                        ) : <span style={{ color:t.fa }}>—</span>}
                      </td>
                    </>) : (<>
                      {/* FUNDAMENTALS VIEW */}
                      {/* Target */}
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12, color:t.mu }}>
                        {e.tg ? `$${e.tg.toFixed(2)}` : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* Potencial */}
                      <td style={{ padding:"7px 10px", textAlign:"right" }}>
                        {udStr ? (
                          <span style={{ fontSize:12, fontWeight:700, color:ud>=0?t.gr:t.rd }}>{udStr}</span>
                        ) : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* Fwd P/E */}
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12 }}>
                        {e.fpe ? <span style={{ color:e.fpe<20?t.gr:e.fpe<35?t.mu:t.rd }}>{e.fpe}</span>
                               : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* ROIC-WACC */}
                      <td style={{ padding:"7px 10px", textAlign:"right", fontSize:12 }}>
                        {e.rw !== null
                          ? <span style={{ fontWeight:600, color:e.rw>=0?t.gr:t.rd }}>{e.rw>=0?"+":""}{e.rw}%</span>
                          : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* Calidad */}
                      <td style={{ padding:"7px 10px", textAlign:"center" }}>
                        {e.cal ? <Badge c={calColor[e.cal]||"gray"} sm t={t}>{e.cal}</Badge>
                               : <span style={{ color:t.fa }}>—</span>}
                      </td>
                      {/* Valuación */}
                      <td style={{ padding:"7px 10px", textAlign:"center" }}>
                        {e.val ? <Badge c={valColor[e.val]||"gray"} sm t={t}>{e.val}</Badge>
                               : <span style={{ color:t.fa }}>—</span>}
                      </td>
                    </>)}

                    {/* Momentum — siempre visible */}
                    <td style={{ padding:"7px 10px", textAlign:"center" }}>
                      {e.mom ? <Badge c={momColor[e.mom]||"gray"} sm t={t}>{e.mom}</Badge>
                             : <span style={{ color:t.fa }}>—</span>}
                    </td>

                    {/* Analistas */}
                    <td style={{ padding:"7px 10px", textAlign:"center" }}>
                      {e.an ? <Badge c={e.an==="BUY"?"green":"gold"} sm t={t}>{e.an}</Badge>
                            : <span style={{ color:t.fa }}>—</span>}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          padding:"8px 18px", borderTop:`1px solid ${t.brd}`,
          display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8
        }}>
          <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
            Precios: Finnhub (en vivo) · Historial: Finnhub Weekly Candles · Scores: Research Desk Balanz
          </span>
          <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
            {filtered.length} resultados · Ordenado por {sortCol} {sortDir === 1 ? "↑" : "↓"}
          </span>
        </div>
      </Card>
    </div>
  );
}
/* ════════════════════════════════════════════════════════════════
   INSTRUMENTOS VIEW — tabs: LECAP | Soberanos | Renta Variable
════════════════════════════════════════════════════════════════ */
/* ── Calcula YTM via bisección numérica (Newton aproximado) ── */
function calcBondMetrics(s, livePrice) {
  const baseP = parseFloat(s.p.replace("$","").replace(".","").replace(",","."));
  const price  = livePrice || baseP;
  const isLive = !!livePrice;

  // ── TIR por aproximación de duración modificada ───────────────
  let newTIR = null;
  if (s.tir !== "—") {
    const baseTIR = parseFloat(s.tir.replace("%","").replace(",","."))/100;
    const modDur  = s.dur / (1 + baseTIR / 2);
    const dTIR    = (baseP - price) / (baseP * modDur) * 100;
    newTIR = baseTIR * 100 + dTIR;
  }

  // ── Current Yield = cupón anual $ / precio live ───────────────
  let newCY = null;
  if (s.cy !== "—") {
    const baseCY = parseFloat(s.cy.replace("%","").replace(",","."))/100;
    const annualCouponUSD = baseCY * baseP;
    newCY = (annualCouponUSD / price) * 100;
  }

  // ── Paridad = precio / VT fijo ────────────────────────────────
  let newPar = null;
  if (s.par !== "—") {
    const basePar = parseFloat(s.par.replace("%","").replace(",","."))/100;
    const vtFixed = baseP / basePar;
    newPar = (price / vtFixed) * 100;
  }

  const varVsBase = ((price - baseP) / baseP * 100);
  return { price, isLive, newTIR, newCY, newPar, varVsBase };
}

function InstrumentosView({ t }) {
  const [sub, setSub] = useState("lecap");
  const [bondPrices,  setBondPrices]  = useState({});
  const [bondStatus,  setBondStatus]  = useState("loading");
  const [uvaIndex,    setUvaIndex]    = useState(null);
  const [tamarRate,   setTamarRate]   = useState(null);
  const [arsStatus,   setArsStatus]   = useState("loading");
  const [lastUpdate,  setLastUpdate]  = useState(null);
  const REFRESH_MS = 5 * 60 * 1000; // 5 minutos

  const BASE_DATE     = new Date("2026-03-19");
  const BASE_TC_A3500 = 1399.60;
  const daysSinceBase = Math.floor((Date.now() - BASE_DATE.getTime()) / 86400000);
  const today = new Date().toLocaleDateString("es-AR");

  // Fetch 1: ArgentinaDatos bonos soberanos USD — refresh cada 5 min
  useEffect(() => {
    const load = () => {
      fetch("https://api.argentinadatos.com/v1/finanzas/bonos")
        .then(r => r.json())
        .then(data => {
          const prices = {};
          data.forEach(b => {
            if (!b.ticker || !b.ultimo) return;
            const tk = b.ticker.toUpperCase();
            prices[tk] = b.ultimo;
            prices[tk + "D"] = b.ultimo;
          });
          const matched = SOBERANOS.filter(s => prices[s.t]).length;
          setBondPrices(prices);
          setBondStatus(matched > 0 ? "ok" : "error");
          setLastUpdate(new Date());
        })
        .catch(() => setBondStatus("error"));
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Fetch 2: UVA + TAMAR — refresh cada 5 min
  useEffect(() => {
    const run = async () => {
      let hits = 0;
      try {
        const r = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/uva");
        const data = await r.json();
        if (Array.isArray(data) && data.length > 0) {
          setUvaIndex(parseFloat(data[data.length - 1].valor));
          hits++;
        }
      } catch {}
      try {
        const r = await fetch("https://api.bcra.gob.ar/estadisticas/v3.0/monetarias/principales-variables");
        const data = await r.json();
        const results = data.results || data;
        const tamar = Array.isArray(results) && results.find(v =>
          (v.descripcion || v.nombre || "").toLowerCase().includes("tamar") || v.idVariable === 17
        );
        if (tamar && tamar.valor) { setTamarRate(parseFloat(tamar.valor)); hits++; }
      } catch {}
      setArsStatus(hits > 0 ? "ok" : "partial");
      setLastUpdate(new Date());
    };
    run();
    const id = setInterval(run, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // LECAP/BONCAP: cálculo correcto
  // VN_vto = pBase × (1 + r_base) — valor técnico al vencimiento, fijo
  // TEM_live = (VN_vto / pLive)^(30/diasRest) - 1
  // TNA = rendimiento_total × (365 / diasRest)  ← convención mercado ARG
  const calcLECAPMetrics = (row, g) => {
    const pBase   = parseFloat(row.pre.replace("$","").replace(/\./g,"").replace(",","."));
    const rBase   = parseFloat(row.r.replace("%","").replace(",",".")) / 100;
    const temBase = parseFloat(row.tem.replace("%","").replace(",",".")) / 100;
    if (!pBase || !rBase || !temBase) return null;

    const vnVto    = pBase * (1 + rBase);                          // VN al vto — fijo
    const diasBase = g.dias;                                        // días al vto al 19-MAR
    const diasRest = Math.max(1, diasBase - daysSinceBase);        // días restantes hoy

    // precio teórico hoy = capitalización desde precio base
    const pLive = pBase * Math.pow(1 + temBase, daysSinceBase / 30);

    if (diasRest <= 0) return { pLive, rendimiento:0, tem:0, tna:0, diasRest:0 };

    // rendimiento total desde precio live hasta vto
    const rendimiento = (vnVto / pLive - 1) * 100;

    // TEM implícita del mercado hoy
    const temLive = (Math.pow(vnVto / pLive, 30 / diasRest) - 1) * 100;

    // TNA = rendimiento total × (365 / días restantes) — convención BYMA/MAE
    const tnaLive = rendimiento * (365 / diasRest);

    return { pLive, rendimiento, tem: temLive, tna: tnaLive, diasRest };
  };

  const diasHasta = (vtoStr) => {
    const parts = vtoStr.split("/");
    if (parts.length !== 3) return 0;
    const [d, m, y] = parts.map(Number);
    const vto = new Date(y, m - 1, d);
    return Math.max(0, Math.floor((vto - Date.now()) / 86400000));
  };

  const Th2 = ({children, right}) => (
    <th style={{ padding:"8px 12px", textAlign:right?"right":"left", fontSize:9, fontWeight:700,
      color:t.mu, letterSpacing:".08em", textTransform:"uppercase",
      borderBottom:`2px solid ${t.brd}`, background:t.alt, whiteSpace:"nowrap",
      position:"sticky", top:0, zIndex:5 }}>
      {children}
    </th>
  );
  const Td2 = ({children, right, bold, color}) => (
    <td style={{ padding:"8px 12px", textAlign:right?"right":"left", fontSize:12,
      fontWeight:bold?700:400, color:color||t.tx, whiteSpace:"nowrap" }}>
      {children}
    </td>
  );
  const trStyle = { borderBottom:`1px solid ${t.brd}`, transition:"background .12s" };
  const trHover = e => { e.currentTarget.style.background=t.alt; };
  const trLeave = e => { e.currentTarget.style.background="transparent"; };

  const ArsStatusChip = () => {
    const [secsAgo, setSecsAgo] = useState(0);
    useEffect(() => {
      if (!lastUpdate) return;
      const id = setInterval(() => {
        setSecsAgo(Math.floor((Date.now() - lastUpdate.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(id);
    }, [lastUpdate]);
    const nextIn = Math.max(0, Math.round((REFRESH_MS / 1000) - secsAgo));
    const lastStr = lastUpdate
      ? lastUpdate.toLocaleTimeString("es-AR", { hour:"2-digit", minute:"2-digit", second:"2-digit" })
      : null;
    return (
      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"6px 14px",
          borderRadius:8, fontFamily:FB, fontSize:11, whiteSpace:"nowrap",
          border:`1px solid ${arsStatus==="ok"?t.grAcc+"55":t.brd}`,
          background:arsStatus==="ok"?t.grBg:t.alt, color:arsStatus==="ok"?t.gr:t.mu }}>
          <span style={{ width:7, height:7, borderRadius:"50%", display:"inline-block", flexShrink:0,
            background:arsStatus==="ok"?"#22c55e":"#94a3b8",
            boxShadow:arsStatus==="ok"?"0 0 6px #22c55e":"none",
            animation:arsStatus==="loading"?"blink 1s infinite":"none" }}/>
          {arsStatus==="loading" && "Cargando datos ARS..."}
          {arsStatus!=="loading" && (lastStr ? `Últ. actualización: ${lastStr}` : "Precios teóricos activos")}
          {uvaIndex  && <span style={{marginLeft:4,opacity:.7}}>· UVA {uvaIndex.toFixed(2)}</span>}
          {tamarRate && <span style={{marginLeft:2,opacity:.7}}>· TAMAR {tamarRate.toFixed(2)}%</span>}
        </div>
        {lastUpdate && arsStatus!=="loading" && (
          <div style={{ fontFamily:FB, fontSize:10, color:t.fa, display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%",
              background:t.go, opacity: nextIn < 30 ? 1 : 0.4,
              animation: nextIn < 30 ? "blink 0.8s infinite" : "none" }}/>
            Próximo refresh en {nextIn}s · cada 5 min
          </div>
        )}
      </div>
    );
  };

  const SUBTABS = [
    {id:"lecap",   label:"📋 Renta Fija ARS"},
    {id:"soberano",label:"🌎 Soberanos USD"},
    {id:"rv",      label:"📊 Research Desk — Renta Variable"},
  ];

  return (
    <div className="fade-up">
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {SUBTABS.map(s => (
          <button key={s.id} onClick={()=>setSub(s.id)} style={{
            padding:"8px 18px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:600,
            cursor:"pointer", transition:"all .18s", border:`2px solid ${sub===s.id?t.go:t.brd}`,
            background:sub===s.id?t.go+"18":"transparent", color:sub===s.id?t.go:t.mu,
          }}>{s.label}</button>
        ))}
      </div>

      {/* ── RENTA FIJA ARS ── */}
      {sub === "lecap" && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            <ArsStatusChip />
            <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>
              Precio teórico = precio base 19-MAR capitalizado a TEM diaria. No incluye spread bid/ask.
            </span>
          </div>

          {/* LECAP / BONCAP */}
          <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
            LECAP & BONCAP — Tasa Fija Capitalizable
          </div>
          <Card t={t} style={{ marginBottom:16 }}>
            <div style={{ overflowX:"auto", maxHeight:"52vh", overflowY:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                <thead><tr>
                  {["Vto","Ticker","Precio vivo","Días rest.","Rendim. act.","TNA act.","TEM","Var. base","Fx BE"].map((h,i) => <Th2 key={h} right={i>1}>{h}</Th2>)}
                </tr></thead>
                <tbody>
                  {LECAP.map((g, i) => g.rows.map((r, j) => {
                    const m = calcLECAPMetrics(r, g);
                    if (!m) return null;
                    const isLive = daysSinceBase > 0;
                    const pBase = parseFloat(r.pre.replace("$","").replace(/\./g,"").replace(",","."));
                    const varBase = ((m.pLive - pBase) / pBase * 100);
                    return (
                      <tr key={`${i}-${j}`} style={trStyle} onMouseEnter={trHover} onMouseLeave={trLeave}>
                        <Td2 bold>{g.vto}</Td2>
                        <Td2>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <span style={{fontFamily:"monospace",fontSize:11,background:t.alt,padding:"2px 8px",borderRadius:5}}>{r.t}</span>
                            {isLive && <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block"}} title="Precio vivo"/>}
                          </div>
                        </Td2>
                        <Td2 right bold>
                          ${m.pLive.toLocaleString("es-AR",{minimumFractionDigits:2,maximumFractionDigits:2})}
                        </Td2>
                        <Td2 right color={m.diasRest<=30?t.rd:m.diasRest<=90?t.go:t.mu}>{m.diasRest}d</Td2>
                        <Td2 right color={t.go} bold>{m.rendimiento.toFixed(2)}%</Td2>
                        <Td2 right>
                          <span style={{background:t.goBg,color:t.go,padding:"2px 8px",borderRadius:10,fontWeight:700,fontSize:11}}>
                            {m.tna.toFixed(2)}%
                          </span>
                        </Td2>
                        <Td2 right color={t.bl}>{m.tem.toFixed(2)}%</Td2>
                        <Td2 right>
                          <span style={{fontWeight:600,color:varBase>=0?t.gr:t.rd}}>
                            {varBase>=0?"+":""}{varBase.toFixed(3)}%
                          </span>
                        </Td2>
                        <Td2 right color={t.mu}>{r.fxbe}</Td2>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Bonos Duales */}
          <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", margin:"16px 0 10px" }}>BONOS DUALES — Mayor de Fija o TAMAR</div>
          <Card t={t} style={{ marginBottom:16 }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                <thead><tr>
                  {["Ticker","Vto","Días rest.","TEM Fija","TNA Fija","TEM Var.","TNA Var.","TAMAR live","Fx BE"].map((h,i) => <Th2 key={h} right={i>1}>{h}</Th2>)}
                </tr></thead>
                <tbody>
                  {DUALES.map((d,i) => {
                    const diasAct = diasHasta(d.vto);
                    const tamarTEM = tamarRate ? ((Math.pow(1 + tamarRate/100/365, 30) - 1)*100) : null;
                    return (
                      <tr key={i} style={trStyle} onMouseEnter={trHover} onMouseLeave={trLeave}>
                        <Td2><span style={{fontFamily:"monospace",fontSize:11,background:t.alt,padding:"2px 8px",borderRadius:5}}>{d.t}</span></Td2>
                        <Td2 bold>{d.vto}</Td2>
                        <Td2 right color={diasAct<=30?t.rd:diasAct<=90?t.go:t.mu}>{diasAct}d</Td2>
                        <Td2 right color={parseFloat(d.temFija.replace(",","."))<0?t.rd:t.go} bold>{d.temFija}</Td2>
                        <Td2 right color={parseFloat(d.tnaFija.replace(",","."))<0?t.rd:t.go}>{d.tnaFija}</Td2>
                        <Td2 right color={t.bl} bold>{d.temVar}</Td2>
                        <Td2 right><span style={{background:t.blBg,color:t.bl,padding:"2px 8px",borderRadius:10,fontWeight:700,fontSize:11}}>{d.tnaVar}</span></Td2>
                        <Td2 right>
                          {tamarTEM
                            ? <span style={{background:t.puBg,color:t.pu,padding:"2px 8px",borderRadius:10,fontWeight:700,fontSize:11}}>{tamarTEM.toFixed(2)}% TEM</span>
                            : <span style={{color:t.fa}}>—</span>}
                        </Td2>
                        <Td2 right color={t.mu}>{d.fxbe}</Td2>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {tamarRate && (
              <div style={{padding:"8px 12px",fontFamily:FB,fontSize:10,color:t.mu,borderTop:`1px solid ${t.brd}`}}>
                💡 TAMAR actual: <strong>{tamarRate.toFixed(2)}% TNA</strong> · TEM: {((Math.pow(1+tamarRate/100/365,30)-1)*100).toFixed(2)}% · Fuente: BCRA API
              </div>
            )}
          </Card>

          {/* TAMAR */}
          <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", margin:"16px 0 10px" }}>LETRAS TAMAR — Tasa Variable BCRA</div>
          <Card t={t} style={{ marginBottom:16 }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                <thead><tr>
                  {["Ticker","Vto","Días rest.","Rendim.","TNA live","TEM live","Fx BE"].map((h,i) => <Th2 key={h} right={i>1}>{h}</Th2>)}
                </tr></thead>
                <tbody>
                  {TAMAR.map((d,i) => {
                    const diasAct  = diasHasta(d.vto);
                    const tamarTEM = tamarRate ? ((Math.pow(1 + tamarRate/100/365, 30) - 1)*100) : null;
                    return (
                      <tr key={i} style={trStyle} onMouseEnter={trHover} onMouseLeave={trLeave}>
                        <Td2>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{fontFamily:"monospace",fontSize:11,background:t.alt,padding:"2px 8px",borderRadius:5}}>{d.t}</span>
                            {tamarRate && <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>}
                          </div>
                        </Td2>
                        <Td2 bold>{d.vto}</Td2>
                        <Td2 right color={diasAct<=30?t.rd:diasAct<=90?t.go:t.mu}>{diasAct}d</Td2>
                        <Td2 right color={t.go} bold>{d.rend}</Td2>
                        <Td2 right>
                          <span style={{background:t.puBg,color:t.pu,padding:"2px 8px",borderRadius:10,fontWeight:700,fontSize:11}}>
                            {tamarRate ? `${tamarRate.toFixed(2)}%` : d.tna}
                          </span>
                        </Td2>
                        <Td2 right color={t.bl}>{tamarTEM ? `${tamarTEM.toFixed(2)}%` : d.tem}</Td2>
                        <Td2 right color={t.mu}>{d.fxbe}</Td2>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Dólar Linked */}
          <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", margin:"16px 0 10px" }}>DÓLAR LINKED</div>
          <Card t={t}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                <thead><tr>
                  {["Ticker","Vto","Días rest.","Precio base","Rendim.","TNA"].map((h,i) => <Th2 key={h} right={i>1}>{h}</Th2>)}
                </tr></thead>
                <tbody>
                  {DOLARLINKED.map((d,i) => {
                    const diasAct = diasHasta(d.vto);
                    return (
                      <tr key={i} style={trStyle} onMouseEnter={trHover} onMouseLeave={trLeave}>
                        <Td2><span style={{fontFamily:"monospace",fontSize:11,background:t.alt,padding:"2px 8px",borderRadius:5}}>{d.t}</span></Td2>
                        <Td2 bold>{d.vto}</Td2>
                        <Td2 right color={diasAct<=30?t.rd:diasAct<=90?t.go:t.mu}>{diasAct}d</Td2>
                        <Td2 right color={t.mu}>{d.pre}</Td2>
                        <Td2 right color={parseFloat(d.rend.replace(",","."))<0?t.rd:t.gr} bold>{d.rend}</Td2>
                        <Td2 right color={parseFloat(d.tna.replace(",","."))<0?t.rd:t.gr}>{d.tna}</Td2>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding:"8px 12px", fontFamily:FB, fontSize:10, color:t.fa, borderTop:`1px solid ${t.brd}` }}>
              * No constituye asesoramiento. TC base referencia: $1.399,60 al 19-MAR-2026.
            </div>
          </Card>
        </div>
      )}

      {/* ── SOBERANOS USD ── */}
      {sub === "soberano" && (
        <div>
          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
            <p style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.6, flex:1 }}>
              TIR calculada por bisección numérica sobre flujos reales. CY y Paridad actualizadas con precio de mercado.
            </p>
            <div style={{
              borderRadius:8, padding:"8px 14px", fontFamily:FB, fontSize:11,
              border:`1px solid ${bondStatus==="ok"?t.grAcc+"66":t.brd}`,
              background:bondStatus==="ok"?t.grBg:t.alt,
              color:bondStatus==="ok"?t.gr:t.mu,
              display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap",
            }}>
              <span style={{width:8,height:8,borderRadius:"50%",display:"inline-block",
                background:bondStatus==="ok"?"#22c55e":"#94a3b8",
                boxShadow:bondStatus==="ok"?"0 0 6px #22c55e":"none",
                animation:bondStatus==="loading"?"blink 1s infinite":"none"}}/>
              {bondStatus==="loading" && "Actualizando bonos..."}
              {bondStatus==="ok"      && "Precios en vivo · ArgentinaDatos"}
              {bondStatus==="error"   && "Usando precios de cierre"}
            </div>
          </div>
          {[{label:"LEY ARGENTINA", items:SOBERANOS.filter(s=>s.ley==="ARG"), color:t.go},
            {label:"LEY NUEVA YORK", items:SOBERANOS.filter(s=>s.ley==="NY"),  color:t.bl}].map(grp => (
            <div key={grp.label} style={{ marginBottom:20 }}>
              <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, color:grp.color, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
                {grp.label} — {grp.items.length} bonos
              </div>
              <Card t={t}>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:FB }}>
                    <thead><tr>
                      {["Ticker","Vto","Precio","Var. día","TIR","Curr. Yield","Duración","Pago","Paridad","Var. 1W"].map((h,i) => (
                        <Th2 key={h} right={i>=2&&i<=8}>{h}</Th2>
                      ))}
                    </tr></thead>
                    <tbody>
                      {grp.items.map((s,i) => {
                        const liveRaw = bondPrices[s.t] || bondPrices[s.t.replace("D","")] || null;
                        const m = calcBondMetrics(s, liveRaw);
                        return (
                          <tr key={i} style={trStyle} onMouseEnter={trHover} onMouseLeave={trLeave}>
                            <Td2>
                              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <span style={{ fontFamily:"monospace", fontSize:11, background:grp.color+"22", color:grp.color, padding:"2px 8px", borderRadius:5, fontWeight:700 }}>{s.t}</span>
                                {m.isLive && <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block"}} title="Precio en vivo"/>}
                              </div>
                            </Td2>
                            <Td2 bold>{s.vto}</Td2>
                            <Td2 right bold><span style={{color:m.isLive?t.tx:t.mu}}>${m.price.toFixed(2)}</span></Td2>
                            <Td2 right>
                              <span style={{ fontWeight:600, color:m.varVsBase>0?t.gr:m.varVsBase<0?t.rd:t.mu }}>
                                {m.isLive ? `${m.varVsBase>=0?"+":""}${m.varVsBase.toFixed(2)}%` : s.var1d}
                              </span>
                            </Td2>
                            <Td2 right>
                              {m.newTIR !== null
                                ? <span style={{ fontWeight:700, color:t.rd }}>{m.newTIR.toFixed(2)}%</span>
                                : <span style={{color:t.fa}}>—</span>}
                            </Td2>
                            <Td2 right color={t.mu}>{m.newCY !== null ? `${m.newCY.toFixed(2)}%` : s.cy}</Td2>
                            <Td2 right color={t.mu}>{s.dur.toFixed(2)}</Td2>
                            <Td2 color={t.mu}>{s.pago}</Td2>
                            <Td2 right color={t.mu}>{m.newPar !== null ? `${m.newPar.toFixed(2)}%` : s.par}</Td2>
                            <Td2 right color={s.var1w.startsWith("-")?t.rd:s.var1w.startsWith("+")?t.gr:t.mu}>{s.var1w}</Td2>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ))}
          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, lineHeight:1.5 }}>
            * TIR calculada por bisección sobre flujos reales. No constituye recomendación de inversión.
          </p>
        </div>
      )}

      {/* ── RESEARCH DESK — RENTA VARIABLE ── */}
      {sub === "rv" && <EquityScreener t={t} />}

    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MERCADOS VIEW — LIVE QUOTES (dolarapi.com + argentinadatos.com)
════════════════════════════════════════════════════════════════ */
function MercadosView({ dolar, riesgoPais, fxError, t }) {
  const cMap = {
    blue:{bg:t.blBg,ac:t.bl}, gold:{bg:t.goBg,ac:t.go}, green:{bg:t.grBg,ac:t.gr},
    red:{bg:t.rdBg,ac:t.rd}, purple:{bg:t.puBg,ac:t.pu}, gray:{bg:t.alt,ac:t.mu},
  };

  const fmt = (v) => v ? `$${Math.round(v).toLocaleString("es-AR")}` : "—";
  const pct = (num, den) => {
    if (!num || !den) return null;
    return (((num / den) - 1) * 100).toFixed(1);
  };

  const of  = dolar?.oficial?.venta;
  const bl  = dolar?.blue?.venta;
  const mep = dolar?.bolsa?.venta;
  const ccl = dolar?.ccl?.venta;
  const may = dolar?.mayorista?.venta;

  // Brechas
  const bBlue = pct(bl, of);
  const bMEP  = pct(mep, of);
  const bCCL  = pct(ccl, of);
  const bCCLmep = pct(ccl, mep);

  const FxCard = ({ label, value, compra, sub, color, badge, loading }) => {
    const col = cMap[color] || cMap.gray;
    return (
      <div style={{
        background:col.bg, border:`1px solid ${col.ac}22`,
        borderRadius:12, padding:"18px 20px", borderLeft:`4px solid ${col.ac}`,
        transition:"transform .18s, box-shadow .18s",
        display:"flex", flexDirection:"column", gap:4,
      }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=t.sh;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="";}}>
        <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em" }}>{label}</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8, flexWrap:"wrap" }}>
          <span style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:col.ac, lineHeight:1 }}>
            {loading
              ? <span style={{ fontSize:20, color:t.fa, animation:"blink 1s infinite" }}>cargando…</span>
              : fxError ? <span style={{ fontSize:16, color:t.rd }}>sin datos</span>
              : value}
          </span>
          {!loading && !fxError && badge !== null && badge !== undefined && (
            <span style={{
              fontFamily:FB, fontSize:11, fontWeight:700,
              color: parseFloat(badge) > 0 ? t.rd : t.gr,
              background: parseFloat(badge) > 0 ? t.rdBg : t.grBg,
              padding:"2px 8px", borderRadius:20,
            }}>
              {parseFloat(badge) > 0 ? "+" : ""}{badge}%
            </span>
          )}
        </div>
        {compra && !fxError && <div style={{ fontFamily:FB, fontSize:11, color:t.mu }}>Compra: {compra}</div>}
        <div style={{ fontFamily:FB, fontSize:11, color:t.fa, marginTop:2 }}>{sub}</div>
      </div>
    );
  };

  const loading = !dolar && !fxError;

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:20 }}>
        <SectionLabel t={t}>MERCADO DE CAMBIOS — TIEMPO REAL</SectionLabel>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {fxError ? (
            <span style={{ fontFamily:FB, fontSize:11, color:t.rd, background:t.rdBg, padding:"3px 10px", borderRadius:8 }}>
              ⚠️ Sin conexión a la API — recargá la página
            </span>
          ) : (
            <span style={{ fontFamily:FB, fontSize:11, color:t.fa }}>
              🔄 dolarapi.com · argentinadatos.com{dolar ? " · live" : ""}
            </span>
          )}
          <div style={{ width:7, height:7, borderRadius:"50%",
            background: fxError ? t.rd : dolar ? t.gr : t.fa,
            animation: (!dolar && !fxError) ? "blink 1s infinite" : "none"
          }} />
        </div>
      </div>

      {/* ── FOREX GRID ── */}
      <div style={{ marginBottom:10 }}>
        <div style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>
          TIPOS DE CAMBIO (venta)
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10, marginBottom:24 }}>
          <FxCard label="Dólar Oficial (BNA)" value={fmt(of)} compra={fmt(dolar?.oficial?.compra)} sub="Tipo de cambio oficial" color="blue" loading={loading} />
          <FxCard label="Dólar Mayorista" value={fmt(may)} sub="Mercado de mayoristas" color="blue" loading={loading} />
          <FxCard label="Dólar Blue" value={fmt(bl)} compra={fmt(dolar?.blue?.compra)} sub="Mercado informal" color="gold" loading={loading} />
          <FxCard label="Dólar MEP (bolsa)" value={fmt(mep)} sub="Bonos en pesos → USD" color="purple" loading={loading} />
          <FxCard label="Dólar CCL" value={fmt(ccl)} sub="Contado con liquidación" color="purple" loading={loading} />
        </div>
      </div>

      {/* ── BRECHAS ── */}
      <Card t={t} style={{ marginBottom:20 }}>
        <div style={{ padding:"18px 22px" }}>
          <div style={{ fontFamily:FB, fontSize:10, color:t.mu, letterSpacing:".1em", textTransform:"uppercase", marginBottom:14 }}>
            BRECHAS CAMBIARIAS (vs. Oficial)
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
            {[
              { label:"Blue / Oficial", val:bBlue, desc:"Mercado informal vs. BNA" },
              { label:"MEP / Oficial",  val:bMEP,  desc:"Dólar bolsa vs. BNA" },
              { label:"CCL / Oficial",  val:bCCL,  desc:"Contado con liqui vs. BNA" },
              { label:"CCL / MEP",      val:bCCLmep, desc:"Spread financiero interno" },
            ].map((br, i) => {
              const v = br.val ? parseFloat(br.val) : null;
              const isHigh = v !== null && v > 5;
              const color = v === null ? t.mu : isHigh ? t.rd : t.gr;
              const bg    = v === null ? t.alt : isHigh ? t.rdBg : t.grBg;
              return (
                <div key={i} style={{ background:bg, borderRadius:10, padding:"14px 18px" }}>
                  <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>{br.label}</div>
                  <div style={{ fontFamily:FH, fontSize:28, fontWeight:700, color, lineHeight:1 }}>
                    {v !== null ? `+${br.val}%` : "—"}
                  </div>
                  <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:4 }}>{br.desc}</div>
                </div>
              );
            })}
          </div>
          <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:14, lineHeight:1.5 }}>
            * Brechas calculadas en tiempo real desde precios de venta. Brecha negativa o &lt;1% indica convergencia con el tipo de cambio oficial.
          </p>
        </div>
      </Card>

      {/* ── RIESGO PAÍS + OTROS ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
        {/* Riesgo País — live */}
        <div style={{
          background:t.rdBg, borderRadius:12, padding:"18px 20px",
          borderLeft:`4px solid ${t.rd}`, gridColumn: riesgoPais ? "span 1" : "span 1",
        }}>
          <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em", marginBottom:6 }}>RIESGO PAÍS</div>
          <div style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:t.rd, lineHeight:1 }}>
            {riesgoPais ? `${riesgoPais.valor} pb` : "—"}
          </div>
          <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:4 }}>EMBI Argentina · JP Morgan</div>
          {riesgoPais?.fecha && <div style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:4 }}>{riesgoPais.fecha}</div>}
        </div>

        {/* Estáticos con nota */}
        {[
          { label:"Merval USD", value:"USD 1.810", sub:"+0,55% · Cierre 18 MAR 2026", color:"green" },
          { label:"Brent", value:"+5,78%", sub:"USD 106,23 · Tensión Irán", color:"gold" },
          { label:"Oro (GLD)", value:"-3,14%", sub:"USD 444,83 · Toma de ganancias", color:"gray" },
        ].map((c,i) => {
          const col = cMap[c.color] || cMap.gray;
          return (
            <div key={i} style={{
              background:col.bg, border:`1px solid ${col.ac}22`,
              borderRadius:12, padding:"18px 20px", borderLeft:`4px solid ${col.ac}`,
            }}>
              <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em", marginBottom:6 }}>{c.label}</div>
              <div style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:col.ac, lineHeight:1 }}>{c.value}</div>
              <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:4 }}>{c.sub}</div>
            </div>
          );
        })}

        {/* LECAP/BONCAP — mayor TNA disponible (dinámico) */}
        {(() => {
          // Flatten all LECAP rows and find the highest TNA
          const all = LECAP.flatMap(g => g.rows.map(r => ({
            ticker: r.t,
            mes: g.mes,
            tna: parseFloat(r.tna.replace(",", ".")),
            tnaStr: r.tna,
            tem: r.r,
          })));
          const top = all.reduce((best, cur) => cur.tna > best.tna ? cur : best, all[0]);
          const col = cMap["blue"];
          return (
            <div style={{
              background:col.bg, border:`1px solid ${col.ac}22`,
              borderRadius:12, padding:"18px 20px", borderLeft:`4px solid ${col.ac}`,
              position:"relative",
            }}>
              <div style={{
                position:"absolute", top:10, right:12,
                fontFamily:FB, fontSize:8, fontWeight:700, letterSpacing:".06em",
                color:t.go, background:t.goBg, padding:"2px 7px", borderRadius:10,
                textTransform:"uppercase",
              }}>MAYOR TNA</div>
              <div style={{ fontFamily:FB, fontSize:9, color:t.mu, textTransform:"uppercase", letterSpacing:".1em", marginBottom:6 }}>
                LECAP/BONCAP
              </div>
              <div style={{ fontFamily:FH, fontSize:26, fontWeight:700, color:col.ac, lineHeight:1 }}>
                {top.tnaStr} TNA
              </div>
              <div style={{ fontFamily:"monospace", fontSize:11, color:t.tx, marginTop:6, background:t.alt, display:"inline-block", padding:"2px 8px", borderRadius:5 }}>
                {top.ticker}
              </div>
              <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:6 }}>
                {top.tem} acum. · Vto. {top.mes}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── PANEL BCRA ── */}
      <Card t={t} style={{ marginTop:20 }}>
        <div style={{ padding:"20px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
            <SectionLabel t={t}>BANCO CENTRAL · DATOS DEL DÍA</SectionLabel>
            <span style={{ fontFamily:FB, fontSize:10, color:t.mu, background:t.alt, padding:"3px 10px", borderRadius:6 }}>{BCRA_DATA.fecha}</span>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10, marginBottom:14 }}>
            {[
              { label:"TAMAR",             val:BCRA_DATA.tamar.val,      nota:BCRA_DATA.tamar.nota,      color:t.bl,   bg:t.blBg },
              { label:"BADLAR",            val:BCRA_DATA.badlar.val,     nota:BCRA_DATA.badlar.nota,     color:t.pu,   bg:t.puBg },
              { label:"COMPRAS BCRA",      val:BCRA_DATA.comprasUSD.val, nota:BCRA_DATA.comprasUSD.nota, color:t.gr,   bg:t.grBg },
              { label:"RESERVAS BRUTAS",   val:BCRA_DATA.reservas.val,   nota:BCRA_DATA.reservas.nota,   color:t.rd,   bg:t.rdBg },
              { label:"TIPO DE CAMBIO REF",val:BCRA_DATA.mayorista.val,  nota:BCRA_DATA.mayorista.nota,  color:t.go,   bg:t.goBg },
            ].map((item,i) => (
              <div key={i} style={{ background:item.bg, border:`1px solid ${item.color}22`, borderRadius:10, padding:"12px 14px", borderLeft:`3px solid ${item.color}` }}>
                <div style={{ fontFamily:FB, fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:item.color, marginBottom:5 }}>{item.label}</div>
                <div style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:t.tx, lineHeight:1 }}>{item.val}</div>
                <div style={{ fontFamily:FB, fontSize:10, color:t.mu, marginTop:4, lineHeight:1.4 }}>{item.nota}</div>
              </div>
            ))}
          </div>

          <div style={{ background:t.rdBg, border:`1px solid ${t.rd}22`, borderRadius:8, padding:"10px 14px", fontFamily:FB, fontSize:11, color:t.tx, lineHeight:1.6 }}>
            ⚠️ {BCRA_DATA.nota}
          </div>
        </div>
      </Card>

      <p style={{ fontFamily:FB, fontSize:11, color:t.fa, marginTop:16, lineHeight:1.6 }}>
        Fuentes: <strong>dolarapi.com</strong> (Oficial, Blue, MEP, CCL, Mayorista — tiempo real) · <strong>argentinadatos.com</strong> (Riesgo País — último valor disponible) · <strong>BCRA / La Macro</strong> (TAMAR, BADLAR, Reservas) · Merval, Brent y Oro al cierre del día anterior.
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   NOTICIAS VIEW
════════════════════════════════════════════════════════════════ */
function NoticiasView({ t }) {
  const [filtro, setFiltro] = useState("todas");
  const [expandida, setExpandida] = useState(null);

  const cats = ["todas", ...Array.from(new Set(NOTICIAS.map(n => n.cat)))];

  const filtradas = filtro === "todas"
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === filtro);

  const catColors = { blue:t.bl, green:t.gr, red:t.rd, purple:t.pu, gold:t.go, gray:t.mu };
  const catBgs    = { blue:t.blBg, green:t.grBg, red:t.rdBg, purple:t.puBg, gold:t.goBg, gray:t.alt };

  return (
    <div className="fade-up">

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:22 }}>
        <div>
          <SectionLabel t={t}>NOTICIAS · 18-20 MAR 2026</SectionLabel>
          <p style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.6, marginTop:-10 }}>
            {NOTICIAS.length} noticias · Información procesada y diferenciada de interpretación.
          </p>
        </div>
        {/* Relevancia badge count */}
        <div style={{ display:"flex", gap:8 }}>
          <div style={{ background:t.rdBg, borderRadius:8, padding:"6px 14px", fontFamily:FB, fontSize:11, color:t.rd, fontWeight:600 }}>
            🔴 {NOTICIAS.filter(n=>n.relevancia==="alta").length} alta relevancia
          </div>
          <div style={{ background:t.alt, borderRadius:8, padding:"6px 14px", fontFamily:FB, fontSize:11, color:t.mu, fontWeight:600 }}>
            ⚪ {NOTICIAS.filter(n=>n.relevancia==="media").length} media
          </div>
        </div>
      </div>

      {/* Filtro por categoría */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {cats.map(c => (
          <button key={c} onClick={()=>setFiltro(c)} style={{
            padding:"5px 14px", borderRadius:20, fontFamily:FB, fontSize:11, fontWeight:600,
            cursor:"pointer", transition:"all .18s", border:"none",
            background: filtro===c ? t.tx : t.alt,
            color: filtro===c ? (t===TH.d?"#0D1117":"#FFFFFF") : t.mu,
          }}>
            {c === "todas" ? "Todas" : c}
          </button>
        ))}
      </div>

      {/* Noticias list */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtradas.map(n => {
          const ac  = catColors[n.catColor] || t.mu;
          const bg  = catBgs[n.catColor]   || t.alt;
          const open = expandida === n.id;

          return (
            <div key={n.id} style={{
              background:t.srf, borderRadius:14, border:`1px solid ${t.brd}`,
              borderLeft:`4px solid ${ac}`, overflow:"hidden",
              boxShadow: open ? t.sh : "none",
              transition:"box-shadow .2s",
            }}>
              {/* Card header — always visible */}
              <button onClick={()=>setExpandida(open ? null : n.id)} style={{
                width:"100%", textAlign:"left", background:"none", border:"none",
                padding:"18px 20px", cursor:"pointer", display:"flex",
                justifyContent:"space-between", alignItems:"flex-start", gap:16,
              }}>
                <div style={{ flex:1 }}>
                  {/* Meta row */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexWrap:"wrap" }}>
                    <span style={{
                      fontFamily:FB, fontSize:9, fontWeight:700, letterSpacing:".08em",
                      textTransform:"uppercase", color:ac,
                      background:bg, padding:"2px 9px", borderRadius:20,
                    }}>{n.cat}</span>
                    {n.relevancia === "alta" && (
                      <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.rd, background:t.rdBg, padding:"2px 8px", borderRadius:20 }}>
                        ● ALTA RELEVANCIA
                      </span>
                    )}
                    <span style={{ fontFamily:FB, fontSize:10, color:t.fa }}>{n.fecha}</span>
                  </div>
                  {/* Titular */}
                  <h3 style={{
                    fontFamily:FH, fontSize:19, fontWeight:700, color:t.tx,
                    lineHeight:1.25, marginBottom: open ? 0 : 4,
                  }}>{n.titulo}</h3>
                  {/* Preview line when collapsed */}
                  {!open && (
                    <p style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.6, marginTop:6 }}
                      dangerouslySetInnerHTML={{ __html: n.cuerpo.replace(/<[^>]+>/g,"").slice(0, 120) + "…" }}
                    />
                  )}
                </div>
                {/* Toggle icon */}
                <span style={{
                  color:t.mu, fontSize:18, flexShrink:0, marginTop:2,
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition:"transform .2s",
                }}>⌄</span>
              </button>

              {/* Expanded body */}
              {open && (
                <div style={{
                  padding:"0 20px 22px",
                  borderTop:`1px solid ${t.brd}`,
                  paddingTop:18,
                }}>
                  <div
                    style={{ fontFamily:FB, fontSize:13, color:t.tx, lineHeight:1.85 }}
                    dangerouslySetInnerHTML={{ __html: n.cuerpo }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:20, lineHeight:1.5 }}>
        Contenido de carácter informativo. Los análisis e interpretaciones son opinión editorial y no constituyen asesoramiento de inversión.
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   INICIO VIEW — Minimal, clean, great UX
════════════════════════════════════════════════════════════════ */
function InicioView({ dolar, riesgoPais, t, setTab, isMobile=false, clock }) {
  const mep = dolar?.bolsa;
  const rp  = riesgoPais?.valor;

  // ── Live market chips ─────────────────────────────────────────
  const [spy,       setSpy]       = useState(null); // { price, changePct }
  const [mervalUSD, setMervalUSD] = useState(null); // valor en USD
  const [chipsStatus, setChipsStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    const fetchChips = async () => {
      try {
        // SPY — Finnhub
        const r1 = await fetch(`https://finnhub.io/api/v1/quote?symbol=SPY&token=${FINNHUB_KEY}`);
        const d1 = await r1.json();
        if (!cancelled && d1.c > 0) setSpy({ price: d1.c, changePct: d1.dp });

        // Merval ARS — Finnhub (ticker MERV en Buenos Aires)
        // Dividimos por MEP para obtener USD
        const r2 = await fetch(`https://finnhub.io/api/v1/quote?symbol=MERV&token=${FINNHUB_KEY}`);
        const d2 = await r2.json();
        if (!cancelled && d2.c > 0 && mep?.venta) {
          setMervalUSD({ value: Math.round(d2.c / mep.venta), changePct: d2.dp, raw: d2.c });
        }

        if (!cancelled) setChipsStatus("ok");
      } catch {
        if (!cancelled) setChipsStatus("error");
      }
    };

    fetchChips();
    const id = setInterval(fetchChips, 60_000); // cada 60 segundos
    return () => { cancelled = true; clearInterval(id); };
  }, [mep?.venta]);

  const LiveChip = ({ label, value, sub, color, change, loading }) => (
    <div style={{
      flex:1, minWidth:isMobile?130:150,
      background:t.srf, border:`1px solid ${t.brd}`,
      borderRadius:14, padding:"16px 18px",
      transition:"transform .15s, box-shadow .15s",
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px rgba(0,0,0,.07)`;}}
    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <div style={{ fontFamily:FB, fontSize:9, color:t.fa, letterSpacing:".1em", textTransform:"uppercase" }}>{label}</div>
        {loading && <div style={{ width:6, height:6, borderRadius:"50%", background:"#94a3b8", animation:"blink 1s infinite" }} />}
        {!loading && chipsStatus==="ok" && <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 5px #22c55e" }} />}
      </div>
      <div style={{ fontFamily:FH, fontSize:24, fontWeight:700, color:color||t.tx, lineHeight:1 }}>
        {loading ? <span style={{color:t.fa,fontSize:14}}>—</span> : value}
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:6 }}>
        {sub && <div style={{ fontFamily:FB, fontSize:10, color:t.mu }}>{sub}</div>}
        {change !== undefined && change !== null && (
          <div style={{ fontFamily:FB, fontSize:10, fontWeight:600, color:change>=0?t.gr:t.rd }}>
            {change>=0?"+":""}{change.toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );

  const NavCard = ({ icon, title, desc, tab, accent }) => (
    <button onClick={()=>setTab(tab)} style={{
      flex:1, minWidth:isMobile?"100%":170,
      background:t.srf, border:`1px solid ${t.brd}`,
      borderRadius:16, padding:"22px 22px 20px",
      textAlign:"left", cursor:"pointer",
      display:"flex", flexDirection:"column", gap:10,
      transition:"all .18s",
    }}
    onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,.07)`;}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor=t.brd;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
      <div style={{ fontSize:26, lineHeight:1 }}>{icon}</div>
      <div>
        <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx, marginBottom:3 }}>{title}</div>
        <div style={{ fontFamily:FB, fontSize:11, color:t.mu, lineHeight:1.55 }}>{desc}</div>
      </div>
      <div style={{ fontFamily:FB, fontSize:11, color:accent, fontWeight:600, marginTop:"auto" }}>Abrir →</div>
    </button>
  );

  const loading = chipsStatus === "loading";

  return (
    <div className="fade-up" style={{ maxWidth:900, margin:"0 auto" }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div style={{
        borderRadius:20,
        background:`linear-gradient(145deg, #0d1117 0%, #1a2744 55%, #0d2137 100%)`,
        padding: isMobile ? "36px 24px 32px" : "52px 52px 44px",
        marginBottom:20, position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", right:-60, top:-60, width:280, height:280, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(176,120,42,.12) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", left:-40, bottom:-80, width:220, height:220, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(59,130,246,.06) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ fontFamily:FB, fontSize:9, color:"rgba(255,255,255,.3)", letterSpacing:".18em",
          textTransform:"uppercase", marginBottom:16 }}>
          {clock?.date?.toUpperCase() || "THE BIG LONG"} · BUENOS AIRES
        </div>

        <h1 style={{
          fontFamily:FH, fontSize: isMobile ? 38 : 64,
          fontWeight:700, color:"#fff", lineHeight:1,
          letterSpacing:"-.02em", marginBottom:14,
        }}>The Big Long</h1>

        <p style={{
          fontFamily:FB, fontSize: isMobile ? 13 : 15,
          color:"rgba(255,255,255,.45)", lineHeight:1.7,
          maxWidth:440, marginBottom:30,
        }}>
          Inteligencia financiera para el mercado argentino e internacional.
        </p>

        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <button onClick={()=>setTab("resumen")} style={{
            background:t.go, color:"#fff", border:"none", borderRadius:12,
            padding:"13px 28px", fontFamily:FB, fontWeight:700, fontSize:13,
            cursor:"pointer", boxShadow:`0 4px 20px rgba(176,120,42,.4)`, transition:"opacity .15s",
          }}
          onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            Resumen del día →
          </button>
          <button onClick={()=>setTab("mercados")} style={{
            background:"rgba(255,255,255,.07)", color:"rgba(255,255,255,.75)",
            border:"1px solid rgba(255,255,255,.13)", borderRadius:12,
            padding:"13px 28px", fontFamily:FB, fontWeight:600, fontSize:13,
            cursor:"pointer", transition:"background .15s",
          }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.12)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.07)"}>
            Cotizaciones en vivo
          </button>
        </div>
      </div>

      {/* ── LIVE KPIs ────────────────────────────────────── */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20 }}>
        <LiveChip
          label="Merval USD"
          value={mervalUSD ? `USD ${mervalUSD.value.toLocaleString("es-AR")}` : "—"}
          sub="BYMA · CCL"
          change={mervalUSD?.changePct ?? null}
          loading={loading && !mervalUSD}
        />
        <LiveChip
          label="SPY"
          value={spy ? `$${spy.price.toFixed(2)}` : "—"}
          sub="S&P 500 ETF"
          change={spy?.changePct ?? null}
          loading={loading && !spy}
        />
        <LiveChip
          label="Dólar MEP"
          value={mep ? `$${Math.round(mep.venta).toLocaleString("es-AR")}` : "—"}
          sub="venta · dolarapi"
          change={null}
          loading={false}
        />
        <LiveChip
          label="Riesgo País"
          value={rp ? `${rp.toLocaleString("es-AR")} pb` : "—"}
          sub={rp ? (rp < 600 ? "< 600 pb" : "> 600 pb") : "EMBI+"}
          change={null}
          color={rp ? (rp < 600 ? t.gr : t.rd) : t.tx}
          loading={false}
        />
      </div>

      {/* ── HIGHLIGHT DEL DÍA ────────────────────────────── */}
      <div style={{
        background:t.srf, border:`1px solid ${t.brd}`,
        borderLeft:`4px solid ${t.go}`, borderRadius:16,
        padding:"22px 26px", marginBottom:20,
        display:"flex", alignItems:"center", gap:20, flexWrap:"wrap",
      }}>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <span style={{
              fontFamily:FB, fontSize:9, fontWeight:700, letterSpacing:".1em",
              textTransform:"uppercase", color:t.go,
              background:t.goBg, padding:"3px 10px", borderRadius:20,
            }}>● {clock?.dateShort || "21 MAR"} · Último cierre</span>
          </div>
          <h2 style={{ fontFamily:FH, fontSize:isMobile?18:22, fontWeight:700, color:t.tx, lineHeight:1.25, marginBottom:8 }}>
            Bancos +4/+6% · Reservas cubiertas · Wall St. a la baja
          </h2>
          <p style={{ fontFamily:FB, fontSize:12, color:t.mu, lineHeight:1.7, margin:0 }}>
            Acciones argentinas suben a contramano del mundo. Fed sin recortes en todo 2026.
          </p>
        </div>
        <button onClick={()=>setTab("resumen")} style={{
          background:t.go, color:"#fff", border:"none", borderRadius:10,
          padding:"10px 22px", fontFamily:FB, fontWeight:700, fontSize:12,
          cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, transition:"opacity .15s",
        }}
        onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
        onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          Leer resumen →
        </button>
      </div>

      {/* ── NAVEGACIÓN RÁPIDA ────────────────────────────── */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <NavCard icon="📋" tab="resumen"    title="Resumen Diario"  desc="Cierre del mercado argentino e internacional, día a día."    accent={t.go} />
        <NavCard icon="📈" tab="mercados"   title="Mercados"        desc="Cotizaciones en vivo: dólar, riesgo país, BCRA."             accent={t.bl} />
        <NavCard icon="🔍" tab="instrumentos" title="Instrumentos" desc="Screener de renta fija, soberanos y renta variable."         accent={t.gr} />
        <NavCard icon="🗞️" tab="noticias"   title="Noticias"       desc="Las novedades del mercado que importan."                     accent={t.pu} />
      </div>

      {/* ── ANÁLISIS DESTACADO ───────────────────────────── */}
      <button onClick={()=>setTab("informes")} style={{
        width:"100%", marginTop:12,
        background:"transparent",
        border:`1.5px solid ${t.brd}`,
        borderRadius:16, padding:"18px 24px",
        textAlign:"left", cursor:"pointer",
        display:"flex", alignItems:"center", gap:16,
        transition:"all .18s",
      }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=t.gr;e.currentTarget.style.background=t.grBg;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=t.brd;e.currentTarget.style.background="transparent";}}>
        <div style={{ width:44, height:44, borderRadius:10, flexShrink:0,
          background:"linear-gradient(135deg,#1a3a1a,#2d6a2d)",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ color:"#4ade80", fontFamily:FB, fontWeight:900, fontSize:12 }}>VIST</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, color:t.gr,
              background:t.grBg, padding:"2px 8px", borderRadius:20,
              textTransform:"uppercase", letterSpacing:".08em" }}>🔬 Análisis Destacado</span>
          </div>
          <div style={{ fontFamily:FH, fontSize:16, fontWeight:700, color:t.tx }}>Vista Energy — Informe Fundamental</div>
          <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:2 }}>
            Pure-play Vaca Muerta · Fwd P/E 9.19x · Score #1 Research Desk · Earnings 21 ABR 2026
          </div>
        </div>
        <div style={{ fontFamily:FB, fontSize:12, color:t.gr, fontWeight:700, flexShrink:0 }}>Leer →</div>
      </button>

      <p style={{ fontFamily:FB, fontSize:10, color:t.fa, marginTop:24, textAlign:"center" }}>
        Contenido informativo · No constituye asesoramiento de inversión · The Big Long · Máximo Ricciardi
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   RECOMENDACIONES VIEW
════════════════════════════════════════════════════════════════ */
function RecomendacionesView({ t }) {
  const [active, setActive] = useState("conservador");
  const pf = PERFILES.find(p=>p.id===active);
  const cMap = {blue:{ac:t.bl,bg:t.blBg},gold:{ac:t.go,bg:t.goBg},purple:{ac:t.pu,bg:t.puBg}};
  const col = cMap[pf.color]||cMap.blue;

  return (
    <div className="fade-up">
      <div style={{ background:t.rdBg, border:`1px solid ${t.rdAcc}44`, borderRadius:10, padding:"12px 18px", fontFamily:FB, fontSize:12, color:t.rd, marginBottom:20, lineHeight:1.6 }}>
        ⚠️ <strong>Aviso importante:</strong> El contenido de esta sección es exclusivamente a modo orientativo e informativo. No constituye asesoramiento financiero, recomendación de inversión ni oferta de compra o venta de valores. Consultá siempre con un asesor antes de invertir.
      </div>

      {/* Profile selector */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {PERFILES.map(p => {
          const pc = cMap[p.color]||cMap.blue;
          const isA = active===p.id;
          return (
            <button key={p.id} onClick={()=>setActive(p.id)} style={{
              padding:"10px 22px", borderRadius:10, fontFamily:FB, fontSize:13, fontWeight:600,
              cursor:"pointer", transition:"all .2s",
              border:`2px solid ${isA?pc.ac:t.brd}`,
              background:isA?pc.ac:"transparent",
              color:isA?"#fff":t.mu,
            }}>
              {p.icon} {p.label}
            </button>
          );
        })}
      </div>

      {/* Profile detail */}
      <Card t={t}>
        <div style={{ padding:"24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:20 }}>
            <div>
              <h2 style={{ fontFamily:FH, fontSize:28, fontWeight:700, color:t.tx, marginBottom:6 }}>
                {pf.icon} Perfil {pf.label}
              </h2>
              <p style={{ fontFamily:FB, fontSize:13, color:t.mu, lineHeight:1.6, maxWidth:520 }}>{pf.desc}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginBottom:4 }}>Retorno orientativo</div>
              <Badge c={pf.color==="blue"?"blue":pf.color==="gold"?"gold":"purple"} t={t}>{pf.retorno}</Badge>
              <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:8 }}>Nivel de riesgo: <strong>{pf.riesgo}</strong></div>
            </div>
          </div>

          <SectionLabel t={t}>IDEAS ORIENTATIVAS DE CARTERA</SectionLabel>
          <div style={{ display:"grid", gap:8 }}>
            {pf.ideas.map((idea,i) => (
              <div key={i} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap",
                background:t.alt, borderRadius:10, padding:"14px 18px", gap:10,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:col.bg, border:`2px solid ${col.ac}44`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:FH, fontWeight:800, fontSize:16, color:col.ac }}>{idea.por}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily:FB, fontSize:13, fontWeight:600, color:t.tx }}>{idea.inst}</div>
                    <div style={{ fontFamily:FB, fontSize:11, color:t.mu, marginTop:2 }}>{idea.note}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ADMIN PANEL
════════════════════════════════════════════════════════════════ */
function AdminPanel({ onClose, onPublish, t }) {
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const process = useCallback(async () => {
    if (!txt.trim()) return;
    setLoading(true); setMsg("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`Sos un editor financiero argentino. Tu tarea: convertir el texto del usuario en un objeto JSON limpio para publicar en una landing page financiera.
Respondé SOLO con JSON válido, sin texto extra, sin markdown backticks.
Estructura:
{
  "title": "Titular breve y claro (máx 8 palabras)",
  "date": "fecha mencionada o 'HOY'",
  "type": "resumen|noticia|alerta|balance|dato",
  "kpis": [{"k":"LABEL","v":"VALOR","b":"CHIP","bc":"green|red|blue|gold|gray"}],
  "content": "HTML con análisis en 3-4 oraciones. Usá <b>negritas</b> para los datos clave. Diferenciá datos de interpretación."
}
Reglas: no inventés datos, usá solo lo que viene en el texto, tono técnico-profesional.`,
          messages:[{role:"user",content:txt}],
        }),
      });
      const d = await res.json();
      const raw = d.content?.find(x=>x.type==="text")?.text||"{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      parsed.id = Date.now().toString();
      onPublish(parsed);
      setMsg("✅ Publicado correctamente");
      setTxt("");
    } catch(e) {
      setMsg("❌ Error al procesar. Verificá el contenido.");
    }
    setLoading(false);
  }, [txt, onPublish]);

  return (
    <div style={{ background:t.goBg, borderBottom:`2px solid ${t.go}`, padding:"16px 20px" }}>
      <div style={{ maxWidth:1160, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontWeight:700, color:t.go, fontFamily:FB, fontSize:14 }}>🔑 Panel Admin — Publicar contenido</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:t.go, cursor:"pointer", fontSize:18 }}>✕</button>
        </div>
        <textarea value={txt} onChange={e=>setTxt(e.target.value)}
          placeholder="Pegá el texto con información del día: resumen de mercado, noticias, balance de empresa, cotizaciones, etc."
          style={{ width:"100%", height:90, padding:12, borderRadius:8, border:`1px solid ${t.go}55`, fontFamily:FB, fontSize:13, resize:"vertical", background:t.srf, color:t.tx, outline:"none" }}
        />
        <div style={{ display:"flex", gap:10, marginTop:8, alignItems:"center", flexWrap:"wrap" }}>
          <button onClick={process} disabled={loading} style={{
            background:t.go, color:"#fff", border:"none", borderRadius:8,
            padding:"9px 22px", fontFamily:FB, fontWeight:700, fontSize:13, cursor:"pointer", opacity:loading?.6:1,
          }}>{loading?"Procesando…":"✨ Procesar y publicar"}</button>
          {msg && <span style={{ fontSize:13, fontFamily:FB, color:msg.startsWith("✅")?t.gr:t.rd }}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   AI CHAT WIDGET
   Nombres: referentes de finanzas globales
   Contraseña: 1243 · WhatsApp: +54 11 4050-0087
════════════════════════════════════════════════════════════════ */
const IA_NAMES = ["Warren","Milton","Benjamin","Peter","Charlie","George","Ray","Paul","Janet","Adam","Irving","Nassim","Howard","Michael","John","Philip","David","Robert","Carl","Alan"];
const IA_NAME  = IA_NAMES[Math.floor(Math.random() * IA_NAMES.length)];
const WA_NUM   = "5491140500087";
const WA_LINK  = (msg) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
const CHAT_PWD = "1243";

const IA_SYSTEM = `Sos ${IA_NAME}, un asistente financiero del dashboard The Big Long de Máximo Ricciardi, asesor financiero argentino.

Personalidad: inteligente, directo, con criterio propio. Hablás en español rioplatense. Sabés de mercados argentinos e internacionales.

REGLAS (innegociables):
1. Explicás instrumentos, conceptos de mercado, funcionamiento de bonos, acciones, ETFs, tipos de cambio, macroeconomía.
2. NUNCA recomendás comprar o vender activos específicos. Si te lo piden → derivás a Máximo mostrando el botón de WhatsApp.
3. Si alguien dice que es cliente de Máximo → mostrás el botón de WhatsApp con entusiasmo.
4. Usás búsqueda web para datos frescos: cotizaciones, noticias, tasas.
5. Separás datos de interpretación.
6. Respuestas concisas, máximo 4 párrafos.
7. En respuestas sobre inversiones agregás al final: "⚠️ Orientativo, no asesoramiento formal."

Asesoramiento de Máximo: sin costo. WhatsApp: +54 11 4050-0087.`;

function AIChatWidget({ t, isMobile }) {
  const [open, setOpen]     = useState(false);
  const [auth, setAuth]     = useState(false);
  const [pwd, setPwd]       = useState("");
  const [pwdErr, setPwdErr] = useState(false);
  const [msgs, setMsgs]     = useState([{
    role:"assistant",
    content:`Hola, soy **${IA_NAME}**. Podés preguntarme sobre mercados, instrumentos financieros, tipos de cambio o economía. ¿En qué te ayudo?`,
    id:Date.now(),
  }]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const checkPwd = () => {
    if (pwd === CHAT_PWD) { setAuth(true); setPwdErr(false); }
    else { setPwdErr(true); }
  };

  const isClientMsg = (txt) => /soy cliente|cliente de m[aá]ximo|cliente tuyo/i.test(txt);
  const isRecoMsg   = (txt) => /recomend[aá]s?|debo comprar|conviene comprar|debo vender|conviene vender|me entr[aá]s?|me sal[ií]s?|qué compro|qué vendo/i.test(txt);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg = { role:"user", content:text, id:Date.now() };
    const history = [...msgs, userMsg];
    setMsgs(history);
    setLoading(true);

    if (isClientMsg(text)) {
      setMsgs([...history, { role:"assistant", id:Date.now()+1,
        content:`Perfecto, le aviso a Máximo ahora mismo. Hacé click abajo y le llega tu mensaje directo.\n\n[WA_ALERT]` }]);
      setLoading(false); return;
    }
    if (isRecoMsg(text)) {
      setMsgs([...history, { role:"assistant", id:Date.now()+1,
        content:`Las recomendaciones de compra y venta son terreno de Máximo. Su asesoramiento es **sin costo** — te lo conecto directamente.\n\n[WA_CONSULT]` }]);
      setLoading(false); return;
    }

    try {
      const apiMsgs = history.map(m => ({ role:m.role, content:m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:IA_SYSTEM,
          tools:[{ type:"web_search_20250305", name:"web_search" }],
          messages:apiMsgs,
        }),
      });
      const data = await res.json();
      const reply = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("")
        || "No pude procesar tu consulta. Intentá de nuevo.";
      setMsgs([...history, { role:"assistant", content:reply, id:Date.now()+1 }]);
    } catch {
      setMsgs([...history, { role:"assistant", id:Date.now()+1,
        content:"Error de conexión con el servidor. Verificá tu conexión e intentá de nuevo." }]);
    }
    setLoading(false);
  };

  const MiniMarkdown = ({ text }) => (
    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.75, color:"inherit" }}>
      {text.split("\n").map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p,j) =>
          p.startsWith("**")&&p.endsWith("**") ? <strong key={j} style={{fontWeight:700}}>{p.slice(2,-2)}</strong> : p
        );
        return <div key={i} style={{ marginBottom:line===""?8:2 }}>{parts}</div>;
      })}
    </div>
  );

  const renderContent = (content) => {
    const waBtn = (href, label) => (
      <a href={href} target="_blank" rel="noreferrer" style={{
        display:"inline-flex", alignItems:"center", gap:8, marginTop:12,
        background:"#22c55e", color:"#fff", borderRadius:10, padding:"9px 18px",
        fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, textDecoration:"none",
        boxShadow:"0 2px 10px rgba(34,197,94,.3)",
      }}>
        <span style={{fontSize:16}}>💬</span> {label}
      </a>
    );
    if (content.includes("[WA_ALERT]")) return (
      <div><MiniMarkdown text={content.replace("[WA_ALERT]","")} />
        {waBtn(WA_LINK("Hola Máximo, te escribo desde The Big Long. Soy cliente tuyo y me gustaría consultarte."),"Avisarle a Máximo")}
      </div>
    );
    if (content.includes("[WA_CONSULT]")) return (
      <div><MiniMarkdown text={content.replace("[WA_CONSULT]","")} />
        {waBtn(WA_LINK("Hola Máximo, te escribo desde The Big Long. Me gustaría que me asesores."),"Hablar con Máximo (sin costo)")}
      </div>
    );
    return <MiniMarkdown text={content} />;
  };

  const CHAT_W = isMobile ? "100vw" : 400;
  const CHAT_H = isMobile ? "100dvh" : 580;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button onClick={()=>setOpen(true)} title={`Hablar con ${IA_NAME}`} style={{
          position:"fixed", bottom:isMobile?72:28, right:22, zIndex:200,
          width:56, height:56, borderRadius:"50%",
          background:"linear-gradient(145deg,#1a1a2e,#16213e)",
          border:"2px solid rgba(176,120,42,.5)",
          cursor:"pointer", boxShadow:"0 4px 24px rgba(0,0,0,.35)",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"transform .2s, box-shadow .2s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.1)";e.currentTarget.style.boxShadow="0 6px 32px rgba(176,120,42,.5)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,.35)";}}>
          <span style={{fontSize:22}}>💹</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position:"fixed",
          bottom:isMobile?0:24, right:isMobile?0:22,
          width:CHAT_W, height:CHAT_H,
          borderRadius:isMobile?0:20,
          background:t.srf, border:`1px solid ${t.brd}`,
          boxShadow:"0 24px 64px rgba(0,0,0,.22)",
          zIndex:300, display:"flex", flexDirection:"column", overflow:"hidden",
        }}>

          {/* Header */}
          <div style={{
            background:"linear-gradient(145deg,#1a1a2e,#0f3460)",
            padding:"16px 18px", flexShrink:0,
            display:"flex", alignItems:"center", gap:12,
            borderBottom:"1px solid rgba(176,120,42,.3)",
          }}>
            <div style={{
              width:40, height:40, borderRadius:12,
              background:"linear-gradient(135deg,#B0782A,#D4A853)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, flexShrink:0,
            }}>💹</div>
            <div style={{flex:1}}>
              <div style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:18, fontWeight:700, color:"#fff", letterSpacing:"-.01em",
              }}>{IA_NAME}</div>
              <div style={{
                fontFamily:"'DM Sans',sans-serif",
                fontSize:10, color:"rgba(255,255,255,.5)", marginTop:1, letterSpacing:".06em",
              }}>ASISTENTE FINANCIERO · THE BIG LONG</div>
            </div>
            {/* Status dot */}
            <div style={{display:"flex",alignItems:"center",gap:5,marginRight:8}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}} />
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"rgba(255,255,255,.4)"}}>en línea</span>
            </div>
            <button onClick={()=>setOpen(false)} style={{
              background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.12)",
              borderRadius:8, width:32, height:32, cursor:"pointer",
              color:"rgba(255,255,255,.7)", fontSize:14,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"background .2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.15)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}>✕</button>
          </div>

          {/* Auth gate */}
          {!auth ? (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, gap:18 }}>
              <div style={{
                width:64, height:64, borderRadius:16,
                background:"linear-gradient(135deg,#B0782A22,#D4A85322)",
                border:"1px solid rgba(176,120,42,.3)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:28,
              }}>🔒</div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:t.tx, marginBottom:6 }}>Acceso privado</div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.mu, lineHeight:1.7 }}>
                  Ingresá la contraseña para acceder al asistente.
                </p>
              </div>
              <div style={{width:"100%", display:"flex", flexDirection:"column", gap:10}}>
                <input
                  type="password" placeholder="Contraseña"
                  value={pwd}
                  onChange={e=>{ setPwd(e.target.value); setPwdErr(false); }}
                  onKeyDown={e=>e.key==="Enter"&&checkPwd()}
                  autoFocus
                  style={{
                    width:"100%", padding:"12px 16px", borderRadius:12,
                    fontFamily:"'DM Sans',sans-serif", fontSize:14, letterSpacing:".1em",
                    border:`1.5px solid ${pwdErr?"#ef4444":t.brd}`,
                    background:t.alt, color:t.tx, outline:"none",
                    transition:"border-color .2s",
                  }}
                />
                {pwdErr && (
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#ef4444", marginTop:-4 }}>
                    Contraseña incorrecta. Intentá de nuevo.
                  </p>
                )}
                <button onClick={checkPwd} style={{
                  width:"100%", padding:"13px", borderRadius:12, border:"none",
                  background:"linear-gradient(135deg,#1a1a2e,#0f3460)",
                  color:"#fff", fontFamily:"'DM Sans',sans-serif",
                  fontWeight:700, fontSize:14, cursor:"pointer",
                  letterSpacing:".02em", transition:"opacity .2s",
                }}>Ingresar</button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages area */}
              <div style={{
                flex:1, overflowY:"auto", padding:"18px 16px",
                display:"flex", flexDirection:"column", gap:14,
                background:t.bg,
              }}>
                {msgs.map(m => (
                  <div key={m.id} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", alignItems:"flex-end", gap:8 }}>
                    {m.role==="assistant" && (
                      <div style={{
                        width:28, height:28, borderRadius:8, flexShrink:0,
                        background:"linear-gradient(135deg,#B0782A,#D4A853)",
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:14,
                      }}>💹</div>
                    )}
                    <div style={{
                      maxWidth:"82%",
                      background: m.role==="user"
                        ? "linear-gradient(135deg,#1a1a2e,#0f3460)"
                        : t.srf,
                      color: m.role==="user" ? "#fff" : t.tx,
                      borderRadius: m.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      padding:"11px 15px",
                      border: m.role==="assistant" ? `1px solid ${t.brd}` : "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,.06)",
                    }}>
                      {m.role==="assistant"
                        ? renderContent(m.content)
                        : <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.65 }}>{m.content}</span>
                      }
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
                    <div style={{
                      width:28, height:28, borderRadius:8, flexShrink:0,
                      background:"linear-gradient(135deg,#B0782A,#D4A853)",
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:14,
                    }}>💹</div>
                    <div style={{ background:t.srf, border:`1px solid ${t.brd}`, borderRadius:"18px 18px 18px 4px", padding:"12px 16px" }}>
                      <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                        {[0,1,2].map(i => (
                          <div key={i} style={{
                            width:7, height:7, borderRadius:"50%",
                            background:"#B0782A",
                            animation:"blink 1.4s infinite ease-in-out",
                            animationDelay:`${i*0.18}s`,
                          }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick suggestions */}
              {msgs.length <= 1 && (
                <div style={{ padding:"10px 16px 6px", background:t.bg, display:"flex", gap:6, flexWrap:"wrap", borderTop:`1px solid ${t.brd}33` }}>
                  {["¿Qué es un LECAP?","¿Cómo funciona el MEP?","¿Qué es el riesgo país?","¿Cómo dolarizo?"].map((s,i) => (
                    <button key={i} onClick={()=>setInput(s)} style={{
                      background:"transparent",
                      border:`1px solid ${t.brd}`,
                      borderRadius:20, padding:"5px 12px",
                      fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.mu,
                      cursor:"pointer", whiteSpace:"nowrap",
                      transition:"all .15s",
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#B0782A";e.currentTarget.style.color="#B0782A";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=t.brd;e.currentTarget.style.color=t.mu;}}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input bar */}
              <div style={{
                padding:"12px 16px 14px",
                background:t.srf,
                borderTop:`1px solid ${t.brd}`,
                display:"flex", gap:10, flexShrink:0, alignItems:"center",
              }}>
                <input
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
                  placeholder={`Preguntale a ${IA_NAME}...`}
                  disabled={loading}
                  style={{
                    flex:1, padding:"11px 15px", borderRadius:12,
                    fontFamily:"'DM Sans',sans-serif", fontSize:13,
                    border:`1px solid ${t.brd}`,
                    background:t.alt, color:t.tx, outline:"none",
                    transition:"border-color .2s",
                  }}
                  onFocus={e=>e.target.style.borderColor="#B0782A"}
                  onBlur={e=>e.target.style.borderColor=t.brd}
                />
                <button onClick={send} disabled={loading||!input.trim()} style={{
                  width:42, height:42, borderRadius:12, border:"none", flexShrink:0,
                  background:input.trim()&&!loading
                    ? "linear-gradient(135deg,#B0782A,#D4A853)"
                    : t.alt,
                  color:input.trim()&&!loading?"#fff":t.mu,
                  cursor:input.trim()&&!loading?"pointer":"default",
                  fontSize:16, transition:"all .2s",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:input.trim()&&!loading?"0 2px 10px rgba(176,120,42,.35)":"none",
                }}>➤</button>
              </div>

              {/* Footer */}
              <div style={{ padding:"6px 16px 10px", background:t.srf, textAlign:"center" }}>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:t.fa, lineHeight:1.5 }}>
                  Puede cometer errores · No es asesoramiento de inversión ·{" "}
                  <a href={WA_LINK("Hola Máximo, te escribo desde The Big Long.")} target="_blank" rel="noreferrer"
                    style={{ color:"#B0782A", textDecoration:"none", fontWeight:600 }}>
                    Hablar con Máximo →
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   APP

const IA_SYSTEM = `Sos ${IA_NAME}, una asistente financiera de The Big Long — el dashboard de finanzas de Máximo Ricciardi, asesor financiero argentino.

Tu personalidad: profesional, directa, amigable y con buen humor financiero. Hablás en español rioplatense. Siempre sabés de qué hablás.

TUS REGLAS (no negociables):
1. Podés explicar instrumentos financieros, conceptos de mercado, cómo funcionan los bonos, acciones, ETFs, tipos de cambio, etc.
2. NUNCA recomendás comprar o vender un activo específico. Si te lo piden, decís algo como: "Eso es territorio de Máximo — te conecto con él." y mostrás el link de WhatsApp.
3. Si alguien dice que es cliente de Máximo, respondés con entusiasmo y les decís que podés avisarle directamente, mostrando el botón de WhatsApp.
4. Tenés acceso a búsqueda web en tiempo real — úsala para cotizaciones, noticias y datos frescos.
5. Diferenciá siempre datos concretos de interpretación.
6. Sé concisa. Máximo 4 párrafos por respuesta.
7. Al final de cada respuesta que involucre inversiones, agregá: "⚠️ Esto es orientativo, no asesoramiento formal."

El asesoramiento de Máximo es sin costo. Su WhatsApp: +54 11 4050-0087.`;


/* ════════════════════════════════════════════════════════════════
   APP
════════════════════════════════════════════════════════════════ */
export default function App() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState("inicio");
  const [selS, setSelS] = useState(0);
  const [admin, setAdmin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [extra, setExtra] = useState([]);
  const [dolar, setDolar] = useState(null);
  const [riesgoPais, setRiesgoPais] = useState(null);
  const [fxError, setFxError] = useState(false);
  const winW = useWindowSize();
  const isMobile = winW < 640;
  const clock = useClock();
  const t = dark ? TH.d : TH.l;
  useFonts(dark);

  // Load extra from storage
  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get("mr-extra"); if (r?.value) setExtra(JSON.parse(r.value)); } catch {}
    })();
  }, []);

  // ── Live FX: dolarapi.com directo con fallback a valores del día ──
  useEffect(() => {
    // Valores verificados 20 MAR 2026 — Fuente: La Nación / El Cronista / c5n
    const FALLBACK = {
      oficial:   { compra: 1365, venta: 1415 },
      blue:      { compra: 1410, venta: 1430 },
      bolsa:     { compra: 1418, venta: 1421 },
      ccl:       { compra: 1462, venta: 1478 },
      mayorista: { compra: 1392, venta: 1394 },
    };
    const FALLBACK_RP = { valor: 640, fecha: "20 MAR 2026" };

    async function loadLiveData() {
      try {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 5000); // 5s timeout
        const res = await fetch("https://dolarapi.com/v1/dolares", { signal: ctrl.signal });
        clearTimeout(tid);
        const data = await res.json();
        const byName = k => data.find(d => d.casa === k);
        setDolar({
          oficial:   byName("oficial")   || FALLBACK.oficial,
          blue:      byName("blue")      || FALLBACK.blue,
          bolsa:     byName("bolsa")     || FALLBACK.bolsa,
          ccl:       byName("contadoconliqui") || FALLBACK.ccl,
          mayorista: byName("mayorista") || FALLBACK.mayorista,
        });
        setFxError(false);
      } catch {
        setDolar(FALLBACK);
        setFxError(true);
      }
      try {
        const ctrl2 = new AbortController();
        const tid2 = setTimeout(() => ctrl2.abort(), 5000);
        const rpRes = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo", { signal: ctrl2.signal });
        clearTimeout(tid2);
        const rpData = await rpRes.json();
        if (rpData?.valor) setRiesgoPais(rpData);
        else setRiesgoPais(FALLBACK_RP);
      } catch {
        setRiesgoPais(FALLBACK_RP);
      }
    }

    loadLiveData();
    const interval = setInterval(loadLiveData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = () => {
    setLogoClicks(n => { const next = n+1; if(next>=5){ setAdmin(true); return 0; } return next; });
  };

  const publishExtra = useCallback(async (item) => {
    const updated = [item, ...extra];
    setExtra(updated);
    try { await window.storage.set("mr-extra", JSON.stringify(updated)); } catch {}
  }, [extra]);

  const removeExtra = useCallback(async (id) => {
    const updated = extra.filter(x=>x.id!==id);
    setExtra(updated);
    try { await window.storage.set("mr-extra", JSON.stringify(updated)); } catch {}
  }, [extra]);

  const TABS = [
    { id:"inicio",          label:"Inicio",           icon:"🏠" },
    { id:"resumen",         label:"Resumen Diario",   icon:"📋" },
    { id:"noticias",        label:"Noticias",          icon:"📰" },
    { id:"mercados",        label:"Mercados",          icon:"💱" },
    { id:"informes",         label:"Informes",          icon:"📊" },
    { id:"instrumentos",    label:"Instrumentos",      icon:"🔬" },
    { id:"recomendaciones", label:"Recomendaciones",  icon:"💼" },
  ];

  const of  = dolar?.oficial?.venta;
  const bl  = dolar?.blue?.venta;
  const mep = dolar?.bolsa?.venta;
  const ccl = dolar?.ccl?.venta;
  const bBlueStr = (of && bl) ? `Brecha Blue ${(((bl/of)-1)*100).toFixed(1)}%` : "Brecha Blue —";
  const bMEPStr  = (of && mep) ? `Brecha MEP ${(((mep/of)-1)*100).toFixed(1)}%` : "Brecha MEP —";
  const rpStr    = riesgoPais ? `Riesgo País ${riesgoPais.valor} pb` : "Riesgo País 610 pb";

  const tickerItems = [
    dolar?.oficial   ? `USD Oficial $${Math.round(of)}` : "USD Oficial —",
    dolar?.blue      ? `USD Blue $${Math.round(bl)}` : "USD Blue —",
    dolar?.bolsa     ? `USD MEP $${Math.round(mep)}` : "USD MEP —",
    dolar?.ccl       ? `USD CCL $${Math.round(ccl)}` : "USD CCL —",
    bBlueStr, bMEPStr, rpStr,
    "BCRA compras USD 58M · Dólar mayorista $1.400", "Merval USD +1,4%", "Bonos USD a la baja · presión EM",
    "Desempleo Q4 7,5% · sube +0,9 p.p.", "YPF · fallo suspendido · Cámara NY",
    "Inflación feb. 1,0%", "Superávit primario 0,4% PBI",
  ].join(" · ");

  const tickerFull = `${tickerItems} · ${tickerItems} ·`;

  return (
    <div style={{ fontFamily:FB, background:t.bg, minHeight:"100vh", color:t.tx, transition:"background .3s, color .3s",
      paddingBottom: isMobile ? 64 : 0 }}>

      {/* ── HEADER ── */}
      <header style={{ background:t.hdr, borderBottom:`1px solid ${t.brd}`, position:"sticky", top:0, zIndex:100, boxShadow:t.sh }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:`0 ${isMobile?12:20}px`, display:"flex", alignItems:"center", justifyContent:"space-between", height:isMobile?50:56, gap:isMobile?8:16 }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:isMobile?6:12, flexShrink:0, cursor:"pointer" }} onClick={handleLogoClick}>
            <div style={{ fontFamily:FH, fontSize:isMobile?16:20, fontWeight:700, color:t.tx, letterSpacing:"-.02em", lineHeight:1 }}>
              The Big Long
            </div>
            {!isMobile && <><div style={{ width:1, height:20, background:t.brd }} />
            <div style={{ fontFamily:FB, fontSize:11, color:t.mu, letterSpacing:".04em" }}>Máximo Ricciardi</div></>}
          </div>

          {/* Nav — desktop only */}
          {!isMobile && (
            <nav style={{ display:"flex", gap:2, flexWrap:"nowrap" }}>
              {TABS.map(tb => (
                <button key={tb.id} onClick={()=>setTab(tb.id)} style={{
                  padding:"6px 12px", borderRadius:8, border:"none", fontFamily:FB,
                  fontSize:11, fontWeight:tab===tb.id?700:400,
                  background:tab===tb.id?t.go+"18":"transparent",
                  color:tab===tb.id?t.go:t.mu,
                  cursor:"pointer", transition:"all .2s", whiteSpace:"nowrap",
                }}>{tb.label}</button>
              ))}
            </nav>
          )}

          {/* Right controls */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            {!isMobile && (
              <div style={{ textAlign:"right", lineHeight:1.3 }}>
                <div style={{ fontFamily:FB, fontSize:13, fontWeight:700, color:t.tx, letterSpacing:".01em", fontVariantNumeric:"tabular-nums" }}>
                  {clock.time}
                </div>
                <div style={{ fontFamily:FB, fontSize:9, color:t.mu, letterSpacing:".04em", textTransform:"uppercase" }}>
                  {clock.date}
                </div>
              </div>
            )}
            <button onClick={()=>setDark(d=>!d)} style={{
              background:t.alt, border:`1px solid ${t.brd}`, borderRadius:8,
              padding:isMobile?"6px 10px":"6px 12px", fontFamily:FB, fontSize:12, color:t.mu, cursor:"pointer",
            }}>{dark?"☀️":"🌙"}</button>
          </div>
        </div>
      </header>

      {/* ── BOTTOM NAV — mobile only ── */}
      {isMobile && (
        <nav style={{
          position:"fixed", bottom:0, left:0, right:0, zIndex:100,
          background:t.hdr, borderTop:`1px solid ${t.brd}`,
          display:"flex", justifyContent:"space-around", alignItems:"center",
          height:56, boxShadow:"0 -2px 12px rgba(0,0,0,.08)",
        }}>
          {TABS.map(tb => (
            <button key={tb.id} onClick={()=>setTab(tb.id)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              padding:"4px 6px", border:"none", background:"transparent",
              cursor:"pointer", flex:1,
            }}>
              <span style={{ fontSize:18, lineHeight:1 }}>{tb.icon}</span>
              <span style={{
                fontFamily:FB, fontSize:8, fontWeight:tab===tb.id?700:400,
                color:tab===tb.id?t.go:t.fa, letterSpacing:".04em",
                textTransform:"uppercase", whiteSpace:"nowrap",
              }}>{tb.label.split(" ")[0]}</span>
            </button>
          ))}
        </nav>
      )}

      {/* ── TICKER ── */}
      <div style={{ background:t.tick, padding:"7px 0", overflow:"hidden" }}>
        <div style={{ display:"flex", animation:"marquee 60s linear infinite", width:"max-content" }}>
          {[tickerFull, tickerFull].map((txt2, k) => (
            <span key={k} style={{ fontFamily:FB, fontSize:11, fontWeight:500, color:t.tickT, whiteSpace:"nowrap", paddingRight:40 }}>
              {txt2.split("·").map((item,i) => (
                <span key={i}>
                  <span style={{ color:t.go, fontWeight:700 }}> {item.trim()} </span>
                  <span style={{ color:t.tickT, opacity:.4 }}>·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── ADMIN PANEL ── */}
      {admin && <AdminPanel onClose={()=>setAdmin(false)} onPublish={publishExtra} t={t} />}

      {/* ── MAIN ── */}
      <main style={{ maxWidth:1200, margin:"0 auto", padding:isMobile?"16px 12px 80px":"28px 20px 60px" }}>

        {/* Extra published content */}
        {extra.length > 0 && (
          <div style={{ marginBottom:24 }}>
            <SectionLabel t={t}>⚡ ÚLTIMO · ACTUALIZACIÓN EN VIVO</SectionLabel>
            {extra.map(item => (
              <Card key={item.id} t={t} style={{ marginBottom:12, borderLeft:`4px solid ${t.go}` }}>
                <div style={{ padding:"16px 20px", position:"relative" }}>
                  {admin && <button onClick={()=>removeExtra(item.id)} style={{ position:"absolute", top:12, right:12, background:t.rdBg, border:"none", borderRadius:6, padding:"3px 8px", color:t.rd, cursor:"pointer", fontSize:11, fontFamily:FB }}>Eliminar</button>}
                  <div style={{ fontFamily:FB, fontSize:10, color:t.fa, marginBottom:6 }}>{item.date} · {item.type?.toUpperCase()}</div>
                  <h3 style={{ fontFamily:FH, fontSize:20, fontWeight:700, color:t.tx, marginBottom:10 }}>{item.title}</h3>
                  {item.kpis?.length>0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                      {item.kpis.map((k,i) => <KpiChip key={i} item={k} t={t} />)}
                    </div>
                  )}
                  <div style={{ fontFamily:FB, fontSize:13, color:t.mu, lineHeight:1.75 }} dangerouslySetInnerHTML={{ __html:item.content }} />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab content */}
        {tab==="inicio" && <InicioView dolar={dolar} riesgoPais={riesgoPais} fxError={fxError} t={t} setTab={setTab} isMobile={isMobile} clock={clock} />}
        {tab==="resumen" && (
          <div>
            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
              {SUMMARIES.map((s,i) => (
                <button key={s.id} onClick={()=>setSelS(i)} style={{
                  padding:"8px 18px", borderRadius:10, fontFamily:FB, fontSize:12, fontWeight:500,
                  cursor:"pointer", transition:"all .2s",
                  border:`2px solid ${selS===i?t.tx:t.brd}`,
                  background:selS===i?t.tx:"transparent",
                  color:selS===i?"#fff":t.mu,
                }}>
                  {i===0&&"🔴 "}{s.date}
                  {i===0&&<span style={{ marginLeft:6, fontSize:9, background:t.rd, color:"#fff", padding:"1px 5px", borderRadius:8 }}>HOY</span>}
                </button>
              ))}
            </div>
            <SummaryCard s={SUMMARIES[selS]} t={t} />
          </div>
        )}
        {tab==="noticias" && <NoticiasView t={t} />}
        {tab==="mercados" && <MercadosView dolar={dolar} riesgoPais={riesgoPais} fxError={fxError} t={t} />}
        {tab==="informes" && <InformesView t={t} />}
        {tab==="instrumentos" && <InstrumentosView t={t} />}
        {tab==="recomendaciones" && <RecomendacionesView t={t} />}
      </main>

      {/* ── FOOTER — ALWAYS VISIBLE — */}
      <footer style={{ background:t.ft, borderTop:`1px solid ${t.brd}33`, padding:"36px 20px 28px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          {/* Top row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:20, alignItems:"start", marginBottom:28, flexWrap:"wrap" }}>

            {/* Brand + contact */}
            <div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:t.ftT, lineHeight:1, letterSpacing:"-.02em" }}>The Big Long</div>
                <div style={{ fontFamily:FB, fontSize:11, color:"rgba(255,255,255,.35)", marginTop:4 }}>Máximo Ricciardi</div>
              </div>
              <p style={{ fontFamily:FB, fontSize:12, color:"rgba(255,255,255,.45)", lineHeight:1.7, maxWidth:320 }}>
                Análisis y seguimiento del mercado argentino. Actualización diaria con datos de renta fija, renta variable, mercado de cambios y contexto macro.
              </p>
            </div>

            {/* Divider */}
            <div style={{ width:1, background:"rgba(255,255,255,.08)", minHeight:120, margin:"0 20px" }} />

            {/* Contact */}
            <div>
              <div style={{ fontFamily:FB, fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:14 }}>CONTACTO</div>
              <div style={{ fontFamily:FH, fontSize:22, fontWeight:600, color:t.ftT, marginBottom:4 }}>{CONTACT.name}</div>
              <div style={{ fontFamily:FB, fontSize:12, color:"rgba(255,255,255,.5)", marginBottom:16 }}>{CONTACT.title}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <a href={`tel:${CONTACT.phone}`} style={{ display:"flex", alignItems:"center", gap:10, fontFamily:FB, fontSize:13, color:t.go, textDecoration:"none", fontWeight:600 }}>
                  <span style={{ fontSize:14 }}>📞</span> {CONTACT.phone}
                </a>
                <a href={`mailto:${CONTACT.email}`} style={{ display:"flex", alignItems:"center", gap:10, fontFamily:FB, fontSize:13, color:t.go, textDecoration:"none", fontWeight:600 }}>
                  <span style={{ fontSize:14 }}>✉️</span> {CONTACT.email}
                </a>
              </div>
            </div>
          </div>

          {/* Bottom legal */}
          <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:18, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <p style={{ fontFamily:FB, fontSize:11, color:"rgba(255,255,255,.3)", lineHeight:1.6, maxWidth:640 }}>
              La información publicada tiene carácter exclusivamente informativo. No constituye asesoramiento de inversión, recomendación de compra o venta de valores, ni oferta pública. Invertir implica riesgos.
            </p>
            <span style={{ fontFamily:FB, fontSize:11, color:"rgba(255,255,255,.25)", whiteSpace:"nowrap" }}>© 2026 · v2.0 · 20 MAR 2026</span>
          </div>
        </div>
      </footer>

      {/* ── AI CHAT WIDGET ── */}
      <AIChatWidget t={t} isMobile={isMobile} />

    </div>
  );
}
