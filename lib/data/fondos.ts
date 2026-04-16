import {
  Banknote, ClipboardList, DollarSign, Globe, Shield, TrendingUp,
} from "lucide-react";
import type { FondoCategory } from "@/types";

const BZ = "https://balanz.com/inversiones/fondos";

export const FONDOS_BALANZ: FondoCategory[] = [
  {
    cat:"Transaccionales — Pesos", Icon:Banknote, color:"blue", moneda:"ARS",
    desc:"Liquidez inmediata (T+0). Ideal para parking de pesos a tasa diaria.",
    fondos:[
      {nombre:"Balanz Money Market",           ticker:"BMMKT",  rescate:"T+0", tipo:"Money Market", url:`${BZ}/money-market/`},
      {nombre:"Balanz Lecaps (Performance II)", ticker:"PERF2",  rescate:"T+0", tipo:"Tasa Fija",    url:`${BZ}/performance-ii/`, note:"Exposición a LECAPs"},
    ],
  },
  {
    cat:"Renta Fija — Pesos", Icon:ClipboardList, color:"gold", moneda:"ARS",
    desc:"Bonos soberanos, ONs y LECAPs. Horizonte corto-mediano plazo.",
    destacado:"BCAH",
    fondos:[
      {nombre:"Balanz Ahorro Corto Plazo",          ticker:"BCAH",   rescate:"T+1", tipo:"RF Corto Plazo",  url:`${BZ}/ahorro/`, destacado:true},
      {nombre:"Balanz Crédito Privado Corto Plazo",  ticker:"BCPCP",  rescate:"T+1", tipo:"ONs Corp.",       url:`${BZ}/credito-privado-corto-plazo/`},
      {nombre:"Balanz ONs (Performance III)",         ticker:"PERF3",  rescate:"T+1", tipo:"ONs Corp.",       url:`${BZ}/performance-iii/`},
      {nombre:"Balanz Opportunity",                   ticker:"BOPPO",  rescate:"T+1", tipo:"RF Flexible",     url:`${BZ}/renta-fija-opportunity/`},
      {nombre:"Balanz Long Pesos",                    ticker:"BLPSO",  rescate:"T+1", tipo:"RF Largo Plazo",  url:`${BZ}/long-pesos/`},
      {nombre:"Balanz Abierto PyMES",                 ticker:"BPYME",  rescate:"T+1", tipo:"SGR / PyME",      url:`${BZ}/abierto-pymes/`},
      {nombre:"Balanz Abierto Infraestructura",       ticker:"BINFA",  rescate:"T+1", tipo:"Infraestructura", url:`${BZ}/abierto-infraestructura/`},
    ],
  },
  {
    cat:"Cobertura — Pesos", Icon:Shield, color:"green", moneda:"ARS",
    desc:"Cobertura inflación (CER) y tipo de cambio (Dólar Linked).",
    fondos:[
      {nombre:"Balanz Inflation Linked (Inst.)", ticker:"BINFL", rescate:"T+1", tipo:"CER",          url:`${BZ}/institucional-inflation-linked/`},
      {nombre:"Balanz Dólar Linked",              ticker:"BDLNK", rescate:"T+1", tipo:"Dólar Linked", url:`${BZ}/renta-fija-dolar-linked/`},
    ],
  },
  {
    cat:"Renta Variable — Pesos", Icon:TrendingUp, color:"red", moneda:"ARS",
    desc:"Acciones argentinas, CEDEARs y commodities. Mayor volatilidad, mayor potencial.",
    fondos:[
      {nombre:"Balanz Acciones",                   ticker:"BACCA",  rescate:"T+1", tipo:"Acciones ARG",  url:`${BZ}/acciones/`},
      {nombre:"Balanz Equity Selection",            ticker:"BEQSL",  rescate:"T+1", tipo:"Acciones ARG",  url:`${BZ}/equity-selection/`},
      {nombre:"Balanz Renta Mixta (Retorno Total)", ticker:"BRTOT",  rescate:"T+1", tipo:"Mixto",         url:`${BZ}/retorno-total/`},
      {nombre:"Balanz Soja",                        ticker:"BSOJA",  rescate:"T+1", tipo:"Commodities",   url:`${BZ}/soja/`},
      {nombre:"Balanz Crecimiento",                 ticker:"BCREC",  rescate:"T+1", tipo:"RV Growth",     url:`${BZ}/crecimiento/`},
      {nombre:"Balanz Desarrollo",                  ticker:"BDESA",  rescate:"T+1", tipo:"RV Growth",     url:`${BZ}/desarrollo/`},
    ],
  },
  {
    cat:"Transaccionales — Dólares", Icon:DollarSign, color:"purple", moneda:"USD",
    desc:"Liquidez inmediata en dólares (T+0).",
    fondos:[
      {nombre:"Balanz Money Market USD", ticker:"BMMUSD", rescate:"T+0", tipo:"Money Market", url:`${BZ}/money-market-dolares/`},
    ],
  },
  {
    cat:"Renta Fija — Dólares", Icon:Globe, color:"purple", moneda:"USD",
    desc:"Soberanos, corporativos y LATAM en USD. Horizonte 3-18 meses.",
    destacado:"ESTRA1",
    fondos:[
      {nombre:"Balanz Dólar Corto Plazo (Estrategia I)", ticker:"ESTRA1", rescate:"T+1", tipo:"RF USD Corto",    url:`${BZ}/estrategia-i/`, destacado:true},
      {nombre:"Balanz Corporativo (Ahorro USD)",          ticker:"BAUSD",  rescate:"T+1", tipo:"ONs USD",         url:`${BZ}/ahorro-en-dolares/`},
      {nombre:"Balanz Latam (Estrategia III)",            ticker:"ESTRA3", rescate:"T+1", tipo:"RF Latam",        url:`${BZ}/estrategia-iii/`},
      {nombre:"Balanz Soberano (Renta Fija USD)",         ticker:"BSOBU",  rescate:"T+1", tipo:"Soberanos USD",   url:`${BZ}/renta-fija-en-dolares/`},
      {nombre:"Balanz Latam sin Arg. Sudamericano",       ticker:"BSUDA",  rescate:"T+2", tipo:"RF Latam ex-AR",  url:`${BZ}/sudamericano/`},
    ],
  },
  {
    cat:"Renta Variable — Dólares", Icon:Globe, color:"red", moneda:"USD",
    desc:"Acciones globales. Máximo potencial, máxima volatilidad.",
    fondos:[
      {nombre:"Balanz Renta Variable Global", ticker:"BRVGL", rescate:"T+2", tipo:"RV Global", url:`${BZ}/renta-variable-global/`},
    ],
  },
];
