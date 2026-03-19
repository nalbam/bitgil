"use client";

import { useEffect, useMemo } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import type { Layer } from "@deck.gl/core";
import { ScatterplotLayer, PathLayer } from "@deck.gl/layers";
import { MAPS_CONFIG } from "@/lib/maps/config";
import { NIGHT_MAP_STYLE } from "@/lib/maps/night-style";
import { DeckGLOverlay } from "@/components/map/DeckGLOverlay";
import { SchoolMarker } from "@/components/map/SchoolMarker";
import {
  FACILITY_GLOW,
  ROUTE_COLORS,
  ROUTE_SELECTED_MULTIPLIER,
  ROUTE_UNSELECTED_OPACITY,
  hexToRgba,
} from "@/lib/maps/glow-config";
import type { DomainFacility } from "@/domain/entities/facility";
import type { RouteOption, GeoPoint, School } from "@/lib/maps/types";

interface BitgilMapProps {
  center: GeoPoint;
  schools: School[];
  selectedSchoolId: string | null;
  onSchoolSelect: (school: School) => void;
  streetlights: DomainFacility[];
  routes: RouteOption[];
  selectedRouteId: string | null;
  onRouteSelect: (routeId: string) => void;
}

function MapContent({
  center,
  schools,
  selectedSchoolId,
  onSchoolSelect,
  streetlights,
  routes,
  selectedRouteId,
  onRouteSelect,
}: BitgilMapProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo(center);
  }, [map, center]);

  const layers = useMemo(() => {
    const glowConfig = FACILITY_GLOW.streetlight;
    const glowColor = hexToRgba(glowConfig.color, 40);
    const coreColor = hexToRgba(glowConfig.color, 180);

    const result: Layer[] = [
      // Streetlight glow layer (larger radius, lower opacity)
      new ScatterplotLayer({
        id: "streetlights-glow",
        data: streetlights,
        getPosition: (d: DomainFacility) => [d.position.lng, d.position.lat],
        getFillColor: glowColor,
        getRadius: 12,
        radiusMinPixels: 6,
        radiusMaxPixels: 20,
        opacity: 0.6,
        antialiasing: true,
      }),

      // Streetlight core layer (smaller radius, higher opacity)
      new ScatterplotLayer({
        id: "streetlights-core",
        data: streetlights,
        getPosition: (d: DomainFacility) => [d.position.lng, d.position.lat],
        getFillColor: coreColor,
        getRadius: 4,
        radiusMinPixels: 1.5,
        radiusMaxPixels: 6,
        opacity: 0.9,
        antialiasing: true,
      }),
    ];

    // Route layers
    for (const route of routes) {
      const colors = ROUTE_COLORS[route.safetyLevel];
      const selected = route.id === selectedRouteId;
      const opacityMul = selected ? 1 : ROUTE_UNSELECTED_OPACITY;
      const weightMul = selected ? ROUTE_SELECTED_MULTIPLIER : 1;
      const path = route.points.map(
        (p) => [p.position.lng, p.position.lat] as [number, number],
      );

      // Route glow
      result.push(
        new PathLayer<{ path: [number, number][] }>({
          id: `route-glow-${route.id}`,
          data: [{ path }],
          getPath: (d) => d.path,
          getColor: hexToRgba(colors.stroke, Math.round(colors.glowOpacity * opacityMul * 255)),
          getWidth: colors.glowWeight * weightMul,
          widthUnits: "pixels" as const,
          pickable: true,
          onClick: () => onRouteSelect(route.id),
        }),
      );

      // Route line
      result.push(
        new PathLayer<{ path: [number, number][] }>({
          id: `route-line-${route.id}`,
          data: [{ path }],
          getPath: (d) => d.path,
          getColor: hexToRgba(colors.stroke, Math.round(colors.opacity * opacityMul * 255)),
          getWidth: colors.weight * weightMul,
          widthUnits: "pixels" as const,
          pickable: true,
          onClick: () => onRouteSelect(route.id),
        }),
      );
    }

    return result;
  }, [streetlights, routes, selectedRouteId, onRouteSelect]);

  return (
    <>
      <DeckGLOverlay layers={layers} />
      {schools.map((s) => (
        <SchoolMarker
          key={s.id}
          school={s}
          selected={selectedSchoolId === s.id}
          onClick={() => onSchoolSelect(s)}
        />
      ))}
    </>
  );
}

export function BitgilMap(props: BitgilMapProps) {
  if (!MAPS_CONFIG.apiKey) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0a0f1e] text-slate-500">
        <p>Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={MAPS_CONFIG.apiKey}>
      <Map
        defaultCenter={props.center}
        defaultZoom={MAPS_CONFIG.defaultZoom}
        mapId={MAPS_CONFIG.mapId}
        colorScheme="DARK"
        styles={MAPS_CONFIG.mapId ? undefined : NIGHT_MAP_STYLE}
        tilt={MAPS_CONFIG.mapId ? 45 : 0}
        heading={0}
        gestureHandling="greedy"
        disableDefaultUI={true}
        zoomControl={true}
        className="h-full w-full"
      >
        <MapContent {...props} />
      </Map>
    </APIProvider>
  );
}
