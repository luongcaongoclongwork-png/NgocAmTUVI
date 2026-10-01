import Image from "next/image";
import Link from "next/link";
import { getProductCategories } from "@/lib/products";
import { isSafeHttpUrl } from "@/lib/site-settings";
import { getHomeData, LINEAGE, PATHS } from "../data";
import { calendarLeaf, dailyLine, vietnamToday } from "../calendar";
import { ASKS, servicesFor } from "../asks";
import Ask, { type AskItem } from "../Ask";
import Leaf from "../Leaf";
import { fromPrice } from "../HomeV2";
import { InkClose, InkNotes, InkPage, InkSection, InkServices, InkSteps } from "../kit";
import Philosophy from "@/components/Philosophy";
import { Chapter, LineageWhisper } from "../maison/Maison";
import { toPortrait } from "../maison/people";
import { StillLifeStone } from "@/components/illustrations";
import HeroInk from "./HeroInk";
import "../thuy-mac.css";
import "../leaf.css";
import "./home.css";

/** v1's pillar photographs for the three paths; Đại Chủ Sự uses its own page's study. */
const PATH_IMAGES: Record<(typeof PATHS)[number]["id"], { src: string; alt: string }> = {
  "tu-vi": { src: "/images/pillars/tu-vi.webp", alt: "Lá số Tử Vi viết tay trên bàn gỗ cổ" },
  "phong-thuy": { src: "/images/pillars/phong-thuy.webp", alt: "Hành lang gỗ bên hồ nước trong sân nhà cổ" },
  "dai-chu-su": { src: "/images/23-homepage-heritage-study.webp", alt: "Thư phòng cổ Việt Nam nhìn ra sân nhà" },
};

function yesterday(y: number, m: number, d: number) {
  const t = new Date(Date.UTC(y, m - 1, d - 1));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

/**
 * v3 home, "Thuỷ Mặc Dễ Dùng": v1's paintings and everything v1's home had
 * (three pillars with Trà Đạo, the Xuyên giả, prices, process, lineage,
 * Khương–Lạc–Tịnh, Sổ tay, Vật phẩm), told with v2's ink: a one-second ink
 * bleed, the Cửu Đỉnh carving, the calendar leaf and the question. Nothing is
 * pinned; prices and booking are on the first screen.
 */
export default async function HomeV3() {
  const [{ groups, trang, tinh, khuong, articles, settings }, categories] = await Promise.all([getHomeData(), getProductCategories()]);
  const { y, m, d } = vietnamToday();
  const prev = yesterday(y, m, d);
  const zalo = { url: isSafeHttpUrl(settings.zaloUrl) ? settings.zaloUrl : "", phone: settings.phone };

  const paths = PATHS.map((p) => ({ ...p, from: fromPrice(groups.find((g) => g.id === p.id)?.items ?? []) }));
  const allServices = groups.flatMap((g) => [...g.items]);
  const featured = groups.map((g) => g.items[0]).filter(Boolean);
  const masters = [trang, tinh].filter((c) => !!c).map(toPortrait);
  const tea = khuong ? toPortrait(khuong) : null;

  const who = {
    "co-minh-trang": trang && { name: trang.name, role: "Xuyên giả Tử Vi Xuyên Tam Diệm", photo: trang.photo },
    "thay-tinh": tinh && { name: tinh.name, role: tinh.field, photo: tinh.photo },
  };
  const askItems: AskItem[] = ASKS.map((a) => ({
    id: a.id,
    label: a.label,
    hint: a.hint,
    reply: a.reply,
    services: servicesFor(a.match, allServices),
    who: who[a.who] || null,
  })).filter((a) => a.services.length > 0);

  return (
    <InkPage>
      {/* 1 · the pavilion, prices and booking on the first screen */}
      <header className="hHero">
        <HeroInk src="/images/20-homepage-hero-hue.webp" alt="Nhà lầu cổ nhìn ra sông trong sương sớm" />
        <div className="hHero-body">
          <p className="hHero-kicker">Hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn</p>
          <h1 className="ipScrolls hHero-h1">
            {["Hiểu mình", "Thuận thế", "Vững bước"].map((s) => (
              <span key={s} className="ipScroll">
                {s.split(" ").map((w) => (
                  <span key={w}>{w} </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="hHero-lede">Từ sự quan sát, Xuyên vấn và định hướng, tìm ra sự hài hoà giữa con người và hoàn cảnh để vượt qua những điều bất như ý.</p>
          <div className="hHero-cta">
            {/* two ways only: book, or learn who Ngọc Âm is. Prices are public further down and on Bảng Giá, not on the first screen. */}
            <Link href="/lien-he" className="hBtn">Đặt Lịch Xuyên Vấn</Link>
            <Link href="/ve-ngoc-am" className="hBtn hBtn--ghost">Về Ngọc Âm</Link>
          </div>
        </div>
      </header>

      {/* 2 · the lineage, said once */}
      <LineageWhisper line={LINEAGE.quote} />

      {/* 3 · the Xuyên giả, a chapter each: the people are why a client chooses Ngọc Âm */}
      {masters.map((p, i) => (
        <Chapter
          key={p.slug}
          id={i === 0 ? "xuyen-gia" : `xuyen-gia-${p.slug}`}
          portrait={p}
          field={p.field}
          title={p.name}
          about={p.about}
          view={p.view[0]}
          reverse={i % 2 === 1}
          tone={i % 2 === 0 ? "raised" : "paper"}
          backdrop={i === 0 ? { image: "/images/02-truyen-nhan-khai-van.png", position: "right bottom" } : undefined}
          portraitHref={`/xuyen-gia/${p.slug}`}
        >
          <Link href={`/xuyen-gia/${p.slug}`} className="mBtn mBtn--line">Chân Dung Và Các Phiên</Link>
          <Link href={`/lien-he?topic=${p.topic}`} className="ipLink">{p.group === "tu-vi" ? "Đặt Lịch Xuyên Vấn Cùng Cô" : "Đặt Lịch Tư Vấn Cùng Thầy"}</Link>
        </Chapter>
      ))}

      {/* 3 · today's leaf and one question */}
      <section className="eS4 hAsk" aria-label="Lịch hôm nay và câu hỏi">
        <div className="eS4-water" aria-hidden="true" />
        <div className="eS4-grid">
          <div className="eS4-leaf">
            <div className="hLeaf">
              <Leaf leaf={calendarLeaf(y, m, d)} line={dailyLine(y, m, d)} />
              {/* yesterday's sheet turns away once, as the leaf comes into view */}
              <div className="hLeaf-prev" aria-hidden="true">
                <Leaf leaf={calendarLeaf(prev.y, prev.m, prev.d)} hidden />
              </div>
            </div>
            <p className="eS4-caption">Lịch hôm nay, tính theo lối Khâm Thiên Giám triều Nguyễn.</p>
          </div>
          <Ask items={askItems} zalo={zalo} />
        </div>
      </section>

      {/* 4 · three paths, and Trà Đạo beside them, on v1's river painting */}
      <InkSection
        id="ba-con-duong"
        title="Kế thừa tri thức cổ, ứng dụng vào đời sống hiện đại."
        backdrop={{ image: "/images/29-homepage-thuy-mac-song-huong.webp" }}
      >
        <ul className="hPaths">
          {paths.map((p) => (
            <li key={p.id} className="hPath ip-r">
              <Link href={p.href} className="hPath-img">
                <Image src={PATH_IMAGES[p.id].src} alt={PATH_IMAGES[p.id].alt} fill sizes="(min-width: 1024px) 33vw, 100vw" />
              </Link>
              <div className="hPath-text">
                <h3><Link href={p.href}>{p.name}</Link></h3>
                <p>{p.line}</p>
                {p.from && <p className="hPath-price">Từ <b>{p.from}</b></p>}
                <div className="hPath-cta">
                  <Link href={p.href} className="ipLink">{p.cta}</Link>
                  <Link href={`/lien-he?topic=${p.id}`} className="hBtn hBtn--small">Đặt Lịch</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </InkSection>

      {/* 6 · one session from each path, on the ink river */}
      <InkSection
        id="phien-tieu-bieu"
        title="Phiên Xuyên vấn tiêu biểu"
        intro={<p>Mỗi phiên được chuẩn bị riêng theo câu hỏi và hoàn cảnh của bạn. <Link href="/dich-vu" className="ipLink">Xem toàn bộ Bảng Giá</Link></p>}
        backdrop={{ image: "/images/03-dich-vu-tu-van.png", position: "bottom" }}
      >
        <InkServices items={featured} />
      </InkSection>

      {/* 7 · the session */}
      <InkSection
        id="quy-trinh"
        title="Một phiên Xuyên vấn"
        intro={<p>Mỗi phiên là một cuộc đối thoại riêng, được chuẩn bị theo câu hỏi và hoàn cảnh của bạn.</p>}
        tone="raised"
        backdrop={{ image: "/images/04-trai-nghiem-khai-van.png", position: "bottom" }}
      >
        <InkSteps />
      </InkSection>

      {/* 7b · Trà Đạo, a chapter of its own, like the Xuyên giả */}
      {tea && (
        <Chapter
          id="tra-dao"
          portrait={tea}
          field={`${tea.name}, Trà Sư Ngọc Âm`}
          title="Trà Đạo Ngọc Âm"
          about={tea.about}
          view="Thuận trà, thuận thuỷ, thuận thời, thuận tâm."
          reverse
          backdrop={{ image: "/images/pillars/tra-dao.png" }}
          portraitHref="/tra-dao"
        >
          <Link href="/tra-dao" className="mBtn mBtn--line">Tìm Hiểu Trà Đạo</Link>
          <Link href={`/xuyen-gia/${tea.slug}`} className="ipLink">Chân dung {tea.name}</Link>
        </Chapter>
      )}

      {/* 8 · lineage and the Ngọc Âm spirit */}
      <InkSection id="ve-ngoc-am" backdrop={{ image: "/images/07-hau-nhan-kham-thien-giam.png", position: "top" }}>
        <div className="hAbout">
          <span className="hAbout-img ipPortrait">
            <Image src="/images/23-homepage-heritage-study.webp" alt="Thư phòng cổ Việt Nam nhìn ra sân nhà" fill sizes="(min-width: 900px) 40vw, 90vw" />
          </span>
          <div className="ip-r">
            <h2 className="ipH2">Về Ngọc Âm</h2>
            <p className="hAbout-quote">{LINEAGE.quote}</p>
            <p>{LINEAGE.body}</p>
            <Link href="/ve-ngoc-am" className="ipLink">Tìm hiểu Ngọc Âm</Link>
          </div>
        </div>
      </InkSection>
      {/* the owner asked for this section exactly as on the first site: the v1 component, unchanged */}
      <div id="tinh-than" className="hSpiritV1">
        <Philosophy />
      </div>

      {/* 9 · Sổ tay */}
      {articles.length > 0 && (
        <InkSection
          id="so-tay"
          title="Mới trong Sổ Tay"
          intro={<Link href="/kien-thuc" className="ipLink">Xem tất cả bài viết</Link>}
          tone="raised"
          backdrop={{ image: "/images/06-thuy-mac-song-huong.webp" }}
        >
          <InkNotes articles={articles} />
        </InkSection>
      )}

      {/* 10 · Vật phẩm */}
      {categories.length > 0 && (
        <InkSection
          id="vat-pham"
          title="Vật phẩm đồng hành, không phải trọng tâm."
          intro={<p>Ngọc phỉ thuý, đá và đồ phong thuỷ được Ngọc Âm tuyển chọn như một phần mở rộng của hành trình tư vấn, luôn đi kèm lời khuyên trực tiếp.</p>}
          backdrop={{ image: "/images/08-vat-pham-ngoc-am.png", position: "top" }}
        >
          <ul className="hGoods">
            {categories.slice(0, 4).map((c) => (
              <li key={c.id} className="ip-r">
                <Link href="/cua-hang">
                  <span className="hGoods-img">
                    {c.image ? <Image src={c.image} alt={c.imageAlt ?? c.name} fill sizes="(min-width: 1024px) 280px, 45vw" /> : <StillLifeStone className="hGoods-stone" />}
                  </span>
                  <b>{c.name}</b>
                </Link>
              </li>
            ))}
          </ul>
          <p className="hGoods-more">
            <Link href="/cua-hang" className="ipLink">Xem tất cả vật phẩm</Link>
            {zalo.url && (
              <a href={zalo.url} className="ipLink">Hỏi qua Zalo</a>
            )}
          </p>
        </InkSection>
      )}

      <InkClose />
    </InkPage>
  );
}
