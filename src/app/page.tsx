"use client";

import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SchoolSearch } from "@/components/search/SchoolSearch";
import { BitgilMap } from "@/components/map/BitgilMap";
import { RouteComparisonPanel } from "@/components/route/RouteComparisonPanel";
import { useSchoolData } from "@/hooks/useSchoolData";
import type { School } from "@/lib/maps/types";
import type { DomainFacility } from "@/domain/entities/facility";

// Osan city center
const OSAN_CENTER = { lat: 37.1500, lng: 127.0680 };

export default function HomePage() {
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [allStreetlights, setAllStreetlights] = useState<DomainFacility[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const { routes, isLoading } = useSchoolData(selectedSchool);

  // Load all schools and streetlights on mount
  useEffect(() => {
    fetch("/api/schools")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setAllSchools(json.data);
      });
    fetch("/api/facilities?areaId=area-osan&type=streetlight")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setAllStreetlights(json.data);
      });
  }, []);

  const handleSchoolSelect = useCallback((school: School) => {
    setSelectedSchool(school);
    setSelectedRouteId(null);
  }, []);

  const handleRouteSelect = useCallback((routeId: string) => {
    setSelectedRouteId(routeId);
  }, []);

  const effectiveRouteId = selectedRouteId ?? routes[0]?.id ?? null;
  const mapCenter = selectedSchool?.position ?? OSAN_CENTER;

  return (
    <div className="flex h-screen flex-col bg-[#0a0f1e] text-slate-100">
      <Header />

      {/* Search bar */}
      <div className="border-b border-white/5 px-4 py-3">
        <SchoolSearch onSelect={handleSchoolSelect} selectedSchool={selectedSchool} />
      </div>

      {/* Main content: map + panel */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Map — always visible with Osan overview */}
        <div className="relative h-[50vh] lg:h-auto lg:flex-[2]">
          <BitgilMap
            center={mapCenter}
            schools={allSchools}
            selectedSchoolId={selectedSchool?.id ?? null}
            onSchoolSelect={handleSchoolSelect}
            streetlights={allStreetlights}
            routes={routes}
            selectedRouteId={effectiveRouteId}
            onRouteSelect={handleRouteSelect}
          />
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
              <div className="text-center">
                <p className="text-lg">🏫</p>
                <p className="mt-2 text-sm">지도에서 학교를 선택하세요</p>
                <p className="mt-1 text-xs text-slate-600">또는 위 검색창에서 학교를 검색하세요</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
