import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { formatPrice, type Service } from "@/lib/service-constants";
import type { Article } from "@/lib/article-constants";
import { computeReadTime } from "@/lib/articles";
import { getSiteSettings, isSafeHttpUrl } from "@/lib/site-settings";
import { CuuDinhLandscape } from "./ornaments";
import { lunarDateLabel } from "./calendar";
import JsonLd, { priceNumber } from "./JsonLd";
import { absoluteUrl } from "@/lib/site-url";
import "./chrome.css";
import InkButtons from "./InkButtons";
import "./kit.css";
import "./type.css";

/**
 * The Thuỷ Mặc page kit: every public page is built from these pieces so the
 * whole site reads as one ink painting. Motion is CSS only (a load-time ink
 * bleed and scroll-driven reveals where the browser supports them); without
 * it everything is simply visible.
 */

/** Page root: paper, tokens, fonts. */
export function InkPage({ children }: { children: ReactNode }) {
  return (
    <div className="ip">
      {children}
      <InkButtons />
    </div>
  );
}

/**
 * The opening: a painting bleeds in from a drop of ink, the page title hangs
 * as scrolls (one per phrase, words stacked), a lede below.
 */
export function InkHero({
  image,
  alt = "",
  scrolls,
  lede,
  quote,
  compact = false,
  focus = "50% 50%",
}: {
  /** Leave out when the page draws its own background behind the hero (Lập lá số). */
  image?: string;
  alt?: string;
  /** The H1, one hanging scroll per phrase. */
  scrolls: string[];
  lede?: ReactNode;
  quote?: string;
  compact?: boolean;
  focus?: string;
}) {
  return (
    <header className={`ipHero ${compact ? "ipHero--compact" : ""} ${image ? "" : "ipHero--bare"}`}>
      {image && (
        <div className="ipHero-paint">
          <Image src={image} alt={alt} fill priority sizes="100vw" style={{ objectPosition: focus }} />
        </div>
      )}
      <div className="ipHero-body">
        <h1 className="ipScrolls">
          {scrolls.map((s) => (
            <span key={s} className="ipScroll">
              {/* each word ends with a space: invisible in the stacked layout, but read as separate words by search engines and screen readers */}
              {s.split(" ").map((w, i) => (
                <span key={i}>{w} </span>
              ))}
            </span>
          ))}
        </h1>
        {lede && <div className="ipHero-lede">{lede}</div>}
        {quote && <blockquote className="ipHero-quote">{quote}</blockquote>}
      </div>
    </header>
  );
}

/** A section with a brush-reveal heading; `backdrop` lays one of v1's section paintings under a paper veil. */
export function InkSection({
  id,
  eyebrow,
  title,
  intro,
  children,
  tone = "paper",
  narrow = false,
  backdrop,
}: {
  id?: string;
  /** A short label above the title, only where it names the group (v1's "Ba trụ cột triết học"). */
  eyebrow?: string;
  /** Usually a string; a node where the title has a set line break. */
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  tone?: "paper" | "raised" | "ink";
  narrow?: boolean;
  /** position: where the painting's detail sits, so it survives a phone crop (v1's SectionBackdrop). */
  backdrop?: { image: string; position?: string };
}) {
  const hid = id ? `${id}-h` : undefined;
  return (
    <section id={id} className={`ipSec ipSec--${tone} ${backdrop ? "ipSec--backdrop" : ""}`} aria-labelledby={title ? hid : undefined}>
      {backdrop && <Image src={backdrop.image} alt="" fill sizes="100vw" className="ipSec-bg" style={{ objectPosition: backdrop.position ?? "center" }} />}
      <div className={`ipSec-inner ${narrow ? "ipSec-inner--narrow" : ""}`}>
        {eyebrow && <p className="ipEyebrow ip-r">{eyebrow}</p>}
        {title && (
          <h2 id={hid} className="ipH2 ip-r">
            {title}
          </h2>
        )}
        {intro && <div className="ipIntro ip-r">{intro}</div>}
        {children}
      </div>
    </section>
  );
}

/** Principles / glossary as hanging scrolls. */
export function Scrolls({ items }: { items: { word: string; desc: string }[] }) {
  return (
    <ul className="ipHang">
      {items.map((it) => (
        <li key={it.word} className="ipHang-item ip-r">
          <b>{it.word}</b>
          <p>{it.desc}</p>
        </li>
      ))}
    </ul>
  );
}

/** Packages as points along an ink river. */
export function InkServices({ items }: { items: readonly Service[] }) {
  // Each package as a schema.org Service with its price, so search results and assistants quote it right.
  const services = {
    "@type": "ItemList",
    itemListElement: items.map((s, i) => {
      const price = priceNumber(s.price);
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: s.title,
          description: s.desc,
          provider: { "@type": "LocalBusiness", name: "Ngọc Âm", url: absoluteUrl("/") },
          ...(price ? { offers: { "@type": "Offer", price, priceCurrency: "VND", url: absoluteUrl(`/lien-he?topic=${s.group}&service=${s.id}`) } } : {}),
        },
      };
    }),
  };
  return (
    <>
      <JsonLd data={services} />
      <ol className="ipRiver">
        {items.map((s) => (
          <li key={s.id} className="ipRiver-item ip-r">
            <span className="ipRiver-node" aria-hidden="true" />
            <div className="ipRiver-text">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {s.note && <p className="ipRiver-note">{s.note}</p>}
            </div>
            <div className="ipRiver-buy">
              <b>{formatPrice(s.price)}</b>
              {s.duration && <span>{s.duration}</span>}
              <Link href={`/lien-he?topic=${s.group}&service=${s.id}`} className="ipBtn">Đặt Phiên Này</Link>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

/** A person, their portrait washing in like ink. */
export function InkPerson({
  name,
  role,
  photo,
  bio,
  href,
  cta,
  reverse = false,
}: {
  name: string;
  role: string;
  photo: string;
  bio: string;
  href?: string;
  cta?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`ipPerson ${reverse ? "ipPerson--rev" : ""}`}>
      <span className="ipPortrait">{photo && <Image src={photo} alt={`Chân dung ${name}`} fill sizes="(min-width: 900px) 34vw, 80vw" />}</span>
      <div className="ipPerson-text ip-r">
        <p className="ipPerson-role">{role}</p>
        <h3>{name}</h3>
        {bio.split(/\n+/).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {href && cta && (
          <Link href={href} className="ipLink">
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}

/** The consultation, as a real sequence. */
export const STEPS = [
  { label: "Lắng nghe", desc: "Thấu hiểu hoàn cảnh, mối bận tâm và câu hỏi thật sự của bạn." },
  { label: "Quan sát", desc: "Đọc Diệm Bản hoặc không gian sống bằng góc nhìn tổng thể, không vội kết luận." },
  { label: "Xuyên vấn", desc: "Đối thoại trực tiếp, làm rõ những điểm mấu chốt đang ảnh hưởng đến bạn." },
  { label: "Định hướng", desc: "Gợi mở các hướng đi khả dĩ, cùng bạn cân nhắc được mất của từng lựa chọn." },
  { label: "Hành động", desc: "Chuyển định hướng thành những bước đi cụ thể, phù hợp với hoàn cảnh thực tế." },
  { label: "Chuyển hoá", desc: "Nhìn lại và điều chỉnh theo thời gian, để điều bất như ý trở thành bài học." },
];

export function InkSteps({ steps = STEPS }: { steps?: { label: string; desc: string }[] }) {
  return (
    <ol className="ipSteps">
      {steps.map((s) => (
        <li key={s.label} className="ip-r">
          <b>{s.label}</b>
          <p>{s.desc}</p>
        </li>
      ))}
    </ol>
  );
}

/** Cửu Đỉnh engraving that carves itself as it scrolls into view. */
export function InkEngrave() {
  return (
    <div className="ipEngrave" aria-hidden="true">
      <CuuDinhLandscape />
    </div>
  );
}

export function solarDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

/** Sổ tay entries: both dates, a reading time counted from the text, thumbnails washed to ink. */
export function InkNotes({ articles, lead = false }: { articles: Article[]; lead?: boolean }) {
  return (
    <ol className={`ipNotes ${lead ? "ipNotes--lead" : ""}`}>
      {articles.map((a) => (
        <li key={a.id} className="ip-r">
          <Link href={`/kien-thuc/${a.slug}`}>
            <span className="ipNotes-img">
              <Image src={a.image} alt={a.imageAlt || a.title} fill sizes="(min-width: 900px) 320px, 40vw" />
            </span>
            <span className="ipNotes-text">
              <small>
                {a.category}, {solarDate(a.createdAt)} ({lunarDateLabel(a.createdAt)}), {computeReadTime(a.body)}
              </small>
              <b>{a.title}</b>
              <span>{a.excerpt}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** Long-form reading. */
export function InkProse({ children }: { children: ReactNode }) {
  return <div className="ipProse">{children}</div>;
}

/** Closing: a drop of ink that opens into the booking button, over the v1 "mặc trầm" painting. */
const CLOSE_TITLE = "Mỗi cuộc trao đổi bắt đầu từ sự lắng nghe.";

export async function InkClose({
  title = CLOSE_TITLE,
  text = "Để lại đôi dòng, Ngọc Âm hồi đáp trong một ngày làm việc.",
  href = "/lien-he",
  label = "Đặt Lịch Xuyên Vấn",
}: {
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  const settings = await getSiteSettings();
  const zalo = isSafeHttpUrl(settings.zaloUrl) ? settings.zaloUrl : "";
  return (
    <section className="ipClose" aria-labelledby="ipClose-h">
      <Image src="/images/06-dat-lich-mac-tram.png" alt="" fill sizes="100vw" className="ipClose-bg" />
      <InkEngrave />
      <div className="ipClose-body ip-r">
        {/* the house sentence is always two lines, one clause each */}
        <h2 id="ipClose-h">
          {title === CLOSE_TITLE ? (
            <>
              Mỗi cuộc trao đổi
              <br /> bắt đầu từ sự lắng nghe.
            </>
          ) : (
            title
          )}
        </h2>
        <p>{text}</p>
        <Link href={href} className="ipDrop">
          <span>{label}</span>
        </Link>
        {zalo && (
          <a href={zalo} className="ipLink">
            Hoặc nhắn Zalo {settings.phone}
          </a>
        )}
      </div>
    </section>
  );
}
