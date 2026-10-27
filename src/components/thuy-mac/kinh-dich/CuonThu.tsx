"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { decodeCast, encodeCast, KHAM12, lapQue, type Cast, type Reading } from "@/lib/kinh-dich";
import XuyenHoa from "./XuyenHoa";
import XuyenHoa3D from "./XuyenHoa3D";
import HexLines from "./HexLines";
import { Result } from "./KinhDichTool";
import "./kinh-dich.css";
import "./cuon-thu.css";

/**
 * "Nghi Thức Thỉnh Bích", level B (demo, 2026-10-21): about forty seconds, in a quiet full-screen space.
 * The site falls away; one slow breath runs while the visitor names the question (typed or spoken);
 * six presses on the flame (Xuyên Hỏa Thành Thê) send three needles through its three tongues, one Nấc Thê each;
 * the mirror and the thanks close it. The reading then stays on the page.
 * The question never leaves the visitor's device: it lives in state, on the printed sheet and in localStorage.
 */
type Phase = "hoi" | "gieo" | "guong";
const STORE = "ngocam-kd-hoi";

const norm = (s: string) => s.toLowerCase().normalize("NFC").replace(/\s+/g, " ").trim();
const today = () => new Date().toISOString().slice(0, 10);
function askedToday(q: string) {
  try {
    const v = JSON.parse(localStorage.getItem(STORE) ?? "null") as { q: string; d: string } | null;
    return !!v && v.d === today() && v.q === norm(q);
  } catch {
    return false;
  }
}
function remember(q: string) {
  try {
    localStorage.setItem(STORE, JSON.stringify({ q: norm(q), d: today() }));
  } catch {}
}

/** A bronze bell made in the browser (no file), only when the visitor turns it on. */
function bell() {
  try {
    const A = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new A();
    const t = ctx.currentTime;
    for (const [f, g, d] of [[392, 0.22, 4.5], [784, 0.08, 3], [1176, 0.04, 2]] as const) {
      const o = ctx.createOscillator(), v = ctx.createGain();
      o.frequency.value = f;
      v.gain.setValueAtTime(g, t);
      v.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(v).connect(ctx.destination);
      o.start(t);
      o.stop(t + d);
    }
  } catch {}
}

function Mirror({ r, hoi }: { r: Reading; hoi: string }) {
  return (
    <>
      {hoi && <p className="ctAsked">Bạn hỏi: “{hoi}”</p>}
      <div className="ctMirror">
        {/* the three quẻ of every reading, as on /kinh-dich: Hiện → Hóa (when a line moves), then Nội Bích */}
        {[
          { q: r.hien, role: "Hiện Bích", sub: "quẻ chủ", from: undefined as number[] | undefined, mv: r.moving, arrow: false },
          ...(r.hoa ? [{ q: r.hoa, role: "Hóa Bích", sub: "quẻ biến", from: r.hien.hao as number[] | undefined, mv: [] as number[], arrow: true }] : []),
          { q: r.noi, role: "Nội Bích", sub: "quẻ hỗ, điều nằm bên trong việc hỏi", from: undefined as number[] | undefined, mv: [] as number[], arrow: false },
        ].map(({ q, role, sub, from, mv, arrow }, i) => (
          <figure key={role} className="ctQue" style={{ ["--step" as string]: i }}>
            {arrow && <span className="ctArrow" aria-hidden="true">→</span>}
            <figcaption className="ctQue-role">{role}<small>{sub}</small></figcaption>
            <div className="ctQue-lines">
              <HexLines lines={q.hao} moving={mv} from={from} label={`${role}: ${q.ten_xtd}, ${q.ten_goc}`} />
              <div className="ctReflect" aria-hidden="true">
                <HexLines lines={q.hao} label="" />
              </div>
            </div>
            <p className="ctQue-name">{q.ten_xtd}</p>
            <p className="ctQue-goc">Quẻ {q.so}, {q.ten_goc}</p>
            <p className="ctQue-tuong">{q.hinh_tuong}</p>
          </figure>
        ))}
      </div>
    </>
  );
}

type Rec = { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; start: () => void; stop: () => void };
type SpeechWindow = { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
const speechCtor = () => (typeof window === "undefined" ? undefined : ((window as unknown as SpeechWindow).SpeechRecognition ?? (window as unknown as SpeechWindow).webkitSpeechRecognition));

export default function CuonThu({ initialCode, initialKham, three = false }: { initialCode?: string; initialKham?: number; three?: boolean }) {
  const shared = decodeCast(initialCode ?? "");
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("hoi");
  const [listening, setListening] = useState(false);
  const [gathering, setGathering] = useState(false); // the lamps of the question draw together into one flame
  const [canSpeak, setCanSpeak] = useState(false);
  const [hoi, setHoi] = useState("");
  const [kham, setKham] = useState<number | null>(shared && initialKham && initialKham >= 1 && initialKham <= 12 ? initialKham : null);
  const [casts, setCasts] = useState<Cast[]>(shared ?? []);
  const [code, setCode] = useState<string | null>(shared ? initialCode! : null);
  const [at, setAt] = useState(() => new Date());
  const [sound, setSound] = useState(false);
  const recRef = useRef<Rec | null>(null);
  const layer = useRef<HTMLDivElement>(null);
  const reading = useRef<HTMLElement>(null);
  const done = casts.length === 6;
  const r = done ? lapQue(casts) : null;
  const words = hoi.trim() ? hoi.trim().split(/\s+/).length : 0;
  const repeat = phase === "hoi" && hoi.trim().length > 3 && askedToday(hoi);

  // Esc leaves the ritual; the page under it does not scroll while it is open
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  // each beat takes the focus, so keyboard and screen-reader users move with it
  useEffect(() => {
    if (open) layer.current?.querySelector<HTMLElement>("[data-focus]")?.focus();
  }, [open, phase]);

  // each beat morphs into the next through a view transition: the question glides into place
  const step = (p: Phase) => {
    const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (d.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) d.startViewTransition(() => flushSync(() => setPhase(p)));
    else setPhase(p);
  };
  const begin = () => {
    setPhase("hoi");
    setCanSpeak(!!speechCtor());
    setOpen(true);
    if (sound) bell();
  };
  const toGieo = () => {
    setCasts([]);
    castsRef.current = [];
    setCode(null);
    recRef.current?.stop();
    step("gieo");
    setGathering(false);
  };
  const thinhBich = () => {
    if (gathering) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return toGieo();
    layer.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setGathering(true), 320);
    setTimeout(toGieo, 1500);
  };
  const speak = () => {
    const C = speechCtor();
    if (!C) return;
    if (listening) return recRef.current?.stop();
    const rec = new C();
    rec.lang = "vi-VN";
    rec.interimResults = true;
    rec.onresult = (e) => setHoi(Array.from(e.results).map((x) => x[0].transcript).join(" ").slice(0, 160));
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };
  const castsRef = useRef<Cast[]>([]);
  const addCast = (c: Cast) => {
    const next = [...castsRef.current, c];
    castsRef.current = next;
    setCasts(next);
    navigator.vibrate?.(c.dong ? [18, 40, 18] : 18);
    if (next.length < 6) return;
    const code = encodeCast(next);
    setCode(code);
    setAt(new Date());
    remember(hoi);
    const url = new URL(window.location.href);
    url.searchParams.set("q", code);
    if (kham) url.searchParams.set("k", String(kham));
    window.history.replaceState(null, "", url);
    if (sound) bell();
    setTimeout(() => step("guong"), 2900); // the flame draws back into its ember first
  };
  const finish = () => {
    setOpen(false);
    setTimeout(() => reading.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };
  const askAnother = () => {
    setHoi("");
    setKham(null);
    setCasts([]);
    castsRef.current = [];
    setCode(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    url.searchParams.delete("k");
    window.history.replaceState(null, "", url);
    begin();
  };

  return (
    <div className="ct">
      {/* before: what the ritual is, and the way in */}
      {!done && (
        <section className="ctStep ctStep--vao" aria-labelledby="ct-vao-h">
          <h2 id="ct-vao-h" className="ctH">Trước khi gieo</h2>
          <p className="ctHint">
            Một quẻ chỉ soi rõ khi người hỏi thật lòng với điều mình hỏi. Nghi thức Thỉnh Bích dẫn bạn lặng lại, gọi tên điều cần hỏi, rồi tự tay gieo sáu lần, mỗi lần một hơi thở. Chừng một phút.
          </p>
          <button type="button" className="ipBtn" onClick={() => begin()}>Bắt Đầu Nghi Thức</button>
        </section>
      )}

      {/* after: the reading stays on the page */}
      {r && code && !open && (
        <>
          <section ref={reading} className="ctStep ctStep--guong" aria-labelledby="ct-guong-h">
            <h2 id="ct-guong-h" className="ctH">Gương soi</h2>
            <Mirror r={r} hoi={hoi} />
          </section>
          <section className="ctStep ctStep--loi" aria-labelledby="ct-loi-h">
            <h2 id="ct-loi-h" className="ctH">Lời đọc</h2>
            <Result r={r} kham={kham} casts={casts} code={code} at={at} hoi={hoi} hideQues />
            <p className="ctAgain">
              <button type="button" className="ipLink ctSkip" onClick={askAnother}>Hỏi Một Việc Khác</button>
            </p>
          </section>
        </>
      )}

      {open && (
        <div ref={layer} className={`ctRite ctRite--${phase}`} role="dialog" aria-modal="true" aria-label="Nghi thức Thỉnh Bích">
          <div className="ctRite-bar">
            <button type="button" className="ctRite-tool" onClick={() => setSound((s) => !s)} aria-pressed={sound}>
              Chuông: {sound ? "bật" : "tắt"}
            </button>
            <button type="button" className="ctRite-tool" onClick={() => setOpen(false)}>Rời nghi thức</button>
          </div>

          {phase === "hoi" && (
            <div className="ctBeat ctBeat--hoi" key="hoi">
              {/* Nhiên Đăng Văn (燃燈文): a row of twelve oil lamps; each word of the question lights one.
                  On Thành Tâm Thỉnh Bích they draw together into the one flame the needles will pierce. */}
              <div className={`ctLamps ${gathering ? "is-gathering" : ""}`} aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} className={`ctLamp ${i < words ? "is-lit" : ""}`} style={{ ["--o" as string]: i - 5.5 }}>
                    <span className="ctLamp-flame" />
                    <span className="ctLamp-bowl" />
                  </span>
                ))}
                <span className="ctLamps-one" />
              </div>
              <p className="ctLead">{gathering ? "Ngọn lửa của câu hỏi đã thành." : words ? `${Math.min(words, 12)} ngọn đèn đã thắp.` : "Thở một hơi thật chậm. Mỗi lời bạn viết thắp một ngọn đèn."}</p>
              <label className="ctAsk">
                <span className="ctH ctH--small">Điều tôi đang hỏi là…</span>
                <textarea data-focus className="ctAsk-text" value={hoi} onChange={(e) => setHoi(e.target.value)} maxLength={160} rows={2} placeholder="Ví dụ: Tôi có nên nhận lời mời làm việc ở Đà Nẵng trong năm nay?" />
              </label>
              {canSpeak && (
                <p className="ctVoice">
                  <button type="button" className={`ctVoice-btn ${listening ? "is-on" : ""}`} onClick={speak} aria-pressed={listening}>
                    {listening ? "Đang nghe… chạm để dừng" : "Hoặc nói câu hỏi"}
                  </button>
                  <small>Giọng nói được trình duyệt gửi tới Google hoặc Apple để chuyển thành chữ. Ngọc Âm không nhận bản ghi.</small>
                </p>
              )}
              <ul className="ctRules">
                <li>Chỉ hỏi một việc.</li>
                <li>Việc bạn thật sự còn phân vân.</li>
                <li>Điều bạn có thể tự mình làm hay chọn.</li>
              </ul>
              {repeat && (
                <p className="ctMong" role="note">
                  Hôm nay bạn đã hỏi việc này. Kinh Dịch dạy ở quẻ Mông: “Sơ phệ cáo, tái tam độc”, lần đầu thành tâm thì quẻ đã đáp, hỏi lại là làm vẩn đục lời đáp. Hãy ở lại với quẻ trước một thời gian.
                </p>
              )}
              <p className="ctKham-h">Việc này thuộc khám nào? <span>(có thể bỏ qua)</span></p>
              <div className="ctKham" role="radiogroup" aria-label="Khám của việc hỏi">
                {KHAM12.map((x) => (
                  <button key={x.so} type="button" role="radio" aria-checked={kham === x.so} className={`ctScroll ${kham === x.so ? "is-on" : ""}`} onClick={() => setKham(kham === x.so ? null : x.so)} title={x.chu_de}>
                    {x.ten_xtd.split(" ").map((w, i) => (
                      <span key={i}>{w}</span>
                    ))}
                  </button>
                ))}
              </div>
              <p className="ctDe" aria-live="polite">{kham ? `${KHAM12.find((x) => x.so === kham)!.ten_xtd}: ${KHAM12.find((x) => x.so === kham)!.chu_de}.` : ""}</p>
              <button type="button" className="ipBtn" onClick={thinhBich} disabled={hoi.trim().length < 4 || gathering}>Thành Tâm Thỉnh Bích</button>
            </div>
          )}

          {phase === "gieo" && (
            <div className="ctBeat" key="gieo">
              <p className="ctAsked">“{hoi}”</p>
              {three ? <XuyenHoa3D casts={casts} onCast={addCast} /> : <XuyenHoa casts={casts} onCast={addCast} />}
            </div>
          )}

          {phase === "guong" && r && (
            <div className="ctBeat ctBeat--guong" key="guong">
              <Mirror r={r} hoi={hoi} />
              <p className="ctThanks" tabIndex={-1} data-focus>Cảm tạ. Hãy để quẻ này ở lại với bạn vài ngày trước khi hỏi lại về việc này.</p>
              <button type="button" className="ipBtn" onClick={finish}>Xem Lời Đọc</button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
