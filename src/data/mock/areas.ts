import type { Area } from "@/lib/maps/types";

export const MOCK_AREAS: Area[] = [
  {
    id: "area-osan",
    name: "오산시 통학구역",
    center: { lat: 37.1500, lng: 127.0680 },
    radiusKm: 3.0,
  },
];

export const DEFAULT_AREA = MOCK_AREAS[0]!;

export function findAreaById(areaId: string): Area | undefined {
  return MOCK_AREAS.find((a) => a.id === areaId);
}
