import "server-only";
import { getDb } from "@/lib/db";
import { deleteUploadedImage } from "@/lib/uploads";

/**
 * One place for the admin list mechanics shared by several content types:
 * hide/show, reorder and the trash. Table and column names only ever come
 * from this fixed map (never from input), so the dynamic SQL is safe.
 *
 * Columns come from lib/schema-extras.ts: `hidden` (0/1) and `deleted_at`
 * ('' or ISO time it was moved to the trash).
 */

export type EntityKey = "article" | "service" | "consultant" | "category" | "product" | "lead";

type EntityDef = {
  table: string;
  label: string;
  nameCol: string;
  hideable: boolean;
  sortable: boolean;
  /** Items are ordered within this column's value (services per group, products per category). */
  scopeCol: string | null;
  /** Uploaded image columns whose files are deleted when the item is purged. */
  imageCols: string[];
  revalidate: string[];
  editPath: (id: number) => string;
};

export const ENTITIES: Record<EntityKey, EntityDef> = {
  article: {
    table: "articles",
    label: "Bài viết",
    nameCol: "title",
    hideable: false, // articles already have Nháp / Đã đăng
    sortable: false, // newest first
    scopeCol: null,
    imageCols: ["image"],
    revalidate: ["/admin", "/admin/bai-viet", "/kien-thuc", "/"],
    editPath: (id) => `/admin/bai-viet/${id}`,
  },
  service: {
    table: "services",
    label: "Dịch vụ",
    nameCol: "title",
    hideable: true,
    sortable: true,
    scopeCol: "group_id",
    imageCols: [],
    revalidate: ["/admin/dich-vu", "/", "/tu-vi", "/phong-thuy", "/dai-chu-su", "/dich-vu"],
    editPath: (id) => `/admin/dich-vu/${id}`,
  },
  consultant: {
    table: "consultants",
    label: "Tư vấn viên",
    nameCol: "name",
    hideable: true,
    sortable: true,
    scopeCol: null,
    imageCols: ["photo"],
    revalidate: ["/admin/tu-van-vien", "/", "/ve-ngoc-am", "/tu-vi", "/phong-thuy"],
    editPath: (id) => `/admin/tu-van-vien/${id}`,
  },
  category: {
    table: "product_categories",
    label: "Danh mục sản phẩm",
    nameCol: "name",
    hideable: true,
    sortable: true,
    scopeCol: null,
    imageCols: ["image"],
    revalidate: ["/admin/san-pham", "/", "/cua-hang"],
    editPath: (id) => `/admin/san-pham/danh-muc/${id}`,
  },
  product: {
    table: "products",
    label: "Sản phẩm",
    nameCol: "name",
    hideable: true,
    sortable: true,
    scopeCol: "category_id",
    imageCols: [],
    revalidate: ["/admin/san-pham", "/", "/cua-hang"],
    editPath: (id) => `/admin/san-pham/mon/${id}`,
  },
  lead: {
    table: "contact_leads",
    label: "Khách liên hệ",
    nameCol: "name",
    hideable: false,
    sortable: false,
    scopeCol: null,
    imageCols: [],
    revalidate: ["/admin", "/admin/lien-he"],
    editPath: (id) => `/admin/lien-he/${id}`,
  },
};

export const TRASH_DAYS = 30;

export function isEntityKey(value: unknown): value is EntityKey {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(ENTITIES, value);
}

/** SQL fragment for public reads: not hidden (where applicable) and not in the trash. */
export function visibleSql(key: EntityKey, alias = ""): string {
  const p = alias ? `${alias}.` : "";
  return ENTITIES[key].hideable ? `${p}hidden = 0 AND ${p}deleted_at = ''` : `${p}deleted_at = ''`;
}

/** Ids currently hidden, for the admin lists' "Đang ẩn" badges. */
export function getHiddenIds(key: EntityKey): Set<number> {
  const { table, hideable } = ENTITIES[key];
  if (!hideable) return new Set();
  const rows = getDb().prepare(`SELECT id FROM ${table} WHERE hidden = 1 AND deleted_at = ''`).all() as { id: number }[];
  return new Set(rows.map((r) => r.id));
}

export function setHidden(key: EntityKey, id: number, hidden: boolean): void {
  if (!ENTITIES[key].hideable) throw new Error("Không thể ẩn mục này.");
  getDb().prepare(`UPDATE ${ENTITIES[key].table} SET hidden = ? WHERE id = ?`).run(hidden ? 1 : 0, id);
}

/**
 * Saves a new order: `ids` is the complete list for one scope (e.g. all Tử
 * Vi services) in the order the admin arranged them. Rejects lists that mix
 * scopes, include trashed/unknown ids or leave items out, so a stale screen
 * can never scramble the order.
 */
export function reorder(key: EntityKey, ids: number[]): void {
  const { table, sortable, scopeCol } = ENTITIES[key];
  if (!sortable) throw new Error("Mục này không sắp xếp được.");
  if (ids.length === 0 || new Set(ids).size !== ids.length) throw new Error("Danh sách sắp xếp không hợp lệ.");
  const db = getDb();
  const rows = db
    .prepare(`SELECT id${scopeCol ? `, ${scopeCol} AS scope` : ""} FROM ${table} WHERE id IN (${ids.map(() => "?").join(",")}) AND deleted_at = ''`)
    .all(...ids) as { id: number; scope?: string | number }[];
  if (rows.length !== ids.length) throw new Error("Danh sách đã thay đổi, vui lòng tải lại trang.");
  if (scopeCol) {
    const scopes = new Set(rows.map((r) => String(r.scope)));
    if (scopes.size !== 1) throw new Error("Không thể sắp xếp lẫn giữa các nhóm.");
    const total = (db.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE ${scopeCol} = ? AND deleted_at = ''`).get(rows[0].scope) as { n: number }).n;
    if (total !== ids.length) throw new Error("Danh sách đã thay đổi, vui lòng tải lại trang.");
  } else {
    const total = (db.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE deleted_at = ''`).get() as { n: number }).n;
    if (total !== ids.length) throw new Error("Danh sách đã thay đổi, vui lòng tải lại trang.");
  }
  const update = db.prepare(`UPDATE ${table} SET sort_order = ? WHERE id = ?`);
  db.transaction(() => ids.forEach((id, i) => update.run((i + 1) * 10, id)))();
}

export function moveToTrash(key: EntityKey, id: number): void {
  getDb().prepare(`UPDATE ${ENTITIES[key].table} SET deleted_at = ? WHERE id = ? AND deleted_at = ''`).run(new Date().toISOString(), id);
}

export function restoreFromTrash(key: EntityKey, id: number): void {
  getDb().prepare(`UPDATE ${ENTITIES[key].table} SET deleted_at = '' WHERE id = ?`).run(id);
}

/** Permanent delete of a trashed item, including its uploaded images (and a lead's notes / a category's products). */
export async function purge(key: EntityKey, id: number): Promise<void> {
  const { table, imageCols } = ENTITIES[key];
  const db = getDb();
  const row = db.prepare(`SELECT * FROM ${table} WHERE id = ? AND deleted_at != ''`).get(id) as Record<string, unknown> | undefined;
  if (!row) return; // only ever purge what is actually in the trash
  db.transaction(() => {
    if (key === "lead") db.prepare("DELETE FROM lead_notes WHERE lead_id = ?").run(id);
    if (key === "category") db.prepare("DELETE FROM products WHERE category_id = ?").run(id);
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  })();
  for (const col of imageCols) {
    const path = row[col];
    if (typeof path === "string" && path) await deleteUploadedImage(path);
  }
}

export type TrashItem = { key: EntityKey; label: string; id: number; name: string; deletedAt: string; daysLeft: number };

export function listTrash(): TrashItem[] {
  const db = getDb();
  const now = Date.now();
  const items: TrashItem[] = [];
  for (const key of Object.keys(ENTITIES) as EntityKey[]) {
    const { table, nameCol, label } = ENTITIES[key];
    const rows = db.prepare(`SELECT id, ${nameCol} AS name, deleted_at FROM ${table} WHERE deleted_at != ''`).all() as {
      id: number;
      name: string;
      deleted_at: string;
    }[];
    for (const r of rows) {
      const age = (now - new Date(r.deleted_at).getTime()) / 86_400_000;
      items.push({ key, label, id: r.id, name: r.name, deletedAt: r.deleted_at, daysLeft: Math.max(0, Math.ceil(TRASH_DAYS - age)) });
    }
  }
  return items.sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));
}

export function countTrash(): number {
  const db = getDb();
  return (Object.keys(ENTITIES) as EntityKey[]).reduce(
    (n, key) => n + (db.prepare(`SELECT COUNT(*) AS n FROM ${ENTITIES[key].table} WHERE deleted_at != ''`).get() as { n: number }).n,
    0
  );
}

/** Purges everything that has been in the trash longer than TRASH_DAYS. */
export async function purgeExpired(): Promise<number> {
  const cutoff = new Date(Date.now() - TRASH_DAYS * 86_400_000).toISOString();
  const expired = listTrash().filter((t) => t.deletedAt < cutoff);
  for (const t of expired) await purge(t.key, t.id);
  return expired.length;
}
