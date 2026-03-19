import type { Area } from "@/lib/maps/types";

export const MOCK_AREAS: Area[] = [
  { id: "area-mapo", name: "마포구 통학구역", center: { lat: 37.5545, lng: 126.9231 }, radiusKm: 1.5 },
  { id: "area-gangnam", name: "강남구 통학구역", center: { lat: 37.4979, lng: 127.0276 }, radiusKm: 1.2 },
  { id: "area-jongno", name: "종로구 통학구역", center: { lat: 37.5729, lng: 126.9794 }, radiusKm: 1.0 },
  { id: "area-songpa", name: "송파구 통학구역", center: { lat: 37.5145, lng: 127.1066 }, radiusKm: 1.3 },
  { id: "area-yeongdeungpo", name: "영등포구 통학구역", center: { lat: 37.5264, lng: 126.8963 }, radiusKm: 1.1 },
];

export const DEFAULT_AREA = MOCK_AREAS[0]!;

export function findAreaById(areaId: string): Area | undefined {
  return MOCK_AREAS.find((a) => a.id === areaId);
}
