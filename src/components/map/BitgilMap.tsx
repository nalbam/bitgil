"use client";

import { useEffect, useRef } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { MAPS_CONFIG } from "@/lib/maps/config";
import { NIGHT_MAP_STYLE } from "@/lib/maps/night-style";
import { FacilityGlowMarker } from "@/components/map/FacilityGlowMarker";
import { SchoolMarker } from "@/components/map/SchoolMarker";
import { RoutePolyline } from "@/components/map/RoutePolyline";
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
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!map) return;
    map.panTo(center);
  }, [map, center]);

  // Update CSS variable on zoom change — no React re-render
  useEffect(() => {
    if (!map) return;

    const mapDiv = map.getDiv();
    containerRef.current = mapDiv;

    function updateScale() {
      const z = map!.getZoom() ?? MAPS_CONFIG.defaultZoom;
      const scale = Math.pow(2, (z - 15) / 2.5);
      mapDiv.style.setProperty("--glow-scale", String(scale));
    }

    updateScale();
    const listener = map.addListener("zoom_changed", updateScale);
    return () => listener.remove();
  }, [map]);

  return (
    <>
      {schools.map((s) => (
        <SchoolMarker
          key={s.id}
          school={s}
          selected={selectedSchoolId === s.id}
          onClick={() => onSchoolSelect(s)}
        />
      ))}
      {streetlights.map((f) => (
        <FacilityGlowMarker key={f.id} facility={f} />
      ))}
      {routes.map((r) => (
        <RoutePolyline
          key={r.id}
          route={r}
          selected={selectedRouteId === r.id}
          onClick={() => onRouteSelect(r.id)}
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
