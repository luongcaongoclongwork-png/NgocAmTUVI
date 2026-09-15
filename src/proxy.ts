import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/session-constants";

/**
 * Optimistic outer gate for /admin — redirects on page loads only. This is
 * NOT the real security boundary: per Next.js's own docs, a Server Action is
 * a POST to the page that defines it, so a proxy matcher gap silently skips
 * protecting the action too. Every mutating Server Action re-checks
 * verifySession() itself (see src/lib/auth.ts) regardless of this file.
 */
function secretKey(): Uint8Array {
  return new TextEncoder().encode(process.env.SESSION_SECRET);
}

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = await hasValidSession(request);

  if (pathname === "/admin/login") {
    return authed ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }

  if (!authed) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
