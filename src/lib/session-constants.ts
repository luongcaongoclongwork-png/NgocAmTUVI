/**
 * The session cookie's name — kept in its own tiny module (no Node APIs, no
 * `next/headers`) so it can be imported from BOTH src/lib/auth.ts (Server
 * Component/Action context, uses `next/headers`) and src/proxy.ts (Proxy
 * context, uses `NextRequest.cookies` instead — the two APIs aren't
 * interchangeable, so proxy.ts can't just import auth.ts's helpers).
 */
export const SESSION_COOKIE = "ngocam_admin_session";
