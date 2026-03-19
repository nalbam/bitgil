"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  cctv: DomainFacility[];
  policeStations: DomainFacility[];
  dangerZones: DomainFacility[];
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
  cctv,
  policeStations,
  dangerZones,
  routes,
  selectedRouteId,
  onRouteSelect,
}: BitgilMapProps) {
  const map = useMap();
  const [infoSchoolId, setInfoSchoolId] = useState<string | null>(null);

  useEffect(() => {
    if (!map) return;
    map.panTo(center);
  }, [map, center]);

  // Close InfoWindow on map click
  useEffect(() => {
    if (!map) return;
    const listener = map.addListener("click", () => setInfoSchoolId(null));
    return () => listener.remove();
  }, [map]);

  const handleSchoolClick = useCallback(
    (school: School) => {
      onSchoolSelect(school);
      setInfoSchoolId(school.id);
    },
    [onSchoolSelect],
  );

  const layers = useMemo(() => {
    const slGlow = FACILITY_GLOW.streetlight;
    const slGlowColor = hexToRgba(slGlow.color, 40);
    const slCoreColor = hexToRgba(slGlow.color, 180);

    const cctvGlow = FACILITY_GLOW.cctv;
    const cctvGlowColor = hexToRgba(cctvGlow.color, 40);
    const cctvCoreColor = hexToRgba(cctvGlow.color, 180);

    const psGlow = FACILITY_GLOW.police_station;
    const psGlowColor = hexToRgba(psGlow.color, 40);
    const psCoreColor = hexToRgba(psGlow.color, 180);

    const dzGlow = FACILITY_GLOW.danger;
    const dzGlowColor = hexToRgba(dzGlow.color, 40);
    const dzCoreColor = hexToRgba(dzGlow.color, 180);

    const result: Layer[] = [
      // Streetlight glow layer (larger radius, lower opacity)
      new ScatterplotLayer({
        id: "streetlights-glow",
        data: streetlights,
        getPosition: (d: DomainFacility) => [d.position.lng, d.position.lat],
        getFillColor: slGlowColor,
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
        getFillColor: slCoreColor,
        getRadius: 4,
        radiusMinPixels: 1.5,
        radiusMaxPixels: 6,
        opacity: 0.9,
        antialiasing: true,
      }),

      // CCTV glow layer
      new ScatterplotLayer({
        id: "cctv-glow",
        data: cctv,
        getPosition: (d: DomainFacility) => [d.position.lng, d.position.lat],
        getFillColor: cctvGlowColor,
        getRadius: 12,
        radiusMinPixels: 6,
        radiusMaxPixels: 20,
        opacity: 0.6,
        antialiasing: true,
      }),

      // CCTV core layer
      new ScatterplotLayer({
        id: "cctv-core",
        data: cctv,
        getPosition: (d: DomainFacility) => [d.position.lng, d.position.lat],
        getFillColor: cctvCoreColor,
        getRadius: 4,
        radiusMinPixels: 1.5,
        radiusMaxPixels: 6,
        opacity: 0.9,
        antialiasing: true,
      }),

      // Police station glow layer
      new ScatterplotLayer({
        id: "police-stations-glow",
        data: policeStations,
        getPosition: (d: DomainFacility) => [d.position.lng, d.position.lat],
        getFillColor: psGlowColor,
        getRadius: 18,
        radiusMinPixels: 8,
        radiusMaxPixels: 24,
        opacity: 0.6,
        antialiasing: true,
      }),

      // Police station core layer
      new ScatterplotLayer({
        id: "police-stations-core",
        data: policeStations,
        getPosition: (d: DomainFacility) => [d.position.lng, d.position.lat],
        getFillColor: psCoreColor,
        getRadius: 6,
        radiusMinPixels: 3,
        radiusMaxPixels: 8,
        opacity: 0.9,
        antialiasing: true,
      }),

      // Danger zone glow layer
      new ScatterplotLayer({
        id: "danger-zones-glow",
        data: dangerZones,
        getPosition: (d: DomainFacility) => [d.position.lng, d.position.lat],
        getFillColor: dzGlowColor,
        getRadius: 15,
        radiusMinPixels: 7,
        radiusMaxPixels: 22,
        opacity: 0.6,
        antialiasing: true,
      }),

      // Danger zone core layer
      new ScatterplotLayer({
        id: "danger-zones-core",
        data: dangerZones,
        getPosition: (d: DomainFacility) => [d.position.lng, d.position.lat],
        getFillColor: dzCoreColor,
        getRadius: 5,
        radiusMinPixels: 2.5,
        radiusMaxPixels: 7,
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
  }, [streetlights, cctv, policeStations, dangerZones, routes, selectedRouteId, onRouteSelect]);

  return (
    <>
      <DeckGLOverlay layers={layers} />
      {schools.map((s) => (
        <SchoolMarker
          key={s.id}
          school={s}
          selected={selectedSchoolId === s.id}
          showInfo={infoSchoolId === s.id}
          onClick={() => handleSchoolClick(s)}
          onCloseInfo={() => setInfoSchoolId(null)}
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
