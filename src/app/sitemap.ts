import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/tu-vi", priority: 0.9 },
  { path: "/phong-thuy", priority: 0.9 },
  { path: "/dai-chu-su", priority: 0.9 },
  { path: "/dich-vu", priority: 0.8 },
  { path: "/lien-he", priority: 0.8 },
  { path: "/lap-la-so", priority: 0.7 },
  { path: "/kien-thuc", priority: 0.7 },
  { path: "/tra-dao", priority: 0.6 },
  { path: "/phat-hoc", priority: 0.6 },
  { path: "/cua-hang", priority: 0.5 },
  { path: "/ve-ngoc-am", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  return [
    ...PAGES.map((p) => ({ url: absoluteUrl(p.path), priority: p.priority })),
    ...articles.map((a) => ({ url: absoluteUrl(`/kien-thuc/${a.slug}`), lastModified: a.updatedAt || a.createdAt, priority: 0.5 })),
  ];
}
