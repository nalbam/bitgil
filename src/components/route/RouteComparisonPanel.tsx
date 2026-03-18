"use client";

import { useState } from "react";
import { RouteCard } from "@/components/ui/RouteCard";
import type { Route } from "@/lib/maps/types";

interface RouteComparisonPanelProps {
  routes: Route[];
}

export function RouteComparisonPanel({ routes }: RouteComparisonPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(routes[0]?.id ?? null);
  return (
    <div className="space-y-3">
      {routes.map((route) => (
        <button key={route.id} className="w-full text-left" onClick={() => setSelectedId(route.id)}>
          <RouteCard route={route} selected={selectedId === route.id} />
        </button>
      ))}
    </div>
  );
}
