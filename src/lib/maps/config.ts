import { clientEnv } from "@/lib/env";

export const MAPS_CONFIG = {
  defaultCenter: {
    lat: 37.5665,
    lng: 126.978,
  },
  defaultZoom: 15,
  apiKey: clientEnv.googleMapsApiKey,
  mapId: clientEnv.googleMapsMapId || undefined,
} as const;

export type MapCenter = typeof MAPS_CONFIG.defaultCenter;
