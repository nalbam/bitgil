import { NextResponse } from "next/server";
import { isDynamoDbConfigured } from "@/lib/env";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "bitgil",
    timestamp: new Date().toISOString(),
    db: isDynamoDbConfigured() ? "dynamodb" : "mock",
  });
}
