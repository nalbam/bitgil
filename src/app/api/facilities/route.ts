import { NextResponse } from "next/server";
import { getStreetlightsNear } from "@/lib/api/streetlight-csv";
import { findAreaById } from "@/data/mock/areas";
import { DEFAULT_AREA } from "@/data/mock/areas";
import type { NextRequest } from "next/server";

// Osan center for default streetlight query
const OSAN_CENTER = { lat: 37.15, lng: 127.068 };
const DEFAULT_RADIUS_KM = 3;
const DEFAULT_LIMIT = 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const areaId = searchParams.get("areaId") ?? DEFAULT_AREA.id;
  const type = searchParams.get("type");
  const limit = parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);

  // For streetlight type, use real CSV data
  if (type === "streetlight") {
    const area = findAreaById(areaId);
    const center = area?.center ?? OSAN_CENTER;
    const radius = area?.radiusKm ?? DEFAULT_RADIUS_KM;
    const streetlights = getStreetlightsNear(center.lat, center.lng, radius, limit);

    return NextResponse.json({
      ok: true,
      data: streetlights,
      total: streetlights.length,
    });
  }

  // For other types, return empty (to be implemented later)
  return NextResponse.json({
    ok: true,
    data: [],
    total: 0,
  });
}
