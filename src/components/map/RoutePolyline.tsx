"use client";

import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import type { RouteOption } from "@/lib/maps/types";
import {
  ROUTE_COLORS,
  ROUTE_SELECTED_MULTIPLIER,
  ROUTE_UNSELECTED_OPACITY,
} from "@/lib/maps/glow-config";

interface RoutePolylineProps {
  route: RouteOption;
  selected: boolean;
  onClick: () => void;
}

export function RoutePolyline({ route, selected, onClick }: RoutePolylineProps) {
  const map = useMap();
  const glowPolylineRef = useRef<google.maps.Polyline | null>(null);
  const linePolylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    const colors = ROUTE_COLORS[route.safetyLevel];
    const path = route.points.map((p) => p.position);

    const opacityMultiplier = selected ? 1 : ROUTE_UNSELECTED_OPACITY;
    const weightMultiplier = selected ? ROUTE_SELECTED_MULTIPLIER : 1;

    // Outer glow polyline (wider, semi-transparent)
    const glowPolyline = new google.maps.Polyline({
      path,
      map,
      strokeColor: colors.stroke,
      strokeOpacity: colors.glowOpacity * opacityMultiplier,
      strokeWeight: colors.glowWeight * weightMultiplier,
      zIndex: selected ? 10 : 5,
      clickable: true,
    });

    // Inner line polyline (narrower, more opaque)
    const linePolyline = new google.maps.Polyline({
      path,
      map,
      strokeColor: colors.stroke,
      strokeOpacity: colors.opacity * opacityMultiplier,
      strokeWeight: colors.weight * weightMultiplier,
      zIndex: selected ? 11 : 6,
      clickable: true,
    });

    glowPolyline.addListener("click", onClick);
    linePolyline.addListener("click", onClick);

    glowPolylineRef.current = glowPolyline;
    linePolylineRef.current = linePolyline;

    return () => {
      glowPolyline.setMap(null);
      linePolyline.setMap(null);
      google.maps.event.clearListeners(glowPolyline, "click");
      google.maps.event.clearListeners(linePolyline, "click");
    };
  }, [map, route, selected, onClick]);

  return null;
}
