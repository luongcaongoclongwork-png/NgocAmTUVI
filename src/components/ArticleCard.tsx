import Reveal from "./Reveal";
import NgocAmCard from "./ui/NgocAmCard";
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
      <NgocAmCard
        href={`/kien-thuc/${article.slug}`}
        variant="article"
        eyebrow={article.category}
        title={article.title}
        description={article.excerpt}
        meta={<span>{article.readTime}</span>}
        ctaLabel="Đọc bài"
        image={{ src: article.image, alt: article.title }}
      />
    </Reveal>
  );
}
