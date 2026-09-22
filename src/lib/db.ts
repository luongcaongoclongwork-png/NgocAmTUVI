import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Database from "better-sqlite3";
import { seedArticles } from "@/data/seed-articles";
import { seedServices } from "@/data/seed-services";
import { seedConsultants } from "@/data/seed-consultants";
import { seedProductCategories } from "@/data/seed-products";

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
      group_id TEXT NOT NULL CHECK (group_id IN ('tu-vi', 'phong-thuy')),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price TEXT NOT NULL,
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

  seedIfEmpty(db);
  seedServicesIfEmpty(db);
  seedConsultantsIfEmpty(db);
  seedProductsIfEmpty(db);
  return db;
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
    `INSERT INTO services (group_id, title, description, price, sort_order)
     VALUES (@group, @title, @desc, @price, @sortOrder)`
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
