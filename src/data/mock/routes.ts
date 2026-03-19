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

// ===================== 마포 (school-1) =====================
const mapoSafetyDetails = calculateRouteSafety({ facilities: SAFE_ROUTE_FACILITIES });
const mapoBalancedDetails = calculateRouteSafety({ facilities: BALANCED_ROUTE_FACILITIES });
const mapoFastestDetails = calculateRouteSafety({
  facilities: FASTEST_ROUTE_FACILITIES,
  hasUnlitSegment: true,
});

const MAPO_ROUTES: RouteOption[] = [
  {
    id: "mapo-route-safe",
    name: "안전 경로",
    safetyLevel: mapoSafetyDetails.level,
    score: mapoSafetyDetails.score,
    distanceKm: 1.8,
    estimatedMinutes: 22,
    explanation: "가로등과 CCTV가 충분하고 파출소 인근을 경유하는 가장 안전한 경로입니다. 야간 이동에 추천합니다.",
    points: [
      { position: { lat: 37.5545, lng: 126.9231 }, label: "School" },
      { position: { lat: 37.5548, lng: 126.924 } },
      { position: { lat: 37.5553, lng: 126.9228 } },
      { position: { lat: 37.556, lng: 126.9205 } },
      { position: { lat: 37.5565, lng: 126.919 }, label: "Home" },
    ],
    safetyDetails: mapoSafetyDetails,
    facilityInfluences: buildFacilityInfluences(SAFE_ROUTE_FACILITIES),
  },
  {
    id: "mapo-route-balanced",
    name: "균형 경로",
    safetyLevel: mapoBalancedDetails.level,
    score: mapoBalancedDetails.score,
    distanceKm: 1.4,
    estimatedMinutes: 17,
    explanation: "안전성과 이동 시간의 균형을 맞춘 경로입니다. 주요 가로등과 CCTV를 경유합니다.",
    points: [
      { position: { lat: 37.5545, lng: 126.9231 }, label: "School" },
      { position: { lat: 37.5549, lng: 126.9235 } },
      { position: { lat: 37.5555, lng: 126.922 } },
      { position: { lat: 37.5565, lng: 126.919 }, label: "Home" },
    ],
    safetyDetails: mapoBalancedDetails,
    facilityInfluences: buildFacilityInfluences(BALANCED_ROUTE_FACILITIES),
  },
  {
    id: "mapo-route-fast",
    name: "빠른 경로",
    safetyLevel: mapoFastestDetails.level,
    score: mapoFastestDetails.score,
    distanceKm: 1.1,
    estimatedMinutes: 13,
    explanation: "가장 짧은 경로이지만 어두운 골목을 통과합니다. 야간에는 권장하지 않습니다.",
    points: [
      { position: { lat: 37.5545, lng: 126.9231 }, label: "School" },
      { position: { lat: 37.5543, lng: 126.9215 } },
      { position: { lat: 37.5565, lng: 126.919 }, label: "Home" },
    ],
    safetyDetails: mapoFastestDetails,
    facilityInfluences: buildFacilityInfluences(FASTEST_ROUTE_FACILITIES),
  },
];

// ===================== 강남 (school-gangnam) =====================
const gangnamFacilities = FACILITIES_BY_AREA["area-gangnam"] ?? [];

const gangnamSafeFacilities = gangnamFacilities.filter((f) =>
  ["gangnam-sl-1", "gangnam-sl-2", "gangnam-sl-3", "gangnam-cctv-1", "gangnam-cctv-2", "gangnam-cctv-3", "gangnam-cctv-4", "gangnam-ps-1", "gangnam-cw-1", "gangnam-cw-2", "gangnam-eb-1"].includes(f.id),
);
const gangnamBalancedFacilities = gangnamFacilities.filter((f) =>
  ["gangnam-sl-1", "gangnam-sl-2", "gangnam-cctv-1", "gangnam-cctv-2", "gangnam-ps-1", "gangnam-cw-1"].includes(f.id),
);
const gangnamFastFacilities = gangnamFacilities.filter((f) =>
  ["gangnam-sl-1", "gangnam-cctv-1"].includes(f.id),
);

const gangnamSafeDetails = calculateRouteSafety({ facilities: gangnamSafeFacilities });
const gangnamBalancedDetails = calculateRouteSafety({ facilities: gangnamBalancedFacilities });
const gangnamFastDetails = calculateRouteSafety({ facilities: gangnamFastFacilities });

const GANGNAM_ROUTES: RouteOption[] = [
  {
    id: "gangnam-route-safe",
    name: "안전 경로",
    safetyLevel: gangnamSafeDetails.level,
    score: gangnamSafeDetails.score,
    distanceKm: 1.6,
    estimatedMinutes: 20,
    explanation: "CCTV와 가로등이 촘촘히 설치된 강남구 최안전 경로입니다. 파출소 인근을 경유합니다.",
    points: [
      { position: { lat: 37.4979, lng: 127.0276 }, label: "School" },
      { position: { lat: 37.498, lng: 127.0278 } },
      { position: { lat: 37.4978, lng: 127.0272 } },
      { position: { lat: 37.4983, lng: 127.0285 } },
      { position: { lat: 37.4990, lng: 127.030 }, label: "Home" },
    ],
    safetyDetails: gangnamSafeDetails,
    facilityInfluences: buildFacilityInfluences(gangnamSafeFacilities),
  },
  {
    id: "gangnam-route-balanced",
    name: "균형 경로",
    safetyLevel: gangnamBalancedDetails.level,
    score: gangnamBalancedDetails.score,
    distanceKm: 1.2,
    estimatedMinutes: 15,
    explanation: "이동 시간을 단축하면서도 주요 CCTV와 가로등 구간을 유지하는 경로입니다.",
    points: [
      { position: { lat: 37.4979, lng: 127.0276 }, label: "School" },
      { position: { lat: 37.498, lng: 127.0275 } },
      { position: { lat: 37.4977, lng: 127.026 } },
      { position: { lat: 37.4990, lng: 127.030 }, label: "Home" },
    ],
    safetyDetails: gangnamBalancedDetails,
    facilityInfluences: buildFacilityInfluences(gangnamBalancedFacilities),
  },
  {
    id: "gangnam-route-fast",
    name: "빠른 경로",
    safetyLevel: gangnamFastDetails.level,
    score: gangnamFastDetails.score,
    distanceKm: 0.9,
    estimatedMinutes: 11,
    explanation: "가장 빠른 경로로 테헤란로를 직선으로 이동합니다.",
    points: [
      { position: { lat: 37.4979, lng: 127.0276 }, label: "School" },
      { position: { lat: 37.4982, lng: 127.028 } },
      { position: { lat: 37.4990, lng: 127.030 }, label: "Home" },
    ],
    safetyDetails: gangnamFastDetails,
    facilityInfluences: buildFacilityInfluences(gangnamFastFacilities),
  },
];

// ===================== 종로 (school-jongno) =====================
const jongnoFacilities = FACILITIES_BY_AREA["area-jongno"] ?? [];

const jongnoSafeFacilities = jongnoFacilities.filter((f) =>
  ["jongno-sl-1", "jongno-sl-2", "jongno-sl-3", "jongno-cctv-1", "jongno-cctv-2", "jongno-ps-1", "jongno-cw-1", "jongno-eb-1"].includes(f.id),
);
const jongnoBalancedFacilities = jongnoFacilities.filter((f) =>
  ["jongno-sl-1", "jongno-cctv-1", "jongno-ps-1", "jongno-cw-1"].includes(f.id),
);
const jongnoFastFacilities = jongnoFacilities.filter((f) =>
  ["jongno-sl-1", "jongno-dz-1", "jongno-dz-2"].includes(f.id),
);

const jongnoSafeDetails = calculateRouteSafety({ facilities: jongnoSafeFacilities });
const jongnoBalancedDetails = calculateRouteSafety({ facilities: jongnoBalancedFacilities });
const jongnoFastDetails = calculateRouteSafety({ facilities: jongnoFastFacilities, hasUnlitSegment: true });

const JONGNO_ROUTES: RouteOption[] = [
  {
    id: "jongno-route-safe",
    name: "안전 경로",
    safetyLevel: jongnoSafeDetails.level,
    score: jongnoSafeDetails.score,
    distanceKm: 1.5,
    estimatedMinutes: 18,
    explanation: "위험 골목을 피해 가로등과 CCTV가 있는 대로변을 이용하는 안전 경로입니다.",
    points: [
      { position: { lat: 37.5729, lng: 126.9794 }, label: "School" },
      { position: { lat: 37.5732, lng: 126.9798 } },
      { position: { lat: 37.5728, lng: 126.9788 } },
      { position: { lat: 37.5733, lng: 126.9807 } },
      { position: { lat: 37.5740, lng: 126.982 }, label: "Home" },
    ],
    safetyDetails: jongnoSafeDetails,
    facilityInfluences: buildFacilityInfluences(jongnoSafeFacilities),
  },
  {
    id: "jongno-route-balanced",
    name: "균형 경로",
    safetyLevel: jongnoBalancedDetails.level,
    score: jongnoBalancedDetails.score,
    distanceKm: 1.1,
    estimatedMinutes: 14,
    explanation: "파출소와 주요 가로등을 경유하여 적절한 안전성을 유지하는 경로입니다.",
    points: [
      { position: { lat: 37.5729, lng: 126.9794 }, label: "School" },
      { position: { lat: 37.5731, lng: 126.9802 } },
      { position: { lat: 37.5728, lng: 126.9788 } },
      { position: { lat: 37.5740, lng: 126.982 }, label: "Home" },
    ],
    safetyDetails: jongnoBalancedDetails,
    facilityInfluences: buildFacilityInfluences(jongnoBalancedFacilities),
  },
  {
    id: "jongno-route-fast",
    name: "빠른 경로",
    safetyLevel: jongnoFastDetails.level,
    score: jongnoFastDetails.score,
    distanceKm: 0.8,
    estimatedMinutes: 10,
    explanation: "가장 짧지만 북촌 좁은 골목을 통과합니다. 야간에는 권장하지 않습니다.",
    points: [
      { position: { lat: 37.5729, lng: 126.9794 }, label: "School" },
      { position: { lat: 37.5722, lng: 126.9778 } },
      { position: { lat: 37.5740, lng: 126.982 }, label: "Home" },
    ],
    safetyDetails: jongnoFastDetails,
    facilityInfluences: buildFacilityInfluences(jongnoFastFacilities),
  },
];

// ===================== 송파 (school-songpa) =====================
const songpaFacilities = FACILITIES_BY_AREA["area-songpa"] ?? [];

const songpaSafeFacilities = songpaFacilities.filter((f) =>
  ["songpa-sl-1", "songpa-sl-2", "songpa-sl-3", "songpa-sl-4", "songpa-sl-5", "songpa-cctv-1", "songpa-cctv-2", "songpa-ps-1", "songpa-cw-1", "songpa-cw-2", "songpa-eb-1"].includes(f.id),
);
const songpaBalancedFacilities = songpaFacilities.filter((f) =>
  ["songpa-sl-1", "songpa-sl-2", "songpa-sl-3", "songpa-cctv-1", "songpa-ps-1", "songpa-cw-1"].includes(f.id),
);
const songpaSafeDetails = calculateRouteSafety({ facilities: songpaSafeFacilities });
const songpaBalancedDetails = calculateRouteSafety({ facilities: songpaBalancedFacilities });

const SONGPA_ROUTES: RouteOption[] = [
  {
    id: "songpa-route-safe",
    name: "안전 경로",
    safetyLevel: songpaSafeDetails.level,
    score: songpaSafeDetails.score,
    distanceKm: 1.7,
    estimatedMinutes: 21,
    explanation: "신도시 특성상 가로등이 충분히 설치된 안전한 경로입니다. 올림픽공원 인근을 경유합니다.",
    points: [
      { position: { lat: 37.5145, lng: 127.1066 }, label: "School" },
      { position: { lat: 37.5148, lng: 127.107 } },
      { position: { lat: 37.5144, lng: 127.106 } },
      { position: { lat: 37.5152, lng: 127.108 } },
      { position: { lat: 37.516, lng: 127.1095 }, label: "Home" },
    ],
    safetyDetails: songpaSafeDetails,
    facilityInfluences: buildFacilityInfluences(songpaSafeFacilities),
  },
  {
    id: "songpa-route-balanced",
    name: "균형 경로",
    safetyLevel: songpaBalancedDetails.level,
    score: songpaBalancedDetails.score,
    distanceKm: 1.3,
    estimatedMinutes: 16,
    explanation: "파출소와 CCTV를 경유하며 적절한 이동 시간을 유지하는 경로입니다.",
    points: [
      { position: { lat: 37.5145, lng: 127.1066 }, label: "School" },
      { position: { lat: 37.5147, lng: 127.1065 } },
      { position: { lat: 37.5141, lng: 127.1053 } },
      { position: { lat: 37.516, lng: 127.1095 }, label: "Home" },
    ],
    safetyDetails: songpaBalancedDetails,
    facilityInfluences: buildFacilityInfluences(songpaBalancedFacilities),
  },
];

// ===================== 영등포 (school-yeongdeungpo) =====================
const ydpFacilities = FACILITIES_BY_AREA["area-yeongdeungpo"] ?? [];

const ydpSafeFacilities = ydpFacilities.filter((f) =>
  ["ydp-sl-1", "ydp-sl-2", "ydp-sl-3", "ydp-cctv-1", "ydp-cctv-2", "ydp-ps-1", "ydp-cw-1", "ydp-cw-2", "ydp-eb-1"].includes(f.id),
);
const ydpBalancedFacilities = ydpFacilities.filter((f) =>
  ["ydp-sl-1", "ydp-sl-2", "ydp-cctv-1", "ydp-ps-1", "ydp-cw-1"].includes(f.id),
);
const ydpFastFacilities = ydpFacilities.filter((f) =>
  ["ydp-sl-1", "ydp-cctv-1", "ydp-dz-1"].includes(f.id),
);

const ydpSafeDetails = calculateRouteSafety({ facilities: ydpSafeFacilities });
const ydpBalancedDetails = calculateRouteSafety({ facilities: ydpBalancedFacilities });
const ydpFastDetails = calculateRouteSafety({ facilities: ydpFastFacilities, hasUnlitSegment: true });

const YEONGDEUNGPO_ROUTES: RouteOption[] = [
  {
    id: "ydp-route-safe",
    name: "안전 경로",
    safetyLevel: ydpSafeDetails.level,
    score: ydpSafeDetails.score,
    distanceKm: 1.6,
    estimatedMinutes: 20,
    explanation: "시장 뒷골목을 피해 대로변을 이용하는 안전한 경로입니다. 파출소 인근을 경유합니다.",
    points: [
      { position: { lat: 37.5264, lng: 126.8963 }, label: "School" },
      { position: { lat: 37.5267, lng: 126.8967 } },
      { position: { lat: 37.5262, lng: 126.8958 } },
      { position: { lat: 37.527, lng: 126.8975 } },
      { position: { lat: 37.5278, lng: 126.899 }, label: "Home" },
    ],
    safetyDetails: ydpSafeDetails,
    facilityInfluences: buildFacilityInfluences(ydpSafeFacilities),
  },
  {
    id: "ydp-route-balanced",
    name: "균형 경로",
    safetyLevel: ydpBalancedDetails.level,
    score: ydpBalancedDetails.score,
    distanceKm: 1.2,
    estimatedMinutes: 15,
    explanation: "파출소와 주요 가로등을 경유하며 이동 시간도 적절히 단축한 경로입니다.",
    points: [
      { position: { lat: 37.5264, lng: 126.8963 }, label: "School" },
      { position: { lat: 37.5265, lng: 126.8963 } },
      { position: { lat: 37.526, lng: 126.8955 } },
      { position: { lat: 37.5278, lng: 126.899 }, label: "Home" },
    ],
    safetyDetails: ydpBalancedDetails,
    facilityInfluences: buildFacilityInfluences(ydpBalancedFacilities),
  },
  {
    id: "ydp-route-fast",
    name: "빠른 경로",
    safetyLevel: ydpFastDetails.level,
    score: ydpFastDetails.score,
    distanceKm: 0.9,
    estimatedMinutes: 11,
    explanation: "가장 빠르지만 재래시장 뒷골목을 통과합니다. 야간에는 권장하지 않습니다.",
    points: [
      { position: { lat: 37.5264, lng: 126.8963 }, label: "School" },
      { position: { lat: 37.5255, lng: 126.8945 } },
      { position: { lat: 37.5278, lng: 126.899 }, label: "Home" },
    ],
    safetyDetails: ydpFastDetails,
    facilityInfluences: buildFacilityInfluences(ydpFastFacilities),
  },
];

// ===================== 전체 내보내기 =====================
export const ROUTES_BY_SCHOOL: Record<string, RouteOption[]> = {
  "school-1": MAPO_ROUTES,
  "school-gangnam": GANGNAM_ROUTES,
  "school-jongno": JONGNO_ROUTES,
  "school-songpa": SONGPA_ROUTES,
  "school-yeongdeungpo": YEONGDEUNGPO_ROUTES,
};

export const MOCK_ROUTES: RouteOption[] = [
  ...MAPO_ROUTES,
  ...GANGNAM_ROUTES,
  ...JONGNO_ROUTES,
  ...SONGPA_ROUTES,
  ...YEONGDEUNGPO_ROUTES,
];
