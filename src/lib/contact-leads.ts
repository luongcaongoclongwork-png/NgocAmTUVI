import "server-only";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import {
  validateLeadInput,
  type ContactLead,
  type LeadFormInput,
  type LeadStatus,
} from "@/lib/contact-leads-constants";

type LeadRow = {
  id: number;
  name: string;
  phone: string;
  interest: string;
  message: string;
  consent: number;
  status: string;
  admin_note: string;
  created_at: string;
  updated_at: string;
};

function rowToLead(row: LeadRow): ContactLead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    interest: row.interest,
    message: row.message,
    consent: row.consent === 1,
    status: row.status as LeadStatus,
    adminNote: row.admin_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------- Admin reads/writes (always called from a session-verified caller) ----------

export async function getAllLeadsForAdmin(): Promise<ContactLead[]> {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM contact_leads ORDER BY created_at DESC").all() as LeadRow[];
  return rows.map(rowToLead);
}

export async function getLeadByIdForAdmin(id: number): Promise<ContactLead | null> {
  const db = getDb();
  const row = db.prepare("SELECT * FROM contact_leads WHERE id = ?").get(id) as LeadRow | undefined;
  return row ? rowToLead(row) : null;
}

export async function updateLeadStatus(
  id: number,
  status: LeadStatus,
  adminNote: string
): Promise<ContactLead> {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE contact_leads SET status = @status, admin_note = @adminNote, updated_at = @now WHERE id = @id`
  ).run({ status, adminNote, now, id });
  const lead = await getLeadByIdForAdmin(id);
  if (!lead) throw new Error("Không tìm thấy yêu cầu này.");
  return lead;
}

// ---------- Public create path ----------

export type CreateLeadResult = { ok: true; lead: ContactLead } | { ok: false; error: string };

/** Validates and inserts — no rate limiting, no header/IP access. Kept
 * separate from createLeadPublic() below so it can be unit tested directly
 * (next/headers' headers() throws outside an actual request scope). */
export async function createLead(input: LeadFormInput): Promise<CreateLeadResult> {
  const validation = validateLeadInput(input);
  if (!validation.ok) return validation;

  const db = getDb();
  const now = new Date().toISOString();
  const info = db
    .prepare(
      `INSERT INTO contact_leads (name, phone, interest, message, consent, status, admin_note, created_at, updated_at)
       VALUES (@name, @phone, @interest, @message, 1, 'new', '', @now, @now)`
    )
    .run({ ...validation.data, now });

  const lead = await getLeadByIdForAdmin(Number(info.lastInsertRowid));
  if (!lead) return { ok: false, error: "Không thể lưu yêu cầu, vui lòng thử lại." };
  return { ok: true, lead };
}

// ---------- In-memory per-IP rate limit (mirrors src/lib/auth.ts's login
// lockout — resets on server restart, single-instance only, acceptable at
// this scale) ----------

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_SUBMISSIONS = 3;
const submissionLog = new Map<string, number[]>();

async function requestKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
}

async function isRateLimited(): Promise<boolean> {
  const key = await requestKey();
  const now = Date.now();
  const recent = (submissionLog.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
    submissionLog.set(key, recent);
    return true;
  }
  recent.push(now);
  submissionLog.set(key, recent);
  return false;
}

/** The real entry point for the public /lien-he form. */
export async function createLeadPublic(input: LeadFormInput): Promise<CreateLeadResult> {
  if (await isRateLimited()) {
    return { ok: false, error: "Bạn vừa gửi yêu cầu. Vui lòng chờ ít phút rồi thử lại." };
  }
  return createLead(input);
}
