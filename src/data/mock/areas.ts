import type { Area } from "@/lib/maps/types";

export const MOCK_AREAS: Area[] = [
  {
    id: "area-mapo",
    name: "Mapo-gu Night Zone",
    center: { lat: 37.5545, lng: 126.9231 },
    radiusKm: 1.5,
  },
];

export const DEFAULT_AREA = MOCK_AREAS[0]!;
