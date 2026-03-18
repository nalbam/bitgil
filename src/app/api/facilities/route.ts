import { NextResponse } from "next/server";
import { MOCK_FACILITIES } from "@/data/mock/facilities";

export function GET() {
  return NextResponse.json({
    ok: true,
    data: MOCK_FACILITIES,
    total: MOCK_FACILITIES.length,
  });
}
