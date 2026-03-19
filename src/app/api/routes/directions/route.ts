import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getDirectionsWithSafety,
  DirectionsError,
} from "@/server/services/directions-service";

const requestCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 30;

const responseCache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function cacheKey(originLat: number, originLng: number, destLat: number, destLng: number): string {
  const round = (n: number) => Math.round(n * 2000) / 2000;
  return `${round(originLat)},${round(originLng)}-${round(destLat)},${round(destLng)}`;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS_PER_MINUTE;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 },
    );
  }

  let body: {
    origin?: { lat?: number; lng?: number };
    destination?: { lat?: number; lng?: number };
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "잘못된 요청 형식입니다" }, { status: 400 });
  }

  const { origin, destination } = body;

  if (
    !origin?.lat ||
    !origin?.lng ||
    !destination?.lat ||
    !destination?.lng ||
    Math.abs(origin.lat) > 90 ||
    Math.abs(destination.lat) > 90 ||
    Math.abs(origin.lng) > 180 ||
    Math.abs(destination.lng) > 180
  ) {
    return NextResponse.json({ ok: false, error: "유효하지 않은 좌표입니다" }, { status: 400 });
  }

  if (origin.lat === destination.lat && origin.lng === destination.lng) {
    return NextResponse.json(
      { ok: false, error: "출발지와 도착지가 같습니다" },
      { status: 400 },
    );
  }

  const key = cacheKey(origin.lat, origin.lng, destination.lat, destination.lng);
  const cached = responseCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json({ ok: true, data: cached.data });
  }

  try {
    const result = await getDirectionsWithSafety({
      origin: { lat: origin.lat, lng: origin.lng },
      destination: { lat: destination.lat, lng: destination.lng },
    });

    responseCache.set(key, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });

    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    if (err instanceof DirectionsError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
    }
    console.error("Directions API error:", err);
    return NextResponse.json(
      { ok: false, error: "경로 서비스를 일시적으로 사용할 수 없습니다" },
      { status: 500 },
    );
  }
}
