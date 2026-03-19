import type { School } from "@/lib/maps/types";

export const MOCK_SCHOOLS: School[] = [
  {
    id: "school-1",
    name: "Mapo High School",
    address: "123 Mapo-daero, Mapo-gu, Seoul",
    position: { lat: 37.5545, lng: 126.9231 },
  },
];

export const DEFAULT_SCHOOL = MOCK_SCHOOLS[0]!;
