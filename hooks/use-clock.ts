"use client";

import { useState, useEffect } from "react";

const DAYS   = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

export interface ClockData {
  time:      string;
  date:      string;
  dateShort: string;
}

export function useClock(): ClockData {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return {
    time:      now.toLocaleTimeString("es-AR", { hour:"2-digit", minute:"2-digit", second:"2-digit" }),
    date:      `${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
    dateShort: `${now.getDate()} ${MONTHS[now.getMonth()]}`,
  };
}
