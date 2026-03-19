import { NextResponse } from "next/server";
import { MOCK_SCHOOLS } from "@/data/mock/schools";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.toLowerCase() ?? "";

  const filtered = query
    ? MOCK_SCHOOLS.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.address.toLowerCase().includes(query),
      )
    : MOCK_SCHOOLS;

  return NextResponse.json({
    ok: true,
    data: filtered,
    total: filtered.length,
  });
}
