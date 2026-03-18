import type { DomainFacility } from "@/domain/entities/facility";

export const MOCK_FACILITIES: DomainFacility[] = [
  { id: "sl-1", type: "streetlight", name: "Streetlight A", position: { lat: 37.5548, lng: 126.924 } },
  { id: "sl-2", type: "streetlight", name: "Streetlight B", position: { lat: 37.5551, lng: 126.9225 } },
  { id: "sl-3", type: "streetlight", name: "Streetlight C", position: { lat: 37.5558, lng: 126.921 } },
  { id: "sl-4", type: "streetlight", name: "Streetlight D", position: { lat: 37.5562, lng: 126.9198 } },
  { id: "cctv-1", type: "cctv", name: "CCTV Camera 1", position: { lat: 37.5549, lng: 126.9235 }, description: "Municipal CCTV at intersection" },
  { id: "cctv-2", type: "cctv", name: "CCTV Camera 2", position: { lat: 37.5555, lng: 126.922 }, description: "Convenience store CCTV" },
  { id: "cctv-3", type: "cctv", name: "CCTV Camera 3", position: { lat: 37.556, lng: 126.9205 } },
  { id: "ps-1", type: "police_station", name: "Mapo Police Box", position: { lat: 37.5553, lng: 126.9228 }, description: "24-hour police substation" },
  { id: "cw-1", type: "crosswalk", name: "Crosswalk at Main St", position: { lat: 37.555, lng: 126.9232 } },
  { id: "cw-2", type: "crosswalk", name: "Crosswalk at School Gate", position: { lat: 37.5546, lng: 126.9232 } },
  { id: "dz-1", type: "danger", name: "Dimly Lit Alley", position: { lat: 37.5543, lng: 126.9215 }, description: "Poorly lit narrow alley with limited visibility" },
  { id: "eb-1", type: "emergency_bell", name: "Emergency Bell Station", position: { lat: 37.5557, lng: 126.9218 }, description: "Direct line to police" },
];

export const SAFE_ROUTE_FACILITIES = MOCK_FACILITIES.filter((f) =>
  ["sl-1", "sl-2", "sl-3", "sl-4", "cctv-1", "cctv-2", "cctv-3", "ps-1", "cw-1", "cw-2", "eb-1"].includes(f.id),
);

export const BALANCED_ROUTE_FACILITIES = MOCK_FACILITIES.filter((f) =>
  ["sl-1", "sl-2", "cctv-1", "cctv-2", "ps-1", "cw-1"].includes(f.id),
);

export const FASTEST_ROUTE_FACILITIES = MOCK_FACILITIES.filter((f) =>
  ["sl-1", "cctv-1", "dz-1"].includes(f.id),
);
