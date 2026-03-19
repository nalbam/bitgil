"use client";

import { RouteCard } from "@/components/ui/RouteCard";
import { SafetyBreakdown } from "@/components/route/SafetyBreakdown";
import type { RouteOption } from "@/lib/maps/types";

interface RouteComparisonPanelProps {
  routes: RouteOption[];
  selectedRouteId: string | null;
  onRouteSelect: (routeId: string) => void;
}

export function RouteComparisonPanel({
  routes,
  selectedRouteId,
  onRouteSelect,
}: RouteComparisonPanelProps) {
  const selectedRoute = routes.find((r) => r.id === selectedRouteId);

  return (
    <div className="space-y-3">
      {routes.map((route) => (
        <button
          key={route.id}
          className="w-full text-left"
          onClick={() => onRouteSelect(route.id)}
        >
          <RouteCard route={route} selected={selectedRouteId === route.id} />
        </button>
      ))}
      {selectedRoute && (
        <SafetyBreakdown
          factors={selectedRoute.safetyDetails.factors}
          score={selectedRoute.safetyDetails.score}
          level={selectedRoute.safetyDetails.level}
        />
      )}
    </div>
  );
}
