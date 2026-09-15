/**
 * Types + the fixed category list — deliberately NOT in src/lib/articles.ts
 * (which has `import "server-only"` for its DB access). A Client Component
 * like AdminArticleForm.tsx needs CATEGORIES at runtime for its <select>;
 * importing any real value (not just a type) from a server-only module
 * pulls the whole module — DB code included — into the client bundle and
 * Next.js correctly refuses to build it. This file has no server-only
 * dependency so it's safe from both sides.
 */

export type ArticleStatus = "draft" | "published";

export type Article = {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
  body: string[];
  status: ArticleStatus;
  authorId: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ArticleInput = {
  slug?: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  body: string[];
  status: ArticleStatus;
  authorId: number | null;
};

/** The 6 categories currently in use — kept as a fixed list (not free text)
 * so an admin can never mistype the one phat-hoc/page.tsx filters on
 * ("Phật học") and silently make an article disappear from that page. */
export const CATEGORIES = [
  "Tử vi",
  "Phong thuỷ",
  "Phật học",
  "Phát triển nội lực",
  "Không gian sống",
  "Văn hoá",
] as const;
