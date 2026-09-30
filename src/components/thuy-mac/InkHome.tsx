"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPrice, type Service } from "@/lib/service-constants";
import { CloudBand, CuuDinhLandscape, PATH_ICONS } from "./ornaments";
import { createInk } from "./inkShader";
import { PAINTING, PAINTING_ALT, PAINTING_LAYERS } from "./layers";
import type { CalendarLeaf } from "./calendar";
import Compass from "./Compass";
import Leaf from "./Leaf";
import Ask, { type AskItem } from "./Ask";

export type Branch = { id: "tu-vi" | "phong-thuy" | "dai-chu-su"; name: string; line: string; href: string; from: string };
export type Person = { slug: string; name: string; role: string; photo: string; line: string; href: string; cta: string };
export type HomeProps = {
  branches: Branch[];
  lineage: { title: string; quote: string; body: string };
  leaf: CalendarLeaf;
  dailyLine: string;
  askItems: AskItem[];
  people: Person[];
  tea: { name: string; photo: string } | null;
  notes: { slug: string; title: string; date: string }[];
  groups: { id: string; name: string; items: Service[] }[];
  contact: { address: string; phone: string; hours: string; zaloUrl: string; socials: { label: string; href: string }[]; legal: string };
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Branch ends in the river drawing (viewBox 1000 × 600), used for the label positions too. */
const BRANCH_PATHS: Record<Branch["id"], string> = {
  "tu-vi": "M500 600 C500 520 492 450 480 400 C440 320 300 260 170 170",
  "phong-thuy": "M500 600 C500 520 492 450 480 400 C486 320 510 220 500 130",
  "dai-chu-su": "M500 600 C500 520 492 450 480 400 C560 320 700 260 830 170",
};

/**
 * Thuỷ Mặc Sống — the homepage as one ink painting the visitor moves through.
 *
 *  1 · a drop of ink spreads into the Huế painting; three hanging scrolls
 *  2 · the camera pushes in, clouds rush past, the Cửu Đỉnh engraving carves itself
 *  3 · the river forks into Tử Vi / Phong Thuỷ / Đại Chủ Sự
 *  4 · today's calendar leaf floats on the water beside one question
 *  5 · the study: the Xuyên giả appear as ink portraits
 *  6 · the ink floods the page, draws back into one drop, and the drop becomes the booking button
 *
 * Scenes 1–3 are pinned and driven by one scroll track (--s1/--s2/--s3);
 * scene 6 has its own track (--f/--g/--h). Everything readable is real HTML.
 */
export default function InkHome(props: HomeProps) {
  const { branches, lineage, leaf, dailyLine, askItems, people, tea, notes, groups, contact } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // pending: paper only, waiting for the painting · ink: WebGL is drawing · still: plain image fallback
  const [mode, setMode] = useState<"pending" | "ink" | "still">("pending");
  const [intro, setIntro] = useState(false);
  const [hot, setHot] = useState<Branch["id"] | null>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const track = trackRef.current!;
    const end = endRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t0: number | null = null;
    let ink: ReturnType<typeof createInk> = null;
    try {
      ink = reduced
        ? null
        : createInk(canvasRef.current!, { painting: PAINTING, layers: PAINTING_LAYERS }, () => {
            t0 = performance.now();
            setMode("ink");
          });
    } catch (err) {
      console.error("Thuỷ mặc: WebGL unavailable, showing the still painting.", err);
      ink = null;
    }
    const fallback = () => {
      setMode("still");
      setIntro(true);
    };
    if (!ink) fallback();
    // a painting that never arrives must not leave a blank page
    const giveUp = window.setTimeout(() => {
      if (t0 === null) fallback();
    }, 5000);

    // scenes 4–5 reveal once, as they come into view
    const seen = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-seen")),
      { rootMargin: "0px 0px -18% 0px" },
    );
    root.querySelectorAll(".eReveal").forEach((el) => seen.observe(el));

    const mouse: [number, number] = [0.5, 0.5];
    let mouseAmt = 0;
    const onMove = (e: PointerEvent) => {
      mouse[0] = e.clientX / window.innerWidth;
      mouse[1] = e.clientY / window.innerHeight;
      mouseAmt = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const set = (k: string, v: number) => root.style.setProperty(k, v.toFixed(4));
    let introShown = !ink;
    let raf = 0;
    const frame = (now: number) => {
      const vh = window.innerHeight;
      const r = track.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - vh));
      const s2 = clamp01((p - 0.3) / 0.36);
      const s3 = clamp01((p - 0.66) / 0.3);
      set("--p", p);
      set("--s1", clamp01(p / 0.3));
      set("--s2", s2);
      set("--s2b", Math.sin(Math.PI * s2));
      set("--s2d", clamp01(s2 * 1.5));
      set("--s3", s3);
      set("--s3d", clamp01(s3 * 1.4));

      const re = end.getBoundingClientRect();
      const s6 = clamp01(-re.top / Math.max(1, re.height - vh));
      set("--f", smooth(0.02, 0.3, s6));
      set("--g", smooth(0.42, 0.7, s6));
      set("--h", smooth(0.72, 0.86, s6));
      set("--th", smooth(0.2, 0.3, s6) * (1 - smooth(0.4, 0.48, s6)));

      root.dataset.scene = re.top < vh * 0.6 ? "6" : r.bottom > vh * 0.5 ? (p < 0.3 ? "1" : p < 0.66 ? "2" : "3") : "4";

      // ease-in-out over ~4s, so the drop visibly spreads before it fills the page
      const rt = t0 === null ? 0 : clamp01((now - t0 - 400) / 4200);
      const reveal = rt < 0.5 ? 4 * rt * rt * rt : 1 - Math.pow(-2 * rt + 2, 3) / 2;
      if (!introShown && reveal > 0.35) {
        introShown = true;
        setIntro(true);
      }
      mouseAmt *= 0.965;
      // the painting is off screen once the pinned track has scrolled away
      if (r.bottom > 0) {
        ink?.draw({
          reveal,
          time: now / 1000,
          zoom: 1 + 0.55 * smooth(0, 0.55, p),
          fog: smooth(0.24, 0.42, p) * 0.86 + smooth(0.6, 0.72, p) * 0.12,
          mouse,
          mouseAmt,
          focusX: window.innerWidth < 700 ? 0.74 : 0.5,
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(giveUp);
      window.removeEventListener("pointermove", onMove);
      seen.disconnect();
      ink?.destroy();
    };
  }, []);

  const hotBranch = branches.find((b) => b.id === hot);

  return (
    <div ref={rootRef} className={`eInk ${intro ? "is-intro" : ""}`} data-mode={mode} data-scene="1">
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <filter id="eInkEdge">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="12" />
        </filter>
      </svg>

      <Link href="/" className="eBrand">
        <Image src="/images/logo-mark.png" alt="" width={34} height={34} />
        <span>Ngọc Âm</span>
      </Link>
      <Compass branches={branches} />

      <div ref={trackRef} className="eTrack">
        <div className="eStage">
          <Image src={PAINTING} alt={PAINTING_ALT} fill priority sizes="100vw" className="eStill" />
          <canvas ref={canvasRef} className="eCanvas" aria-hidden="true" />

          {/* 1 · the drop of ink, and three hanging scrolls */}
          <section className="eScene eS1" aria-label="Mở đầu">
            <div className="eS1-head">
              <h1 className="eBoards">
                <span className="eBoard"><span>Hiểu</span><span>mình</span></span>
                <span className="eBoard"><span>Thuận</span><span>thế</span></span>
                <span className="eBoard"><span>Vững</span><span>bước</span></span>
              </h1>
              <p className="eS1-sub">Tử Vi và Phong Thuỷ của hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn.</p>
            </div>
            <p className="eHint" aria-hidden="true"><span />Cuộn để đi vào tranh</p>
          </section>

          {/* 2 · through the clouds; the urn engravings carve themselves */}
          <div className="eClouds" aria-hidden="true">
            <CloudBand id="e1" className="eCloud eCloud--1" />
            <CloudBand id="e2" className="eCloud eCloud--2" />
            <CloudBand id="e3" className="eCloud eCloud--3" />
          </div>
          <section className="eScene eS2" aria-labelledby="eS2-h">
            <CuuDinhLandscape className="eEngrave" />
            <div className="eS2-text">
              <h2 id="eS2-h">{lineage.title}</h2>
              <p>{lineage.quote}</p>
            </div>
          </section>

          {/* 3 · the river forks into three paths */}
          <section className="eScene eS3" aria-labelledby="eS3-h">
            <h2 id="eS3-h" className="eS3-h">Một dòng sông, ba nhánh chảy</h2>
            <div className="eRiver">
              <svg viewBox="0 0 1000 600" className="eRiver-svg" aria-hidden="true" fill="none" strokeLinecap="round">
                {branches.map((b) => (
                  <g key={b.id} className={`eBranch ${hot === b.id ? "is-hot" : ""}`}>
                    <path d={BRANCH_PATHS[b.id]} pathLength={1} className="eBranch-wash" />
                    <path d={BRANCH_PATHS[b.id]} pathLength={1} className="eBranch-line" />
                  </g>
                ))}
              </svg>
              <ul className="eForks">
                {branches.map((b) => {
                  const Icon = PATH_ICONS[b.id];
                  return (
                    <li key={b.id} className={`eFork eFork--${b.id}`}>
                      <Link href={b.href} onPointerEnter={() => setHot(b.id)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(b.id)} onBlur={() => setHot(null)}>
                        <span className="eBlot" aria-hidden="true" />
                        <Icon className="eFork-icon" />
                        <b>{b.name}</b>
                        <span>{b.line}</span>
                        {b.from && <small>từ {b.from}</small>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>

      {/* 4 · today's leaf floats on the water, beside one question */}
      <section className="eS4" aria-label="Lịch hôm nay và câu hỏi">
        <div className="eS4-water" aria-hidden="true" />
        <div className="eS4-grid">
          <div className="eS4-leaf eReveal">
            <div className="eFloat">
              <Leaf leaf={leaf} line={dailyLine} />
            </div>
            <span className="eRipple" aria-hidden="true" />
            <span className="eRipple eRipple--2" aria-hidden="true" />
            <p className="eS4-caption">Lịch hôm nay, tính theo lối Khâm Thiên Giám triều Nguyễn.</p>
          </div>
          <div className="eReveal eReveal--late">
            <Ask items={askItems} zalo={{ url: contact.zaloUrl, phone: contact.phone }} />
          </div>
        </div>
      </section>

      {/* 5 · the study */}
      <section className="eS5" aria-labelledby="eS5-h">
        <Image src="/images/23-homepage-heritage-study.webp" alt="" fill sizes="100vw" className="eS5-bg" />
        <div className="eS5-inner">
          <div className="eS5-head eReveal">
            <h2 id="eS5-h">Thư phòng của Xuyên giả</h2>
            <p>{lineage.body}</p>
          </div>
          <ul className="ePeople">
            {people.map((p) => (
              <li key={p.slug} className="ePerson eReveal">
                <span className="ePortrait">
                  {p.photo && <Image src={p.photo} alt={`Chân dung ${p.name}`} fill sizes="(min-width: 900px) 30vw, 80vw" />}
                </span>
                <b>{p.name}</b>
                <span className="ePerson-role">{p.role}</span>
                <p>{p.line}</p>
                <Link href={p.href} className="eLink">{p.cta}</Link>
              </li>
            ))}
          </ul>
          {tea && (
            <Link href="/tra-dao" className="eTea eReveal">
              {tea.photo && <Image src={tea.photo} alt="" width={56} height={56} />}
              <span>
                <b>Trà Đạo</b>
                Chén trà của {tea.name}, Trà Sư Ngọc Âm
              </span>
            </Link>
          )}
        </div>
      </section>

      {/* 6 · the ink floods, draws back into one drop, the drop becomes the button */}
      <div ref={endRef} className="eS6">
        <div className="eS6-stage">
          <span className="ePool" aria-hidden="true" />
          <p className="eS6-hold" aria-hidden="true">Mỗi cuộc trao đổi bắt đầu từ sự lắng nghe.</p>
          <div className="eS6-end">
            <Link href="/lien-he" className="eDropBtn">
              <span>Đặt lịch Xuyên vấn</span>
            </Link>
            <h2 className="eS6-h">Mỗi cuộc trao đổi bắt đầu từ sự lắng nghe.</h2>
            <p>Để lại đôi dòng, Ngọc Âm hồi đáp trong một ngày làm việc.</p>
            {contact.zaloUrl && <a href={contact.zaloUrl} className="eLink">Hoặc nhắn Zalo {contact.phone}</a>}
          </div>
        </div>
      </div>

      <footer className="eFoot">
        <div className="eFoot-grid">
          <div>
            <p className="eFoot-brand">Ngọc Âm</p>
            <p>Tử Vi, Phong Thuỷ hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn.</p>
            <p>{contact.address}</p>
            <p>{contact.phone}, {contact.hours}</p>
          </div>
          <nav aria-label="Các trang">
            <p className="eFoot-h">Các trang</p>
            <ul>
              {[["Tử Vi", "/tu-vi"], ["Phong Thuỷ", "/phong-thuy"], ["Đại Chủ Sự", "/dai-chu-su"], ["Lập lá số", "/lap-la-so"], ["Sổ tay", "/kien-thuc"], ["Trà Đạo", "/tra-dao"], ["Phật học", "/phat-hoc"], ["Cửa hàng", "/cua-hang"], ["Về Ngọc Âm", "/ve-ngoc-am"], ["Liên hệ", "/lien-he"]].map(([l, h]) => (
                <li key={h}><Link href={h}>{l}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eFoot-h">Mới trong Sổ tay</p>
            <ul className="eFoot-notes">
              {notes.map((n) => (
                <li key={n.slug}>
                  <Link href={`/kien-thuc/${n.slug}`}>
                    <small>{n.date}</small>
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dD-prices eFoot-prices">
          <p className="eFoot-h">Toàn bộ bảng giá</p>
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
        </div>

        <p className="eFoot-social">
          {contact.socials.map((s) => (
            <a key={s.label} href={s.href}>{s.label}</a>
          ))}
        </p>
        <p className="eFoot-legal">{contact.legal}</p>
      </footer>

      <Link href={hotBranch ? `/lien-he?topic=${hotBranch.id}` : "/lien-he"} className="ePill">
        <span className="ePill-dot" aria-hidden="true" />
        {hotBranch ? `Đặt lịch ${hotBranch.name}` : "Đặt lịch Xuyên vấn"}
      </Link>
    </div>
  );
}
