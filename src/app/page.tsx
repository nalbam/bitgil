"use client";

import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SchoolSearch } from "@/components/search/SchoolSearch";
import { BitgilMap } from "@/components/map/BitgilMap";
import { RouteComparisonPanel } from "@/components/route/RouteComparisonPanel";
import { useSchoolData } from "@/hooks/useSchoolData";
import type { School } from "@/lib/maps/types";

function findNearestSchool(lat: number, lng: number, schools: School[]): School | null {
  if (schools.length === 0) return null;
  let nearest = schools[0]!;
  let minDist = Infinity;
  for (const s of schools) {
    const d = (s.position.lat - lat) ** 2 + (s.position.lng - lng) ** 2;
    if (d < minDist) {
      minDist = d;
      nearest = s;
    }
  }
  return nearest;
}

export default function HomePage() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const { routes, facilities, isLoading } = useSchoolData(selectedSchool);

  // Auto-select nearest school on page load
  useEffect(() => {
    async function autoSelect() {
      const res = await fetch("/api/schools");
      const json = await res.json();
      if (!json.ok || !json.data?.length) return;
      const schools: School[] = json.data;

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const nearest = findNearestSchool(pos.coords.latitude, pos.coords.longitude, schools);
            if (nearest) setSelectedSchool(nearest);
          },
          () => {
            // Geolocation denied — select first school as default
            setSelectedSchool(schools[0]!);
          },
        );
      } else {
        setSelectedSchool(schools[0]!);
      }
    }
    autoSelect();
  }, []);

  const handleSchoolSelect = useCallback((school: School) => {
    setSelectedSchool(school);
    setSelectedRouteId(null);
  }, []);

  const handleRouteSelect = useCallback((routeId: string) => {
    setSelectedRouteId(routeId);
  }, []);

  const effectiveRouteId = selectedRouteId ?? routes[0]?.id ?? null;

  return (
    <div className="flex h-screen flex-col bg-[#0a0f1e] text-slate-100">
      <Header />

      {/* Search bar */}
      <div className="border-b border-white/5 px-4 py-3">
        <SchoolSearch onSelect={handleSchoolSelect} selectedSchool={selectedSchool} />
      </div>

      {/* Main content: map + panel */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Map */}
        <div className="relative h-[50vh] lg:h-auto lg:flex-[2]">
          {selectedSchool ? (
            <BitgilMap
              center={selectedSchool.position}
              facilities={facilities}
              routes={routes}
              selectedRouteId={effectiveRouteId}
              onRouteSelect={handleRouteSelect}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              <div className="text-center">
                <p className="text-lg font-medium">학교를 검색하세요</p>
                <p className="mt-1 text-sm">안전한 통학로를 찾아드립니다</p>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0f1e]/60">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>

        {/* Route panel */}
        <div className="flex-1 overflow-y-auto border-t border-white/5 p-4 lg:max-w-sm lg:border-l lg:border-t-0">
          {routes.length > 0 ? (
            <RouteComparisonPanel
              routes={routes}
              selectedRouteId={effectiveRouteId}
              onRouteSelect={handleRouteSelect}
            />
          ) : selectedSchool ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              <p className="text-sm">경로 데이터를 불러오는 중...</p>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              <p className="text-sm">학교를 선택하면 경로가 표시됩니다</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
