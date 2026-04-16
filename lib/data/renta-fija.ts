import type { LecapMes, DualBond, TamarBond, DolarLinkedBond, CerBond, SoberanoBond } from "@/types";

// ── LECAP (Tasa Fija) — 19 MAR 2026 10:45hs ──────────────────
export const LECAP: LecapMes[] = [
  {mes:"Abril",     vto:"17/04/2026", dias:29,  rows:[{t:"S17A6", pre:"$107,82",r:"2,14%", tna:"26,91%", tem:"2,21%", fxbe:"$1.452"}]},
  {mes:"Abril",     vto:"30/04/2026", dias:42,  rows:[{t:"S30A6", pre:"$123,83",r:"2,96%", tna:"25,69%", tem:"2,10%", fxbe:"$1.463"}]},
  {mes:"Mayo",      vto:"15/05/2026", dias:57,  rows:[{t:"S15Y6", pre:"$100,00",r:"4,20%", tna:"26,90%", tem:"2,18%", fxbe:"$1.470"}]},
  {mes:"Mayo",      vto:"29/05/2026", dias:71,  rows:[{t:"S29Y6", pre:"$124,96",r:"5,67%", tna:"29,12%", tem:"2,36%", fxbe:"$1.502"}]},
  {mes:"Junio",     vto:"30/06/2026", dias:103, rows:[{t:"T30J6", pre:"$134,20",r:"7,97%", tna:"28,24%", tem:"2,26%", fxbe:"$1.535"}]},
  {mes:"Julio",     vto:"17/07/2026", dias:120, rows:[{t:"S17L6", pre:"$102,50",r:"8,64%", tna:"26,28%", tem:"2,16%", fxbe:"$1.548"}]},
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

// ── BONOS DUALES — 19 MAR 2026 ─────────────────────────────
export const DUALES: DualBond[] = [
  {t:"TTJ26", vto:"30/06/2026", dias:103, temFija:"-1,29%", tnaFija:"-15,40%", temVar:"3,08%", tnaVar:"38,83%", fxbe:"$1.360"},
  {t:"TTS26", vto:"15/09/2026", dias:180, temFija:"0,33%",  tnaFija:"4,00%",   temVar:"3,28%", tnaVar:"43,28%", fxbe:"$1.450"},
  {t:"TTD26", vto:"15/12/2026", dias:271, temFija:"0,92%",  tnaFija:"11,66%",  temVar:"3,26%", tnaVar:"45,33%", fxbe:"$1.545"},
];

// ── LETRAS TAMAR — 19 MAR 2026 ──────────────────────────────
export const TAMAR: TamarBond[] = [
  {t:"M30A6", vto:"30/04/2026", dias:42,  rend:"4,49%",  tna:"39,94%", tem:"3,26%", fxbe:"$1.485"},
  {t:"M31G6", vto:"31/08/2026", dias:165, rend:"19,23%", tna:"42,79%", tem:"3,27%", fxbe:"$1.695"},
];

// ── DÓLAR LINKED — 19 MAR 2026 ──────────────────────────────
export const DOLARLINKED: DolarLinkedBond[] = [
  {t:"D30A6", vto:"30/04/2026", dias:42,  pre:"$1.383",rend:"1,17%",  tna:"10,18%"},
  {t:"TZV26", vto:"30/06/2026", dias:103, pre:"$1.412",rend:"-0,87%", tna:"-3,09%"},
  {t:"TZV27", vto:"30/06/2027", dias:468, pre:"$1.310",rend:"6,84%",  tna:"5,33%"},
];

// ── BONOS CER ────────────────────────────────────────────────
export const BONOS_CER: CerBond[] = [
  {t:"TX26",  desc:"Bonte 2026",    vto:"09/11/2026", cupCer:2.00, tipo:"CER+2%",    ley:"ARG", amort:"Bullet"},
  {t:"TZXM6", desc:"BONCER Jun 26", vto:"30/06/2026", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZXO6", desc:"BONCER Oct 26", vto:"30/10/2026", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZXD6", desc:"BONCER Dic 26", vto:"30/12/2026", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZX26", desc:"BONCER Mar 26", vto:"31/03/2026", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZX27", desc:"BONCER Mar 27", vto:"31/03/2027", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZXM7", desc:"BONCER Jun 27", vto:"30/06/2027", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TZXD7", desc:"BONCER Dic 27", vto:"31/12/2027", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"TX28",  desc:"Bonte 2028",    vto:"09/11/2028", cupCer:2.25, tipo:"CER+2,25%", ley:"ARG", amort:"Bullet"},
  {t:"TZX28", desc:"BONCER Mar 28", vto:"31/03/2028", cupCer:0,    tipo:"CER (Zero)",ley:"ARG", amort:"Bullet"},
  {t:"DICP",  desc:"Discount 2033", vto:"31/12/2033", cupCer:5.83, tipo:"CER+5,83%", ley:"ARG", amort:"Amort."},
  {t:"PARP",  desc:"Par 2038",      vto:"31/12/2038", cupCer:1.68, tipo:"CER+1,68%", ley:"ARG", amort:"Amort."},
];

// ── SOBERANOS EN USD — 19 MAR 2026 ───────────────────────────
export const SOBERANOS: SoberanoBond[] = [
  // ley argentina
  {t:"AO27D",vto:"Oct 2027",p:"$102,20",tir:"4,90%", sprd:"—",    cy:"5,87%",dur:1.56,pago:"Mensual", ley:"ARG",par:"101,84%",var1d:"+0,25%",var1w:"+1,29%",neg:false},
  {t:"AO28D",vto:"Oct 2028",p:"$95,00", tir:"9,50%", sprd:"—",    cy:"6,32%",dur:2.10,pago:"Mensual", ley:"ARG",par:"95,00%", var1d:"—",     var1w:"—",     neg:false},
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

// BCRA key variable IDs
export const BCRA_VARS = {
  RESERVAS: 1, TC_MIN: 4, TC_MAY: 5, BADLAR: 6, TPM: 7, TAMAR: 27, BASE_MON: 15,
} as const;
