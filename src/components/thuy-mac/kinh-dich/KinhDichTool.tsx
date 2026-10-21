"use client";

import Link from "next/link";
import { useState } from "react";
import { castLine, decodeCast, encodeCast, KHAM12, lapQue, type Cast, type Hexagram, type Reading } from "@/lib/kinh-dich";
import HexLines from "./HexLines";
import { drawSheet, printSheet, saveBlob, sheetToPdf } from "./queSheet";
import "./kinh-dich.css";

const DIEM_TEN: Record<string, string> = { BOI_QUANG: "Bối quang", NHIEN_DANG: "Nhiên đăng", DO_TY: "Đồ tỳ" };
const rnd = () => {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] / 2 ** 32;
};

function Que({ q, role, moving, note, from, step }: { q: Hexagram; role: string; moving?: number[]; note?: string; from?: number[]; step: number }) {
  return (
    <article className="kdQue" style={{ ["--step" as string]: step }}>
      <p className="kdQue-role">{role}</p>
      <HexLines lines={q.hao} moving={moving} from={from} label={`${q.ten_xtd}, ${q.ten_goc}`} />
      <h3 className="kdQue-name"><Link href={`/kinh-dich/que/${q.so}`}>{q.ten_xtd}</Link></h3>
      <p className="kdQue-goc">
        Quẻ {q.so} · {q.ten_goc} · chữ khóa <b>{q.chu_khoa}</b> · diệm <b>{q.diem}</b>
      </p>
      <p className="kdQue-tuong">{q.hinh_tuong}</p>
      {note && <p className="kdQue-note">{note}</p>}
    </article>
  );
}

/** Three coins of the last cast: a filled coin is a mặt lưng. */
function Coins({ lung, final }: { lung: number; final: boolean }) {
  return (
    <div className={`kdCoins ${final ? "kdCoins--final" : ""}`} aria-label={`${lung} mặt lưng, ${3 - lung} mặt chữ`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`kdCoin ${i < lung ? "is-lung" : ""}`} aria-hidden="true" />
      ))}
    </div>
  );
}

const HAO_TEN: Record<number, string> = { 6: "Âm động", 7: "Dương", 8: "Âm", 9: "Dương động" };

function Exports({ r, casts, kham, code, at }: { r: Reading; casts: Cast[]; kham: number | null; code: string; at: Date }) {
  const [busy, setBusy] = useState<string | null>(null);
  const run = async (what: "png" | "pdf" | "print") => {
    setBusy(what);
    try {
      const url = new URL(window.location.href);
      const cv = await drawSheet({ r, casts, kham: KHAM12.find((x) => x.so === kham), code, at, link: `${url.host}${url.pathname}?q=${code}${kham ? `&k=${kham}` : ""}` });
      const name = `que-${r.hien.so}-${code}`;
      if (what === "print") printSheet(cv);
      else if (what === "pdf") saveBlob(await sheetToPdf(cv), `${name}.pdf`);
      else saveBlob(await new Promise<Blob>((ok) => cv.toBlob((b) => ok(b!), "image/png")), `${name}.png`);
    } finally {
      setBusy(null);
    }
  };
  return (
    <div className="kdExport" role="group" aria-label="Giữ lại quẻ">
      <p>Giữ lại tờ quẻ này (khổ A4):</p>
      <button type="button" className="ipBtn kdBtn--ghost" onClick={() => run("png")} disabled={!!busy}>{busy === "png" ? "Đang vẽ…" : "Lưu Ảnh Quẻ"}</button>
      <button type="button" className="ipBtn kdBtn--ghost" onClick={() => run("pdf")} disabled={!!busy}>{busy === "pdf" ? "Đang tạo…" : "Xuất PDF"}</button>
      <button type="button" className="ipBtn kdBtn--ghost" onClick={() => run("print")} disabled={!!busy}>In Quẻ</button>
    </div>
  );
}

function Result({ r, kham, casts, code, at }: { r: Reading; kham: number | null; casts: Cast[]; code: string; at: Date }) {
  const k = KHAM12.find((x) => x.so === kham);
  const n = r.moving.length;
  return (
    <div className="kdResult" aria-live="polite">
      {k && (
        <p className="kdResult-kham">
          Việc hỏi thuộc khám <b>{k.ten_xtd}</b> ({k.ten_goc}): {k.chu_de}.
        </p>
      )}
      <div className="kdQues">
        <Que q={r.hien} step={0} role="Hiện Bích · quẻ chủ" moving={r.moving} note={`Nội Khám ${r.noiKham.ten_xtd} (${r.noiKham.ten}, ${r.noiKham.tuong}) · Ngoại Khám ${r.ngoaiKham.ten_xtd} (${r.ngoaiKham.ten}, ${r.ngoaiKham.tuong})`} />
        {r.hoa && <span className="kdArrow" aria-hidden="true">→</span>}
        {r.hoa && <Que q={r.hoa} step={1} from={r.hien.hao} role="Hóa Bích · quẻ biến" />}
        <Que q={r.noi} step={r.hoa ? 2 : 1} role="Nội Bích · quẻ hỗ" />
      </div>

      <Exports r={r} casts={casts} kham={kham} code={code} at={at} />

      <dl className="kdFacts">
        <div>
          <dt>Sáu nấc</dt>
          <dd>
            <table className="kdTable">
              <thead><tr><th scope="col">Nấc</th><th scope="col">Mặt lưng</th><th scope="col">Tổng</th><th scope="col">Hào</th></tr></thead>
              <tbody>
                {[...casts.keys()].reverse().map((i) => (
                  <tr key={i} className={casts[i].dong ? "is-dong" : ""}><td>{i + 1}</td><td>{casts[i].lung}</td><td>{casts[i].tong}</td><td>{HAO_TEN[casts[i].tong]}</td></tr>
                ))}
              </tbody>
            </table>
          </dd>
        </div>
        <div>
          <dt>Động Diệm</dt>
          <dd>{n === 0 ? "Không có nấc nào động: quẻ đứng yên." : `${n} nấc động: nấc ${r.moving.join(", ")} (tính từ dưới lên).`}</dd>
        </div>
        <div>
          <dt>Lời cần đọc</dt>
          <dd>
            {r.read.que === "hien" ? "Theo Hiện Bích" : r.read.que === "hoa" ? "Theo Hóa Bích" : "Theo cả Hiện Bích và Hóa Bích, lấy Hiện Bích làm chính"}: {r.read.loi}
            {r.read.nac.length > 0 && ` (nấc ${r.read.nac.join(", ")}).`}
            <span className="kdSoon">Lời quẻ và lời hào đang được Ngọc Âm biên soạn.</span>
          </dd>
        </div>
        {r.hoa && (
          <div>
            <dt>Chuyển diệm</dt>
            <dd>
              {DIEM_TEN[r.hien.diem_ma]} → {DIEM_TEN[r.hoa.diem_ma]}: {r.chuyenDiem}
            </dd>
          </div>
        )}
        {r.theDung && (
          <div>
            <dt>Thể – Dụng</dt>
            <dd>
              Thể {r.theDung.the.ten_xtd} ({r.theDung.the.ngu_hanh}), Dụng {r.theDung.dung.ten_xtd} ({r.theDung.dung.ngu_hanh}). {r.theDung.y}
            </dd>
          </div>
        )}
      </dl>

      <div className="kdNext kdNext--signed">
        {/* the reading is signed with the Xuyên Tam Diệm seal, as a lạc khoản closes an inscription */}
        <span className="kdStamp" aria-hidden="true">
          <span className="kdStamp-khung" /><span className="kdStamp-am" /><span className="kdStamp-duong" /><span className="kdStamp-giua" />
        </span>
        <p>Một quẻ là tấm gương soi việc đang hỏi, không phải lời phán. Muốn đọc quẻ này cùng Diệm Bản của bạn, trong khám {k ? k.ten_xtd : "của việc hỏi"}, Đại Trình và Niên Trình, hãy mang quẻ đến một buổi Xuyên vấn.</p>
        <Link href="/lien-he?topic=tu-vi" className="ipBtn">Đặt Lịch Xuyên Vấn</Link>
        <Link href="/lap-la-so" className="ipLink">Lập Lá Số miễn phí</Link>
      </div>
    </div>
  );
}

/** `initialCode`/`initialKham` come from a shared link (?q=789678&k=9), read on the server so the reading renders at once. */
export default function KinhDichTool({ initialCode, initialKham }: { initialCode?: string; initialKham?: number }) {
  const shared = decodeCast(initialCode ?? "");
  const [kham, setKham] = useState<number | null>(shared && initialKham && initialKham >= 1 && initialKham <= 12 ? initialKham : null);
  const [casts, setCasts] = useState<Cast[]>(shared ?? []);
  const [code, setCode] = useState<string | null>(shared ? initialCode! : null);
  const [at, setAt] = useState(() => new Date());

  const done = casts.length === 6;
  const cast = () => {
    if (done) return;
    const next = [...casts, castLine(rnd)];
    setCasts(next);
    if (next.length === 6) {
      const c = encodeCast(next);
      setCode(c);
      setAt(new Date());
      const url = new URL(window.location.href);
      url.searchParams.set("q", c);
      if (kham) url.searchParams.set("k", String(kham));
      window.history.replaceState(null, "", url);
    }
  };
  const reset = () => {
    setCasts([]);
    setCode(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    url.searchParams.delete("k");
    window.history.replaceState(null, "", url);
  };
  const last = casts[casts.length - 1];

  return (
    <div className="kd">
      <fieldset className="kdKham">
        <legend>1. Việc bạn hỏi thuộc khám nào?</legend>
        <div className="kdKham-list">
          {KHAM12.map((k) => (
            <label key={k.so} className={kham === k.so ? "is-on" : ""}>
              <input type="radio" name="kham" value={k.so} checked={kham === k.so} onChange={() => setKham(k.so)} disabled={done} />
              <span className="kdKham-ten">{k.ten_xtd}</span>
              <span className="kdKham-de">{k.chu_de}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <section className="kdCast" aria-labelledby="kd-cast-h">
        <h2 id="kd-cast-h" className="kdStep">2. Thỉnh Bích</h2>
        <p className="kdHint">Giữ câu hỏi trong lòng. Mỗi lần bấm là gieo ba đồng tiền, dựng một Nấc Thê từ dưới lên; sáu lần thành một quẻ.</p>
        <div className="kdCast-row">
          <div className="kdCast-lines" aria-live="polite">
            {casts.length ? <HexLines lines={casts.map((c) => c.hao)} moving={casts.flatMap((c, i) => (c.dong ? [i + 1] : []))} label={`${casts.length} nấc đã gieo`} /> : <p className="kdEmpty">Chưa có nấc nào.</p>}
          </div>
          <div className="kdCast-act">
            {last && <Coins key={casts.length} lung={last.lung} final={done} />}
            <p className="kdCount">
              {done ? "Đủ sáu nấc." : `Nấc ${casts.length + 1} / 6`}
              {last && !done && <span> · lần vừa rồi: {last.lung} mặt lưng, {last.hao ? "dương" : "âm"}{last.dong ? ", động" : ""}</span>}
            </p>
            {!done ? (
              <button type="button" className="ipBtn" onClick={cast}>
                {casts.length ? "Gieo Nấc Tiếp" : "Bắt Đầu Thỉnh Bích"}
              </button>
            ) : (
              <button type="button" className="ipBtn kdBtn--ghost" onClick={reset}>Gieo Quẻ Khác</button>
            )}
            {done && code && <p className="kdShare">Mã quẻ <code>{code}</code> đã nằm trong địa chỉ trang: lưu hoặc gửi đường link để mở lại đúng quẻ này.</p>}
          </div>
        </div>
      </section>

      {done && code && <Result r={lapQue(casts)} kham={kham} casts={casts} code={code} at={at} />}
    </div>
  );
}
