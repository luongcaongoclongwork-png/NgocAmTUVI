import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getArticleBySlug, getArticleBySlugForAdmin } from "@/lib/articles";
import { verifySession } from "@/lib/auth";
import { lunarDateLabel } from "@/components/thuy-mac/calendar";
import { InkClose, InkPage, InkProse } from "@/components/thuy-mac/kit";

export const revalidate = 60;

/**
 * No generateStaticParams here on purpose — articles are created/edited at
 * any time from /admin now, so pages render on demand (revalidate=60) and
 * new slugs are reachable immediately instead of waiting for a rebuild.
 */

async function loadArticle(slug: string) {
  const published = await getArticleBySlug(slug);
  if (published) return published;

  // Draft preview: same real URL, only visible to a logged-in admin.
  // Anyone else gets a plain 404.
  const session = await verifySession();
  if (!session) return null;
  const draft = await getArticleBySlugForAdmin(slug);
  return draft?.status === "draft" ? draft : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Sổ tay Ngọc Âm`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) notFound();

  return (
    <InkPage>
      <article className="ipArticle">
        <header className="ipArticle-head">
          <Link href="/kien-thuc" className="ipLink">← Sổ tay</Link>
          {article.status === "draft" && <p className="ipArticle-draft">Bản nháp, chỉ bạn thấy được</p>}
          <p className="ipArticle-meta">
            {article.category}, viết {lunarDateLabel(article.createdAt)}, {article.readTime}
          </p>
          <h1>{article.title}</h1>
          {article.excerpt && <p className="ipArticle-excerpt">{article.excerpt}</p>}
        </header>
        <figure className="ipArticle-cover">
          <Image src={article.image} alt={article.imageAlt || article.title} fill sizes="(min-width: 1100px) 1000px, 100vw" priority />
        </figure>
        <div className="ipArticle-body">
          <InkProse>
            <div className="ipProse--drop">
              <ArticleBody paragraphs={article.body} reveal={false} />
            </div>
          </InkProse>
        </div>
      </article>
      <InkClose />
    </InkPage>
  );
}
