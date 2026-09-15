import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Database from "better-sqlite3";
import { seedArticles } from "@/data/seed-articles";

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
  `);

  seedIfEmpty(db);
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

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = openDb();
  }
  return dbInstance;
}

export { hashPassword, scryptHash };
