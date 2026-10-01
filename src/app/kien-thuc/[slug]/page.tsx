import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { computeReadTime, getArticleBySlug, getArticleBySlugForAdmin } from "@/lib/articles";
import { verifySession } from "@/lib/auth";
import { lunarDateLabel } from "@/components/thuy-mac/calendar";
import { InkClose, InkPage, InkProse, solarDate } from "@/components/thuy-mac/kit";

/** The booking a reader of this topic would most likely make next. */
function closeFor(category: string): { href: string } {
  const c = category.toLowerCase();
  if (c.includes("tử vi")) return { href: "/lien-he?topic=tu-vi" };
  if (c.includes("phong thuỷ") || c.includes("không gian")) return { href: "/lien-he?topic=phong-thuy" };
  return { href: "/lien-he" };
}
import JsonLd from "@/components/thuy-mac/JsonLd";
import { absoluteUrl } from "@/lib/site-url";

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
    title: `${article.title} — Sổ Tay Ngọc Âm`,
    description: article.excerpt,
    // the cover is the share preview for this article
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image, alt: article.imageAlt || article.title }],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) notFound();

  return (
    <InkPage>
      {article.status === "published" && (
        <JsonLd
          data={{
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            image: absoluteUrl(article.image),
            datePublished: article.createdAt,
            dateModified: article.updatedAt || article.createdAt,
            author: { "@type": "Organization", name: "Ngọc Âm", url: absoluteUrl("/") },
            publisher: { "@type": "Organization", name: "Ngọc Âm", logo: { "@type": "ImageObject", url: absoluteUrl("/images/logo-mark.png") } },
            mainEntityOfPage: absoluteUrl(`/kien-thuc/${article.slug}`),
          }}
        />
      )}
      <article className="ipArticle">
        <header className="ipArticle-head">
          <Link href="/kien-thuc" className="ipLink">← Sổ Tay</Link>
          {article.status === "draft" && <p className="ipArticle-draft">Bản nháp, chỉ bạn thấy được</p>}
          <p className="ipArticle-meta">
            {article.category}, viết ngày {solarDate(article.createdAt)} ({lunarDateLabel(article.createdAt)}), {computeReadTime(article.body)}
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
      <InkClose {...closeFor(article.category)} />
    </InkPage>
  );
}
