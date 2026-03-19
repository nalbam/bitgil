import type { School } from "@/lib/maps/types";

export const MOCK_SCHOOLS: School[] = [
  {
    id: "school-osan-go",
    name: "오산고등학교",
    address: "경기도 오산시 청학로5번길 20",
    position: { lat: 37.1497, lng: 127.0697 },
    areaId: "area-osan",
  },
  {
    id: "school-osan-jung",
    name: "오산중학교",
    address: "경기도 오산시 청학로 43",
    position: { lat: 37.1489, lng: 127.0710 },
    areaId: "area-osan",
  },
  {
    id: "school-osan-cho",
    name: "오산초등학교",
    address: "경기도 오산시 가수로 16",
    position: { lat: 37.1535, lng: 127.0620 },
    areaId: "area-osan",
  },
  {
    id: "school-maehol",
    name: "매홀중학교",
    address: "경기도 오산시 내삼미로48번길 17",
    position: { lat: 37.1560, lng: 127.0770 },
    areaId: "area-osan",
  },
  {
    id: "school-unam",
    name: "운암고등학교",
    address: "경기도 오산시 운천로 12",
    position: { lat: 37.1440, lng: 127.0560 },
    areaId: "area-osan",
  },
  {
    id: "school-uncheon-go",
    name: "운천고등학교",
    address: "경기도 오산시 운천로 193",
    position: { lat: 37.1559140426, lng: 127.0804910337 },
    areaId: "area-osan",
  },
  {
    id: "school-uncheon-jung",
    name: "운천중학교",
    address: "경기도 오산시 운암로 133",
    position: { lat: 37.1583031167, lng: 127.0780451793 },
    areaId: "area-osan",
  },
  {
    id: "school-uncheon-cho",
    name: "운천초등학교",
    address: "경기도 오산시 운암로 116",
    position: { lat: 37.1559475051, lng: 127.078858823 },
    areaId: "area-osan",
  },
];

export const DEFAULT_SCHOOL = MOCK_SCHOOLS[0]!;

export function findSchoolById(schoolId: string): School | undefined {
  return MOCK_SCHOOLS.find((s) => s.id === schoolId);
}
