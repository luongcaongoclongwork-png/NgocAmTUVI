import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Noto_Serif_Display } from "next/font/google";
import { getHomeData, PATHS, STEPS, LINEAGE } from "../data";
import { CloudBand } from "../ornaments";
import DraftBar from "../DraftBar";
import PriceTabs from "./PriceTabs";
import "./c.css";

const display = Noto_Serif_Display({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--dc-display" });

export const metadata: Metadata = { title: "Hướng C · Sông Hương — Ngọc Âm v2", robots: { index: false } };

const PATH_IMAGES: Record<string, { src: string; alt: string }> = {
  "tu-vi": { src: "/images/pillars/tu-vi.webp", alt: "Diệm Bản Tử Vi viết tay trên án thư" },
  "phong-thuy": { src: "/images/pillars/phong-thuy.webp", alt: "Sơn thuỷ mờ sương, núi ôm dòng nước" },
  "dai-chu-su": { src: "/images/23-homepage-heritage-study.webp", alt: "Thư phòng cổ, nơi bàn những quyết định lớn" },
};

export default async function DraftC() {
  const { groups, trang, articles, settings } = await getHomeData();
  const [lead, ...rest] = articles;

  return (
    <div className={`dC ${display.variable}`}>
      <section className="dC-hero">
        <Image src="/images/20-homepage-hero-hue.webp" alt="Sông núi xứ Huế lúc bình minh, mái đình cổ bên triền núi" fill priority sizes="100vw" className="dC-hero-img" />
        <header className="dC-head">
          <Link href="/thu-nghiem/c" className="dC-brand">
            <Image src="/images/logo-mark.png" alt="" width={34} height={34} />
            <span>Ngọc Âm</span>
          </Link>
          <nav aria-label="Chính" className="dC-nav">
            <Link href="/tu-vi">Tử Vi</Link>
            <Link href="/phong-thuy">Phong Thuỷ</Link>
            <Link href="/dai-chu-su">Đại Chủ Sự</Link>
            <Link href="/kien-thuc">Kiến thức</Link>
            <Link href="/ve-ngoc-am">Về Ngọc Âm</Link>
          </nav>
          <Link href="/lien-he" className="dC-btn dC-btn--small">Đặt lịch</Link>
        </header>
        <div className="dC-hero-text">
          <h1>Hiểu mình, thuận thế, vững bước.</h1>
          <p>Tử Vi, Phong Thuỷ của hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn.</p>
          <div className="dC-actions">
            <Link href="/lien-he" className="dC-btn">Đặt lịch Xuyên vấn</Link>
            <Link href="#bang-gia" className="dC-btn dC-btn--glass">Xem bảng giá</Link>
          </div>
        </div>
        <CloudBand id="c-hero" className="dC-hero-cloud" />
      </section>

      <main>
        <section className="dC-intro">
          <h2>Ngọc Âm</h2>
          <p>Không xem để biết trước. Ngọc Âm cùng bạn đọc Diệm Bản và không gian sống như đọc một dòng sông: thấy nguồn, thấy khúc quanh, để tự chọn cách đi tiếp.</p>
        </section>

        <section className="dC-paths" aria-label="Ba con đường">
          {PATHS.map((p) => (
            <Link key={p.id} href={p.href} className="dC-path">
              <span className="dC-path-img"><Image src={PATH_IMAGES[p.id].src} alt={PATH_IMAGES[p.id].alt} fill sizes="(min-width: 900px) 33vw, 100vw" /></span>
              <h3>{p.name}</h3>
              <p>{p.line}</p>
              <span className="dC-link">{p.cta}</span>
            </Link>
          ))}
        </section>

        <section className="dC-lineage" aria-labelledby="dC-lin-h">
          <div className="dC-lineage-img">
            <Image src="/images/21-homepage-tu-vi-manuscript.webp" alt="Bản chép tay Tử Vi, bút lông và nghiên mực trên án thư" fill sizes="100vw" />
          </div>
          <div className="dC-lineage-card">
            <h2 id="dC-lin-h">{LINEAGE.title}</h2>
            <blockquote>{LINEAGE.quote}</blockquote>
            <p>{LINEAGE.body}</p>
            {trang && (
              <p className="dC-sign">
                {trang.photo && <Image src={trang.photo} alt={`Chân dung ${trang.name}`} width={52} height={64} />}
                <span><b>{trang.name}</b>Xuyên giả Tử Vi Xuyên Tam Diệm</span>
              </p>
            )}
          </div>
        </section>

        <section id="bang-gia" className="dC-prices" aria-labelledby="dC-price-h">
          <h2 id="dC-price-h">Bảng giá</h2>
          <PriceTabs groups={groups} />
        </section>

        <section className="dC-steps" aria-labelledby="dC-steps-h">
          <h2 id="dC-steps-h">Một phiên Xuyên vấn</h2>
          <ol>
            {STEPS.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {lead && (
          <section className="dC-articles" aria-labelledby="dC-art-h">
            <h2 id="dC-art-h">Kiến thức</h2>
            <div className="dC-art-grid">
              <Link href={`/kien-thuc/${lead.slug}`} className="dC-art dC-art--lead">
                <span className="dC-art-img"><Image src={lead.image} alt={lead.imageAlt || lead.title} fill sizes="(min-width: 900px) 60vw, 100vw" /></span>
                <small>{lead.category}</small>
                <b>{lead.title}</b>
                <span>{lead.excerpt}</span>
              </Link>
              <div className="dC-art-side">
                {rest.map((a) => (
                  <Link key={a.id} href={`/kien-thuc/${a.slug}`} className="dC-art">
                    <span className="dC-art-img"><Image src={a.image} alt={a.imageAlt || a.title} fill sizes="(min-width: 900px) 30vw, 100vw" /></span>
                    <small>{a.category}</small>
                    <b>{a.title}</b>
                  </Link>
                ))}
              </div>
            </div>
            <p className="dC-more">
              <Link href="/kien-thuc" className="dC-link">Tất cả bài viết</Link>
              <Link href="/tra-dao" className="dC-link">Trà Đạo</Link>
              <Link href="/phat-hoc" className="dC-link">Phật học</Link>
            </p>
          </section>
        )}

        <section className="dC-close">
          <Image src="/images/06-thuy-mac-song-huong.webp" alt="" fill sizes="100vw" className="dC-close-img" />
          <div className="dC-close-text">
            <h2>Mỗi cuộc trao đổi bắt đầu từ sự lắng nghe.</h2>
            <p>Để lại đôi dòng, Ngọc Âm hồi đáp trong một ngày làm việc.</p>
            <div className="dC-actions">
              <Link href="/lien-he" className="dC-btn">Đặt lịch Xuyên vấn</Link>
              {settings.zaloUrl && <a href={settings.zaloUrl} className="dC-btn dC-btn--glass">Nhắn Zalo {settings.phone}</a>}
            </div>
          </div>
        </section>
      </main>

      <footer className="dC-foot">
        <p><b>Ngọc Âm</b>Tử Vi, Phong Thuỷ hậu nhân Khâm Thiên Giám</p>
        <p>{settings.address}</p>
        <p>{settings.phone}, {settings.workingHours}</p>
      </footer>
      <DraftBar current="c" />
    </div>
  );
}
