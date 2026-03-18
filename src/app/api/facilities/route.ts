import { NextResponse } from "next/server";
import { listFacilitiesByArea } from "@/server/repositories/facility-repository";
import { DEFAULT_AREA } from "@/data/mock/areas";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const areaId = searchParams.get("areaId") ?? DEFAULT_AREA.id;

  const facilities = await listFacilitiesByArea(areaId);

  return NextResponse.json({
    ok: true,
    data: facilities,
    total: facilities.length,
  });
}
