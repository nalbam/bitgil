"use client";

import { useState, useEffect } from "react";
import type { School, RouteOption } from "@/lib/maps/types";
import type { DomainFacility } from "@/domain/entities/facility";

interface SchoolData {
  routes: RouteOption[];
  facilities: DomainFacility[];
  isLoading: boolean;
}

export function useSchoolData(school: School | null): SchoolData {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [facilities, setFacilities] = useState<DomainFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!school) {
      setRoutes([]);
      setFacilities([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    Promise.all([
      fetch(`/api/routes?schoolId=${school.id}`).then((r) => r.json()),
      fetch(`/api/facilities?areaId=${school.areaId}`).then((r) => r.json()),
    ])
      .then(([routesRes, facilitiesRes]) => {
        if (cancelled) return;
        setRoutes(routesRes.data?.routes ?? []);
        setFacilities(facilitiesRes.data ?? []);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [school]);

  return { routes, facilities, isLoading };
}
