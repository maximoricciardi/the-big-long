"use client";

import { useState, useEffect } from "react";

export function useWindowSize(): number {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return width;
}

export function useIsMobile(breakpoint = 640): boolean {
  const width = useWindowSize();
  return width < breakpoint;
}
