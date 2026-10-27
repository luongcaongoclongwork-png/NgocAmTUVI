"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CHAT, docBanDo, docGanDay, HANG, HANG_TEN, HUONG, laKey, laTen, luuBanDo, luuGanDay, xoaGanDay,
  type BanDoLuu, type Chat, type Hang, type Huong, type La,
} from "@/lib/tinh-hoa";
import LaBai, { ChatIcon } from "./LaBai";
import "./tinh-hoa.css";

/**
 * Lập Bản Đồ Tịnh Hoá (owner-approved 2026-10-27): the home's details, then a brass compass of eight directions laid out the
 * owner's way (Đông up, Nam right, Tây down, Bắc left). Tapping a direction turns the needle to it and opens the
 * deck: 13 ranks, 4 suits; a card already placed elsewhere cannot be drawn twice. All eight, then Tịnh Hoá.
 * The last maps stay on this device (Bản đồ gần đây) so Thầy Tịnh can reopen them.
 */
const NGAY = Array.from({ length: 31 }, (_, i) => i + 1);
const THANG = Array.from({ length: 12 }, (_, i) => i + 1);
const pad = (n: number) => String(n).padStart(2, "0");

/** Arrow keys move through a radio group, as a native one would (WAI-ARIA radio group). */
function arrowRadio(e: ReactKeyboardEvent<HTMLDivElement>) {
  const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
  const d = keys[e.key];
  if (!d) return;
  const items = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)')];
  const i = items.indexOf(document.activeElement as HTMLButtonElement);
  const next = items[(i + d + items.length) % items.length];
  e.preventDefault();
  next?.focus();
  next?.click();
}

export default function LapBanDo({ mapPath = "/phong-thuy/ban-do-tinh-hoa" }: { mapPath?: string }) {
  const router = useRouter();
  const [ten, setTen] = useState("");
  const [ngay, setNgay] = useState("");
  const [thang, setThang] = useState("");
  const [nam, setNam] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [la, setLa] = useState<Partial<Record<Huong, La>>>({});
  const [chon, setChon] = useState<Huong | null>(null);
  const [kim, setKim] = useState(0); // needle angle
  const [hang, setHang] = useState<Hang | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [loi, setLoi] = useState("");
  const [ganDay, setGanDay] = useState<BanDoLuu[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const dirRefs = useRef<Map<Huong, HTMLButtonElement>>(new Map());
  const lastDir = useRef<Huong | null>(null);

  // back from the map with "Sửa bản đồ": the cards are still there; and the maps kept on this device
  useEffect(() => {
    const b = docBanDo();
    const list = docGanDay();
    queueMicrotask(() => {
      setGanDay(list);
      if (!b) return;
      setTen(b.ten);
      const [y, m, d] = b.ngaySinh ? b.ngaySinh.split("-") : ["", "", ""];
      setNam(y ?? "");
      setThang(m ? String(Number(m)) : "");
      setNgay(d ? String(Number(d)) : "");
      setDiaChi(b.diaChi);
      setLa(b.la);
    });
  }, []);

  // the deck: focus moves in, stays in (Tab cycles), Esc closes, and focus returns to the direction it came from
  useEffect(() => {
    if (!chon) {
      if (lastDir.current) dirRefs.current.get(lastDir.current)?.focus();
      return;
    }
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setChon(null);
      if (e.key !== "Tab" || !panel.current) return;
      const f = [...panel.current.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]')].filter((x) => x.offsetParent);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chon]);

  const daDat = new Map(Object.entries(la).map(([h, l]) => [laKey(l!), h as Huong]));
  const du = HUONG.every((h) => la[h.id]);
  const soLa = HUONG.filter((h) => la[h.id]).length;
  const y = Number(nam);
  const ngaySinh = ngay && thang && y > 1900 && y < 2100 ? `${y}-${pad(Number(thang))}-${pad(Number(ngay))}` : "";
  const ngayHopLe = !ngaySinh || new Date(`${ngaySinh}T00:00:00`).getDate() === Number(ngay);
  const daNhapNgay = !!(ngay || thang || nam);

  const mo = (h: Huong) => {
    const g = HUONG.find((x) => x.id === h)!.goc;
    // turn the needle the short way round
    setKim((k) => k + ((((g - k) % 360) + 540) % 360) - 180);
    lastDir.current = h;
    setChon(h);
    setHang(la[h]?.hang ?? null);
    setChat(la[h]?.chat ?? null);
  };
  const dat = () => {
    if (!chon || !hang || !chat) return;
    setLa((cur) => ({ ...cur, [chon]: { hang, chat } }));
    setChon(null);
  };
  const bo = () => {
    if (!chon) return;
    setLa((cur) => {
      const next = { ...cur };
      delete next[chon];
      return next;
    });
    setChon(null);
  };
  const tinhHoa = () => {
    if (!ten.trim()) return setLoi("Điền họ và tên của gia chủ.");
    if (daNhapNgay && (!ngaySinh || !ngayHopLe)) return setLoi("Ngày sinh chưa đúng: chọn đủ ngày, tháng và năm có thật, hoặc để trống cả ba.");
    if (!du) return setLoi(`Còn ${8 - soLa} hướng chưa có lá.`);
    const b = { ten: ten.trim(), ngaySinh, diaChi: diaChi.trim(), la: la as Record<Huong, La> };
    luuBanDo(b);
    luuGanDay(b);
    router.push(mapPath);
  };
  const moLai = (x: BanDoLuu) => {
    luuBanDo(x.banDo);
    router.push(mapPath);
  };

  const pending = chon && hang && chat ? { hang, chat } : null;
  const trung = pending && daDat.get(laKey(pending)) && daDat.get(laKey(pending)) !== chon ? HUONG.find((h) => h.id === daDat.get(laKey(pending)))!.ten : null;
  const huongChon = HUONG.find((h) => h.id === chon);

  return (
    <div className="th">
      <section className="thInfo" aria-labelledby="th-info-h">
        <h2 id="th-info-h" className="thH">Gia chủ và ngôi nhà</h2>
        <div className="thFields">
          <label className="thField thField--wide">
            <span>Họ và tên</span>
            <input value={ten} onChange={(e) => { setTen(e.target.value); setLoi(""); }} autoComplete="off" />
          </label>
          <fieldset className="thField thDate">
            <legend>Ngày sinh (dương lịch)</legend>
            <div className="thDate-row">
              <label>
                <span className="sr-only">Ngày</span>
                <select value={ngay} onChange={(e) => { setNgay(e.target.value); setLoi(""); }}>
                  <option value="">Ngày</option>
                  {NGAY.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">Tháng</span>
                <select value={thang} onChange={(e) => { setThang(e.target.value); setLoi(""); }}>
                  <option value="">Tháng</option>
                  {THANG.map((m) => <option key={m} value={m}>Tháng {m}</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">Năm</span>
                <input inputMode="numeric" maxLength={4} placeholder="Năm" value={nam} onChange={(e) => { setNam(e.target.value.replace(/\D/g, "")); setLoi(""); }} />
              </label>
            </div>
            {daNhapNgay && ngaySinh && !ngayHopLe && <small className="thErr">Tháng {thang} năm {nam} không có ngày {ngay}.</small>}
          </fieldset>
          <label className="thField thField--wide">
            <span>Địa chỉ</span>
            <input value={diaChi} onChange={(e) => setDiaChi(e.target.value)} autoComplete="off" />
          </label>
        </div>
      </section>

      <section className="thCompassStep" aria-labelledby="th-compass-h">
        <h2 id="th-compass-h" className="thH">Tám hướng</h2>
        <p className="thLead">Chạm từng hướng để đặt lá bài đã rút. Đủ tám hướng, mỗi lá một hướng.</p>
        <div className="thCompass">
          {/* the brass luopan: rings, 24 ticks, the eight sectors */}
          <svg className="thCompass-face" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <radialGradient id="thBrass" cx="50%" cy="45%" r="60%">
                <stop offset="0" stopColor="#d9be86" />
                <stop offset="0.6" stopColor="#b08a4c" />
                <stop offset="1" stopColor="#7d5f33" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="98" fill="url(#thBrass)" />
            <circle cx="100" cy="100" r="92" fill="none" stroke="#5c4524" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="62" fill="#efe5d5" stroke="#5c4524" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="#b08a4c" strokeWidth="0.6" />
            {Array.from({ length: 24 }, (_, i) => (
              <line key={i} x1="100" y1="8" x2="100" y2={i % 3 === 0 ? 20 : 14} stroke="#4a3520" strokeWidth={i % 3 === 0 ? 1.1 : 0.6} transform={`rotate(${i * 15} 100 100)`} />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`s${i}`} x1="100" y1="38" x2="100" y2="62" stroke="#b08a4c" strokeWidth="0.6" transform={`rotate(${i * 45 + 22.5} 100 100)`} />
            ))}
          </svg>
          {/* the needle turns to the direction being set */}
          <svg className="thNeedle" viewBox="0 0 200 200" style={{ transform: `rotate(${kim}deg)` }} aria-hidden="true">
            <path d="M100 52 L106 100 L100 106 L94 100 Z" fill="#a8231f" />
            <path d="M100 148 L106 100 L100 94 L94 100 Z" fill="#2b1f17" />
            <circle cx="100" cy="100" r="5" fill="#d9be86" stroke="#5c4524" strokeWidth="0.8" />
          </svg>
          {HUONG.map((h) => (
            <button
              key={h.id}
              ref={(el) => { if (el) dirRefs.current.set(h.id, el); else dirRefs.current.delete(h.id); }}
              type="button"
              className={`thDir ${la[h.id] ? "is-set" : ""} ${chon === h.id ? "is-on" : ""}`}
              style={{ ["--a" as string]: `${h.goc}deg` }}
              onClick={() => mo(h.id)}
              aria-label={`Hướng ${h.ten}: ${la[h.id] ? laTen(la[h.id]!) : "chưa có lá"}`}
            >
              <span className="thDir-ten">{h.ten}</span>
              <LaBai la={la[h.id]} size="sm" />
            </button>
          ))}
        </div>
        <p className="thCount" aria-live="polite">{du ? "Đủ tám hướng." : `${soLa} / 8 hướng đã có lá.`}</p>
      </section>

      <div className="thSubmit">
        {loi && <p className="thErr" role="alert">{loi}</p>}
        <button type="button" className="ipBtn thGo" onClick={tinhHoa} aria-disabled={!du || !ten.trim()}>Tịnh Hoá Phong Thuỷ</button>
      </div>

      {ganDay.length > 0 && (
        <section className="thRecent" aria-labelledby="th-recent-h">
          <h2 id="th-recent-h" className="thH thH--small">Bản đồ gần đây</h2>
          <p className="thLead">Chỉ lưu trên máy này, không gửi đi đâu. Tối đa mười hai bản đồ.</p>
          <ul className="thRecent-list">
            {ganDay.map((x) => (
              <li key={x.id} className="thRecent-item">
                <div className="thRecent-cards" aria-hidden="true">
                  {HUONG.slice(0, 3).map((h) => <LaBai key={h.id} la={x.banDo.la[h.id]} size="sm" />)}
                </div>
                <div className="thRecent-text">
                  <p className="thRecent-name">{x.banDo.ten}</p>
                  <p className="thRecent-meta">{[x.banDo.diaChi, `lập ngày ${new Date(x.lapLuc).toLocaleDateString("vi-VN")}`].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="thRecent-act">
                  <button type="button" className="ipLink thLinkBtn" onClick={() => moLai(x)}>Mở bản đồ</button>
                  <button type="button" className="ipLink thLinkBtn thLinkBtn--muted" onClick={() => setGanDay(xoaGanDay(x.id))} aria-label={`Xoá bản đồ của ${x.banDo.ten}`}>Xoá</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {chon && huongChon && (
        <div className="thSheet" role="dialog" aria-modal="true" aria-labelledby="th-sheet-h">
          <button type="button" className="thSheet-backdrop" aria-label="Đóng" tabIndex={-1} onClick={() => setChon(null)} />
          <div ref={panel} className="thSheet-panel">
            <div className="thSheet-head">
              <h3 id="th-sheet-h">Hướng {huongChon.ten}</h3>
              <button ref={close} type="button" className="thSheet-close" onClick={() => setChon(null)}>Đóng</button>
            </div>
            <div className="thSheet-body">
              <div className="thPick">
                <LaBai la={pending} size="lg" label={pending ? laTen(pending) : "Chưa chọn lá"} />
                <div className="thPick-sets">
                  <p className="thPick-h" id="th-rank-h">Lá</p>
                  <div className="thRanks" role="radiogroup" aria-labelledby="th-rank-h" onKeyDown={arrowRadio}>
                    {HANG.map((r, i) => (
                      <button key={r} type="button" role="radio" aria-checked={hang === r} tabIndex={hang === r || (!hang && i === 0) ? 0 : -1}
                        className={`thRank ${hang === r ? "is-on" : ""}`} onClick={() => setHang(r)} aria-label={HANG_TEN[r]}>
                        {r === "A" ? "Át" : r}
                      </button>
                    ))}
                  </div>
                  <p className="thPick-h" id="th-suit-h">Chất</p>
                  <div className="thSuits" role="radiogroup" aria-labelledby="th-suit-h" onKeyDown={arrowRadio}>
                    {CHAT.map((c, i) => (
                      <button key={c.id} type="button" role="radio" aria-checked={chat === c.id} tabIndex={chat === c.id || (!chat && i === 0) ? 0 : -1}
                        className={`thSuit ${c.son ? "is-son" : ""} ${chat === c.id ? "is-on" : ""}`} onClick={() => setChat(c.id)}>
                        <ChatIcon chat={c.id} /> {c.ten}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {trung && <p className="thErr" role="alert">Lá {laTen(pending!)} đã đặt ở hướng {trung}. Mỗi lá chỉ một hướng.</p>}
              <div className="thSheet-act">
                <button type="button" className="ipBtn" onClick={dat} disabled={!pending || !!trung}>Đặt Lá</button>
                {la[chon] && <button type="button" className="ipLink thLinkBtn" onClick={bo}>Bỏ lá khỏi hướng này</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
