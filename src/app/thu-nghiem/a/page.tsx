import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { formatPrice } from "@/lib/service-constants";
import { getHomeData, PATHS, STEPS, LINEAGE } from "../data";
import { CloudBand, CloudMark, PATH_ICONS } from "../ornaments";
import DraftBar from "../DraftBar";
import "./a.css";

const display = Cormorant_Garamond({ subsets: ["latin", "vietnamese"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--da-display" });

export const metadata: Metadata = { title: "Hướng A · Song cửa Thiền — Ngọc Âm v2", robots: { index: false } };

export default async function DraftA() {
  const { groups, trang, tinh, articles, settings } = await getHomeData();

  return (
    <div className={`dA ${display.variable}`}>
      <header className="dA-head">
        <Link href="/thu-nghiem/a" className="dA-brand">
          <Image src="/images/logo-mark.png" alt="" width={34} height={34} />
          <span>Ngọc Âm</span>
        </Link>
        <nav aria-label="Chính" className="dA-nav">
          <Link href="/tu-vi">Tử Vi</Link>
          <Link href="/phong-thuy">Phong Thuỷ</Link>
          <Link href="/dai-chu-su">Đại Chủ Sự</Link>
          <Link href="/kien-thuc">Kiến thức</Link>
          <Link href="/ve-ngoc-am">Về Ngọc Âm</Link>
        </nav>
        <Link href="/lien-he" className="dA-btn dA-btn--small">Đặt lịch</Link>
      </header>

      <main>
        <section className="dA-hero">
          <h1>Hiểu mình. Thuận thế. Vững bước.</h1>
          <p className="dA-lede">Tử Vi và Phong Thuỷ của hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn, dành cho người muốn hiểu rõ mình trước khi chọn hướng đi.</p>
          <div className="dA-actions">
            <Link href="/lien-he" className="dA-btn">Đặt lịch Xuyên vấn</Link>
            <Link href="#bang-gia" className="dA-link">Xem bảng giá</Link>
          </div>
          <figure className="dA-window">
            <Image src="/images/20-homepage-hero-hue.webp" alt="Sông núi xứ Huế lúc bình minh, mái đình cổ bên triền núi" fill priority sizes="(min-width: 1100px) 1040px, 100vw" />
            <div className="dA-window-clouds" aria-hidden="true"><CloudBand id="a-hero" /></div>
          </figure>
        </section>

        <section className="dA-paths" aria-labelledby="dA-paths-h">
          <h2 id="dA-paths-h" className="dA-h2">Ba con đường đến Ngọc Âm</h2>
          <div className="dA-paths-grid">
            {PATHS.map((p) => {
              const Icon = PATH_ICONS[p.id];
              return (
                <article key={p.id} className="dA-path">
                  <Icon className="dA-icon" />
                  <h3>{p.name}</h3>
                  <p className="dA-path-line">{p.line}</p>
                  <p>{p.desc}</p>
                  <Link href={p.href} className="dA-link">{p.cta}</Link>
                </article>
              );
            })}
          </div>
        </section>

        <div className="dA-divider"><CloudMark /></div>

        <section className="dA-lineage" aria-labelledby="dA-lin-h">
          <h2 id="dA-lin-h" className="dA-h2">{LINEAGE.title}</h2>
          <blockquote>{LINEAGE.quote}</blockquote>
          <p className="dA-center">{LINEAGE.body}</p>
          <div className="dA-people">
            {[trang, tinh].filter(Boolean).map((c) => (
              <figure key={c!.slug} className="dA-person">
                {c!.photo && <Image src={c!.photo} alt={`Chân dung ${c!.name}`} width={120} height={150} />}
                <figcaption>
                  <b>{c!.name}</b>
                  <span>{c!.slug === "co-minh-trang" ? "Xuyên giả Tử Vi Xuyên Tam Diệm" : c!.field}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="bang-gia" className="dA-prices" aria-labelledby="dA-price-h">
          <h2 id="dA-price-h" className="dA-h2">Bảng giá</h2>
          {groups.map((g) => (
            <div key={g.id} className="dA-group">
              <h3><Link href={g.href}>{g.name}</Link></h3>
              <ul>
                {g.items.map((s) => (
                  <li key={s.id}>
                    <Link href={`/lien-he?topic=${s.group}&service=${s.id}`}>
                      <span className="dA-item">
                        <span className="dA-item-name">{s.title}</span>
                        {s.note && <small>{s.note}</small>}
                      </span>
                      <span className="dA-leader" aria-hidden="true" />
                      <span className="dA-price">
                        {formatPrice(s.price)}
                        {s.duration && <small>{s.duration}</small>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="dA-steps" aria-labelledby="dA-steps-h">
          <h2 id="dA-steps-h" className="dA-h2">Một phiên Xuyên vấn diễn ra thế nào</h2>
          <ol>
            {STEPS.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="dA-articles" aria-labelledby="dA-art-h">
          <h2 id="dA-art-h" className="dA-h2">Kiến thức</h2>
          <ul>
            {articles.map((a) => (
              <li key={a.id}>
                <Link href={`/kien-thuc/${a.slug}`}>
                  <span className="dA-thumb"><Image src={a.image} alt={a.imageAlt || a.title} fill sizes="160px" /></span>
                  <span>
                    <small>{a.category}</small>
                    <b>{a.title}</b>
                    <span className="dA-excerpt">{a.excerpt}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="dA-more">
            <Link href="/kien-thuc" className="dA-link">Tất cả bài viết</Link>
            <Link href="/tra-dao" className="dA-link">Trà Đạo</Link>
            <Link href="/phat-hoc" className="dA-link">Phật học</Link>
          </p>
        </section>

        <section className="dA-close">
          <h2>Mỗi cuộc trao đổi bắt đầu từ sự lắng nghe.</h2>
          <p>Để lại đôi dòng, Ngọc Âm hồi đáp trong một ngày làm việc.</p>
          <div className="dA-actions">
            <Link href="/lien-he" className="dA-btn">Đặt lịch Xuyên vấn</Link>
            {settings.zaloUrl && <a href={settings.zaloUrl} className="dA-link">Nhắn Zalo {settings.phone}</a>}
          </div>
        </section>
      </main>

      <footer className="dA-foot">
        <CloudBand id="a-foot" className="dA-foot-cloud" />
        <p><b>Ngọc Âm</b> · Tử Vi, Phong Thuỷ hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn</p>
        <p>{settings.address}</p>
        <p>{settings.phone} · {settings.workingHours}</p>
      </footer>
      <DraftBar current="a" />
    </div>
  );
}
