"use client";

import { useState } from "react";
import { RouteCard } from "@/components/ui/RouteCard";
import type { RouteOption } from "@/lib/maps/types";

interface RouteComparisonPanelProps {
  routes: RouteOption[];
  initialRouteId?: string;
}

export function RouteComparisonPanel({ routes, initialRouteId }: RouteComparisonPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialRouteId ?? routes[0]?.id ?? null,
  );

  return (
    <div className="space-y-3">
      {routes.map((route) => (
        <button
          key={route.id}
          className="w-full text-left"
          onClick={() => setSelectedId(route.id)}
        >
          <RouteCard route={route} selected={selectedId === route.id} />
        </button>
      ))}
    </div>
  );
}
