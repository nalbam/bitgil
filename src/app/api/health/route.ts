import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "bitgil",
    timestamp: new Date().toISOString(),
  });
}
