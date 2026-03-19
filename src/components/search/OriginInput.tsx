"use client";

import { useRef, useEffect, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface OriginInputProps {
  origin: { lat: number; lng: number } | null;
  onOriginChange: (origin: { lat: number; lng: number } | null) => void;
}

export function OriginInput({ origin, onOriginChange }: OriginInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !containerRef.current || elementRef.current) return;

    const autocomplete = new google.maps.places.PlaceAutocompleteElement({
      componentRestrictions: { country: "kr" },
    });

    autocomplete.style.width = "100%";

    autocomplete.addEventListener("gmp-placeselect", async (event) => {
      const { place } = event as unknown as { place: google.maps.places.Place };
      await place.fetchFields({ fields: ["location", "formattedAddress"] });
      if (place.location) {
        onOriginChange({
          lat: place.location.lat(),
          lng: place.location.lng(),
        });
      }
    });

    containerRef.current.appendChild(autocomplete);
    elementRef.current = autocomplete;
  }, [places, onOriginChange]);

  // Update display when origin set from map click
  useEffect(() => {
    if (!elementRef.current) return;
    const input = elementRef.current.querySelector("input");
    if (!input) return;

    if (origin) {
      input.value = `${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}`;
    }
  }, [origin]);

  const handleClear = useCallback(() => {
    onOriginChange(null);
    if (elementRef.current) {
      const input = elementRef.current.querySelector("input");
      if (input) input.value = "";
    }
  }, [onOriginChange]);

  return (
    <div className="relative flex-1">
      <div
        ref={containerRef}
        className="w-full [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-white/10 [&_input]:bg-white/5 [&_input]:px-5 [&_input]:py-3 [&_input]:pr-10 [&_input]:text-white [&_input]:placeholder-slate-500 [&_input]:outline-none"
      />
      {origin && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
}
