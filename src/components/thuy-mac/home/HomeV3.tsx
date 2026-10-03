import Image from "next/image";
import Link from "next/link";
import { getProductCategories } from "@/lib/products";
import { computeReadTime, getFeaturedArticles } from "@/lib/articles";
import { isSafeHttpUrl } from "@/lib/site-settings";
import { getHomeData, PATHS } from "../data";
import { calendarLeaf, dailyLine, vietnamToday } from "../calendar";
import { ASKS, servicesFor } from "../asks";
import Ask, { type AskItem } from "../Ask";
import Leaf from "../Leaf";
import { fromPrice } from "../HomeV2";
import { InkClose, InkPage, InkSection, STEPS } from "../kit";
import Philosophy from "@/components/Philosophy";
import { Chapter } from "../maison/Maison";
import { glue } from "../glue";
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

/** The three cards as the first site drew them: a label, the name, its key words, then the way in. */
const PILLARS: Record<string, { category: string; words: string[]; cta: string }> = {
  "tu-vi": { category: "Tử Vi", words: ["Xuyên vấn", "Định hướng", "Phát triển nội lực", "Chuyển hoá điều bất như ý"], cta: "Tìm hiểu Xuyên vấn Tử Vi" },
  "phong-thuy": { category: "Phong Thuỷ", words: ["Quan sát", "Tịnh hoá", "Hài hoà", "Tự chủ", "Thịnh vượng chân thật"], cta: "Tìm hiểu Tư vấn Phong Thuỷ" },
  "dai-chu-su": { category: "Đại Chủ Sự", words: ["Xuyên vấn", "Định hướng", "Phát triển doanh nghiệp"], cta: "Tìm hiểu Đại Chủ Sự" },
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
  // four notes, as the first site showed them
  const [{ groups, trang, tinh, khuong, settings }, categories, articles] = await Promise.all([getHomeData(), getProductCategories(), getFeaturedArticles(4)]);
  const { y, m, d } = vietnamToday();
  const prev = yesterday(y, m, d);
  const zalo = { url: isSafeHttpUrl(settings.zaloUrl) ? settings.zaloUrl : "", phone: settings.phone };

  const paths = PATHS.map((p) => ({ ...p, from: fromPrice(groups.find((g) => g.id === p.id)?.items ?? []) }));
  const allServices = groups.flatMap((g) => [...g.items]);
  const masters = [trang, tinh].filter((c) => !!c).map(toPortrait);
  const tea = khuong ? toPortrait(khuong) : null;

  const who = {
    "co-minh-trang": trang && { name: trang.name, role: "Xuyên Giả Tử Vi Xuyên Tam Diệm", photo: trang.photo },
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
          {/* the lineage is the page's title: on a laptop or desktop it is a large line with the
              reign under it; on a phone or tablet it is two set lines of capitals above the three scrolls */}
          <h1 className="hHero-kicker">
            <span>Hậu nhân Khâm Thiên Giám</span>
            <span>Vua Minh Mạng · triều Nguyễn</span>
          </h1>
          {/* the three scrolls */}
          <p className="ipScrolls hHero-h1">
            {["Hiểu Mình", "Thuận Thế", "Vững Bước"].map((s) => (
              <span key={s} className="ipScroll">
                {s.split(" ").map((w) => (
                  <span key={w}>{w} </span>
                ))}
              </span>
            ))}
          </p>
          {/* the lead (owner's wording, 2026-10-03): what is inherited, what we do with the visitor, what it leads to —
              three sentences, each its own line; compound words are glued (no-break space) so no line breaks inside one */}
          <p className="hHero-lede">
            <span>Kế thừa {"tinh\u00a0hoa"} {"tri\u00a0thức"} {"Tử\u00a0Vi,"} {"Phong\u00a0Thuỷ"} {"cổ\u00a0học."}</span>
            <span>Cùng bạn làm rõ {"căn\u00a0nguyên,"} {"thấu\u00a0hiểu"} {"bản\u00a0thân"} trong {"hoàn\u00a0cảnh."}</span>
            <span>{"Từ\u00a0đó,"} nhận diện điều cần {"thay\u00a0đổi"}<br className="hHero-ledeBr" /> và xác định hướng {"hành\u00a0động"}<br className="hHero-ledeBr hHero-ledeBr--narrow" /> {"cho\u00a0những"} {"quyết\u00a0định"} {"quan\u00a0trọng."}</span>
          </p>
          <div className="hHero-cta" data-hero-cta>
            {/* two ways only: book, or learn who Ngọc Âm is. Prices are public further down and on Dịch Vụ, not on the first screen. */}
            <Link href="/lien-he" className="hBtn">Đặt Lịch Xuyên Vấn</Link>
            <Link href="/ve-ngoc-am" className="hBtn hBtn--ghost">Về Ngọc Âm</Link>
          </div>
        </div>
      </header>

      {/* 2 · the three pillars, right after the opening, on v1's river painting */}
      <InkSection
        id="ba-con-duong"
        eyebrow="Ba trụ cột triết học"
        title={<>Kế thừa tri thức cổ,<br /> ứng dụng vào đời sống hiện đại.</>}
        backdrop={{ image: "/images/29-homepage-thuy-mac-song-huong.webp" }}
      >
        <ul className="hPaths">
          {paths.map((p) => (
            <li key={p.id} className="hPath ip-r">
              <Link href={p.href} className="hPath-img">
                <Image src={PATH_IMAGES[p.id].src} alt={PATH_IMAGES[p.id].alt} fill sizes="(min-width: 1024px) 33vw, 100vw" />
              </Link>
              <div className="hPath-text">
                <p className="hPath-cat">{PILLARS[p.id].category}</p>
                <h3><Link href={p.href}>{p.name}</Link></h3>
                <ul className="hPath-words">
                  {PILLARS[p.id].words.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
                <div className="hPath-cta">
                  {/* the card's name says what; the short label keeps this and the button on one row at every width */}
                  <Link href={p.href} className="hPath-more" aria-label={PILLARS[p.id].cta}>Tìm hiểu<span aria-hidden="true">→</span></Link>
                  <Link href={`/lien-he?topic=${p.id}`} className="hBtn hBtn--small">Đặt Lịch</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </InkSection>

      {/* 3 · the Xuyên giả, a chapter each: the people are why a client chooses Ngọc Âm */}
      {masters.map((p, i) => (
        <Chapter
          key={p.slug}
          id={i === 0 ? "xuyen-gia" : `xuyen-gia-${p.slug}`}
          portrait={p}
          field={p.field}
          title={p.name}
          about={p.about}
          view={p.view}
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

      {/* 6 · services and the way of a session, as one: what a session is (title), where it leads (lead), its six movements, then every session and price on Dịch Vụ */}
      <InkSection
        id="trai-nghiem"
        eyebrow="Dịch vụ tư vấn"
        title={<>{glue("Mỗi phiên Xuyên vấn là một góc nhìn")}<br className="hWay-br" /> được chuẩn bị riêng cho bạn.</>}
        intro={<p className="hWay-lead">Không chỉ xem vận, mà hiểu đường đi.</p>}
        tone="raised"
        backdrop={{ image: "/images/04-trai-nghiem-khai-van.png", position: "bottom" }}
      >
        <ol className="hWay">
          {STEPS.map((st, i) => (
            <li key={st.label} className="ip-r">
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{st.label}</h3>
              <p>{st.desc}</p>
            </li>
          ))}
        </ol>
        <p className="hSvc-all ip-r">
          <Link href="/dich-vu" className="mBtn mBtn--line">Xem Tất Cả Dịch Vụ</Link>
        </p>
      </InkSection>

      {/* 7b · Trà Đạo, a chapter of its own, like the Xuyên giả */}
      {tea && (
        <Chapter
          id="tra-dao"
          portrait={tea}
          field="Trà Sư Ngọc Âm"
          title={tea.name}
          about={tea.about}
          view={["Thuận trà, thuận thuỷ, thuận thời, thuận tâm."]}
          reverse
          backdrop={{ image: "/images/pillars/tra-dao.png" }}
          portraitHref="/tra-dao"
        >
          <Link href="/tra-dao" className="mBtn mBtn--line">Tìm Hiểu Trà Đạo</Link>
          <Link href={`/xuyen-gia/${tea.slug}`} className="ipLink">Chân dung {tea.name}</Link>
        </Chapter>
      )}

      {/* 8 · the lineage, laid out as on the first site (picture, label, title, quote, two paragraphs), with this site's way in */}
      <InkSection id="ve-ngoc-am" backdrop={{ image: "/images/07-hau-nhan-kham-thien-giam.png", position: "top" }}>
        <div className="hAbout">
          <div className="hAbout-img ip-r">
            <Image src="/images/23-homepage-heritage-study.webp" alt="Thư phòng cổ Việt Nam nhìn ra sân nhà" fill sizes="(min-width: 900px) 560px, 100vw" />
          </div>
          <div className="hAbout-text ip-r">
            <p className="ipEyebrow">Hậu nhân Khâm Thiên Giám</p>
            <h2 className="ipH2">{glue("Từ truyền thống của triều Nguyễn")}<br className="hAbout-br" /> đến đời sống hiện đại.</h2>
            <p className="hAbout-quote">“Kế thừa tri thức chiêm tinh, lịch pháp và phong thuỷ cung đình từ Khâm Thiên Giám thời vua Minh Mạng, triều Nguyễn.”</p>
            <p>
              Ngọc Âm được hình thành từ một mạch truyền thừa tri thức phương Đông — chiêm tinh, lịch pháp, địa lý và phong thuỷ — vốn được lưu giữ và nghiên cứu qua nhiều thế hệ trong dòng họ có liên hệ với Khâm Thiên Giám dưới triều Nguyễn.
            </p>
            <p>
              Chúng tôi tiếp cận tri thức ấy không phải để dự đoán, mà để cùng bạn quan sát rõ hơn bản thân và hoàn cảnh, từ đó đưa ra những lựa chọn có cân nhắc và vững vàng hơn trên hành trình phát triển của chính mình.
            </p>
            <Link href="/ve-ngoc-am" className="ipLink">Tìm hiểu Ngọc Âm</Link>
          </div>
        </div>
      </InkSection>

      {/* 9 · Vật phẩm */}
      {categories.length > 0 && (
        <InkSection id="vat-pham" backdrop={{ image: "/images/08-vat-pham-ngoc-am.png", position: "top" }}>
          {/* the first site's head: the name and one sentence on the left, the ways on on the right; then the four kinds */}
          <div className="hNotes-head hGoods-head ip-r">
            <div>
              <h2 className="ipH2">Vật Phẩm Ngọc Âm</h2>
              <p className="hGoods-lead">Ngọc phỉ thuý, đá và đồ phong thuỷ được Ngọc Âm tuyển chọn như một phần mở rộng của hành trình tư vấn, luôn đi kèm lời khuyên trực tiếp.</p>
            </div>
            <p className="hGoods-more">
              <Link href="/cua-hang" className="ipLink">Xem tất cả vật phẩm</Link>
              {zalo.url && (
                <a href={zalo.url} className="ipLink">Hỏi qua Zalo</a>
              )}
            </p>
          </div>
          <ul className="hGoods">
            {categories.slice(0, 4).map((c) => (
              <li key={c.id} className="ip-r">
                <Link href="/cua-hang">
                  <span className="hGoods-img">
                    {c.image ? <Image src={c.image} alt={c.imageAlt ?? c.name} fill sizes="(min-width: 1024px) 300px, 45vw" /> : <StillLifeStone className="hGoods-stone" />}
                  </span>
                  <b>{c.name}</b>
                </Link>
              </li>
            ))}
          </ul>
        </InkSection>
      )}

      {/* 10 · Sổ tay */}
      {articles.length > 0 && (
        <InkSection id="so-tay" tone="raised" backdrop={{ image: "/images/06-thuy-mac-song-huong.webp" }}>
          {/* the first site's notes: label, title and the way to all of them on one row, then a card for each */}
          <div className="hNotes-head ip-r">
            {/* the section title, set like every other section title on the page */}
            <h2 className="ipH2">Ngọc Âm Kiến Thức</h2>
            <Link href="/kien-thuc" className="ipLink">Xem tất cả bài viết</Link>
          </div>
          <ul className="hNotes">
            {articles.map((n) => (
              <li key={n.id} className="hNote ip-r">
                <div className="hNote-img">
                  <Image src={n.image} alt={n.imageAlt || n.title} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                </div>
                <div className="hNote-text">
                  <p className="hNote-cat">{n.category}</p>
                  <h3>{n.title}</h3>
                  <p className="hNote-desc">{n.excerpt}</p>
                  <p className="hNote-time">{computeReadTime(n.body)}</p>
                  {/* the link's hit area covers the whole card */}
                  <Link href={`/kien-thuc/${n.slug}`} className="hNote-more" aria-label={`Đọc bài: ${n.title}`}>
                    Đọc bài<span aria-hidden="true">→</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </InkSection>
      )}

      {/* the Ngọc Âm spirit closes the page's content, just before the invitation to write; the first site's component */}
      <div id="tinh-than" className="hSpiritV1">
        <Philosophy />
      </div>

      <InkClose />
    </InkPage>
  );
}
