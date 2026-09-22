import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import ArticleCard from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import NgocAmCard from "@/components/ui/NgocAmCard";
import { StillLifeStone } from "@/components/illustrations";
import { getArticlesByCategory } from "@/lib/articles";
import {
  khuong,
  traDaoNgocAmIntro,
  traDaoSpiritQuote,
  traDaoSpiritExtra,
  traDaoSpiritClosing,
  taiQuanIntro,
  traDaoTaiQuan,
  traUlLanhIntro,
  traUlLanh,
  traBieuIntro,
  traBieuQuote,
  traBieuIntro2,
  traBieuCriteria,
  traBieuList,
  traBieuClosing,
  motChenTraClosing,
  motChenTraVows,
  type TraSanPham,
} from "@/data/traDao";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Trà Đạo — Ngọc Âm",
  description:
    "Trà Đạo Ngọc Âm cùng Trà Sư Khương — thuận tự nhiên mà pha, tĩnh tâm mà uống, chân thành mà đối đãi.",
};

function TraSanPhamCard({ item }: { item: TraSanPham }) {
  return (
    <NgocAmCard
      href="/#lien-he"
      variant="tradao"
      title={item.name}
      ctaLabel="Liên hệ để đặt"
      image={item.image ? { src: item.image, alt: item.imageAlt ?? item.name } : undefined}
      media={!item.image ? <StillLifeStone /> : undefined}
    >
      {item.desc.map((d, i) => (
        <p key={i} className="text-[13.5px] leading-relaxed text-ink/70">
          {d}
        </p>
      ))}
    </NgocAmCard>
  );
}

export default async function TraDaoPage() {
  const traDaoArticles = await getArticlesByCategory("Trà đạo");

  return (
    <>
      <PageBanner
        eyebrow="Trà Đạo"
        heading="Đạo Trong Một Chén Trà"
        description="Thuận trà · Thuận thủy · Thuận thời · Thuận tâm."
        image="/images/tra-dao/page-banner.webp"
        imageAlt="Bàn trà gỗ trên hiên nhà nhìn ra sông núi lúc bình minh, ấm trà bốc hơi"
      />

      {/* ---------- Khương — Trà Sư ---------- */}
      <section className="bg-ivory py-24 lg:py-28">
        <div className="mx-auto max-w-[760px] px-6 lg:px-10">
          <Reveal>
            <p className="tracking-label text-center text-[12px] font-medium uppercase text-gold">
              {khuong.title}
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-3 text-center font-heading text-4xl text-ink sm:text-5xl">{khuong.name}</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="tracking-label mt-4 text-center text-[13px] font-semibold uppercase text-bronze">
              {khuong.signature}
            </p>
          </Reveal>

          <Reveal delay={160}>
            <blockquote className="mt-12 border-y border-walnut/15 py-8 text-center font-heading text-xl italic leading-relaxed text-walnut sm:text-2xl">
              {khuong.poem.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </blockquote>
          </Reveal>

          <div className="mt-12 space-y-4 text-[15px] leading-relaxed text-ink/80">
            {khuong.introBeforeThuan.map((p, i) => (
              <Reveal key={i} delay={i * 20}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-14 text-center font-heading text-5xl tracking-[0.15em] text-gold sm:text-6xl">
              {khuong.thuanWord}
            </p>
          </Reveal>

          <div className="mt-14 space-y-4 text-[15px] leading-relaxed text-ink/80">
            {khuong.introAfterThuan.map((p, i) => (
              <Reveal key={i} delay={i * 20}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Trà Đạo Ngọc Âm ---------- */}
      <section className="bg-parchment/60 py-24 lg:py-28">
        <div className="mx-auto max-w-[760px] px-6 lg:px-10">
          <Reveal>
            <p className="tracking-label text-[12px] font-medium uppercase text-gold">Trà Đạo Ngọc Âm</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 font-heading text-3xl leading-tight text-ink sm:text-4xl">
              Trà là đầu câu chuyện.
            </h2>
          </Reveal>

          <div className="mt-10 space-y-4 text-[15px] leading-relaxed text-ink/80">
            {traDaoNgocAmIntro.map((p, i) => (
              <Reveal key={i} delay={i * 20}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-10 text-[15px] leading-relaxed text-ink/80">
              Tinh thần trà của Ngọc Âm được Khương gói lại trong hai câu:
            </p>
          </Reveal>
          <Reveal delay={40}>
            <blockquote className="mt-6 border-l-2 border-gold pl-6 font-heading text-xl italic leading-relaxed text-walnut">
              {traDaoSpiritQuote.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </blockquote>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-10 text-[15px] leading-relaxed text-ink/80">
              Và thêm một điều tưởng nhỏ, nhưng quan trọng:
            </p>
          </Reveal>
          <Reveal delay={120}>
            <blockquote className="mt-6 border-l-2 border-gold pl-6 font-heading text-xl italic leading-relaxed text-walnut">
              {traDaoSpiritExtra}
            </blockquote>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-10 text-[15px] leading-relaxed text-ink/80">{traDaoSpiritClosing}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------- 01 · Trà Đạo Tại Quán ---------- */}
      <section className="bg-ivory py-24 lg:py-28">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
          <Reveal>
            <p className="tracking-label text-[12px] font-medium uppercase text-gold">01</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
              Trà Đạo Tại Quán
            </h2>
          </Reveal>
          <div className="mt-6 max-w-2xl space-y-2 text-[15px] leading-relaxed text-ink/70">
            {taiQuanIntro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-14 divide-y divide-walnut/15">
            {traDaoTaiQuan.map((item, idx) => (
              <Reveal key={item.title} delay={idx * 60}>
                <div className="grid gap-3 py-8 first:pt-0 sm:grid-cols-[220px_1fr] sm:gap-10">
                  <h3 className="font-heading text-xl text-walnut">{item.title}</h3>
                  <div className="space-y-3 text-[15px] leading-relaxed text-ink/75">
                    {item.desc.map((d, i) => (
                      <p key={i}>{d}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 02 · Trà Ủ Lạnh ---------- */}
      <section className="bg-parchment/60 py-24 lg:py-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <Reveal>
            <p className="tracking-label text-[12px] font-medium uppercase text-gold">02</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">Trà Ủ Lạnh</h2>
          </Reveal>
          <div className="mt-6 max-w-2xl space-y-2 text-[15px] leading-relaxed text-ink/70">
            {traUlLanhIntro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {traUlLanh.map((item, idx) => (
              <Reveal key={item.name} delay={idx * 90}>
                <TraSanPhamCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 03 · Trà Biếu ---------- */}
      <section className="bg-ivory py-24 lg:py-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <Reveal>
            <p className="tracking-label text-[12px] font-medium uppercase text-gold">03</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">Trà Biếu</h2>
          </Reveal>

          <div className="mt-6 max-w-xl space-y-2 text-[15px] leading-relaxed text-ink/70">
            {traBieuIntro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="font-heading italic text-walnut">&ldquo;{traBieuQuote}&rdquo;</p>
            {traBieuIntro2.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="font-medium text-ink">{traBieuCriteria}</p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {traBieuList.map((item, idx) => (
              <Reveal key={item.name} delay={idx * 90}>
                <TraSanPhamCard item={item} />
              </Reveal>
            ))}
          </div>

          <div className="mt-14 max-w-xl space-y-2 text-[15px] leading-relaxed text-ink/70">
            {traBieuClosing.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Một chén trà ---------- */}
      <section className="bg-parchment/60 py-24 lg:py-28">
        <div className="mx-auto max-w-[700px] px-6 text-center lg:px-10">
          <div className="space-y-3 text-[15px] leading-relaxed text-ink/80">
            {motChenTraClosing.map((p, i) => (
              <Reveal key={i} delay={i * 30}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 space-y-1">
            {motChenTraVows.map((v, i) => (
              <Reveal key={i} delay={i * 40}>
                <p className="font-heading text-xl text-walnut sm:text-2xl">{v}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <p className="mt-10 font-heading text-2xl text-gold sm:text-3xl">Lấy trà làm đầu câu chuyện.</p>
          </Reveal>

          <Reveal delay={200}>
            <p className="tracking-label mt-8 text-[12px] font-semibold uppercase text-bronze">— {khuong.name}, {khuong.title}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Bài viết Trà Đạo ---------- */}
      {traDaoArticles.length > 0 && (
        <section className="bg-ivory py-24 lg:py-28">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <Reveal>
              <p className="tracking-label text-[12px] font-medium uppercase text-gold">Đọc thêm</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 max-w-xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
                Góc nhìn về Trà từ Ngọc Âm Kiến Thức.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {traDaoArticles.map((a, idx) => (
                <ArticleCard key={a.slug} article={a} delay={idx * 90} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
