import "server-only";
import { getDb } from "@/lib/db";
import { toSlug } from "@/lib/articles";
import { ROLE_TAGLINE, type Consultant, type ConsultantInput } from "@/lib/consultant-constants";

export { ROLE_TAGLINE };
export type { Consultant, ConsultantInput };

type ConsultantRow = {
  id: number;
  slug: string;
  name: string;
  field: string;
  initials: string;
  bio: string;
  sort_order: number;
};

function rowToConsultant(row: ConsultantRow): Consultant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    field: row.field,
    initials: row.initials,
    bio: row.bio,
    sortOrder: row.sort_order,
  };
}

function uniqueSlug(db: ReturnType<typeof getDb>, base: string, excludeId?: number): string {
  let candidate = base || "tu-van-vien";
  let n = 2;
  const exists = db.prepare(
    excludeId ? "SELECT 1 FROM consultants WHERE slug = ? AND id != ?" : "SELECT 1 FROM consultants WHERE slug = ?"
  );
  while (excludeId ? exists.get(candidate, excludeId) : exists.get(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

// ---------- Public reads ----------

export async function getConsultants(): Promise<Consultant[]> {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM consultants ORDER BY sort_order ASC, id ASC").all() as ConsultantRow[];
  return rows.map(rowToConsultant);
}

export async function getConsultantBySlug(slug: string): Promise<Consultant | null> {
  const db = getDb();
  const row = db.prepare("SELECT * FROM consultants WHERE slug = ?").get(slug) as ConsultantRow | undefined;
  return row ? rowToConsultant(row) : null;
}

// ---------- Admin reads (used only behind a verified session) ----------

export async function getConsultantByIdForAdmin(id: number): Promise<Consultant | null> {
  const db = getDb();
  const row = db.prepare("SELECT * FROM consultants WHERE id = ?").get(id) as ConsultantRow | undefined;
  return row ? rowToConsultant(row) : null;
}

// ---------- Writes (always called from a session-verified Server Action) ----------

export async function createConsultant(input: ConsultantInput): Promise<Consultant> {
  const db = getDb();
  const slug = uniqueSlug(db, toSlug(input.slug || input.name));
  const info = db
    .prepare(
      `INSERT INTO consultants (slug, name, field, initials, bio, sort_order)
       VALUES (@slug, @name, @field, @initials, @bio, @sortOrder)`
    )
    .run({ ...input, slug });
  const consultant = await getConsultantByIdForAdmin(Number(info.lastInsertRowid));
  if (!consultant) throw new Error("Không thể tạo tư vấn viên.");
  return consultant;
}

/** Slug is treated as immutable once created (see articles.ts's same rule)
 * so any anchor/link depending on it never breaks under an editor's feet. */
export async function updateConsultant(id: number, input: Omit<ConsultantInput, "slug">): Promise<Consultant> {
  const db = getDb();
  db.prepare(
    `UPDATE consultants SET name = @name, field = @field, initials = @initials,
       bio = @bio, sort_order = @sortOrder WHERE id = @id`
  ).run({ ...input, id });
  const consultant = await getConsultantByIdForAdmin(id);
  if (!consultant) throw new Error("Không tìm thấy tư vấn viên để cập nhật.");
  return consultant;
}

export async function deleteConsultant(id: number): Promise<Consultant | null> {
  const consultant = await getConsultantByIdForAdmin(id);
  if (!consultant) return null;
  getDb().prepare("DELETE FROM consultants WHERE id = ?").run(id);
  return consultant;
}
