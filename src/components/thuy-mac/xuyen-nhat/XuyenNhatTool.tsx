"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  addDays, BRANCHES, canChiOfYear, chonNgay, daysBetween, DIEM_TEN, DIEM_Y, GIO_KHOANG, nienHan, parseYmd, TRUC, VIEC,
  ymdKey, type Diem, type KetQua, type Nguoi, type Viec,
} from "@/lib/xuyen-nhat";
import "./xuyen-nhat.css";

/**
 * Xuyên Nhật · Vách Khám (owner-approved 2026-10-22): the days of the chosen span stand as khám on a cave wall.
 * Minh Khám days hold a lit lamp. When the Chủ Sự opens the wall, the document's layers run in its order:
 * the hard filters crack the khám they set aside, the days whose trực fits the work glow in the work's diệm,
 * and the two or three best are sealed. A khám opens into its tờ ngày: every layer with its source name.
 */
const THU = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const THU_DAI = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const THU_TU = ["Nhất", "Nhì", "Ba"];
const MAX_DAYS = 62;
const DIEMS: Diem[] = ["nhien-dang", "boi-quang", "do-ty"];

const pad = (n: number) => String(n).padStart(2, "0");
const dmy = (k: KetQua) => `${k.info.date.d}/${k.info.date.m}/${k.info.date.y}`;
const gioText = (k: KetQua) => k.info.gioMinh.map((h) => `${BRANCHES[h]} (${GIO_KHOANG[h]}h)`).join(", ");

/** One plain reason line from the layers that helped. */
function lyDo(k: KetQua) {
  const plus = k.lop.filter((l) => l.dau === "+").map((l) => l.ten);
  const minus = k.lop.filter((l) => l.dau === "−").map((l) => l.ten);
  return { plus, minus };
}

/** An all-day calendar entry for the chosen day, with its Minh Khám hours. */
function icsFor(k: KetQua, viec: Viec) {
  const d = k.info.date;
  const start = `${d.y}${pad(d.m)}${pad(d.d)}`;
  const end = ymdKey(addDays(d, 1)).replaceAll("-", "");
  const body = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ngoc Am//Xuyen Nhat//VI", "BEGIN:VEVENT",
    `UID:${start}-${viec.id}@ngocam`, `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${viec.ten} · ngày chọn theo Xuyên Nhật`,
    `DESCRIPTION:Giờ Minh Khám: ${gioText(k)}. Trực ${TRUC[k.info.truc].ten} (${TRUC[k.info.truc].goc})\\, ${k.info.than.ten}.`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
  a.download = `xuyen-nhat-${start}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function ToNgay({ k, viec, onClose }: { k: KetQua; viec: Viec; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const t = TRUC[k.info.truc];
  return (
    <div className="xnSheet" role="dialog" aria-modal="true" aria-label={`Tờ ngày ${dmy(k)}`}>
      <button type="button" className="xnSheet-backdrop" aria-label="Đóng" onClick={onClose} />
      <div className="xnSheet-panel">
        <div className="xnSheet-head">
          <div>
            <p className="xnSheet-kicker">{THU_DAI[k.info.thu]} · âm lịch {k.info.am.d}/{k.info.am.m}{k.info.am.nhuan ? " nhuận" : ""}</p>
            <h3 className="xnSheet-title">{dmy(k)} · {k.info.canChi}</h3>
          </div>
          <button ref={close} type="button" className="xnSheet-close" onClick={onClose}>Đóng</button>
        </div>
        <div className="xnSheet-body">
          {k.loai.length > 0 && <p className="xnSet">Ngày này được đặt sang bên: {k.loai.join(", ")}.</p>}
          <ol className="xnLayers">
            {k.lop.map((l, i) => (
              <li key={i} data-dau={l.dau}>
                <span className="xnLayers-mark" aria-hidden="true">{l.dau === "loại" ? "×" : l.dau}</span>
                <div>
                  <b>{l.ten}</b> <span className="xnGoc">({l.goc})</span>
                  {l.ghiChu && <p>{l.ghiChu}</p>}
                </div>
              </li>
            ))}
          </ol>
          <p className="xnSheet-h">Mười hai giờ</p>
          <ol className="xnHours" aria-label="Mười hai giờ trong ngày, sáng đèn là giờ Minh Khám">
            {BRANCHES.map((b, h) => (
              <li key={b} className={k.info.gioMinh.includes(h) ? "is-minh" : ""}>
                <span className="xnHours-lamp" aria-hidden="true" />
                <b>{b}</b>
                <small>{GIO_KHOANG[h]}h</small>
                <span className="sr-only">{k.info.gioMinh.includes(h) ? "Minh Khám" : "Ám Khám"}</span>
              </li>
            ))}
          </ol>
          <p className="xnSheet-note">
            Trực {t.ten} ({t.goc}) hợp: {t.hop.toLowerCase()}; kỵ: {t.ky.toLowerCase()}.
          </p>
          {!k.loai.length && (
            <button type="button" className="ipBtn xnBtn--ghost xnIcs" onClick={() => icsFor(k, viec)}>Thêm Vào Lịch</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function XuyenNhatTool({ initial }: { initial?: { v?: string; n?: string; tu?: string; den?: string } }) {
  const [today] = useState(() => {
    const t = new Date();
    return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() };
  });
  const [viecId, setViecId] = useState<string>(initial?.v && VIEC.some((v) => v.id === initial.v) ? initial.v : "");
  const years = (initial?.n ?? "").split(",").map(Number).filter((y) => y > 1900 && y < 2100);
  const [nam1, setNam1] = useState<string>(years[0] ? String(years[0]) : "");
  const [nam2, setNam2] = useState<string>(years[1] ? String(years[1]) : "");
  const [tu, setTu] = useState(initial?.tu && parseYmd(initial.tu) ? initial.tu : ymdKey(today));
  const [den, setDen] = useState(initial?.den && parseYmd(initial.den) ? initial.den : ymdKey(addDays(today, 30)));
  const [open, setOpen] = useState(!!(initial?.v && years.length));
  const [phase, setPhase] = useState(open ? 4 : 0);
  const [xem, setXem] = useState<KetQua | null>(null);
  const wall = useRef<HTMLElement>(null);
  const closeXem = useCallback(() => setXem(null), []);

  const viec = VIEC.find((v) => v.id === viecId) ?? null;
  const from = parseYmd(tu), to = parseYmd(den);
  const span = from && to ? daysBetween(from, to) : -1;
  const y1 = Number(nam1), y2 = Number(nam2);
  const okYear = (y: number) => y > 1900 && y < 2100;
  const nguoi: Nguoi[] = useMemo(() => {
    const list: Nguoi[] = [];
    if (okYear(y1)) list.push({ ten: viec?.haiNguoi ? "người thứ nhất" : "Chủ Sự", namSinh: y1 });
    if (viec?.haiNguoi && okYear(y2)) list.push({ ten: "người thứ hai", namSinh: y2 });
    return list;
  }, [y1, y2, viec?.haiNguoi]);
  const ready = !!viec && okYear(y1) && (!viec.haiNguoi || okYear(y2)) && span >= 0 && span < MAX_DAYS;
  const kq = useMemo(() => (open && ready && viec && from && to ? chonNgay(from, to, viec, nguoi) : null), [open, ready, viec, from, to, nguoi]);

  const mo = () => {
    if (!ready || !viec) return;
    setOpen(true);
    setPhase(0);
    // the layers run in the document's order, one beat each
    [1, 2, 3, 4].forEach((p) => setTimeout(() => setPhase(p), p * 650));
    const url = new URL(window.location.href);
    url.searchParams.set("v", viec.id);
    url.searchParams.set("n", [y1, viec.haiNguoi ? y2 : 0].filter(Boolean).join(","));
    url.searchParams.set("tu", tu);
    url.searchParams.set("den", den);
    window.history.replaceState(null, "", url);
    setTimeout(() => wall.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  // the wall: whole weeks, Monday first, from the week of the first day to the week of the last
  const weeks = useMemo(() => {
    if (!kq || !from) return [];
    const byKey = new Map(kq.all.map((k) => [ymdKey(k.info.date), k]));
    const first = kq.all[0].info;
    const start = addDays(from, -((first.thu + 6) % 7));
    const last = kq.all[kq.all.length - 1].info;
    const end = addDays(last.date, 6 - ((last.thu + 6) % 7));
    const out: { key: string; d: number; m: number; k?: KetQua }[][] = [];
    for (let cur = start; daysBetween(cur, end) >= 0; cur = addDays(cur, 7)) {
      out.push(Array.from({ length: 7 }, (_, i) => { const day = addDays(cur, i); return { key: ymdKey(day), d: day.d, m: day.m, k: byKey.get(ymdKey(day)) }; }));
    }
    return out;
  }, [kq, from]);
  const rankOf = (k: KetQua) => kq?.chon.indexOf(k) ?? -1;
  const nam = kq?.all[0]?.info.am.y ?? today.y;

  const phaseText = ["", "Chất vách: tháng tiết khí và can chi của từng ngày.", "Lọc cứng: Nguyệt Liệt, Liệt Bích, Đối Khám với tuổi.", `Trực hợp việc, Minh Khám, tú, Hợp Chiếu, Ám Thông.`, kq?.coNgayLot === false ? "Không có ngày nào lọt lưới: đây là những ngày ít phạm nhất." : "Những ngày đặt đúng khám nhất đã được đóng dấu."];

  return (
    <div className="xn" data-diem={viec?.diem}>
      {/* 1 · the work and its flame */}
      <section className="xnStep" aria-labelledby="xn-viec-h">
        <h2 id="xn-viec-h" className="xnH">Việc của bạn cần ngọn lửa nào?</h2>
        <p className="xnLead">Không có ngày xấu, chỉ có việc đặt sai ngày. Chọn việc trước, rồi mới tìm ngày.</p>
        <div className="xnDiems">
          {DIEMS.map((d) => (
            <fieldset key={d} className="xnDiem" data-diem={d}>
              <legend>
                <span className="xnDiem-flame" aria-hidden="true" />
                {DIEM_TEN[d]} diệm
              </legend>
              <p className="xnDiem-y">{DIEM_Y[d]}</p>
              <div className="xnChips">
                {VIEC.filter((v) => v.diem === d).map((v) => (
                  <label key={v.id} className={`xnChip ${viecId === v.id ? "is-on" : ""}`}>
                    <input type="radio" name="xn-viec" value={v.id} checked={viecId === v.id} onChange={() => setViecId(v.id)} />
                    {v.ten}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      {/* 2 · who, and when they can */}
      <section className="xnStep xnStep--who" aria-labelledby="xn-ai-h">
        <h2 id="xn-ai-h" className="xnH">Ai, và khi nào bạn xếp được?</h2>
        <div className="xnFields">
          <label className="xnField">
            <span>{viec?.haiNguoi ? "Năm sinh âm lịch, người thứ nhất" : "Năm sinh âm lịch của người chính"}</span>
            <input inputMode="numeric" maxLength={4} placeholder="1988" value={nam1} onChange={(e) => setNam1(e.target.value.replace(/\D/g, ""))} />
            <small>{okYear(y1) ? `${canChiOfYear(y1)}, tuổi ${BRANCHES[(((y1 - 4) % 12) + 12) % 12]}` : "Chỉ cần năm sinh: Xuyên Nhật xét theo chi tuổi, không cần giờ sinh."}</small>
          </label>
          {viec?.haiNguoi && (
            <label className="xnField">
              <span>Năm sinh âm lịch, người thứ hai</span>
              <input inputMode="numeric" maxLength={4} placeholder="1990" value={nam2} onChange={(e) => setNam2(e.target.value.replace(/\D/g, ""))} />
              <small>{okYear(y2) ? `${canChiOfYear(y2)}, tuổi ${BRANCHES[(((y2 - 4) % 12) + 12) % 12]}` : "Cưới hỏi xét cả hai người."}</small>
            </label>
          )}
          <label className="xnField">
            <span>Từ ngày</span>
            <input type="date" value={tu} onChange={(e) => setTu(e.target.value)} />
          </label>
          <label className="xnField">
            <span>Đến ngày</span>
            <input type="date" value={den} min={tu} onChange={(e) => setDen(e.target.value)} />
            <small>{span >= MAX_DAYS ? `Khoảng ngày dài quá: chọn trong ${MAX_DAYS} ngày.` : span < 0 ? "Ngày cuối phải sau ngày đầu." : `${span + 1} ngày để xét.`}</small>
          </label>
        </div>
        <button type="button" className="ipBtn xnOpen" onClick={mo} disabled={!ready}>Mở Vách Khám</button>
        {!viec && <p className="xnHint">Chọn một việc ở trên để mở vách.</p>}
      </section>

      {/* 3 · the wall */}
      {kq && viec && (
        <section ref={wall} className="xnStep xnStep--wall" aria-labelledby="xn-vach-h" data-phase={phase}>
          <h2 id="xn-vach-h" className="xnH">Vách Khám · {viec.ten}</h2>
          <p className="xnPhase" aria-live="polite">{phaseText[phase] || " "}</p>
          <div className="xnWall" role="grid" aria-label="Các ngày trong khoảng đã chọn">
            <div className="xnWall-row xnWall-head" role="row">
              {[1, 2, 3, 4, 5, 6, 0].map((t) => <span key={t} role="columnheader">{THU[t]}</span>)}
            </div>
            {weeks.map((w, wi) => (
              <div key={wi} className="xnWall-row" role="row">
                {w.map((c, ci) => {
                  if (!c.k) return <span key={c.key} className="xnKham is-out" role="gridcell" aria-hidden="true" />;
                  const k = c.k;
                  const r = rankOf(k);
                  const cls = ["xnKham", k.info.than.minh ? "is-minh" : "", k.loai.length ? "is-loai" : "", k.bac === 2 && !k.loai.length ? "is-hop" : "", r >= 0 ? "is-chon" : ""].join(" ");
                  return (
                    <button key={c.key} type="button" role="gridcell" className={cls} style={{ ["--i" as string]: wi * 7 + ci }} onClick={() => setXem(k)}
                      aria-label={`${c.d}/${c.m}, ${k.info.canChi}, trực ${TRUC[k.info.truc].ten}, ${k.info.than.minh ? "Minh Khám" : "Ám Khám"}${k.loai.length ? `, đặt sang bên: ${k.loai.join(", ")}` : ""}${r >= 0 ? `, phương án ${THU_TU[r].toLowerCase()}` : ""}`}>
                      <span className="xnKham-lamp" aria-hidden="true" />
                      <span className="xnKham-d">{c.d}</span>
                      <span className="xnKham-am">{k.info.am.d === 1 ? `${k.info.am.d}/${k.info.am.m}` : k.info.am.d}</span>
                      <span className="xnKham-truc">{TRUC[k.info.truc].ten}</span>
                      {k.loai.length > 0 && <span className="xnKham-crack" aria-hidden="true" />}
                      {r >= 0 && <span className="xnKham-seal" aria-hidden="true">{THU_TU[r]}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <ul className="xnLegend" aria-label="Chú giải">
            <li><span className="xnLegend-lamp" /> Minh Khám: khám có đèn</li>
            <li><span className="xnLegend-hop" /> Trực hợp việc</li>
            <li><span className="xnLegend-crack" /> Đặt sang bên: Nguyệt Liệt, Liệt Bích, Đối Khám</li>
            <li><span className="xnLegend-seal" /> Phương án</li>
          </ul>
        </section>
      )}

      {/* 4 · the options, the niên hạn, and the honest limits */}
      {kq && viec && phase >= 4 && (
        <section className="xnStep xnStep--pick" aria-labelledby="xn-pick-h">
          <h2 id="xn-pick-h" className="xnH">{kq.coNgayLot ? "Phương án" : "Không có ngày nào lọt lưới"}</h2>
          {!kq.coNgayLot && <p className="xnLead">Trong khoảng này ngày nào cũng phạm ít nhất một lớp lọc cứng. Đây là những ngày ít phạm nhất; nếu có thể, hãy nới khoảng ngày.</p>}
          <ol className="xnPicks">
            {kq.chon.map((k, i) => {
              const { plus, minus } = lyDo(k);
              return (
                <li key={ymdKey(k.info.date)} className="xnPick">
                  <span className="xnPick-seal" aria-hidden="true">{THU_TU[i]}</span>
                  <div className="xnPick-body">
                    <p className="xnPick-date">{THU_DAI[k.info.thu]}, {dmy(k)}</p>
                    <p className="xnPick-sub">Âm lịch {k.info.am.d}/{k.info.am.m} · {k.info.canChi} · trực {TRUC[k.info.truc].ten} · {k.info.than.minh ? "Minh Khám" : "Ám Khám"}</p>
                    <p className="xnPick-why">
                      {plus.length ? `Thuận vì: ${plus.join(", ")}.` : "Không có lớp nào cộng thêm."}
                      {minus.length > 0 && ` Cần biết: ${minus.join(", ")}.`}
                      {k.loai.length > 0 && ` Phạm: ${k.loai.join(", ")}.`}
                    </p>
                    <p className="xnPick-hours">Giờ Minh Khám: {gioText(k)}</p>
                    <div className="xnPick-act">
                      <button type="button" className="ipLink xnLinkBtn" onClick={() => setXem(k)}>Xem tờ ngày</button>
                      {!k.loai.length && <button type="button" className="ipLink xnLinkBtn" onClick={() => icsFor(k, viec)}>Thêm vào lịch</button>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {kq.chon.length >= 2 && kq.coNgayLot && (
            <p className="xnSay">
              “Ngày {dmy(kq.chon[0])} thuận hơn ngày {dmy(kq.chon[1])} vì {lyDo(kq.chon[0]).plus.slice(0, 3).join(", ").toLowerCase() || "ít phạm hơn"}. Ngày {dmy(kq.chon[1])} vẫn dùng được nếu lịch của anh chị không sắp xếp được ngày kia. Quyết định cuối cùng là của anh chị.”
            </p>
          )}
          {viec.nienHan.length > 0 && (
            <div className="xnNien">
              <h3>Niên hạn năm {nam}</h3>
              {nguoi.map((p) => {
                const h = nienHan(p.namSinh, nam);
                const items: string[] = [];
                if (viec.nienHan.includes("kim-lau") && h.kimLau) items.push(`${h.kimLau} (tuổi mụ ${h.tuoiMu})`);
                if (viec.nienHan.includes("hoang-oc")) items.push(`Hoang Ốc: ${h.hoangOc.ten}${h.hoangOc.tot ? "" : ", cung kém"}`);
                if (viec.nienHan.includes("tam-tai") && h.tamTai) items.push("Tam Tai");
                if (viec.nienHan.includes("thai-tue") && h.thaiTue) items.push("Thái Tuế: Đương Khám trùng Bản Khám");
                return (
                  <p key={p.ten}>
                    <b>{p.ten === "Chủ Sự" ? "Chủ Sự" : p.ten.charAt(0).toUpperCase() + p.ten.slice(1)}</b> ({canChiOfYear(p.namSinh)}, tuổi mụ {h.tuoiMu}): {items.length ? items.join("; ") : "không phạm niên hạn nào cần xét cho việc này"}.
                  </p>
                );
              })}
              <small>Niên hạn là lời lưu ý cho việc lớn, không loại ngày. Ngọc Âm áp một cách nhất quán cho mọi Chủ Sự.</small>
            </div>
          )}
          <p className="xnLimit">Trạch nhật là hệ thống truyền thống, chưa được kiểm chứng khoa học. Ngày được chọn là ngày thuận hơn theo quy ước của pháp, giúp bạn yên tâm và có mốc để sắp xếp, không hứa kết quả của việc. Quyết định cuối cùng thuộc về bạn.</p>
          <div className="xnNext">
            <p>Muốn Xuyên giả chọn ngày cùng bạn theo Diệm Bản và hoàn cảnh riêng, xét cả những người liên quan, hãy đặt một buổi Xuyên vấn.</p>
            <Link href="/lien-he?topic=tu-vi" className="ipBtn">Đặt Lịch Xuyên Vấn</Link>
          </div>
        </section>
      )}

      {xem && viec && <ToNgay k={xem} viec={viec} onClose={closeXem} />}
    </div>
  );
}
