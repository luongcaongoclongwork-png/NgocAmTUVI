import type Database from "better-sqlite3";

/**
 * Additive schema for the admin features added after the original schema
 * block in db.ts (lead workflow, site settings, consultant photos, article
 * cover alt text, hide/show, trash). Called once from db.ts's openDb() on
 * every boot; every step is idempotent and only ever ADDS columns/tables,
 * so it is safe on a fresh database and on any existing one.
 *
 *   hidden      INTEGER 0/1 — "Ẩn": kept in admin, not shown on the site.
 *   deleted_at  TEXT ''/ISO — in the trash since then; purged after 30 days.
 */
export function applySchemaExtras(db: Database.Database): void {
  const addColumn = (table: string, column: string, ddl: string) => {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
    if (!cols.some((c) => c.name === column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
  };

  // Lead workflow (admin batch 2)
  addColumn("contact_leads", "appointment_at", "TEXT NOT NULL DEFAULT ''");
  db.exec(`
    CREATE TABLE IF NOT EXISTS lead_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL REFERENCES contact_leads(id) ON DELETE CASCADE,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON lead_notes(lead_id, created_at);
  `);

  // Site settings: phone, email, social links… editable in /admin/cai-dat
  db.exec(`CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`);

  // Consultant portrait (uploaded image path, '' = none yet)
  addColumn("consultants", "photo", "TEXT NOT NULL DEFAULT ''");

  // Article cover alt text (for screen readers and SEO)
  addColumn("articles", "image_alt", "TEXT NOT NULL DEFAULT ''");

  // Hide/show
  for (const t of ["services", "consultants", "product_categories", "products"]) {
    addColumn(t, "hidden", "INTEGER NOT NULL DEFAULT 0");
  }

  // Trash
  for (const t of ["articles", "services", "consultants", "product_categories", "products", "contact_leads"]) {
    addColumn(t, "deleted_at", "TEXT NOT NULL DEFAULT ''");
  }
}
