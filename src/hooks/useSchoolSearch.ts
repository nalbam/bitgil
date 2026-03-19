"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { School } from "@/lib/maps/types";

export function useSchoolSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isComposingRef = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const search = useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/schools?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.ok) {
        setResults(json.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isComposingRef.current) return;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [query, search]);

  return { query, setQuery, results, isLoading, isComposingRef };
}
