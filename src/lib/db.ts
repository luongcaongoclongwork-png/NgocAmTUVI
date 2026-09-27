import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Database from "better-sqlite3";
import { seedArticles } from "@/data/seed-articles";
import { seedServices } from "@/data/seed-services";
import { seedConsultants } from "@/data/seed-consultants";
import { seedProductCategories } from "@/data/seed-products";
import { applySchemaExtras } from "@/lib/schema-extras";

const DB_PATH = path.join(process.cwd(), "data", "articles.db");

function scryptHash(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${scryptHash(password, salt)}`;
}

function openDb(): Database.Database {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      read_time TEXT NOT NULL,
      image TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      author_id INTEGER REFERENCES users(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id TEXT NOT NULL CHECK (group_id IN ('tu-vi', 'phong-thuy', 'dai-chu-su')),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price TEXT NOT NULL,
      duration TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS consultants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      field TEXT NOT NULL,
      initials TEXT NOT NULL,
      bio TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      interest TEXT NOT NULL,
      message TEXT NOT NULL,
      consent INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'contacted', 'discussing', 'booked', 'closed')),
      admin_note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      intro TEXT NOT NULL,
      image TEXT,
      image_alt TEXT,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );
  `);

  migrateServicesColumns(db);
  widenServiceGroups(db);
  seedIfEmpty(db);
  seedServicesIfEmpty(db);
  seedConsultantsIfEmpty(db);
  seedProductsIfEmpty(db);
  applySchemaExtras(db);
  migrateToXuyenVanMenu(db);
  return db;
}

/** `CREATE TABLE IF NOT EXISTS` above never retrofits columns onto a table
 * that already existed before `duration`/`note` were added — needed for any
 * dev DB created before this migration. Safe to run on every boot. */
function migrateServicesColumns(db: Database.Database) {
  const columns = db.prepare("PRAGMA table_info(services)").all() as { name: string }[];
  const names = new Set(columns.map((c) => c.name));
  if (!names.has("duration")) {
    db.exec("ALTER TABLE services ADD COLUMN duration TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("note")) {
    db.exec("ALTER TABLE services ADD COLUMN note TEXT NOT NULL DEFAULT ''");
  }
}

/**
 * Databases created before the "Đại Chủ Sự" group have a CHECK constraint
 * that only allows 'tu-vi' / 'phong-thuy'. SQLite cannot alter a CHECK, so
 * the table is rebuilt once with the same columns and rows (ids kept).
 */
function widenServiceGroups(db: Database.Database) {
  const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'services'").get() as
    | { sql: string }
    | undefined;
  if (!row || row.sql.includes("'dai-chu-su'")) return;
  const newSql = row.sql
    .replace("CHECK (group_id IN ('tu-vi', 'phong-thuy'))", "CHECK (group_id IN ('tu-vi', 'phong-thuy', 'dai-chu-su'))")
    .replace(/CREATE TABLE\s+"?services"?/, "CREATE TABLE services_new");
  if (!newSql.includes("'dai-chu-su'")) throw new Error("services: unexpected group CHECK, not migrated");
  const cols = (db.prepare("PRAGMA table_info(services)").all() as { name: string }[]).map((c) => c.name).join(", ");
  db.transaction(() => {
    db.exec(newSql);
    db.exec(`INSERT INTO services_new (${cols}) SELECT ${cols} FROM services`);
    db.exec("DROP TABLE services");
    db.exec("ALTER TABLE services_new RENAME TO services");
  })();
}

/** Runs `fn` once per database, ever: recorded in `app_migrations`. */
function runOnce(db: Database.Database, name: string, fn: () => void) {
  db.exec("CREATE TABLE IF NOT EXISTS app_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)");
  if (db.prepare("SELECT 1 FROM app_migrations WHERE name = ?").get(name)) return;
  db.transaction(() => {
    fn();
    db.prepare("INSERT INTO app_migrations (name, applied_at) VALUES (?, ?)").run(name, new Date().toISOString());
  })();
}

/** The original Tử Vi seed rows (old "Khai vấn / lá số" wording) → new title. */
const OLD_TU_VI_SEED: { title: string; desc: string; newTitle: string }[] = [
  {
    title: "Phiên khai vấn chuyên sâu một vấn đề",
    desc: "Đào sâu một chủ đề cụ thể trong lá số — sự nghiệp, tình duyên, sức khoẻ hoặc một quyết định bạn đang cân nhắc.",
    newTitle: "Phiên Xuyên vấn chuyên sâu một vấn đề",
  },
  {
    title: "Phiên khai vấn tổng hợp toàn lá số",
    desc: "Nhìn toàn cảnh 12 cung trên lá số, các giai đoạn vận trình và những điểm cần lưu tâm trong hành trình sắp tới.",
    newTitle: "Phiên Xuyên vấn Tổng hợp toàn Diệm Bản",
  },
  {
    title: "Phiên khai vấn tổng hợp hai lá số cùng thời điểm",
    desc: "Đối chiếu hai lá số trong cùng một giai đoạn — phù hợp cho vợ chồng, đối tác hoặc các quyết định chung.",
    newTitle: "Phiên Xuyên vấn 2 Diệm Bản cùng thời điểm",
  },
  {
    title: "Khai vấn Ngày / Giờ Hoàng Đạo",
    desc: "Chọn ngày và giờ tốt cho các việc hệ trọng — khai trương, cưới hỏi, nhập trạch, xuất hành hoặc ký kết.",
    newTitle: "Xuyên vấn ngày/giờ đẹp",
  },
];

/**
 * One-time content migration to the brand's "Xuyên vấn / Diệm Bản" price menu
 * (seed-services.ts holds the new copy). Runs once per database and only
 * touches rows still holding the exact old seed text, so anything edited,
 * added or removed in /admin is left alone; it never deletes a row.
 *   - old Tử Vi seed rows → new title/description/duration
 *   - adds any new Tử Vi / Đại Chủ Sự package not already present by title
 *   - Phong Thuỷ plain-number prices get "Từ " (the site used to print "Từ"
 *     before every price; it now shows the price exactly as typed in admin)
 */
function migrateToXuyenVanMenu(db: Database.Database) {
  runOnce(db, "2026-09-xuyen-van-menu", () => {
    const seedByTitle = new Map(seedServices.map((s) => [s.title, s]));
    const update = db.prepare(
      `UPDATE services SET title = @title, description = @desc, duration = @duration, note = @note
       WHERE group_id = 'tu-vi' AND title = @oldTitle AND description = @oldDesc`
    );
    for (const old of OLD_TU_VI_SEED) {
      const next = seedByTitle.get(old.newTitle);
      if (next) update.run({ ...next, oldTitle: old.title, oldDesc: old.desc });
    }

    const exists = db.prepare("SELECT 1 FROM services WHERE group_id = ? AND title = ?");
    const nextOrder = db.prepare("SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM services WHERE group_id = ?");
    const insert = db.prepare(
      `INSERT INTO services (group_id, title, description, price, duration, note, sort_order)
       VALUES (@group, @title, @desc, @price, @duration, @note, @sortOrder)`
    );
    for (const s of seedServices) {
      if (s.group === "phong-thuy" || exists.get(s.group, s.title)) continue;
      insert.run({ ...s, sortOrder: (nextOrder.get(s.group) as { n: number }).n });
    }

    db.prepare(
      "UPDATE services SET price = 'Từ ' || price WHERE group_id = 'phong-thuy' AND price GLOB '[0-9]*' AND price NOT GLOB '*[^0-9.]*'"
    ).run();

    db.prepare("UPDATE consultants SET field = ? WHERE slug = 'co-minh-trang' AND field = ?").run(
      "Xuyên vấn Tử Vi",
      "Khai vấn Tử Vi"
    );
    db.prepare(
      "UPDATE consultants SET bio = REPLACE(bio, 'trong lá số thành cơ hội', 'trong Diệm Bản thành cơ hội') WHERE slug = 'co-minh-trang' AND bio LIKE '%trong lá số thành cơ hội%'"
    ).run();
  });
}

function seedIfEmpty(db: Database.Database) {
  const userCount = (db.prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number }).n;
  let seededUserId: number | null = null;

  if (userCount === 0) {
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      throw new Error(
        "ADMIN_PASSWORD chưa được đặt trong .env.local — cần có mật khẩu để tạo tài khoản admin đầu tiên."
      );
    }
    const now = new Date().toISOString();
    const info = db
      .prepare("INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)")
      .run(username, hashPassword(password), now);
    seededUserId = Number(info.lastInsertRowid);
  }

  const articleCount = (db.prepare("SELECT COUNT(*) AS n FROM articles").get() as { n: number }).n;
  if (articleCount === 0) {
    const authorId =
      seededUserId ?? (db.prepare("SELECT id FROM users ORDER BY id LIMIT 1").get() as { id: number } | undefined)?.id ?? null;
    const now = new Date().toISOString();
    const insert = db.prepare(
      `INSERT INTO articles (slug, category, title, excerpt, read_time, image, body, status, author_id, created_at, updated_at)
       VALUES (@slug, @category, @title, @excerpt, @readTime, @image, @body, 'published', @authorId, @now, @now)`
    );
    const insertMany = db.transaction((rows: typeof seedArticles) => {
      for (const article of rows) {
        insert.run({
          slug: article.slug,
          category: article.category,
          title: article.title,
          excerpt: article.excerpt,
          readTime: article.readTime,
          image: article.image,
          body: JSON.stringify(article.body),
          authorId,
          now,
        });
      }
    });
    insertMany(seedArticles);
  }
}

function seedServicesIfEmpty(db: Database.Database) {
  const count = (db.prepare("SELECT COUNT(*) AS n FROM services").get() as { n: number }).n;
  if (count > 0) return;

  const insert = db.prepare(
    `INSERT INTO services (group_id, title, description, price, duration, note, sort_order)
     VALUES (@group, @title, @desc, @price, @duration, @note, @sortOrder)`
  );
  const insertMany = db.transaction((rows: typeof seedServices) => {
    const counters: Record<string, number> = {};
    for (const service of rows) {
      const sortOrder = counters[service.group] ?? 0;
      counters[service.group] = sortOrder + 1;
      insert.run({ ...service, sortOrder });
    }
  });
  insertMany(seedServices);
}

function seedConsultantsIfEmpty(db: Database.Database) {
  const count = (db.prepare("SELECT COUNT(*) AS n FROM consultants").get() as { n: number }).n;
  if (count > 0) return;

  const insert = db.prepare(
    `INSERT INTO consultants (slug, name, field, initials, bio, sort_order)
     VALUES (@slug, @name, @field, @initials, @bio, @sortOrder)`
  );
  const insertMany = db.transaction((rows: typeof seedConsultants) => {
    rows.forEach((consultant, sortOrder) => insert.run({ ...consultant, sortOrder }));
  });
  insertMany(seedConsultants);
}

function seedProductsIfEmpty(db: Database.Database) {
  const count = (db.prepare("SELECT COUNT(*) AS n FROM product_categories").get() as { n: number }).n;
  if (count > 0) return;

  const insertCategory = db.prepare(
    `INSERT INTO product_categories (slug, name, intro, image, image_alt, sort_order)
     VALUES (@slug, @name, @intro, @image, @imageAlt, @sortOrder)`
  );
  const insertProduct = db.prepare(
    `INSERT INTO products (category_id, name, description, sort_order)
     VALUES (@categoryId, @name, @desc, @sortOrder)`
  );
  const insertMany = db.transaction((rows: typeof seedProductCategories) => {
    rows.forEach((category, categorySortOrder) => {
      const info = insertCategory.run({
        slug: category.slug,
        name: category.name,
        intro: category.intro,
        image: category.image,
        imageAlt: category.imageAlt,
        sortOrder: categorySortOrder,
      });
      const categoryId = Number(info.lastInsertRowid);
      category.items.forEach((item, sortOrder) => {
        insertProduct.run({ categoryId, name: item.name, desc: item.desc, sortOrder });
      });
    });
  });
  insertMany(seedProductCategories);
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = openDb();
  }
  return dbInstance;
}

export { hashPassword, scryptHash };
