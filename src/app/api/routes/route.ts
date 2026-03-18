import { NextResponse } from "next/server";
import { MOCK_ROUTES } from "@/data/mock/routes";
import { MOCK_ANALYSIS } from "@/data/mock/analyses";

export function GET() {
  return NextResponse.json({
    ok: true,
    data: {
      routes: MOCK_ROUTES,
      recommendedRouteId: MOCK_ANALYSIS.recommendedRouteId,
      analyzedAt: MOCK_ANALYSIS.analyzedAt,
    },
    total: MOCK_ROUTES.length,
  });
}
