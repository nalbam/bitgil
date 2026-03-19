"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdvancedMarker, APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import type { Layer } from "@deck.gl/core";
import { ScatterplotLayer, PathLayer } from "@deck.gl/layers";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { MAPS_CONFIG } from "@/lib/maps/config";
import { NIGHT_MAP_STYLE } from "@/lib/maps/night-style";
import { DeckGLOverlay } from "@/components/map/DeckGLOverlay";
import { SchoolMarker } from "@/components/map/SchoolMarker";
import { PoliceMarker } from "@/components/map/PoliceMarker";
import {
  FACILITY_GLOW,
  FACILITY_HEATMAP,
  ROUTE_COLORS,
  ROUTE_SELECTED_MULTIPLIER,
  ROUTE_UNSELECTED_OPACITY,
  hexToRgba,
} from "@/lib/maps/glow-config";
import { HeatmapTogglePanel, type HeatmapVisibility } from "@/components/map/HeatmapTogglePanel";
import type { DomainFacility } from "@/domain/entities/facility";
import type { RouteOption, GeoPoint, School } from "@/lib/maps/types";

type CoordPair = [number, number];

interface BitgilMapProps {
  center: GeoPoint;
  schools: School[];
  selectedSchoolId: string | null;
  onSchoolSelect: (school: School) => void;
  streetlights: CoordPair[];
  cctv: CoordPair[];
  policeStations: DomainFacility[];
  dangerZones: CoordPair[];
  routes: RouteOption[];
  selectedRouteId: string | null;
  onRouteSelect: (routeId: string) => void;
  origin: GeoPoint | null;
  onOriginChange: (origin: GeoPoint | null) => void;
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
  origin,
  onOriginChange,
}: BitgilMapProps) {
  const map = useMap();
  const [infoSchoolId, setInfoSchoolId] = useState<string | null>(null);
  const [infoPoliceId, setInfoPoliceId] = useState<string | null>(null);
  const [heatmapVisibility, setHeatmapVisibility] = useState<HeatmapVisibility>({
    streetlight: true,
    cctv: true,
    danger: true,
  });

  const handleHeatmapToggle = useCallback((layer: keyof HeatmapVisibility) => {
    setHeatmapVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  useEffect(() => {
    if (!map) return;
    map.panTo(center);
  }, [map, center]);

  // Close InfoWindow on map click + set origin
  useEffect(() => {
    if (!map) return;
    const listener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      setInfoSchoolId(null);
      setInfoPoliceId(null);
      if (selectedSchoolId && e.latLng) {
        onOriginChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      }
    });
    return () => listener.remove();
  }, [map, selectedSchoolId, onOriginChange]);

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

    const dzGlow = FACILITY_GLOW.danger;
    const dzGlowColor = hexToRgba(dzGlow.color, 40);
    const dzCoreColor = hexToRgba(dzGlow.color, 180);

    // CoordPair is [lat, lng], deck.gl expects [lng, lat]
    const getCoordPosition = (d: CoordPair) => [d[1], d[0]] as [number, number];

    const result: Layer[] = [];

    // Streetlight layers — heatmap or scatterplot
    if (heatmapVisibility.streetlight) {
      const hm = FACILITY_HEATMAP.streetlight;
      result.push(
        new HeatmapLayer({
          id: "streetlights-heatmap",
          data: streetlights,
          getPosition: getCoordPosition,
          colorRange: hm.colorRange,
          radiusPixels: hm.radiusPixels,
          intensity: hm.intensity,
          threshold: hm.threshold,
          debounceTimeout: hm.debounceTimeout,
          weightsTextureSize: hm.weightsTextureSize,
        }),
      );
    } else {
      result.push(
        new ScatterplotLayer({
          id: "streetlights-glow",
          data: streetlights,
          getPosition: getCoordPosition,
          getFillColor: slGlowColor,
          getRadius: 12,
          radiusMinPixels: 6,
          radiusMaxPixels: 20,
          opacity: 0.6,
          antialiasing: true,
        }),
        new ScatterplotLayer({
          id: "streetlights-core",
          data: streetlights,
          getPosition: getCoordPosition,
          getFillColor: slCoreColor,
          getRadius: 4,
          radiusMinPixels: 1.5,
          radiusMaxPixels: 6,
          opacity: 0.9,
          antialiasing: true,
        }),
      );
    }

    // CCTV layers — heatmap or scatterplot
    if (heatmapVisibility.cctv) {
      const hm = FACILITY_HEATMAP.cctv;
      result.push(
        new HeatmapLayer({
          id: "cctv-heatmap",
          data: cctv,
          getPosition: getCoordPosition,
          colorRange: hm.colorRange,
          radiusPixels: hm.radiusPixels,
          intensity: hm.intensity,
          threshold: hm.threshold,
          debounceTimeout: hm.debounceTimeout,
          weightsTextureSize: hm.weightsTextureSize,
        }),
      );
    } else {
      result.push(
        new ScatterplotLayer({
          id: "cctv-glow",
          data: cctv,
          getPosition: getCoordPosition,
          getFillColor: cctvGlowColor,
          getRadius: 12,
          radiusMinPixels: 6,
          radiusMaxPixels: 20,
          opacity: 0.6,
          antialiasing: true,
        }),
        new ScatterplotLayer({
          id: "cctv-core",
          data: cctv,
          getPosition: getCoordPosition,
          getFillColor: cctvCoreColor,
          getRadius: 4,
          radiusMinPixels: 1.5,
          radiusMaxPixels: 6,
          opacity: 0.9,
          antialiasing: true,
        }),
      );
    }

    // Danger zone layers — heatmap or scatterplot
    if (heatmapVisibility.danger) {
      const hm = FACILITY_HEATMAP.danger;
      result.push(
        new HeatmapLayer({
          id: "danger-zones-heatmap",
          data: dangerZones,
          getPosition: getCoordPosition,
          colorRange: hm.colorRange,
          radiusPixels: hm.radiusPixels,
          intensity: hm.intensity,
          threshold: hm.threshold,
          debounceTimeout: hm.debounceTimeout,
          weightsTextureSize: hm.weightsTextureSize,
        }),
      );
    } else {
      result.push(
        new ScatterplotLayer({
          id: "danger-zones-glow",
          data: dangerZones,
          getPosition: getCoordPosition,
          getFillColor: dzGlowColor,
          getRadius: 15,
          radiusMinPixels: 7,
          radiusMaxPixels: 22,
          opacity: 0.6,
          antialiasing: true,
        }),
        new ScatterplotLayer({
          id: "danger-zones-core",
          data: dangerZones,
          getPosition: getCoordPosition,
          getFillColor: dzCoreColor,
          getRadius: 5,
          radiusMinPixels: 2.5,
          radiusMaxPixels: 7,
          opacity: 0.9,
          antialiasing: true,
        }),
      );
    }

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
  }, [streetlights, cctv, dangerZones, routes, selectedRouteId, onRouteSelect, heatmapVisibility]);

  return (
    <>
      <HeatmapTogglePanel visibility={heatmapVisibility} onToggle={handleHeatmapToggle} />
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
      {policeStations.map((p) => (
        <PoliceMarker
          key={p.id}
          facility={p}
          showInfo={infoPoliceId === p.id}
          onClick={() => setInfoPoliceId(p.id)}
          onCloseInfo={() => setInfoPoliceId(null)}
        />
      ))}
      {origin && (
        <AdvancedMarker position={origin}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-sm font-bold text-white shadow-lg">
            출
          </div>
        </AdvancedMarker>
      )}
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
