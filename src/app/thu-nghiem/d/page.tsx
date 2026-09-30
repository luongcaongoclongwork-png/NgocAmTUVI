import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Noto_Serif_Display } from "next/font/google";
import { formatPrice } from "@/lib/service-constants";
import { getHomeData, LINEAGE, PATHS } from "../data";
import { PATH_ICONS } from "../ornaments";
import DraftBar from "../DraftBar";
import { calendarLeaf, dailyLine, lunarDateLabel, vietnamToday, type CalendarLeaf } from "./calendar";
import { ASKS, servicesFor } from "./asks";
import Ask, { type AskItem } from "./Ask";
import NowHour from "./NowHour";
import "./d.css";

const numerals = Noto_Serif_Display({ subsets: ["latin", "vietnamese"], weight: ["300", "500"], variable: "--dd-num" });
const display = Cormorant_Garamond({ subsets: ["latin", "vietnamese"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--dd-display" });

export const metadata: Metadata = { title: "Hướng D · Lịch Khâm Thiên Giám — Ngọc Âm v2", robots: { index: false } };

// A new calendar leaf every day (Vietnam time): re-render at most every 10 minutes.
export const revalidate = 600;

function Leaf({ leaf, line, className = "", hidden = false }: { leaf: CalendarLeaf; line?: string; className?: string; hidden?: boolean }) {
  const { solar, lunar, term } = leaf;
  return (
    <div className={`dD-leaf ${className}`} aria-hidden={hidden || undefined}>
      <div className="dD-rings" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => <span key={i} />)}
      </div>
      <p className="dD-solar">
        {solar.weekday}, ngày {solar.d} tháng {solar.m} năm {solar.y}
      </p>
      <p className="dD-bigday">
        <span className="dD-bigday-num">{lunar.day}</span>
        <span className="dD-bigday-month">{lunar.month}, năm {lunar.year.vi}</span>
      </p>
      <dl className="dD-cc">
        {[
          ["Năm", lunar.year],
          ["Tháng", lunar.monthCC],
          ["Ngày", lunar.dayCC],
        ].map(([k, v]) => {
          const cc = v as { vi: string; han: string };
          return (
            <div key={k as string}>
              <dt>{k as string}</dt>
              <dd>
                <span className="dD-han" lang="zh-Hant">{cc.han}</span>
                {cc.vi}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="dD-term">
        <b>Tiết {term.name}</b>, ngày thứ {term.day}. {term.note} <span>Tiết {term.next} bắt đầu ngày {term.nextDate}.</span>
      </p>
      {!hidden && <NowHour hours={leaf.hours} />}
      {line && <p className="dD-line">{line}</p>}
    </div>
  );
}

export default async function DraftD() {
  const { groups, trang, tinh, articles, settings } = await getHomeData();
  const { y, m, d } = vietnamToday();
  const today = calendarLeaf(y, m, d);
  const yd = new Date(Date.UTC(y, m - 1, d - 1));
  const yesterday = calendarLeaf(yd.getUTCFullYear(), yd.getUTCMonth() + 1, yd.getUTCDate());

  const allServices = groups.flatMap((g) => [...g.items]);
  const people = {
    "co-minh-trang": trang && { name: trang.name, role: "Xuyên giả Tử Vi Xuyên Tam Diệm", photo: trang.photo },
    "thay-tinh": tinh && { name: tinh.name, role: tinh.field, photo: tinh.photo },
  };
  const items: AskItem[] = ASKS.map((a) => ({
    id: a.id,
    label: a.label,
    hint: a.hint,
    reply: a.reply,
    services: servicesFor(a.match, allServices),
    who: people[a.who] || null,
  })).filter((a) => a.services.length > 0);

  return (
    <div className={`dD ${numerals.variable} ${display.variable}`}>
      <header className="dD-head">
        <Link href="/thu-nghiem/d" className="dD-brand">
          <Image src="/images/logo-mark.png" alt="" width={32} height={32} />
          <span>Ngọc Âm</span>
        </Link>
        <nav aria-label="Chính" className="dD-nav">
          <Link href="/tu-vi">Tử Vi</Link>
          <Link href="/phong-thuy">Phong Thuỷ</Link>
          <Link href="/dai-chu-su">Đại Chủ Sự</Link>
          <Link href="/kien-thuc">Sổ tay</Link>
          <Link href="/ve-ngoc-am">Về Ngọc Âm</Link>
        </nav>
        <Link href="/lien-he" className="dD-btn dD-btn--small">Đặt lịch</Link>
      </header>

      <main>
        <section className="dD-first" aria-label="Lịch hôm nay và câu hỏi">
          <div className="dD-leafstack">
            <Leaf leaf={today} line={dailyLine(y, m, d)} />
            <Leaf leaf={yesterday} className="dD-leaf--turn" hidden />
            <p className="dD-caption">Lịch hôm nay, tính theo lối Khâm Thiên Giám triều Nguyễn.</p>
          </div>
          <Ask items={items} zalo={{ url: settings.zaloUrl, phone: settings.phone }} />
        </section>

        <section className="dD-house" aria-labelledby="dD-house-h">
          <div className="dD-house-text">
            <h2 id="dD-house-h">Ngọc Âm</h2>
            <p className="dD-house-lead">Khâm Thiên Giám là nơi coi thiên văn, làm lịch và chọn ngày cho triều Nguyễn. Ngọc Âm là {LINEAGE.title.charAt(0).toLowerCase() + LINEAGE.title.slice(1)}.</p>
            <p>{LINEAGE.body}</p>
          </div>
          <ul className="dD-doors">
            {PATHS.map((p) => {
              const Icon = PATH_ICONS[p.id];
              return (
                <li key={p.id}>
                  <Link href={p.href}>
                    <Icon className="dD-door-icon" />
                    <span>
                      <b>{p.name}</b>
                      {p.line}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="dD-notes" aria-labelledby="dD-notes-h">
          <h2 id="dD-notes-h">Sổ tay</h2>
          <ol>
            {articles.map((a) => (
              <li key={a.id}>
                <Link href={`/kien-thuc/${a.slug}`}>
                  <time dateTime={a.createdAt.slice(0, 10)}>{lunarDateLabel(a.createdAt)}</time>
                  <b>{a.title}</b>
                  <span>{a.excerpt}</span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="dD-notes-more">
            <Link href="/kien-thuc" className="dD-link">Mở cả cuốn sổ tay</Link>
            <Link href="/tra-dao" className="dD-link">Trà Đạo</Link>
            <Link href="/phat-hoc" className="dD-link">Phật học</Link>
          </p>
        </section>

        <section className="dD-prices" aria-labelledby="dD-prices-h">
          <h2 id="dD-prices-h">Toàn bộ bảng giá</h2>
          {groups.map((g) => (
            <details key={g.id}>
              <summary>
                {g.name}
                <span>{g.items.length} phiên</span>
              </summary>
              <ul>
                {g.items.map((s) => (
                  <li key={s.id}>
                    <Link href={`/lien-he?topic=${s.group}&service=${s.id}`}>
                      <span>{s.title}</span>
                      <b>
                        {formatPrice(s.price)}
                        {s.duration && <small>{s.duration}</small>}
                      </b>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </section>
      </main>

      <footer className="dD-foot">
        <p><b>Ngọc Âm</b> Tử Vi, Phong Thuỷ hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn</p>
        <p>{settings.address}</p>
        <p>{settings.phone}, {settings.workingHours}</p>
      </footer>
      <DraftBar current="d" />
    </div>
  );
}
