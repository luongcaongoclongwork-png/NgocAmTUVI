import "server-only";
import { getDb } from "@/lib/db";
import { toSlug } from "@/lib/articles";
import type {
  Product,
  ProductCategory,
  ProductCategoryInput,
  ProductCategoryWithItems,
  ProductInput,
} from "@/lib/product-constants";

export type { Product, ProductCategory, ProductCategoryInput, ProductCategoryWithItems, ProductInput };

type CategoryRow = {
  id: number;
  slug: string;
  name: string;
  intro: string;
  image: string | null;
  image_alt: string | null;
  sort_order: number;
};

type ProductRow = {
  id: number;
  category_id: number;
  name: string;
  description: string;
  sort_order: number;
};

function rowToCategory(row: CategoryRow): ProductCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    intro: row.intro,
    image: row.image,
    imageAlt: row.image_alt,
    sortOrder: row.sort_order,
  };
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    desc: row.description,
    sortOrder: row.sort_order,
  };
}

function uniqueCategorySlug(db: ReturnType<typeof getDb>, base: string, excludeId?: number): string {
  let candidate = base || "danh-muc";
  let n = 2;
  const exists = db.prepare(
    excludeId
      ? "SELECT 1 FROM product_categories WHERE slug = ? AND id != ?"
      : "SELECT 1 FROM product_categories WHERE slug = ?"
  );
  while (excludeId ? exists.get(candidate, excludeId) : exists.get(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

// ---------- Public reads ----------

export async function getProductCategories(): Promise<ProductCategory[]> {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM product_categories ORDER BY sort_order ASC, id ASC")
    .all() as CategoryRow[];
  return rows.map(rowToCategory);
}

export async function getProductCategoriesWithItems(): Promise<ProductCategoryWithItems[]> {
  const categories = await getProductCategories();
  const db = getDb();
  const rows = db.prepare("SELECT * FROM products ORDER BY sort_order ASC, id ASC").all() as ProductRow[];
  const items = rows.map(rowToProduct);
  return categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.categoryId === category.id),
  }));
}

// ---------- Admin reads (used only behind a verified session) ----------

export async function getProductCategoryByIdForAdmin(id: number): Promise<ProductCategory | null> {
  const db = getDb();
  const row = db.prepare("SELECT * FROM product_categories WHERE id = ?").get(id) as CategoryRow | undefined;
  return row ? rowToCategory(row) : null;
}

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM products WHERE category_id = ? ORDER BY sort_order ASC, id ASC")
    .all(categoryId) as ProductRow[];
  return rows.map(rowToProduct);
}

export async function getProductByIdForAdmin(id: number): Promise<Product | null> {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow | undefined;
  return row ? rowToProduct(row) : null;
}

// ---------- Writes (always called from a session-verified Server Action) ----------

export async function createProductCategory(input: ProductCategoryInput): Promise<ProductCategory> {
  const db = getDb();
  const slug = uniqueCategorySlug(db, toSlug(input.slug || input.name));
  const info = db
    .prepare(
      `INSERT INTO product_categories (slug, name, intro, image, image_alt, sort_order)
       VALUES (@slug, @name, @intro, @image, @imageAlt, @sortOrder)`
    )
    .run({ ...input, slug });
  const category = await getProductCategoryByIdForAdmin(Number(info.lastInsertRowid));
  if (!category) throw new Error("Không thể tạo danh mục.");
  return category;
}

/** Slug is immutable once created — same rule as articles.ts / consultants.ts,
 * since Footer.tsx and Products.tsx link to `/cua-hang#<slug>` anchors. */
export async function updateProductCategory(
  id: number,
  input: Omit<ProductCategoryInput, "slug">
): Promise<ProductCategory> {
  const db = getDb();
  db.prepare(
    `UPDATE product_categories SET name = @name, intro = @intro, image = @image,
       image_alt = @imageAlt, sort_order = @sortOrder WHERE id = @id`
  ).run({ ...input, id });
  const category = await getProductCategoryByIdForAdmin(id);
  if (!category) throw new Error("Không tìm thấy danh mục để cập nhật.");
  return category;
}

/** Deletes every product inside the category too (ON DELETE CASCADE, see
 * db.ts) — the admin delete button must warn about this before calling it. */
export async function deleteProductCategory(id: number): Promise<ProductCategory | null> {
  const category = await getProductCategoryByIdForAdmin(id);
  if (!category) return null;
  getDb().prepare("DELETE FROM product_categories WHERE id = ?").run(id);
  return category;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const db = getDb();
  const info = db
    .prepare(
      `INSERT INTO products (category_id, name, description, sort_order)
       VALUES (@categoryId, @name, @desc, @sortOrder)`
    )
    .run(input);
  const product = await getProductByIdForAdmin(Number(info.lastInsertRowid));
  if (!product) throw new Error("Không thể tạo sản phẩm.");
  return product;
}

export async function updateProduct(id: number, input: ProductInput): Promise<Product> {
  const db = getDb();
  db.prepare(
    `UPDATE products SET category_id = @categoryId, name = @name,
       description = @desc, sort_order = @sortOrder WHERE id = @id`
  ).run({ ...input, id });
  const product = await getProductByIdForAdmin(id);
  if (!product) throw new Error("Không tìm thấy sản phẩm để cập nhật.");
  return product;
}

export async function deleteProduct(id: number): Promise<Product | null> {
  const product = await getProductByIdForAdmin(id);
  if (!product) return null;
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
  return product;
}
