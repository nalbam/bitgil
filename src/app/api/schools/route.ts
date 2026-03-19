import { NextResponse } from "next/server";
import { searchSchools } from "@/lib/api/school-csv";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") ?? "";

  const schools = searchSchools(query);

  return NextResponse.json({
    ok: true,
    data: schools,
    total: schools.length,
  });
}
