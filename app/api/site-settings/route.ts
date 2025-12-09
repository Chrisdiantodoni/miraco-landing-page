import { NextRequest, NextResponse } from "next/server";
import { fetchSiteData } from "@/lib/api/settings";

// Cache di memory (in-production, gunakan Redis)
let cachedData: unknown = null;
let cacheTime: number = 0;
const CACHE_DURATION = 3600 * 1000; // 1 jam

export async function GET(request: NextRequest) {
  try {
    // Check in-memory cache
    const now = Date.now();
    if (cachedData && now - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedData, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      });
    }

    // Fetch dari Laravel
    const data = await fetchSiteData();

    // Cache di memory
    cachedData = data;
    cacheTime = now;

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
