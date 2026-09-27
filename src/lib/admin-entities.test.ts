import { afterEach, describe, expect, it } from "vitest";
import { getDb } from "./db";
import {
  createProduct,
  createProductCategory,
  getProductCategoriesWithItems,
  getProductCategoriesWithItemsForAdmin,
} from "./products";
import { getHiddenIds, listTrash, moveToTrash, purge, purgeExpired, reorder, restoreFromTrash, setHidden } from "./admin-entities";

// Uses the real dev SQLite file like the other DB tests; everything created
// here is removed in afterEach (products go with their category).
const categoryIds: number[] = [];
afterEach(() => {
  const db = getDb();
  for (const id of categoryIds.splice(0)) {
    db.prepare("DELETE FROM products WHERE category_id = ?").run(id);
    db.prepare("DELETE FROM product_categories WHERE id = ?").run(id);
  }
});

async function fixture() {
  const cat = await createProductCategory({ name: "Test danh mục admin", intro: "x", image: null, imageAlt: null, sortOrder: 9990 });
  categoryIds.push(cat.id);
  const a = await createProduct({ categoryId: cat.id, name: "Món A", desc: "a", sortOrder: 1 });
  const b = await createProduct({ categoryId: cat.id, name: "Món B", desc: "b", sortOrder: 2 });
  const c = await createProduct({ categoryId: cat.id, name: "Món C", desc: "c", sortOrder: 3 });
  return { cat, a, b, c };
}

const publicItems = async (catId: number) => (await getProductCategoriesWithItems()).find((x) => x.id === catId)?.items.map((i) => i.name);
const adminItems = async (catId: number) => (await getProductCategoriesWithItemsForAdmin()).find((x) => x.id === catId)?.items.map((i) => i.name);

describe("hide / show", () => {
  it("hides from the website but keeps it in admin", async () => {
    const { cat, b } = await fixture();
    setHidden("product", b.id, true);
    expect(await publicItems(cat.id)).toEqual(["Món A", "Món C"]);
    expect(await adminItems(cat.id)).toEqual(["Món A", "Món B", "Món C"]);
    expect(getHiddenIds("product").has(b.id)).toBe(true);
    setHidden("product", b.id, false);
    expect(await publicItems(cat.id)).toEqual(["Món A", "Món B", "Món C"]);
  });

  it("hiding a category hides it (and its products) on the website", async () => {
    const { cat } = await fixture();
    setHidden("category", cat.id, true);
    expect(await publicItems(cat.id)).toBeUndefined();
    expect(await adminItems(cat.id)).toHaveLength(3);
  });

  it("refuses to hide types that cannot be hidden", () => {
    expect(() => setHidden("article", 1, true)).toThrow();
  });
});

describe("reorder", () => {
  it("saves the new order", async () => {
    const { cat, a, b, c } = await fixture();
    reorder("product", [c.id, a.id, b.id]);
    expect(await adminItems(cat.id)).toEqual(["Món C", "Món A", "Món B"]);
  });

  it("rejects stale or mixed lists", async () => {
    const { a, b, c } = await fixture();
    expect(() => reorder("product", [a.id, b.id])).toThrow(/tải lại/); // one left out
    expect(() => reorder("product", [a.id, a.id, b.id])).toThrow(); // duplicate
    expect(() => reorder("product", [a.id, b.id, c.id, 999999])).toThrow(); // unknown id
    expect(() => reorder("lead", [1])).toThrow(); // not sortable
  });
});

describe("trash", () => {
  it("moves to trash, restores, and purges only trashed items", async () => {
    const { cat, b } = await fixture();
    moveToTrash("product", b.id);
    expect(await adminItems(cat.id)).toEqual(["Món A", "Món C"]);
    expect(listTrash().some((t) => t.key === "product" && t.id === b.id && t.daysLeft === 30)).toBe(true);

    restoreFromTrash("product", b.id);
    expect(await adminItems(cat.id)).toEqual(["Món A", "Món B", "Món C"]);

    await purge("product", b.id); // not in the trash → must do nothing
    expect(await adminItems(cat.id)).toHaveLength(3);

    moveToTrash("product", b.id);
    await purge("product", b.id);
    expect(listTrash().some((t) => t.key === "product" && t.id === b.id)).toBe(false);
    expect(getDb().prepare("SELECT 1 FROM products WHERE id = ?").get(b.id)).toBeUndefined();
  });

  it("purgeExpired removes only items older than 30 days", async () => {
    const { a, c } = await fixture();
    const old = new Date(Date.now() - 31 * 86_400_000).toISOString();
    getDb().prepare("UPDATE products SET deleted_at = ? WHERE id = ?").run(old, a.id);
    moveToTrash("product", c.id);
    await purgeExpired();
    expect(getDb().prepare("SELECT 1 FROM products WHERE id = ?").get(a.id)).toBeUndefined();
    expect(getDb().prepare("SELECT 1 FROM products WHERE id = ?").get(c.id)).toBeDefined();
  });
});
