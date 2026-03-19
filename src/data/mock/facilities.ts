import type { DomainFacility } from "@/domain/entities/facility";

// --- 마포구 시설 (12개) ---
const MAPO_FACILITIES: DomainFacility[] = [
  { id: "mapo-sl-1", type: "streetlight", name: "마포 가로등 A", position: { lat: 37.5548, lng: 126.924 } },
  { id: "mapo-sl-2", type: "streetlight", name: "마포 가로등 B", position: { lat: 37.5551, lng: 126.9225 } },
  { id: "mapo-sl-3", type: "streetlight", name: "마포 가로등 C", position: { lat: 37.5558, lng: 126.921 } },
  { id: "mapo-sl-4", type: "streetlight", name: "마포 가로등 D", position: { lat: 37.5562, lng: 126.9198 } },
  { id: "mapo-cctv-1", type: "cctv", name: "마포 CCTV 1호", position: { lat: 37.5549, lng: 126.9235 }, description: "교차로 설치 시설 CCTV" },
  { id: "mapo-cctv-2", type: "cctv", name: "마포 CCTV 2호", position: { lat: 37.5555, lng: 126.922 }, description: "편의점 앞 CCTV" },
  { id: "mapo-cctv-3", type: "cctv", name: "마포 CCTV 3호", position: { lat: 37.556, lng: 126.9205 } },
  { id: "mapo-ps-1", type: "police_station", name: "마포 파출소", position: { lat: 37.5553, lng: 126.9228 }, description: "24시간 운영 파출소" },
  { id: "mapo-cw-1", type: "crosswalk", name: "마포 횡단보도 1", position: { lat: 37.555, lng: 126.9232 } },
  { id: "mapo-cw-2", type: "crosswalk", name: "마포 교문 앞 횡단보도", position: { lat: 37.5546, lng: 126.9232 } },
  { id: "mapo-dz-1", type: "danger", name: "마포 어두운 골목", position: { lat: 37.5543, lng: 126.9215 }, description: "조명이 부족한 좁은 골목" },
  { id: "mapo-eb-1", type: "emergency_bell", name: "마포 비상벨", position: { lat: 37.5557, lng: 126.9218 }, description: "경찰 직통 비상벨" },
];

// --- 강남구 시설 (11개, CCTV 多, 위험구역 少) ---
const GANGNAM_FACILITIES: DomainFacility[] = [
  { id: "gangnam-sl-1", type: "streetlight", name: "강남 가로등 A", position: { lat: 37.4982, lng: 127.028 } },
  { id: "gangnam-sl-2", type: "streetlight", name: "강남 가로등 B", position: { lat: 37.4975, lng: 127.0268 } },
  { id: "gangnam-sl-3", type: "streetlight", name: "강남 가로등 C", position: { lat: 37.4985, lng: 127.029 } },
  { id: "gangnam-cctv-1", type: "cctv", name: "강남 CCTV 1호", position: { lat: 37.498, lng: 127.0275 }, description: "테헤란로 CCTV" },
  { id: "gangnam-cctv-2", type: "cctv", name: "강남 CCTV 2호", position: { lat: 37.4977, lng: 127.026 }, description: "강남역 부근 CCTV" },
  { id: "gangnam-cctv-3", type: "cctv", name: "강남 CCTV 3호", position: { lat: 37.4983, lng: 127.0285 } },
  { id: "gangnam-cctv-4", type: "cctv", name: "강남 CCTV 4호", position: { lat: 37.4971, lng: 127.0255 } },
  { id: "gangnam-ps-1", type: "police_station", name: "강남 파출소", position: { lat: 37.4978, lng: 127.0272 }, description: "24시간 운영 파출소" },
  { id: "gangnam-cw-1", type: "crosswalk", name: "강남 횡단보도 1", position: { lat: 37.498, lng: 127.0278 } },
  { id: "gangnam-cw-2", type: "crosswalk", name: "강남 횡단보도 2", position: { lat: 37.4974, lng: 127.0263 } },
  { id: "gangnam-eb-1", type: "emergency_bell", name: "강남 비상벨", position: { lat: 37.4986, lng: 127.0292 }, description: "스쿨존 비상벨" },
];

// --- 종로구 시설 (10개, 위험구역 2개 - 좁은 골목) ---
const JONGNO_FACILITIES: DomainFacility[] = [
  { id: "jongno-sl-1", type: "streetlight", name: "종로 가로등 A", position: { lat: 37.5732, lng: 126.9798 } },
  { id: "jongno-sl-2", type: "streetlight", name: "종로 가로등 B", position: { lat: 37.5726, lng: 126.9785 } },
  { id: "jongno-sl-3", type: "streetlight", name: "종로 가로등 C", position: { lat: 37.5735, lng: 126.981 } },
  { id: "jongno-cctv-1", type: "cctv", name: "종로 CCTV 1호", position: { lat: 37.573, lng: 126.9796 }, description: "종로 메인 CCTV" },
  { id: "jongno-cctv-2", type: "cctv", name: "종로 CCTV 2호", position: { lat: 37.5724, lng: 126.978 } },
  { id: "jongno-ps-1", type: "police_station", name: "종로 파출소", position: { lat: 37.5728, lng: 126.9788 }, description: "종로구청 근처 파출소" },
  { id: "jongno-cw-1", type: "crosswalk", name: "종로 횡단보도", position: { lat: 37.5731, lng: 126.9802 } },
  { id: "jongno-dz-1", type: "danger", name: "종로 북촌 좁은 골목", position: { lat: 37.5722, lng: 126.9778 }, description: "조명 미비 구간" },
  { id: "jongno-dz-2", type: "danger", name: "종로 골목 위험구역", position: { lat: 37.5738, lng: 126.9815 }, description: "야간 시야 불량 구간" },
  { id: "jongno-eb-1", type: "emergency_bell", name: "종로 비상벨", position: { lat: 37.5733, lng: 126.9807 }, description: "교문 앞 비상벨" },
];

// --- 송파구 시설 (11개, 가로등 多 - 신도시) ---
const SONGPA_FACILITIES: DomainFacility[] = [
  { id: "songpa-sl-1", type: "streetlight", name: "송파 가로등 A", position: { lat: 37.5148, lng: 127.107 } },
  { id: "songpa-sl-2", type: "streetlight", name: "송파 가로등 B", position: { lat: 37.5142, lng: 127.1058 } },
  { id: "songpa-sl-3", type: "streetlight", name: "송파 가로등 C", position: { lat: 37.5152, lng: 127.108 } },
  { id: "songpa-sl-4", type: "streetlight", name: "송파 가로등 D", position: { lat: 37.5138, lng: 127.1048 } },
  { id: "songpa-sl-5", type: "streetlight", name: "송파 가로등 E", position: { lat: 37.5156, lng: 127.1088 } },
  { id: "songpa-cctv-1", type: "cctv", name: "송파 CCTV 1호", position: { lat: 37.5147, lng: 127.1065 }, description: "올림픽공원 근처 CCTV" },
  { id: "songpa-cctv-2", type: "cctv", name: "송파 CCTV 2호", position: { lat: 37.5141, lng: 127.1053 } },
  { id: "songpa-ps-1", type: "police_station", name: "송파 파출소", position: { lat: 37.5144, lng: 127.106 }, description: "송파 파출소" },
  { id: "songpa-cw-1", type: "crosswalk", name: "송파 횡단보도 1", position: { lat: 37.5149, lng: 127.1072 } },
  { id: "songpa-cw-2", type: "crosswalk", name: "송파 횡단보도 2", position: { lat: 37.514, lng: 127.105 } },
  { id: "songpa-eb-1", type: "emergency_bell", name: "송파 비상벨", position: { lat: 37.5155, lng: 127.1085 }, description: "스쿨존 비상벨" },
];

// --- 영등포구 시설 (10개, 위험구역 1개) ---
const YEONGDEUNGPO_FACILITIES: DomainFacility[] = [
  { id: "ydp-sl-1", type: "streetlight", name: "영등포 가로등 A", position: { lat: 37.5267, lng: 126.8967 } },
  { id: "ydp-sl-2", type: "streetlight", name: "영등포 가로등 B", position: { lat: 37.526, lng: 126.8955 } },
  { id: "ydp-sl-3", type: "streetlight", name: "영등포 가로등 C", position: { lat: 37.527, lng: 126.8975 } },
  { id: "ydp-cctv-1", type: "cctv", name: "영등포 CCTV 1호", position: { lat: 37.5265, lng: 126.8963 }, description: "영등포역 부근 CCTV" },
  { id: "ydp-cctv-2", type: "cctv", name: "영등포 CCTV 2호", position: { lat: 37.5258, lng: 126.895 } },
  { id: "ydp-ps-1", type: "police_station", name: "영등포 파출소", position: { lat: 37.5262, lng: 126.8958 }, description: "영등포구 파출소" },
  { id: "ydp-cw-1", type: "crosswalk", name: "영등포 횡단보도 1", position: { lat: 37.5268, lng: 126.897 } },
  { id: "ydp-cw-2", type: "crosswalk", name: "영등포 횡단보도 2", position: { lat: 37.5259, lng: 126.8952 } },
  { id: "ydp-dz-1", type: "danger", name: "영등포 시장 뒷골목", position: { lat: 37.5255, lng: 126.8945 }, description: "재래시장 뒷편 좁고 어두운 골목" },
  { id: "ydp-eb-1", type: "emergency_bell", name: "영등포 비상벨", position: { lat: 37.5272, lng: 126.898 }, description: "교문 인근 비상벨" },
];

// --- 구역별 시설 맵 ---
export const FACILITIES_BY_AREA: Record<string, DomainFacility[]> = {
  "area-mapo": MAPO_FACILITIES,
  "area-gangnam": GANGNAM_FACILITIES,
  "area-jongno": JONGNO_FACILITIES,
  "area-songpa": SONGPA_FACILITIES,
  "area-yeongdeungpo": YEONGDEUNGPO_FACILITIES,
};

export const MOCK_FACILITIES: DomainFacility[] = [
  ...MAPO_FACILITIES,
  ...GANGNAM_FACILITIES,
  ...JONGNO_FACILITIES,
  ...SONGPA_FACILITIES,
  ...YEONGDEUNGPO_FACILITIES,
];

export function findFacilitiesByArea(areaId: string): DomainFacility[] {
  return FACILITIES_BY_AREA[areaId] ?? [];
}

// --- 마포 경로별 시설 필터 (기존 호환성 유지) ---
export const SAFE_ROUTE_FACILITIES = MAPO_FACILITIES.filter((f) =>
  ["mapo-sl-1", "mapo-sl-2", "mapo-sl-3", "mapo-sl-4", "mapo-cctv-1", "mapo-cctv-2", "mapo-cctv-3", "mapo-ps-1", "mapo-cw-1", "mapo-cw-2", "mapo-eb-1"].includes(f.id),
);

export const BALANCED_ROUTE_FACILITIES = MAPO_FACILITIES.filter((f) =>
  ["mapo-sl-1", "mapo-sl-2", "mapo-cctv-1", "mapo-cctv-2", "mapo-ps-1", "mapo-cw-1"].includes(f.id),
);

export const FASTEST_ROUTE_FACILITIES = MAPO_FACILITIES.filter((f) =>
  ["mapo-sl-1", "mapo-cctv-1", "mapo-dz-1"].includes(f.id),
);
