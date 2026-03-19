"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { School, RouteOption } from "@/lib/maps/types";
import type { DomainFacility } from "@/domain/entities/facility";

interface SchoolData {
  routes: RouteOption[];
  facilities: DomainFacility[];
  isLoading: boolean;
  loadSchool: (school: School) => void;
  clear: () => void;
}

export function useSchoolData(): SchoolData {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [facilities, setFacilities] = useState<DomainFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setRoutes([]);
    setFacilities([]);
    setIsLoading(false);
  }, []);

  return useMemo(
    () => ({ routes, facilities, isLoading, loadSchool, clear }),
    [routes, facilities, isLoading, loadSchool, clear],
  );
}
