"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MAPS_CONFIG } from "@/lib/maps/config";
import { NIGHT_MAP_STYLE } from "@/lib/maps/night-style";
import { FacilityGlowMarker } from "@/components/map/FacilityGlowMarker";
import { RoutePolyline } from "@/components/map/RoutePolyline";
import type { DomainFacility } from "@/domain/entities/facility";
import type { RouteOption, GeoPoint } from "@/lib/maps/types";

interface BitgilMapProps {
  center: GeoPoint;
  facilities: DomainFacility[];
  routes: RouteOption[];
  selectedRouteId: string | null;
  onRouteSelect: (routeId: string) => void;
}

export function BitgilMap({
  center,
  facilities,
  routes,
  selectedRouteId,
  onRouteSelect,
}: BitgilMapProps) {
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
        defaultCenter={center}
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
        {facilities.map((f) => (
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
      </Map>
    </APIProvider>
  );
}
