"use client";

import { useState, useEffect } from "react";
import type { DolarData, RiesgoPaisData } from "@/types";
import { FX_FALLBACK, RIESGO_PAIS_FALLBACK } from "@/lib/constants";

interface UseFXResult {
  dolar:       DolarData | null;
  riesgoPais:  RiesgoPaisData | null;
  fxError:     boolean;
  loading:     boolean;
}

export function useFX(): UseFXResult {
  const [dolar,      setDolar]      = useState<DolarData | null>(null);
  const [riesgoPais, setRiesgoPais] = useState<RiesgoPaisData | null>(null);
  const [fxError,    setFxError]    = useState(false);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const ctrl = new AbortController();
        const tid  = setTimeout(() => ctrl.abort(), 5000);
        const res  = await fetch("https://dolarapi.com/v1/dolares", { signal: ctrl.signal });
        clearTimeout(tid);
        const data = await res.json() as Array<{ casa: string; compra: number; venta: number }>;
        const byName = (k: string) => data.find(d => d.casa === k);
        setDolar({
          oficial:         byName("oficial")         ?? FX_FALLBACK.oficial,
          blue:            byName("blue")            ?? FX_FALLBACK.blue,
          bolsa:           byName("bolsa")           ?? FX_FALLBACK.bolsa,
          contadoconliqui: byName("contadoconliqui") ?? FX_FALLBACK.contadoconliqui,
          mayorista:       byName("mayorista")       ?? FX_FALLBACK.mayorista,
        });
        setFxError(false);
      } catch {
        setDolar(FX_FALLBACK as DolarData);
        setFxError(true);
      }

      try {
        const ctrl2 = new AbortController();
        const tid2  = setTimeout(() => ctrl2.abort(), 5000);
        const rpRes = await fetch(
          "https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo",
          { signal: ctrl2.signal }
        );
        clearTimeout(tid2);
        const rpData = await rpRes.json() as { valor?: number; fecha?: string };
        setRiesgoPais(
          rpData?.valor
            ? { valor: rpData.valor, fecha: rpData.fecha ?? "" }
            : RIESGO_PAIS_FALLBACK
        );
      } catch {
        setRiesgoPais(RIESGO_PAIS_FALLBACK);
      }

      setLoading(false);
    };

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { dolar, riesgoPais, fxError, loading };
}
