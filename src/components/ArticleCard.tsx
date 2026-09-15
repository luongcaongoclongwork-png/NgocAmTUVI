import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import type { Article } from "@/lib/article-constants";

export default function ArticleCard({
  article,
  delay = 0,
}: {
  article: Article;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <Link href={`/kien-thuc/${article.slug}`} className="group block">
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-walnut/10">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 300px, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <p className="tracking-label mt-5 text-[10px] font-semibold uppercase text-gold">
          {article.category}
        </p>
        <h3 className="mt-2 font-heading text-lg leading-snug text-ink group-hover:text-bronze">
          {article.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between text-[11px] text-bronze">
          <span>{article.readTime}</span>
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
