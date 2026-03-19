import type { RouteOption } from "@/lib/maps/types";
import {
  SAFE_ROUTE_FACILITIES,
  BALANCED_ROUTE_FACILITIES,
  FASTEST_ROUTE_FACILITIES,
  FACILITIES_BY_AREA,
} from "@/data/mock/facilities";
import {
  calculateRouteSafety,
  buildFacilityInfluences,
} from "@/domain/services/calculate-route-safety";

const osanFacilities = FACILITIES_BY_AREA["area-osan"] ?? [];

// ===================== 오산고등학교 (school-osan-go) =====================
// 학교 위치: 37.1497, 127.0697 / 홈: 37.1510, 127.0660

const osaGoSafeDetails = calculateRouteSafety({ facilities: SAFE_ROUTE_FACILITIES });
const osaGoBalancedDetails = calculateRouteSafety({ facilities: BALANCED_ROUTE_FACILITIES });
const osaGoFastDetails = calculateRouteSafety({ facilities: FASTEST_ROUTE_FACILITIES, hasUnlitSegment: true });

const OSAN_GO_ROUTES: RouteOption[] = [
  {
    id: "osan-go-route-safe",
    name: "안전 경로",
    safetyLevel: osaGoSafeDetails.level,
    score: osaGoSafeDetails.score,
    distanceKm: 1.8,
    estimatedMinutes: 22,
    explanation: "가로등과 CCTV가 촘촘히 설치된 청학로를 따라 이동하며 파출소 인근을 경유하는 가장 안전한 경로입니다.",
    points: [
      { position: { lat: 37.1497, lng: 127.0697 }, label: "오산고등학교" },
      { position: { lat: 37.1500, lng: 127.0700 } },
      { position: { lat: 37.1495, lng: 127.0680 } },
      { position: { lat: 37.1503, lng: 127.0665 } },
      { position: { lat: 37.1510, lng: 127.0660 }, label: "Home" },
    ],
    safetyDetails: osaGoSafeDetails,
    facilityInfluences: buildFacilityInfluences(SAFE_ROUTE_FACILITIES),
  },
  {
    id: "osan-go-route-balanced",
    name: "균형 경로",
    safetyLevel: osaGoBalancedDetails.level,
    score: osaGoBalancedDetails.score,
    distanceKm: 1.4,
    estimatedMinutes: 17,
    explanation: "안전성과 이동 시간의 균형을 맞춘 경로입니다. 주요 CCTV와 가로등 구간을 경유합니다.",
    points: [
      { position: { lat: 37.1497, lng: 127.0697 }, label: "오산고등학교" },
      { position: { lat: 37.1498, lng: 127.0695 } },
      { position: { lat: 37.1502, lng: 127.0672 } },
      { position: { lat: 37.1510, lng: 127.0660 }, label: "Home" },
    ],
    safetyDetails: osaGoBalancedDetails,
    facilityInfluences: buildFacilityInfluences(BALANCED_ROUTE_FACILITIES),
  },
  {
    id: "osan-go-route-fast",
    name: "빠른 경로",
    safetyLevel: osaGoFastDetails.level,
    score: osaGoFastDetails.score,
    distanceKm: 1.0,
    estimatedMinutes: 12,
    explanation: "가장 짧은 경로이지만 청학로 뒷골목 어두운 구간을 통과합니다. 야간에는 권장하지 않습니다.",
    points: [
      { position: { lat: 37.1497, lng: 127.0697 }, label: "오산고등학교" },
      { position: { lat: 37.1488, lng: 127.0682 } },
      { position: { lat: 37.1510, lng: 127.0660 }, label: "Home" },
    ],
    safetyDetails: osaGoFastDetails,
    facilityInfluences: buildFacilityInfluences(FASTEST_ROUTE_FACILITIES),
  },
];

// ===================== 오산중학교 (school-osan-jung) =====================
// 학교 위치: 37.1489, 127.0710 / 홈: 37.1475, 127.0740

const jungSafeFacilities = osanFacilities.filter((f) =>
  ["osan-sl-05", "osan-sl-06", "osan-sl-07", "osan-cctv-03", "osan-cctv-04", "osan-ps-01", "osan-cw-03", "osan-eb-01"].includes(f.id),
);
const jungBalancedFacilities = osanFacilities.filter((f) =>
  ["osan-sl-05", "osan-sl-06", "osan-cctv-03", "osan-ps-01", "osan-cw-03"].includes(f.id),
);
const jungFastFacilities = osanFacilities.filter((f) =>
  ["osan-sl-05", "osan-cctv-03", "osan-dz-01"].includes(f.id),
);

const jungSafeDetails = calculateRouteSafety({ facilities: jungSafeFacilities });
const jungBalancedDetails = calculateRouteSafety({ facilities: jungBalancedFacilities });
const jungFastDetails = calculateRouteSafety({ facilities: jungFastFacilities, hasUnlitSegment: true });

const OSAN_JUNG_ROUTES: RouteOption[] = [
  {
    id: "osan-jung-route-safe",
    name: "안전 경로",
    safetyLevel: jungSafeDetails.level,
    score: jungSafeDetails.score,
    distanceKm: 1.6,
    estimatedMinutes: 20,
    explanation: "청학로 대로변을 따라 CCTV와 가로등이 잘 갖춰진 안전한 경로입니다. 파출소 인근을 경유합니다.",
    points: [
      { position: { lat: 37.1489, lng: 127.0710 }, label: "오산중학교" },
      { position: { lat: 37.1492, lng: 127.0715 } },
      { position: { lat: 37.1485, lng: 127.0708 } },
      { position: { lat: 37.1480, lng: 127.0730 } },
      { position: { lat: 37.1475, lng: 127.0740 }, label: "Home" },
    ],
    safetyDetails: jungSafeDetails,
    facilityInfluences: buildFacilityInfluences(jungSafeFacilities),
  },
  {
    id: "osan-jung-route-balanced",
    name: "균형 경로",
    safetyLevel: jungBalancedDetails.level,
    score: jungBalancedDetails.score,
    distanceKm: 1.2,
    estimatedMinutes: 15,
    explanation: "이동 시간을 단축하면서도 주요 가로등과 CCTV 구간을 유지하는 경로입니다.",
    points: [
      { position: { lat: 37.1489, lng: 127.0710 }, label: "오산중학교" },
      { position: { lat: 37.1490, lng: 127.0712 } },
      { position: { lat: 37.1478, lng: 127.0732 } },
      { position: { lat: 37.1475, lng: 127.0740 }, label: "Home" },
    ],
    safetyDetails: jungBalancedDetails,
    facilityInfluences: buildFacilityInfluences(jungBalancedFacilities),
  },
  {
    id: "osan-jung-route-fast",
    name: "빠른 경로",
    safetyLevel: jungFastDetails.level,
    score: jungFastDetails.score,
    distanceKm: 0.9,
    estimatedMinutes: 11,
    explanation: "가장 빠른 경로이나 어두운 골목을 경유합니다. 낮 시간대에만 권장합니다.",
    points: [
      { position: { lat: 37.1489, lng: 127.0710 }, label: "오산중학교" },
      { position: { lat: 37.1483, lng: 127.0718 } },
      { position: { lat: 37.1475, lng: 127.0740 }, label: "Home" },
    ],
    safetyDetails: jungFastDetails,
    facilityInfluences: buildFacilityInfluences(jungFastFacilities),
  },
];

// ===================== 오산초등학교 (school-osan-cho) =====================
// 학교 위치: 37.1535, 127.0620 / 홈: 37.1548, 127.0598

const choSafeFacilities = osanFacilities.filter((f) =>
  ["osan-sl-08", "osan-sl-09", "osan-sl-10", "osan-sl-11", "osan-cctv-05", "osan-cctv-06", "osan-ps-01", "osan-cw-04", "osan-cw-05", "osan-eb-02"].includes(f.id),
);
const choBalancedFacilities = osanFacilities.filter((f) =>
  ["osan-sl-08", "osan-sl-09", "osan-cctv-05", "osan-ps-01", "osan-cw-04"].includes(f.id),
);
const choFastFacilities = osanFacilities.filter((f) =>
  ["osan-sl-08", "osan-cctv-05", "osan-dz-04"].includes(f.id),
);

const choSafeDetails = calculateRouteSafety({ facilities: choSafeFacilities });
const choBalancedDetails = calculateRouteSafety({ facilities: choBalancedFacilities });
const choFastDetails = calculateRouteSafety({ facilities: choFastFacilities, hasUnlitSegment: true });

const OSAN_CHO_ROUTES: RouteOption[] = [
  {
    id: "osan-cho-route-safe",
    name: "안전 경로",
    safetyLevel: choSafeDetails.level,
    score: choSafeDetails.score,
    distanceKm: 1.5,
    estimatedMinutes: 19,
    explanation: "스쿨존 비상벨과 CCTV가 설치된 가수로 대로변을 이용하는 가장 안전한 경로입니다.",
    points: [
      { position: { lat: 37.1535, lng: 127.0620 }, label: "오산초등학교" },
      { position: { lat: 37.1538, lng: 127.0618 } },
      { position: { lat: 37.1540, lng: 127.0608 } },
      { position: { lat: 37.1545, lng: 127.0600 } },
      { position: { lat: 37.1548, lng: 127.0598 }, label: "Home" },
    ],
    safetyDetails: choSafeDetails,
    facilityInfluences: buildFacilityInfluences(choSafeFacilities),
  },
  {
    id: "osan-cho-route-balanced",
    name: "균형 경로",
    safetyLevel: choBalancedDetails.level,
    score: choBalancedDetails.score,
    distanceKm: 1.1,
    estimatedMinutes: 14,
    explanation: "주요 가로등과 CCTV를 경유하며 적절한 안전성을 유지하는 경로입니다.",
    points: [
      { position: { lat: 37.1535, lng: 127.0620 }, label: "오산초등학교" },
      { position: { lat: 37.1535, lng: 127.0618 } },
      { position: { lat: 37.1542, lng: 127.0602 } },
      { position: { lat: 37.1548, lng: 127.0598 }, label: "Home" },
    ],
    safetyDetails: choBalancedDetails,
    facilityInfluences: buildFacilityInfluences(choBalancedFacilities),
  },
  {
    id: "osan-cho-route-fast",
    name: "빠른 경로",
    safetyLevel: choFastDetails.level,
    score: choFastDetails.score,
    distanceKm: 0.8,
    estimatedMinutes: 10,
    explanation: "가장 짧은 경로이지만 CCTV 미설치 구간을 통과합니다. 낮에만 이용하세요.",
    points: [
      { position: { lat: 37.1535, lng: 127.0620 }, label: "오산초등학교" },
      { position: { lat: 37.1522, lng: 127.0605 } },
      { position: { lat: 37.1548, lng: 127.0598 }, label: "Home" },
    ],
    safetyDetails: choFastDetails,
    facilityInfluences: buildFacilityInfluences(choFastFacilities),
  },
];

// ===================== 매홀중학교 (school-maehol) =====================
// 학교 위치: 37.1560, 127.0770 / 홈: 37.1580, 127.0748

const maeHolSafeFacilities = osanFacilities.filter((f) =>
  ["osan-sl-12", "osan-sl-13", "osan-sl-14", "osan-sl-15", "osan-cctv-07", "osan-cctv-08", "osan-ps-02", "osan-cw-06", "osan-cw-07", "osan-eb-03", "osan-eb-05"].includes(f.id),
);
const maeHolBalancedFacilities = osanFacilities.filter((f) =>
  ["osan-sl-12", "osan-sl-13", "osan-cctv-07", "osan-ps-02", "osan-cw-06"].includes(f.id),
);
const maeHolFastFacilities = osanFacilities.filter((f) =>
  ["osan-sl-12", "osan-cctv-07", "osan-dz-02"].includes(f.id),
);

const maeHolSafeDetails = calculateRouteSafety({ facilities: maeHolSafeFacilities });
const maeHolBalancedDetails = calculateRouteSafety({ facilities: maeHolBalancedFacilities });
const maeHolFastDetails = calculateRouteSafety({ facilities: maeHolFastFacilities, hasUnlitSegment: true });

const MAEHOL_ROUTES: RouteOption[] = [
  {
    id: "maehol-route-safe",
    name: "안전 경로",
    safetyLevel: maeHolSafeDetails.level,
    score: maeHolSafeDetails.score,
    distanceKm: 1.7,
    estimatedMinutes: 21,
    explanation: "내삼미로 대로변을 따라 세교파출소 인근을 경유하는 가장 안전한 경로입니다.",
    points: [
      { position: { lat: 37.1560, lng: 127.0770 }, label: "매홀중학교" },
      { position: { lat: 37.1563, lng: 127.0775 } },
      { position: { lat: 37.1550, lng: 127.0730 } },
      { position: { lat: 37.1570, lng: 127.0752 } },
      { position: { lat: 37.1580, lng: 127.0748 }, label: "Home" },
    ],
    safetyDetails: maeHolSafeDetails,
    facilityInfluences: buildFacilityInfluences(maeHolSafeFacilities),
  },
  {
    id: "maehol-route-balanced",
    name: "균형 경로",
    safetyLevel: maeHolBalancedDetails.level,
    score: maeHolBalancedDetails.score,
    distanceKm: 1.3,
    estimatedMinutes: 16,
    explanation: "파출소와 주요 CCTV를 경유하며 적절한 이동 시간을 유지하는 경로입니다.",
    points: [
      { position: { lat: 37.1560, lng: 127.0770 }, label: "매홀중학교" },
      { position: { lat: 37.1558, lng: 127.0765 } },
      { position: { lat: 37.1572, lng: 127.0752 } },
      { position: { lat: 37.1580, lng: 127.0748 }, label: "Home" },
    ],
    safetyDetails: maeHolBalancedDetails,
    facilityInfluences: buildFacilityInfluences(maeHolBalancedFacilities),
  },
  {
    id: "maehol-route-fast",
    name: "빠른 경로",
    safetyLevel: maeHolFastDetails.level,
    score: maeHolFastDetails.score,
    distanceKm: 0.9,
    estimatedMinutes: 11,
    explanation: "가장 빠르지만 공사 중인 구간을 통과합니다. 안전에 주의하세요.",
    points: [
      { position: { lat: 37.1560, lng: 127.0770 }, label: "매홀중학교" },
      { position: { lat: 37.1572, lng: 127.0752 } },
      { position: { lat: 37.1580, lng: 127.0748 }, label: "Home" },
    ],
    safetyDetails: maeHolFastDetails,
    facilityInfluences: buildFacilityInfluences(maeHolFastFacilities),
  },
];

// ===================== 운암고등학교 (school-unam) =====================
// 학교 위치: 37.1440, 127.0560 / 홈: 37.1422, 127.0540

const unamSafeFacilities = osanFacilities.filter((f) =>
  ["osan-sl-16", "osan-sl-17", "osan-sl-18", "osan-cctv-09", "osan-cctv-10", "osan-ps-03", "osan-cw-08", "osan-eb-04"].includes(f.id),
);
const unamBalancedFacilities = osanFacilities.filter((f) =>
  ["osan-sl-16", "osan-sl-17", "osan-cctv-09", "osan-ps-03", "osan-cw-08"].includes(f.id),
);
const unamFastFacilities = osanFacilities.filter((f) =>
  ["osan-sl-16", "osan-cctv-09", "osan-dz-03"].includes(f.id),
);

const unamSafeDetails = calculateRouteSafety({ facilities: unamSafeFacilities });
const unamBalancedDetails = calculateRouteSafety({ facilities: unamBalancedFacilities });
const unamFastDetails = calculateRouteSafety({ facilities: unamFastFacilities, hasUnlitSegment: true });

const UNAM_ROUTES: RouteOption[] = [
  {
    id: "unam-route-safe",
    name: "안전 경로",
    safetyLevel: unamSafeDetails.level,
    score: unamSafeDetails.score,
    distanceKm: 1.9,
    estimatedMinutes: 23,
    explanation: "운천로 대로변을 이용하고 남오산파출소 인근을 경유하는 가장 안전한 경로입니다.",
    points: [
      { position: { lat: 37.1440, lng: 127.0560 }, label: "운암고등학교" },
      { position: { lat: 37.1443, lng: 127.0565 } },
      { position: { lat: 37.1442, lng: 127.0575 } },
      { position: { lat: 37.1435, lng: 127.0552 } },
      { position: { lat: 37.1422, lng: 127.0540 }, label: "Home" },
    ],
    safetyDetails: unamSafeDetails,
    facilityInfluences: buildFacilityInfluences(unamSafeFacilities),
  },
  {
    id: "unam-route-balanced",
    name: "균형 경로",
    safetyLevel: unamBalancedDetails.level,
    score: unamBalancedDetails.score,
    distanceKm: 1.4,
    estimatedMinutes: 17,
    explanation: "파출소와 CCTV를 경유하며 이동 시간도 적절히 단축한 경로입니다.",
    points: [
      { position: { lat: 37.1440, lng: 127.0560 }, label: "운암고등학교" },
      { position: { lat: 37.1440, lng: 127.0562 } },
      { position: { lat: 37.1430, lng: 127.0548 } },
      { position: { lat: 37.1422, lng: 127.0540 }, label: "Home" },
    ],
    safetyDetails: unamBalancedDetails,
    facilityInfluences: buildFacilityInfluences(unamBalancedFacilities),
  },
  {
    id: "unam-route-fast",
    name: "빠른 경로",
    safetyLevel: unamFastDetails.level,
    score: unamFastDetails.score,
    distanceKm: 1.1,
    estimatedMinutes: 13,
    explanation: "가장 빠르지만 일부 구간에 가로등이 없습니다. 밝은 시간대 이용을 권장합니다.",
    points: [
      { position: { lat: 37.1440, lng: 127.0560 }, label: "운암고등학교" },
      { position: { lat: 37.1435, lng: 127.0555 } },
      { position: { lat: 37.1422, lng: 127.0540 }, label: "Home" },
    ],
    safetyDetails: unamFastDetails,
    facilityInfluences: buildFacilityInfluences(unamFastFacilities),
  },
];

// ===================== 전체 내보내기 =====================
export const ROUTES_BY_SCHOOL: Record<string, RouteOption[]> = {
  "school-osan-go": OSAN_GO_ROUTES,
  "school-osan-jung": OSAN_JUNG_ROUTES,
  "school-osan-cho": OSAN_CHO_ROUTES,
  "school-maehol": MAEHOL_ROUTES,
  "school-unam": UNAM_ROUTES,
};

export const MOCK_ROUTES: RouteOption[] = [
  ...OSAN_GO_ROUTES,
  ...OSAN_JUNG_ROUTES,
  ...OSAN_CHO_ROUTES,
  ...MAEHOL_ROUTES,
  ...UNAM_ROUTES,
];
