import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getDb, scryptHash } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/session-constants";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET chưa được đặt trong .env.local.");
  }
  return new TextEncoder().encode(secret);
}

export type SessionUser = { userId: number; username: string };

type UserRow = { id: number; username: string; password_hash: string };

/** `stored` is "salt:hash" (see db.ts's hashPassword). Both sides of the
 * comparison are fixed-length HMAC-style digests (scrypt output), so
 * timingSafeEqual is safe here — never compare raw variable-length
 * strings/passwords with it (it throws on length mismatch). */
function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = Buffer.from(scryptHash(password, salt), "hex");
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

// ---------- Brute-force lockout (in-memory — resets on server restart,
// single-instance only; acceptable at this scale, see plan) ----------

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes
const attempts = new Map<string, { count: number; lockedUntil: number | null }>();

async function requestKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
}

export async function isLoginLocked(): Promise<{ locked: boolean; retryInSeconds: number }> {
  const key = await requestKey();
  const entry = attempts.get(key);
  if (entry?.lockedUntil && entry.lockedUntil > Date.now()) {
    return { locked: true, retryInSeconds: Math.ceil((entry.lockedUntil - Date.now()) / 1000) };
  }
  return { locked: false, retryInSeconds: 0 };
}

async function recordFailedLogin() {
  const key = await requestKey();
  const entry = attempts.get(key) ?? { count: 0, lockedUntil: null };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
    entry.count = 0;
  }
  attempts.set(key, entry);
}

async function clearFailedLogins() {
  attempts.delete(await requestKey());
}

// ---------- Session cookie (jose JWT, per Next.js's own auth guide) ----------

async function encryptSession(payload: SessionUser & { expiresAt: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

async function decryptSession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (typeof payload.userId !== "number" || typeof payload.username !== "string") return null;
    return { userId: payload.userId, username: payload.username };
  } catch {
    return null;
  }
}

export async function createSession(user: SessionUser) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await encryptSession({ ...user, expiresAt: expiresAt.toISOString() });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** The real authorization boundary — must be called inside every mutating
 * Server Action (create/update/delete/upload), not just relied on via
 * src/proxy.ts's redirect (see plan: a proxy matcher gap silently skips
 * protecting a Server Action, so each action re-checks for itself). */
export async function verifySession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return decryptSession(token);
}

export async function login(username: string, password: string): Promise<SessionUser | null> {
  const { locked } = await isLoginLocked();
  if (locked) return null;

  const row = getDb().prepare("SELECT id, username, password_hash FROM users WHERE username = ?").get(username) as
    | UserRow
    | undefined;

  if (!row || !verifyPassword(password, row.password_hash)) {
    await recordFailedLogin();
    return null;
  }

  await clearFailedLogins();
  const user: SessionUser = { userId: row.id, username: row.username };
  await createSession(user);
  return user;
}
