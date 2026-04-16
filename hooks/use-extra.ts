"use client";

import { useState, useEffect, useCallback } from "react";
import type { ExtraItem } from "@/types";

const STORAGE_KEY = "mr-extra";

export function useExtra() {
  const [extra, setExtra] = useState<ExtraItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setExtra(JSON.parse(stored));
    } catch { /* silent */ }
  }, []);

  const persist = useCallback((items: ExtraItem[]) => {
    setExtra(items);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* silent */ }
  }, []);

  const publish = useCallback((item: ExtraItem) => {
    setExtra(prev => {
      const updated = [item, ...prev];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* silent */ }
      return updated;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setExtra(prev => {
      const updated = prev.filter(x => x.id !== id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* silent */ }
      return updated;
    });
  }, []);

  return { extra, publish, remove, persist };
}
