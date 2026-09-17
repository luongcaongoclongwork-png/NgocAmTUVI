/** Types — kept separate from src/lib/products.ts (server-only DB access),
 * same reasoning as article-constants.ts. */

export type ProductCategory = {
  id: number;
  slug: string;
  name: string;
  intro: string;
  image: string | null;
  imageAlt: string | null;
  sortOrder: number;
};

export type ProductCategoryInput = {
  slug?: string;
  name: string;
  intro: string;
  image: string | null;
  imageAlt: string | null;
  sortOrder: number;
};

export type Product = {
  id: number;
  categoryId: number;
  name: string;
  desc: string;
  sortOrder: number;
};

export type ProductInput = {
  categoryId: number;
  name: string;
  desc: string;
  sortOrder: number;
};

export type ProductCategoryWithItems = ProductCategory & { items: Product[] };
