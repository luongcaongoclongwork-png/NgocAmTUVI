import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { articles } from "@/data/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} — Ngọc Âm Kiến Thức`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <>
      <article className="bg-parchment/50 pb-16 pt-36 lg:pb-20 lg:pt-44">
        <div className="mx-auto max-w-[760px] px-6 lg:px-10">
          <Reveal>
            <Link
              href="/kien-thuc"
              className="tracking-label text-[11px] font-semibold uppercase text-walnut/70 transition-colors hover:text-gold"
            >
              ← Ngọc Âm Kiến Thức
            </Link>
          </Reveal>
          <Reveal delay={60}>
            <p className="tracking-label mt-6 text-[12px] font-medium uppercase text-gold">
              {article.category} · {article.readTime}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-3 font-heading text-3xl leading-tight text-ink sm:text-4xl">
              {article.title}
            </h1>
          </Reveal>
        </div>
      </article>

      <section className="bg-ivory py-16 lg:py-20">
        <div className="mx-auto max-w-[760px] space-y-6 px-6 text-[16px] leading-relaxed text-ink/80 lg:px-10">
          {article.body.map((para, idx) => (
            <Reveal key={idx} delay={idx * 60}>
              <p>{para}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
