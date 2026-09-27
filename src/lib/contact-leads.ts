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

// ---------- Lead management extras: appointment + note history ----------
//
// Columns/tables come from lib/schema-extras.ts (run by db.ts at boot).
// `appointment_at` is a UTC ISO string, '' when there is no appointment.
// `lead_notes` replaces overwriting the single admin_note field: each note
// is kept with its author and time. An old admin_note is still shown.

const leadDb = getDb;

export type LeadNote = { id: number; author: string; body: string; createdAt: string };
export type AdminLead = ContactLead & { appointmentAt: string; noteCount: number };
export type AdminLeadDetail = AdminLead & { notes: LeadNote[] };

type AdminLeadRow = LeadRow & { appointment_at: string; note_count: number };

function rowToAdminLead(row: AdminLeadRow): AdminLead {
  return { ...rowToLead(row), appointmentAt: row.appointment_at, noteCount: row.note_count };
}

const ADMIN_LEAD_SELECT = `
  SELECT l.*, (SELECT COUNT(*) FROM lead_notes n WHERE n.lead_id = l.id) AS note_count
  FROM contact_leads l`;

/** Newest first. Filtering by text happens in the caller (accent-insensitive, see lead-admin.ts). */
export async function listLeadsForAdmin(status?: LeadStatus): Promise<AdminLead[]> {
  const db = leadDb();
  const rows = (
    status
      ? db.prepare(`${ADMIN_LEAD_SELECT} WHERE l.status = ? ORDER BY l.created_at DESC`).all(status)
      : db.prepare(`${ADMIN_LEAD_SELECT} ORDER BY l.created_at DESC`).all()
  ) as AdminLeadRow[];
  return rows.map(rowToAdminLead);
}

export async function countLeadsByStatus(): Promise<Record<LeadStatus, number> & { all: number }> {
  const rows = leadDb().prepare("SELECT status, COUNT(*) AS c FROM contact_leads GROUP BY status").all() as {
    status: LeadStatus;
    c: number;
  }[];
  const counts = { new: 0, contacted: 0, discussing: 0, booked: 0, closed: 0, all: 0 };
  for (const r of rows) {
    counts[r.status] = r.c;
    counts.all += r.c;
  }
  return counts;
}

/** Appointments from now until `days` ahead, soonest first (closed leads excluded). */
export async function getUpcomingAppointments(days = 14): Promise<AdminLead[]> {
  const now = new Date();
  const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const rows = leadDb()
    .prepare(
      `${ADMIN_LEAD_SELECT} WHERE l.appointment_at != '' AND l.appointment_at >= ? AND l.appointment_at <= ?
       AND l.status != 'closed' ORDER BY l.appointment_at ASC`
    )
    .all(now.toISOString(), until.toISOString()) as AdminLeadRow[];
  return rows.map(rowToAdminLead);
}

export async function getLeadDetailForAdmin(id: number): Promise<AdminLeadDetail | null> {
  const db = leadDb();
  const row = db.prepare(`${ADMIN_LEAD_SELECT} WHERE l.id = ?`).get(id) as AdminLeadRow | undefined;
  if (!row) return null;
  const notes = (
    db.prepare("SELECT id, author, body, created_at FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC, id DESC").all(id) as {
      id: number;
      author: string;
      body: string;
      created_at: string;
    }[]
  ).map((n) => ({ id: n.id, author: n.author, body: n.body, createdAt: n.created_at }));
  return { ...rowToAdminLead(row), notes };
}

/** Every note grouped by lead id (oldest first), for the CSV export. */
export async function getAllLeadNotes(): Promise<Map<number, LeadNote[]>> {
  const rows = leadDb().prepare("SELECT id, lead_id, author, body, created_at FROM lead_notes ORDER BY created_at ASC, id ASC").all() as {
    id: number;
    lead_id: number;
    author: string;
    body: string;
    created_at: string;
  }[];
  const map = new Map<number, LeadNote[]>();
  for (const r of rows) {
    const list = map.get(r.lead_id) ?? [];
    list.push({ id: r.id, author: r.author, body: r.body, createdAt: r.created_at });
    map.set(r.lead_id, list);
  }
  return map;
}

export async function setLeadStatus(id: number, status: LeadStatus): Promise<void> {
  leadDb()
    .prepare("UPDATE contact_leads SET status = ?, updated_at = ? WHERE id = ?")
    .run(status, new Date().toISOString(), id);
}

/**
 * Sets (or clears, with null) the appointment. Setting one also moves a
 * lead that is still new / contacted / discussing to "booked", which is
 * what the admin means by entering a date.
 */
export async function setLeadAppointment(id: number, appointmentAt: string | null): Promise<void> {
  const now = new Date().toISOString();
  const db = leadDb();
  if (appointmentAt) {
    db.prepare(
      `UPDATE contact_leads SET appointment_at = ?, updated_at = ?,
         status = CASE WHEN status IN ('new', 'contacted', 'discussing') THEN 'booked' ELSE status END
       WHERE id = ?`
    ).run(appointmentAt, now, id);
  } else {
    db.prepare("UPDATE contact_leads SET appointment_at = '', updated_at = ? WHERE id = ?").run(now, id);
  }
}

export async function addLeadNote(leadId: number, author: string, body: string): Promise<void> {
  const now = new Date().toISOString();
  const db = leadDb();
  db.prepare("INSERT INTO lead_notes (lead_id, author, body, created_at) VALUES (?, ?, ?, ?)").run(leadId, author, body, now);
  db.prepare("UPDATE contact_leads SET updated_at = ? WHERE id = ?").run(now, leadId);
}

/** Permanently deletes a lead (spam / test entries) and its notes. */
export async function deleteLead(id: number): Promise<void> {
  const db = leadDb();
  db.transaction(() => {
    db.prepare("DELETE FROM lead_notes WHERE lead_id = ?").run(id);
    db.prepare("DELETE FROM contact_leads WHERE id = ?").run(id);
  })();
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
