import { clientEnv } from "@/lib/env";

export const MAPS_CONFIG = {
  defaultCenter: {
    lat: 37.5665,
    lng: 126.978,
  },
  defaultZoom: 14,
  apiKey: clientEnv.googleMapsApiKey,
} as const;

export type MapCenter = typeof MAPS_CONFIG.defaultCenter;
