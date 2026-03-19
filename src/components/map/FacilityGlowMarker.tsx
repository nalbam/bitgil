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
        {/* Outer ambient light — large soft glow that "lights up" the street */}
        <div
          style={{
            position: "relative",
            width: glow.radiusPx,
            height: glow.radiusPx,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Layer 1: Wide ambient glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${glow.color}30 0%, ${glow.color}15 30%, ${glow.color}05 60%, transparent 80%)`,
              animation: isDanger ? undefined : "glow-breathe 3s ease-in-out infinite",
            }}
          />
          {/* Layer 2: Inner bright core */}
          <div
            style={{
              position: "absolute",
              width: glow.radiusPx * 0.4,
              height: glow.radiusPx * 0.4,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${glow.color}90 0%, ${glow.color}40 50%, transparent 100%)`,
            }}
          />
          {/* Layer 3: Center point — the actual light source */}
          <div
            style={{
              position: "relative",
              width: glow.iconSize,
              height: glow.iconSize,
              borderRadius: "50%",
              backgroundColor: glow.color,
              boxShadow: `0 0 ${glow.iconSize * 2}px ${glow.iconSize}px ${glow.color}80, 0 0 ${glow.iconSize * 4}px ${glow.iconSize * 2}px ${glow.color}40`,
              zIndex: 1,
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
