"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { School, RouteOption, GeoPoint } from "@/lib/maps/types";
import type { DomainFacility } from "@/domain/entities/facility";

interface SchoolData {
  routes: RouteOption[];
  facilities: DomainFacility[];
  isLoading: boolean;
  origin: GeoPoint | null;
  setOrigin: (origin: GeoPoint | null) => void;
  loadSchool: (school: School) => void;
  loadDirections: (school: School, origin: GeoPoint) => void;
  clear: () => void;
}

export function useSchoolData(): SchoolData {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [facilities, setFacilities] = useState<DomainFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState<GeoPoint | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadSchool = useCallback((school: School) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);

    Promise.all([
      fetch(`/api/routes?schoolId=${school.id}`, { signal: controller.signal }).then((r) =>
        r.json(),
      ),
      fetch(`/api/facilities?areaId=${school.areaId}`, { signal: controller.signal }).then((r) =>
        r.json(),
      ),
    ])
      .then(([routesRes, facilitiesRes]) => {
        setRoutes(routesRes.data?.routes ?? []);
        setFacilities(facilitiesRes.data ?? []);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        throw err;
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
  }, []);

  const loadDirections = useCallback((school: School, orig: GeoPoint) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);

    fetch("/api/routes/directions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: { lat: orig.lat, lng: orig.lng },
        destination: { lat: school.position.lat, lng: school.position.lng },
      }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setRoutes(json.data.routes ?? []);
        } else {
          console.error("Directions error:", json.error);
          setRoutes([]);
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        throw err;
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setRoutes([]);
    setFacilities([]);
    setOrigin(null);
    setIsLoading(false);
  }, []);

  return useMemo(
    () => ({ routes, facilities, isLoading, origin, setOrigin, loadSchool, loadDirections, clear }),
    [routes, facilities, isLoading, origin, loadSchool, loadDirections, clear],
  );
}
