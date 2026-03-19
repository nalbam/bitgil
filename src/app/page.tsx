"use client";

import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SchoolSearch } from "@/components/search/SchoolSearch";
import { OriginInput } from "@/components/search/OriginInput";
import { BitgilMap } from "@/components/map/BitgilMap";
import { RouteComparisonPanel } from "@/components/route/RouteComparisonPanel";
import { useSchoolData } from "@/hooks/useSchoolData";
import { APIProvider } from "@vis.gl/react-google-maps";
import { MAPS_CONFIG } from "@/lib/maps/config";
import type { School } from "@/lib/maps/types";
import type { DomainFacility } from "@/domain/entities/facility";

type CoordPair = [number, number];

const OSAN_CENTER = { lat: 37.15, lng: 127.068 };
const DIRECTIONS_ENABLED = process.env.NEXT_PUBLIC_DIRECTIONS_ENABLED === "true";

export default function HomePage() {
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [streetlights, setStreetlights] = useState<CoordPair[]>([]);
  const [cctv, setCctv] = useState<CoordPair[]>([]);
  const [policeStations, setPoliceStations] = useState<DomainFacility[]>([]);
  const [dangerZones, setDangerZones] = useState<CoordPair[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const { routes, isLoading, origin, setOrigin, loadSchool, loadDirections } = useSchoolData();
  const [isReversed, setIsReversed] = useState(false);

  // Load all schools on mount
  useEffect(() => {
    fetch("/api/schools")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setAllSchools(json.data);
      });
  }, []);

  // Fetch all streetlights once on mount
  useEffect(() => {
    fetch("/api/facilities?type=streetlight")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setStreetlights(json.data);
      });
  }, []);

  // Fetch all CCTV once on mount
  useEffect(() => {
    fetch("/api/facilities?type=cctv")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setCctv(json.data);
      });
  }, []);

  // Fetch all police stations once on mount
  useEffect(() => {
    fetch("/api/facilities?type=police_station")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setPoliceStations(json.data);
      });
  }, []);

  // Fetch all danger zones once on mount
  useEffect(() => {
    fetch("/api/facilities?type=danger")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setDangerZones(json.data);
      });
  }, []);

  const handleSchoolSelect = useCallback(
    (school: School) => {
      setSelectedSchool(school);
      setSelectedRouteId(null);
      setIsReversed(false);
      loadSchool(school);
    },
    [loadSchool],
  );

  // Load directions when origin changes
  useEffect(() => {
    if (!selectedSchool || !origin) return;
    if (isReversed) {
      // School → Home: origin is school, destination is home
      const homeAsSchool = { ...selectedSchool, position: origin };
      loadDirections(homeAsSchool, selectedSchool.position);
    } else {
      loadDirections(selectedSchool, origin);
    }
  }, [selectedSchool, origin, isReversed, loadDirections]);

  const handleRouteSelect = useCallback((routeId: string) => {
    setSelectedRouteId(routeId);
  }, []);

  const effectiveRouteId = selectedRouteId ?? routes[0]?.id ?? null;
  const mapCenter = selectedSchool?.position ?? OSAN_CENTER;

  return (
    <div className="flex h-screen flex-col bg-[#0a0f1e] text-slate-100">
      <Header />

      <div className="border-b border-white/5 px-4 py-3">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-2">
          <SchoolSearch onSelect={handleSchoolSelect} selectedSchool={selectedSchool} />
          {DIRECTIONS_ENABLED && selectedSchool && MAPS_CONFIG.apiKey && (
            <APIProvider apiKey={MAPS_CONFIG.apiKey} libraries={["places"]}>
              <div className="flex items-center gap-2">
                <OriginInput origin={origin} onOriginChange={setOrigin} />
                <button
                  type="button"
                  onClick={() => setIsReversed((prev) => !prev)}
                  className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-xs text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                  title={isReversed ? "하교 (학교→집)" : "등교 (집→학교)"}
                >
                  {isReversed ? "하교" : "등교"}
                </button>
              </div>
            </APIProvider>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative h-[50vh] lg:h-auto lg:flex-[2]">
          <BitgilMap
            center={mapCenter}
            schools={allSchools}
            selectedSchoolId={selectedSchool?.id ?? null}
            onSchoolSelect={handleSchoolSelect}
            streetlights={streetlights}
            cctv={cctv}
            policeStations={policeStations}
            dangerZones={dangerZones}
            routes={routes}
            selectedRouteId={effectiveRouteId}
            onRouteSelect={handleRouteSelect}
            origin={origin}
            onOriginChange={setOrigin}
          />
        </div>

        <div className="flex-1 overflow-y-auto border-t border-white/5 p-4 lg:max-w-sm lg:border-l lg:border-t-0">
          {routes.length > 0 ? (
            <RouteComparisonPanel
              routes={routes}
              selectedRouteId={effectiveRouteId}
              onRouteSelect={handleRouteSelect}
            />
          ) : selectedSchool ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  <p className="text-sm">경로 데이터를 불러오는 중...</p>
                </div>
              ) : (
                <p className="text-sm">경로 데이터가 없습니다</p>
              )}
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
