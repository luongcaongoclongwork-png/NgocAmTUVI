import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { formatPrice } from "@/lib/service-constants";
import { getHomeData, PATHS, STEPS, LINEAGE } from "../data";
import { CloudBand, CloudMark, CuuDinhLandscape, PATH_ICONS } from "../ornaments";
import DraftBar from "../DraftBar";
import "./b.css";

const display = Cormorant_Garamond({ subsets: ["latin", "vietnamese"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--db-display" });

export const metadata: Metadata = { title: "Hướng B · Cửu Đỉnh — Ngọc Âm v2", robots: { index: false } };

export default async function DraftB() {
  const { groups, trang, tinh, articles, settings } = await getHomeData();

  return (
    <div className={`dB ${display.variable}`}>
      <div className="dB-dark dB-top">
        <header className="dB-head">
          <Link href="/thu-nghiem/b" className="dB-brand">
            <Image src="/images/logo-mark.png" alt="" width={36} height={36} />
            <span>Ngọc Âm</span>
          </Link>
          <nav aria-label="Chính" className="dB-nav">
            <Link href="/tu-vi">Tử Vi</Link>
            <Link href="/phong-thuy">Phong Thuỷ</Link>
            <Link href="/dai-chu-su">Đại Chủ Sự</Link>
            <Link href="/kien-thuc">Kiến thức</Link>
            <Link href="/ve-ngoc-am">Về Ngọc Âm</Link>
          </nav>
          <Link href="/lien-he" className="dB-btn dB-btn--small">Đặt lịch</Link>
        </header>

        <section className="dB-hero">
          <p className="dB-kicker">Hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn</p>
          <h1>Hiểu mình, thuận thế, vững bước.</h1>
          <p className="dB-lede">Tử Vi Xuyên Tam Diệm và Phong Thuỷ Là Tịnh: tri thức lịch pháp, địa lý của cung đình Nguyễn, đọc lại cho những lựa chọn của hôm nay.</p>
          <div className="dB-actions">
            <Link href="/lien-he" className="dB-btn">Đặt lịch Xuyên vấn</Link>
            <Link href="#bang-gia" className="dB-btn dB-btn--ghost">Xem bảng giá</Link>
          </div>
        </section>
        <CuuDinhLandscape className="dB-landscape" />
      </div>

      <main>
        <section className="dB-section" aria-labelledby="dB-paths-h">
          <h2 id="dB-paths-h" className="dB-h2">Ba con đường</h2>
          <p className="dB-sub">Như chín chiếc đỉnh đồng mỗi chiếc khắc một cõi, mỗi con đường ở Ngọc Âm giữ một phần của đời sống.</p>
          <div className="dB-panels">
            {PATHS.map((p) => {
              const Icon = PATH_ICONS[p.id];
              return (
                <article key={p.id} className="dB-panel">
                  <CloudMark className="dB-corner dB-corner--tl" />
                  <CloudMark className="dB-corner dB-corner--br" />
                  <span className="dB-han" lang="zh-Hant" aria-hidden="true">{p.han}</span>
                  <Icon className="dB-icon" />
                  <h3>{p.name}</h3>
                  <p className="dB-panel-line">{p.line}</p>
                  <p>{p.desc}</p>
                  <Link href={p.href} className="dB-link">{p.cta}</Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="dB-dark dB-lineage" aria-labelledby="dB-lin-h">
          <div className="dB-lineage-img">
            <Image src="/images/23-homepage-heritage-study.webp" alt="Thư phòng cổ với án thư gỗ, sách và ánh sáng qua song cửa" fill sizes="(min-width: 900px) 50vw, 100vw" />
          </div>
          <div className="dB-lineage-text">
            <h2 id="dB-lin-h" className="dB-h2 dB-left">{LINEAGE.title}</h2>
            <blockquote>{LINEAGE.quote}</blockquote>
            <p>{LINEAGE.body}</p>
            <ul className="dB-people">
              {[trang, tinh].filter(Boolean).map((c) => (
                <li key={c!.slug}>
                  {c!.photo && <Image src={c!.photo} alt={`Chân dung ${c!.name}`} width={64} height={80} />}
                  <span>
                    <b>{c!.name}</b>
                    {c!.slug === "co-minh-trang" ? "Xuyên giả Tử Vi Xuyên Tam Diệm" : c!.field}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="bang-gia" className="dB-section" aria-labelledby="dB-price-h">
          <h2 id="dB-price-h" className="dB-h2">Bảng giá</h2>
          <div className="dB-prices">
            {groups.map((g) => (
              <div key={g.id} className="dB-price-col">
                <h3><Link href={g.href}>{g.name}</Link></h3>
                <ul>
                  {g.items.map((s) => (
                    <li key={s.id}>
                      <Link href={`/lien-he?topic=${s.group}&service=${s.id}`}>
                        <span className="dB-pname">{s.title}</span>
                        <span className="dB-pmeta">
                          <b>{formatPrice(s.price)}</b>
                          {s.duration && <span>{s.duration}</span>}
                        </span>
                        {s.note && <span className="dB-pnote">{s.note}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="dB-section dB-steps" aria-labelledby="dB-steps-h">
          <h2 id="dB-steps-h" className="dB-h2">Một phiên Xuyên vấn</h2>
          <ol>
            {STEPS.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="dB-section" aria-labelledby="dB-art-h">
          <h2 id="dB-art-h" className="dB-h2">Kiến thức</h2>
          <div className="dB-articles">
            {articles.map((a) => (
              <Link key={a.id} href={`/kien-thuc/${a.slug}`} className="dB-article">
                <span className="dB-article-img"><Image src={a.image} alt={a.imageAlt || a.title} fill sizes="(min-width: 900px) 33vw, 100vw" /></span>
                <small>{a.category}</small>
                <b>{a.title}</b>
              </Link>
            ))}
          </div>
          <p className="dB-more">
            <Link href="/kien-thuc" className="dB-link">Tất cả bài viết</Link>
            <Link href="/tra-dao" className="dB-link">Trà Đạo</Link>
            <Link href="/phat-hoc" className="dB-link">Phật học</Link>
          </p>
        </section>

        <section className="dB-dark dB-close">
          <CloudBand id="b-close" className="dB-close-cloud" />
          <h2>Mỗi cuộc trao đổi bắt đầu từ sự lắng nghe.</h2>
          <p>Để lại đôi dòng, Ngọc Âm hồi đáp trong một ngày làm việc.</p>
          <div className="dB-actions">
            <Link href="/lien-he" className="dB-btn">Đặt lịch Xuyên vấn</Link>
            {settings.zaloUrl && <a href={settings.zaloUrl} className="dB-btn dB-btn--ghost">Nhắn Zalo {settings.phone}</a>}
          </div>
        </section>
      </main>

      <footer className="dB-dark dB-foot">
        <p><b>Ngọc Âm</b></p>
        <p>{settings.address}</p>
        <p>{settings.phone}, {settings.workingHours}</p>
      </footer>
      <DraftBar current="b" />
    </div>
  );
}
