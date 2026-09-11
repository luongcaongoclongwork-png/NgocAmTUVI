import Link from "next/link";
import Reveal from "./Reveal";
import ArticleCard from "./ArticleCard";
import SectionBackdrop from "./SectionBackdrop";
import { articles } from "@/data/articles";

export default function Knowledge() {
  const featured = articles.slice(0, 4);

  return (
    <section id="kien-thuc" className="relative overflow-hidden bg-parchment/60 py-24 lg:py-32">
      <SectionBackdrop
        image="/images/06-thuy-mac-song-huong.webp"
        tint="bg-parchment/78"
      />
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="tracking-label text-[12px] font-medium uppercase text-gold">
                Ngọc Âm Kiến Thức
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 max-w-xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
                Tri thức phương Đông, đọc theo nhịp sống hiện đại.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <Link
              href="/kien-thuc"
              className="tracking-label border-b border-gold pb-1 text-[11px] font-semibold uppercase text-walnut transition-colors hover:text-gold"
            >
              Xem tất cả
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((a, idx) => (
            <ArticleCard key={a.slug} article={a} delay={idx * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
