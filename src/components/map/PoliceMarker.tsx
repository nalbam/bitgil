"use client";

import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import type { DomainFacility } from "@/domain/entities/facility";

interface PoliceMarkerProps {
  facility: DomainFacility;
  showInfo: boolean;
  onClick: () => void;
  onCloseInfo: () => void;
}

export function PoliceMarker({ facility, showInfo, onClick, onCloseInfo }: PoliceMarkerProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={facility.position}
        onClick={onClick}
      >
        <div
          style={{
            fontSize: 24,
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))",
            cursor: "pointer",
          }}
        >
          🚔
        </div>
      </AdvancedMarker>
      {showInfo && marker && (
        <InfoWindow anchor={marker} onCloseClick={onCloseInfo}>
          <div className="p-1 text-sm text-gray-900">
            <p className="font-semibold">{facility.name}</p>
            {facility.description && (
              <p className="text-xs text-gray-600">{facility.description}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}
