import { NextResponse } from "next/server";
import { getAllStreetlights, getStreetlightsNear } from "@/lib/api/streetlight-csv";
import { getAllCctv } from "@/lib/api/cctv-csv";
import { getAllPoliceStations } from "@/lib/api/police-station-csv";
import { getAllDangerZones } from "@/lib/api/danger-zone-csv";
import { findAreaById } from "@/data/mock/areas";
import type { NextRequest } from "next/server";

const OSAN_CENTER = { lat: 37.15, lng: 127.068 };

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type");

  if (type === "streetlight") {
    const areaId = searchParams.get("areaId");

    // If areaId specified, return area-scoped results
    if (areaId) {
      const area = findAreaById(areaId);
      const center = area?.center ?? OSAN_CENTER;
      const radius = area?.radiusKm ?? 3;
      const data = getStreetlightsNear(center.lat, center.lng, radius);
      return NextResponse.json({ ok: true, data, total: data.length });
    }

    // Return all streetlights
    const data = getAllStreetlights();
    return NextResponse.json({ ok: true, data, total: data.length });
  }

  if (type === "cctv") {
    const data = getAllCctv();
    return NextResponse.json({ ok: true, data, total: data.length });
  }

  if (type === "police_station") {
    const data = getAllPoliceStations();
    return NextResponse.json({ ok: true, data, total: data.length });
  }

  if (type === "danger") {
    const data = getAllDangerZones();
    return NextResponse.json({ ok: true, data, total: data.length });
  }

  return NextResponse.json({ ok: true, data: [], total: 0 });
}
