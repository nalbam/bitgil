"use client";

import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import type { DomainFacility } from "@/domain/entities/facility";
import { FACILITY_GLOW } from "@/lib/maps/glow-config";

interface FacilityGlowMarkerProps {
  facility: DomainFacility;
}

export function FacilityGlowMarker({ facility }: FacilityGlowMarkerProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [showInfo, setShowInfo] = useState(false);
  const glow = FACILITY_GLOW[facility.type];
  const isDanger = facility.type === "danger";

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={facility.position}
        onClick={() => setShowInfo(true)}
      >
        <div
          className="glow-marker"
          style={{
            width: glow.radiusPx,
            height: glow.radiusPx,
          }}
        >
          {/* Ambient glow */}
          <div
            className="glow-ambient"
            style={{
              background: `radial-gradient(circle, ${glow.color}30 0%, ${glow.color}10 40%, transparent 70%)`,
              animation: isDanger ? undefined : "glow-breathe 3s ease-in-out infinite",
            }}
          />
          {/* Center light source */}
          <div
            className="glow-center"
            style={{
              width: glow.iconSize,
              height: glow.iconSize,
              backgroundColor: glow.color,
              boxShadow: `0 0 ${glow.iconSize * 2}px ${glow.color}80`,
            }}
          />
        </div>
      </AdvancedMarker>
      {showInfo && marker && (
        <InfoWindow anchor={marker} onCloseClick={() => setShowInfo(false)}>
          <div className="p-1 text-sm text-gray-900">
            <p className="font-semibold">{facility.name}</p>
            <p className="text-xs text-gray-600">{glow.label}</p>
            {facility.description && (
              <p className="mt-1 text-xs text-gray-500">{facility.description}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}
