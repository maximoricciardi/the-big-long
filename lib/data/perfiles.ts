import { Shield, Scale, Rocket } from "lucide-react";
import type { Perfil } from "@/types";

export const PERFILES: Perfil[] = [
  {
    id:"conservador", label:"Conservador", Icon:Shield, color:"blue",
    desc:"Preservación de capital con rendimiento real positivo. Horizonte corto-mediano plazo. Fondos de bajo riesgo, LECAPs y cobertura cambiaria.",
    ideas:[
      {inst:"Balanz Income (ETP)",               por:"25%", note:"T-Bills US · Rating AA · Duration 0.16 · Exterior", tipo:"fondo"},
      {inst:"Balanz Ahorro Corto Plazo",          por:"20%", note:"Fondo RF corto plazo · T+1 · Destacado ARS",       tipo:"fondo"},
      {inst:"LECAP S29Y6 (Mayo 2026)",            por:"20%", note:"Tasa fija · TEM ~2,36% · Vto. mayo",               tipo:"lecap"},
      {inst:"Balanz Money Market",                por:"15%", note:"Fondo Money Market · T+0 · Parking",               tipo:"fondo"},
      {inst:"Balanz Dólar Corto Plazo (Estrategia I)",por:"10%",note:"Fondo RF USD · T+1 · Destacado USD",            tipo:"fondo"},
      {inst:"Caución Bursátil 7D",                por:"10%", note:"~20% TNA · Liquidez semanal",                      tipo:"caucion"},
    ],
    retorno:"Renta fija ARS + T-Bills US + cobertura USD",
    riesgo:"Bajo",
    disclaimer:"Solo a modo orientativo. Consultar asesor antes de invertir.",
  },
  {
    id:"moderado", label:"Moderado", Icon:Scale, color:"gold",
    desc:"Equilibrio entre cobertura inflacionaria, tasa fija y rendimiento en dólares. Horizonte 6-12 meses. Incluye exposición a corporativos LatAm y balance de activos.",
    ideas:[
      {inst:"Balanz Fixed Income LATAM (ETP)",    por:"20%", note:"+50 bonos LatAm · YTM 6,86% · Ley NY · Exterior", tipo:"bono"},
      {inst:"Balanz Balanced (ETP)",              por:"15%", note:"50/50 RV/RF · Gestión activa · Exterior",         tipo:"fondo"},
      {inst:"LECAP S31L6 (Julio 2026)",           por:"15%", note:"Tasa fija · TNA ~27,7% · 4 meses",               tipo:"lecap"},
      {inst:"Balanz Inflation Linked (Inst.)",    por:"15%", note:"Fondo CER · Cobertura inflación",                 tipo:"fondo"},
      {inst:"GD30D — Global 2030 (Ley NY)",       por:"15%", note:"Soberano USD · TIR ~8,2% · Duration 2,1",        tipo:"bono"},
      {inst:"Cedear Oro (GLD)",                   por:"10%", note:"Cobertura geopolítica · Refugio",                 tipo:"cedear"},
      {inst:"Balanz Dólar Corto Plazo (Estrategia I)",por:"10%",note:"Fondo RF USD · Liquidez táctica",              tipo:"fondo"},
    ],
    retorno:"Mixto ARS/USD · LatAm + RF + Oro",
    riesgo:"Moderado",
    disclaimer:"Solo a modo orientativo. Consultar asesor antes de invertir.",
  },
  {
    id:"agresivo", label:"Agresivo", Icon:Rocket, color:"purple",
    desc:"Máxima exposición a activos de mayor beta. Renta variable global, cripto y compresión de riesgo país. Horizonte 12-18 meses.",
    ideas:[
      {inst:"Balanz Global Equity (ETP)",         por:"20%", note:"RV global · Supera S&P500 · Gestión activa · Exterior",tipo:"cedear"},
      {inst:"Balanz Crypto (ETP)",                por:"10%", note:"BTC + ETH + ecosistema cripto · Alta volatilidad · Exterior",tipo:"cedear"},
      {inst:"GD38D — Global 2038 (Ley NY)",       por:"20%", note:"Soberano USD · TIR ~10% · Duration 4,9",           tipo:"bono"},
      {inst:"Balanz Acciones",                    por:"15%", note:"Fondo Acciones ARG · Blue chips locales",           tipo:"fondo"},
      {inst:"Cedear VIST (Vista Energy)",          por:"15%", note:"Pure-play Vaca Muerta · Score #1 RD",              tipo:"cedear"},
      {inst:"Cedear NVDA / GOOGL",                por:"10%", note:"Tech + IA · Mega-cap growth",                      tipo:"cedear"},
      {inst:"Balanz Dólar Corto Plazo (Estrategia I)",por:"10%",note:"Fondo RF USD · Liquidez táctica",               tipo:"fondo"},
    ],
    retorno:"Potencial alfa USD+Cripto · Alta variabilidad",
    riesgo:"Alto",
    disclaimer:"Solo a modo orientativo. Consultar asesor antes de invertir.",
  },
];
