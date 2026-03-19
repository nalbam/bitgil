"use client";

import { useState } from "react";

export function useRouteSelection(initialId?: string) {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(initialId ?? null);
  return {
    selectedRouteId,
    selectRoute: setSelectedRouteId,
    clearSelection: () => setSelectedRouteId(null),
  };
}
