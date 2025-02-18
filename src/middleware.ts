// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// in-memory rate limiting
const rateLimit = {
  requestCount: {} as Record<string, { count: number; timestamp: number }>,

  check: (ip: string): boolean => {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 100; // max requests per windown

    if (!rateLimit.requestCount[ip]) {
      rateLimit.requestCount[ip] = { count: 1, timestamp: now };
      return true;
    }

    const { count, timestamp } = rateLimit.requestCount[ip];

    //reset if outside window
    if (now - timestamp > windowMs) {
      rateLimit.requestCount[ip] = { count: 1, timestamp: now };
      return true;
    }

    // increment and check
    rateLimit.requestCount[ip].count += 1;
    return count <= maxRequests;
  },
};

export function middleware(request: NextRequest) {
  // make it only apply to /api routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const ip = request.headers.get("x-forwarded-for") || "unknown";

  if (!rateLimit.check(ip)) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.next();
}
