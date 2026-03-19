"use client";

import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import type { School } from "@/lib/maps/types";

interface SchoolMarkerProps {
  school: School;
  selected: boolean;
  showInfo: boolean;
  onClick: () => void;
  onCloseInfo: () => void;
}

export function SchoolMarker({ school, selected, showInfo, onClick, onCloseInfo }: SchoolMarkerProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={school.position}
        onClick={onClick}
      >
        <div
          style={{
            fontSize: selected ? 36 : 28,
            filter: selected
              ? "drop-shadow(0 0 12px rgba(255,255,255,0.8))"
              : "drop-shadow(0 0 4px rgba(255,255,255,0.3))",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}
        >
          🏫
        </div>
      </AdvancedMarker>
      {showInfo && marker && (
        <InfoWindow anchor={marker} onCloseClick={onCloseInfo}>
          <div className="p-1 text-sm text-gray-900">
            <p className="font-semibold">{school.name}</p>
            <p className="text-xs text-gray-600">{school.address}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
