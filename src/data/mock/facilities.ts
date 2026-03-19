import type { DomainFacility } from "@/domain/entities/facility";

// =============================================================
// 오산시 전체 시설 데이터 (area-osan)
// 중심: 37.1500, 127.0680
// 5개 학교 주변에 분산 배치
// =============================================================

// --- 가로등 (streetlight): 22개 ---
const OSAN_STREETLIGHTS: DomainFacility[] = [
  // 오산고등학교(37.1497, 127.0697) 주변
  { id: "osan-sl-01", type: "streetlight", name: "청학로 가로등 1호", position: { lat: 37.1500, lng: 127.0700 } },
  { id: "osan-sl-02", type: "streetlight", name: "청학로 가로등 2호", position: { lat: 37.1493, lng: 127.0690 } },
  { id: "osan-sl-03", type: "streetlight", name: "청학로5번길 가로등", position: { lat: 37.1502, lng: 127.0685 } },
  { id: "osan-sl-04", type: "streetlight", name: "오산고 정문 가로등", position: { lat: 37.1495, lng: 127.0705 } },

  // 오산중학교(37.1489, 127.0710) 주변
  { id: "osan-sl-05", type: "streetlight", name: "청학로 가로등 3호", position: { lat: 37.1492, lng: 127.0715 } },
  { id: "osan-sl-06", type: "streetlight", name: "오산중 앞 가로등", position: { lat: 37.1485, lng: 127.0708 } },
  { id: "osan-sl-07", type: "streetlight", name: "청학로 가로등 4호", position: { lat: 37.1480, lng: 127.0720 } },

  // 오산초등학교(37.1535, 127.0620) 주변
  { id: "osan-sl-08", type: "streetlight", name: "가수로 가로등 1호", position: { lat: 37.1538, lng: 127.0618 } },
  { id: "osan-sl-09", type: "streetlight", name: "가수로 가로등 2호", position: { lat: 37.1530, lng: 127.0625 } },
  { id: "osan-sl-10", type: "streetlight", name: "오산초 후문 가로등", position: { lat: 37.1540, lng: 127.0630 } },
  { id: "osan-sl-11", type: "streetlight", name: "가수로 가로등 3호", position: { lat: 37.1525, lng: 127.0612 } },

  // 매홀중학교(37.1560, 127.0770) 주변
  { id: "osan-sl-12", type: "streetlight", name: "내삼미로 가로등 1호", position: { lat: 37.1563, lng: 127.0775 } },
  { id: "osan-sl-13", type: "streetlight", name: "내삼미로 가로등 2호", position: { lat: 37.1555, lng: 127.0765 } },
  { id: "osan-sl-14", type: "streetlight", name: "매홀중 정문 가로등", position: { lat: 37.1558, lng: 127.0778 } },
  { id: "osan-sl-15", type: "streetlight", name: "내삼미로48번길 가로등", position: { lat: 37.1570, lng: 127.0760 } },

  // 운암고등학교(37.1440, 127.0560) 주변
  { id: "osan-sl-16", type: "streetlight", name: "운천로 가로등 1호", position: { lat: 37.1443, lng: 127.0565 } },
  { id: "osan-sl-17", type: "streetlight", name: "운천로 가로등 2호", position: { lat: 37.1435, lng: 127.0555 } },
  { id: "osan-sl-18", type: "streetlight", name: "운암고 정문 가로등", position: { lat: 37.1445, lng: 127.0558 } },

  // 학교 간 연결 도로
  { id: "osan-sl-19", type: "streetlight", name: "오산대로 가로등 A", position: { lat: 37.1510, lng: 127.0670 } },
  { id: "osan-sl-20", type: "streetlight", name: "오산대로 가로등 B", position: { lat: 37.1520, lng: 127.0690 } },
  { id: "osan-sl-21", type: "streetlight", name: "세교로 가로등", position: { lat: 37.1478, lng: 127.0650 } },
  { id: "osan-sl-22", type: "streetlight", name: "오산역로 가로등", position: { lat: 37.1465, lng: 127.0600 } },
];

// --- CCTV: 11개 ---
const OSAN_CCTVS: DomainFacility[] = [
  // 오산고등학교 인근 교차로
  { id: "osan-cctv-01", type: "cctv", name: "청학로 교차로 CCTV", position: { lat: 37.1498, lng: 127.0695 }, description: "청학로 주요 교차로 CCTV" },
  { id: "osan-cctv-02", type: "cctv", name: "오산고 교문 CCTV", position: { lat: 37.1497, lng: 127.0700 }, description: "학교 정문 앞 방범 CCTV" },

  // 오산중학교 인근
  { id: "osan-cctv-03", type: "cctv", name: "오산중 앞 교차로 CCTV", position: { lat: 37.1490, lng: 127.0712 }, description: "스쿨존 교차로 CCTV" },
  { id: "osan-cctv-04", type: "cctv", name: "청학로 북측 CCTV", position: { lat: 37.1483, lng: 127.0718 }, description: "청학로 방범 CCTV" },

  // 오산초등학교 인근
  { id: "osan-cctv-05", type: "cctv", name: "오산초 스쿨존 CCTV", position: { lat: 37.1535, lng: 127.0622 }, description: "초등학교 스쿨존 CCTV" },
  { id: "osan-cctv-06", type: "cctv", name: "가수로 CCTV", position: { lat: 37.1528, lng: 127.0615 }, description: "가수로 방범 CCTV" },

  // 매홀중학교 인근
  { id: "osan-cctv-07", type: "cctv", name: "매홀중 교문 CCTV", position: { lat: 37.1560, lng: 127.0772 }, description: "매홀중 정문 CCTV" },
  { id: "osan-cctv-08", type: "cctv", name: "내삼미로 교차로 CCTV", position: { lat: 37.1565, lng: 127.0780 }, description: "내삼미로 교차로 CCTV" },

  // 운암고등학교 인근
  { id: "osan-cctv-09", type: "cctv", name: "운암고 교문 CCTV", position: { lat: 37.1440, lng: 127.0562 }, description: "운암고 정문 방범 CCTV" },
  { id: "osan-cctv-10", type: "cctv", name: "운천로 CCTV", position: { lat: 37.1437, lng: 127.0555 }, description: "운천로 방범 CCTV" },

  // 중심 구역
  { id: "osan-cctv-11", type: "cctv", name: "오산시청 앞 CCTV", position: { lat: 37.1505, lng: 127.0678 }, description: "시청 주변 CCTV" },
];

// --- 파출소 (police_station): 3개 ---
const OSAN_POLICE_STATIONS: DomainFacility[] = [
  {
    id: "osan-ps-01",
    type: "police_station",
    name: "오산파출소",
    position: { lat: 37.1495, lng: 127.0680 },
    description: "24시간 운영 오산 파출소",
  },
  {
    id: "osan-ps-02",
    type: "police_station",
    name: "세교파출소",
    position: { lat: 37.1550, lng: 127.0730 },
    description: "24시간 운영 세교 파출소",
  },
  {
    id: "osan-ps-03",
    type: "police_station",
    name: "남오산파출소",
    position: { lat: 37.1442, lng: 127.0575 },
    description: "24시간 운영 남오산 파출소",
  },
];

// --- 횡단보도 (crosswalk): 9개 ---
const OSAN_CROSSWALKS: DomainFacility[] = [
  // 오산고등학교 주변
  { id: "osan-cw-01", type: "crosswalk", name: "오산고 정문 횡단보도", position: { lat: 37.1497, lng: 127.0693 } },
  { id: "osan-cw-02", type: "crosswalk", name: "청학로 횡단보도", position: { lat: 37.1503, lng: 127.0702 } },

  // 오산중학교 주변
  { id: "osan-cw-03", type: "crosswalk", name: "오산중 스쿨존 횡단보도", position: { lat: 37.1488, lng: 127.0707 } },

  // 오산초등학교 주변 (스쿨존 집중)
  { id: "osan-cw-04", type: "crosswalk", name: "오산초 정문 횡단보도", position: { lat: 37.1535, lng: 127.0618 } },
  { id: "osan-cw-05", type: "crosswalk", name: "오산초 서편 횡단보도", position: { lat: 37.1532, lng: 127.0610 } },

  // 매홀중학교 주변
  { id: "osan-cw-06", type: "crosswalk", name: "매홀중 앞 횡단보도", position: { lat: 37.1558, lng: 127.0770 } },
  { id: "osan-cw-07", type: "crosswalk", name: "내삼미로 횡단보도", position: { lat: 37.1565, lng: 127.0765 } },

  // 운암고등학교 주변
  { id: "osan-cw-08", type: "crosswalk", name: "운암고 정문 횡단보도", position: { lat: 37.1440, lng: 127.0558 } },

  // 주요 도로
  { id: "osan-cw-09", type: "crosswalk", name: "오산대로 횡단보도", position: { lat: 37.1512, lng: 127.0668 } },
];

// --- 위험구간 (danger): 4개 ---
const OSAN_DANGER_ZONES: DomainFacility[] = [
  {
    id: "osan-dz-01",
    type: "danger",
    name: "청학로 뒷골목 위험구간",
    position: { lat: 37.1488, lng: 127.0682 },
    description: "가로등 미설치 좁은 골목, 야간 시야 불량",
  },
  {
    id: "osan-dz-02",
    type: "danger",
    name: "내삼미로 공사구간",
    position: { lat: 37.1572, lng: 127.0752 },
    description: "도로 공사 중 보행자 주의 필요",
  },
  {
    id: "osan-dz-03",
    type: "danger",
    name: "운천로 어두운 골목",
    position: { lat: 37.1432, lng: 127.0545 },
    description: "조명 부족 구간, 야간 이동 위험",
  },
  {
    id: "osan-dz-04",
    type: "danger",
    name: "가수로 사각지대",
    position: { lat: 37.1522, lng: 127.0605 },
    description: "CCTV 미설치 구간, 주의 요망",
  },
];

// --- 비상벨 (emergency_bell): 5개 ---
const OSAN_EMERGENCY_BELLS: DomainFacility[] = [
  {
    id: "osan-eb-01",
    type: "emergency_bell",
    name: "오산고 교문 비상벨",
    position: { lat: 37.1496, lng: 127.0697 },
    description: "경찰 직통 비상벨",
  },
  {
    id: "osan-eb-02",
    type: "emergency_bell",
    name: "오산초 정문 비상벨",
    position: { lat: 37.1534, lng: 127.0620 },
    description: "스쿨존 비상벨",
  },
  {
    id: "osan-eb-03",
    type: "emergency_bell",
    name: "매홀중 앞 비상벨",
    position: { lat: 37.1560, lng: 127.0769 },
    description: "학교 앞 비상벨",
  },
  {
    id: "osan-eb-04",
    type: "emergency_bell",
    name: "운암고 주변 비상벨",
    position: { lat: 37.1441, lng: 127.0563 },
    description: "운암고 인근 공원 비상벨",
  },
  {
    id: "osan-eb-05",
    type: "emergency_bell",
    name: "세교공원 비상벨",
    position: { lat: 37.1548, lng: 127.0725 },
    description: "세교공원 내 비상벨",
  },
];

// =============================================================
// 오산 전체 시설 통합
// =============================================================
const OSAN_FACILITIES: DomainFacility[] = [
  ...OSAN_STREETLIGHTS,
  ...OSAN_CCTVS,
  ...OSAN_POLICE_STATIONS,
  ...OSAN_CROSSWALKS,
  ...OSAN_DANGER_ZONES,
  ...OSAN_EMERGENCY_BELLS,
];

// --- 구역별 시설 맵 ---
export const FACILITIES_BY_AREA: Record<string, DomainFacility[]> = {
  "area-osan": OSAN_FACILITIES,
};

export const MOCK_FACILITIES: DomainFacility[] = [...OSAN_FACILITIES];

export function findFacilitiesByArea(areaId: string): DomainFacility[] {
  return FACILITIES_BY_AREA[areaId] ?? [];
}

// --- 오산고(첫 번째 학교) 경로별 시설 필터 ---
export const SAFE_ROUTE_FACILITIES = OSAN_FACILITIES.filter((f) =>
  [
    "osan-sl-01", "osan-sl-02", "osan-sl-03", "osan-sl-04",
    "osan-cctv-01", "osan-cctv-02",
    "osan-ps-01",
    "osan-cw-01", "osan-cw-02",
    "osan-eb-01",
  ].includes(f.id),
);

export const BALANCED_ROUTE_FACILITIES = OSAN_FACILITIES.filter((f) =>
  [
    "osan-sl-01", "osan-sl-02",
    "osan-cctv-01", "osan-cctv-02",
    "osan-ps-01",
    "osan-cw-01",
  ].includes(f.id),
);

export const FASTEST_ROUTE_FACILITIES = OSAN_FACILITIES.filter((f) =>
  [
    "osan-sl-01",
    "osan-cctv-01",
    "osan-dz-01",
  ].includes(f.id),
);
