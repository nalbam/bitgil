import type { School } from "@/lib/maps/types";

export const MOCK_SCHOOLS: School[] = [
  { id: "school-1", name: "마포고등학교", address: "서울특별시 마포구 마포대로 123", position: { lat: 37.5545, lng: 126.9231 }, areaId: "area-mapo" },
  { id: "school-gangnam", name: "강남중학교", address: "서울특별시 강남구 테헤란로 45", position: { lat: 37.4979, lng: 127.0276 }, areaId: "area-gangnam" },
  { id: "school-jongno", name: "종로초등학교", address: "서울특별시 종로구 종로 67", position: { lat: 37.5729, lng: 126.9794 }, areaId: "area-jongno" },
  { id: "school-songpa", name: "송파고등학교", address: "서울특별시 송파구 올림픽로 89", position: { lat: 37.5145, lng: 127.1066 }, areaId: "area-songpa" },
  { id: "school-yeongdeungpo", name: "영등포중학교", address: "서울특별시 영등포구 영등포로 34", position: { lat: 37.5264, lng: 126.8963 }, areaId: "area-yeongdeungpo" },
];

export const DEFAULT_SCHOOL = MOCK_SCHOOLS[0]!;

export function findSchoolById(schoolId: string): School | undefined {
  return MOCK_SCHOOLS.find((s) => s.id === schoolId);
}
