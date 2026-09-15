import "server-only";
import { getDb } from "@/lib/db";
import { CATEGORIES, type Article, type ArticleStatus, type ArticleInput } from "@/lib/article-constants";

export { CATEGORIES };
export type { Article, ArticleStatus, ArticleInput };

type ArticleRow = {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  read_time: string;
  image: string;
  body: string;
  status: string;
  author_id: number | null;
  created_at: string;
  updated_at: string;
};

function rowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt,
    readTime: row.read_time,
    image: row.image,
    body: JSON.parse(row.body) as string[],
    status: row.status as ArticleStatus,
    authorId: row.author_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Vietnamese-aware slugify — NFD normalization alone does NOT decompose
 * đ/Đ (it isn't a base-letter+combining-mark sequence in Unicode), so it
 * has to be special-cased before diacritics are stripped. */
export function toSlug(input: string): string {
  const withoutDStroke = input.replace(/đ/g, "d").replace(/Đ/g, "D");
  const normalized = withoutDStroke.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return normalized
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(db: ReturnType<typeof getDb>, base: string, excludeId?: number): string {
  let candidate = base || "bai-viet";
  let n = 2;
  const exists = db.prepare(
    excludeId ? "SELECT 1 FROM articles WHERE slug = ? AND id != ?" : "SELECT 1 FROM articles WHERE slug = ?"
  );
  while (excludeId ? exists.get(candidate, excludeId) : exists.get(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

/** ~200 words/minute Vietnamese reading speed — computed, never manually typed. */
export function computeReadTime(body: string[]): string {
  const wordCount = body
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} phút đọc`;
}

// ---------- Public reads (published only) ----------

export async function getArticles(): Promise<Article[]> {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM articles WHERE status = 'published' ORDER BY created_at DESC")
    .all() as ArticleRow[];
  return rows.map(rowToArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM articles WHERE slug = ? AND status = 'published'")
    .get(slug) as ArticleRow | undefined;
  return row ? rowToArticle(row) : null;
}

export async function getFeaturedArticles(limit: number): Promise<Article[]> {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM articles WHERE status = 'published' ORDER BY created_at DESC LIMIT ?")
    .all(limit) as ArticleRow[];
  return rows.map(rowToArticle);
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM articles WHERE status = 'published' AND category = ? ORDER BY created_at DESC")
    .all(category) as ArticleRow[];
  return rows.map(rowToArticle);
}

// ---------- Admin reads (any status — used only behind a verified session) ----------

export async function getAllArticlesForAdmin(): Promise<Article[]> {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM articles ORDER BY created_at DESC").all() as ArticleRow[];
  return rows.map(rowToArticle);
}

export async function getArticleBySlugForAdmin(slug: string): Promise<Article | null> {
  const db = getDb();
  const row = db.prepare("SELECT * FROM articles WHERE slug = ?").get(slug) as ArticleRow | undefined;
  return row ? rowToArticle(row) : null;
}

export async function getArticleByIdForAdmin(id: number): Promise<Article | null> {
  const db = getDb();
  const row = db.prepare("SELECT * FROM articles WHERE id = ?").get(id) as ArticleRow | undefined;
  return row ? rowToArticle(row) : null;
}

// ---------- Writes (always called from a session-verified Server Action) ----------

export async function createArticle(input: ArticleInput): Promise<Article> {
  const db = getDb();
  const slug = uniqueSlug(db, toSlug(input.slug || input.title));
  const readTime = computeReadTime(input.body);
  const now = new Date().toISOString();
  const info = db
    .prepare(
      `INSERT INTO articles (slug, category, title, excerpt, read_time, image, body, status, author_id, created_at, updated_at)
       VALUES (@slug, @category, @title, @excerpt, @readTime, @image, @body, @status, @authorId, @now, @now)`
    )
    .run({
      slug,
      category: input.category,
      title: input.title,
      excerpt: input.excerpt,
      readTime,
      image: input.image,
      body: JSON.stringify(input.body),
      status: input.status,
      authorId: input.authorId,
      now,
    });
  const article = await getArticleByIdForAdmin(Number(info.lastInsertRowid));
  if (!article) throw new Error("Không thể tạo bài viết.");
  return article;
}

/** Slug is treated as immutable once created (see plan) — not accepted here,
 * so published URLs never break under an editor's feet. */
export async function updateArticle(
  id: number,
  input: Omit<ArticleInput, "slug">
): Promise<Article> {
  const db = getDb();
  const readTime = computeReadTime(input.body);
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE articles SET category = @category, title = @title, excerpt = @excerpt,
       read_time = @readTime, image = @image, body = @body, status = @status, updated_at = @now
     WHERE id = @id`
  ).run({
    id,
    category: input.category,
    title: input.title,
    excerpt: input.excerpt,
    readTime,
    image: input.image,
    body: JSON.stringify(input.body),
    status: input.status,
    now,
  });
  const article = await getArticleByIdForAdmin(id);
  if (!article) throw new Error("Không tìm thấy bài viết để cập nhật.");
  return article;
}

export async function deleteArticle(id: number): Promise<Article | null> {
  const article = await getArticleByIdForAdmin(id);
  if (!article) return null;
  getDb().prepare("DELETE FROM articles WHERE id = ?").run(id);
  return article;
}
