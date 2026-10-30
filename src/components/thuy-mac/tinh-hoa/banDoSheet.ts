import { CHAT_PATH } from "./LaBai";
import { CHAT, GHI_CHU_CHAT, HUONG, laKey, laTen, NGHIA, type BanDo, type La } from "@/lib/tinh-hoa";
import { QUAI, SON } from "./LaBan";

/** The A4 sheet of a Bản Đồ Tịnh Hoá (200 dpi), shared by the image, the PDF and the print: dó paper, bronze frame, the la bàn Tịnh Hoá with the logo at its heart, then the eight readings. */
const W = 1654, H = 2339;
const C = { paper: "#efe5d5", ink: "#2b1f17", muted: "#6e5a49", line: "#cdb99c", bronze: "#94733a", son: "#a8231f", raised: "#f7f0e4" };

const cssVar = (name: string, fallback: string) => {
  const v = getComputedStyle(document.body).getPropertyValue(name).trim();
  return v ? `${v}, ${fallback}` : fallback;
};
const loadImg = (src: string) => new Promise<HTMLImageElement | null>((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
function wrap(g: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  let line = "";
  for (const word of text.split(" ")) {
    const t = line ? `${line} ${word}` : word;
    if (g.measureText(t).width > maxW && line) { g.fillText(line, x, y); y += lh; line = word; } else line = t;
  }
  if (line) g.fillText(line, x, y);
  return y + lh;
}
function card(g: CanvasRenderingContext2D, l: La, x: number, y: number, w: number, disp: string) {
  const h = w * 1.4, c = CHAT.find((s) => s.id === l.chat)!;
  g.fillStyle = C.raised;
  g.strokeStyle = C.bronze;
  g.lineWidth = 2;
  g.beginPath();
  g.roundRect(x, y, w, h, 8);
  g.fill();
  g.stroke();
  g.lineWidth = 1;
  g.strokeRect(x + 6, y + 6, w - 12, h - 12);
  g.fillStyle = c.son ? C.son : C.ink;
  g.textAlign = "left";
  g.font = `600 ${w * 0.26}px ${disp}`;
  g.fillText(l.hang, x + 12, y + w * 0.3);
  // the suit, from the same path as the web cards (24 × 24)
  const sz = w * 0.5;
  g.save();
  g.translate(x + (w - sz) / 2, y + h * 0.4);
  g.scale(sz / 24, sz / 24);
  g.fill(new Path2D(CHAT_PATH[l.chat]));
  g.restore();
}

export async function drawBanDo(b: BanDo, at: Date): Promise<HTMLCanvasElement> {
  await document.fonts.ready;
  const disp = cssVar("--de-display", "'Cormorant Garamond', Georgia, serif");
  const body = cssVar("--font-body", "'Be Vietnam Pro', system-ui, sans-serif");
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  const M = 130;
  g.fillStyle = C.paper;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = C.bronze;
  g.lineWidth = 4;
  g.strokeRect(60, 60, W - 120, H - 120);
  g.lineWidth = 1.5;
  g.strokeRect(78, 78, W - 156, H - 156);

  // heading
  g.textAlign = "center";
  g.fillStyle = C.muted;
  g.font = `400 28px ${body}`;
  g.fillText("Phong Thuỷ Là Tịnh · Bản Đồ Tịnh Hoá", W / 2, 170);
  g.fillStyle = C.ink;
  g.font = `600 78px ${disp}`;
  g.fillText(b.ten, W / 2, 260);
  g.fillStyle = C.muted;
  g.font = `400 28px ${body}`;
  const meta = [b.ngaySinh ? `Sinh ngày ${b.ngaySinh.split("-").reverse().join("/")}` : "", b.diaChi].filter(Boolean).join("   ·   ");
  if (meta) wrap(g, meta, W / 2, 316, W - 2 * M, 38);

  // the la bàn: the same bands as the web dial (viewBox 400 → R px), Đông at the top, every character upright
  const S = 1020, R = S / 2, cx = W / 2, cy = 370 + R, u = R / 200;
  const at0 = (deg: number, r: number) => [cx + Math.sin((deg * Math.PI) / 180) * r * u, cy - Math.cos((deg * Math.PI) / 180) * r * u] as const;
  const ring = (r: number, fill?: string | CanvasGradient) => { g.beginPath(); g.arc(cx, cy, r * u, 0, Math.PI * 2); if (fill) { g.fillStyle = fill; g.fill(); } else g.stroke(); };
  const ray = (deg: number, r1: number, r2: number) => { const [x1, y1] = at0(deg, r1), [x2, y2] = at0(deg, r2); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); };
  // blued steel, as on the page: hard light bands on the rim, a deep cold face
  const steel = g.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  [[0, "#7C8EA6"], [0.18, "#23344C"], [0.42, "#4A5E7A"], [0.6, "#141F31"], [0.82, "#3A4C66"], [1, "#0B1320"]].forEach(([o, c]) => steel.addColorStop(o as number, c as string));
  ring(199, steel);
  const face = g.createRadialGradient(cx - R * 0.24, cy - R * 0.4, 0, cx, cy, R * 1.1);
  face.addColorStop(0, "#2C4060"); face.addColorStop(0.55, "#18263C"); face.addColorStop(1, "#0E1828");
  ring(186, face);
  g.strokeStyle = "#A7ADB6";
  g.lineWidth = 1.6;
  for (let i = 0; i < 120; i++) ray(i * 3, 186, i % 5 === 0 ? 178 : 182);
  [178, 156, 134, 54].forEach((r) => ring(r));
  for (let i = 0; i < 24; i++) ray(255 + i * 15 + 7.5, 178, 156);
  for (const h of HUONG) { ray(h.goc + 22.5, 156, 134); ray(h.goc + 22.5, 134, 54); }
  g.textAlign = "center";
  g.textBaseline = "middle";
  const han = "'Noto Serif TC', 'Noto Serif SC', 'PMingLiU', serif";
  g.fillStyle = "#E6E9EE";
  SON.forEach((s, i) => { const [x, y] = at0(255 + i * 15, 167); g.font = `${i % 3 === 1 ? 600 : 500} ${(i % 3 === 1 ? 13 : 11.5) * u}px ${han}`; g.fillText(s, x, y); });
  g.font = `700 ${15.5 * u}px ${han}`;
  for (const h of HUONG) { const [x, y] = at0(h.goc, 145); g.fillText(QUAI[h.id], x, y); }
  // the rim engraving, along the top
  const rim = `Bản Đồ Tịnh Hoá · Gia chủ ${b.ten} · Phong Thuỷ Là Tịnh`;
  g.font = `600 ${9 * u}px ${body}`;
  g.fillStyle = "#EEF2F7";
  // each character takes its own width along the arc, with a little tracking
  const rr = 190 * u, gap = 1.2 * u, wOf = (ch: string) => (g.measureText(ch).width + gap) / rr;
  let a0 = -[...rim].reduce((s, ch) => s + wOf(ch), 0) / 2;
  for (const ch of rim) {
    const w = wOf(ch);
    a0 += w / 2;
    g.save(); g.translate(cx + Math.sin(a0) * 190 * u, cy - Math.cos(a0) * 190 * u); g.rotate(a0); g.fillText(ch, 0, 0); g.restore();
    a0 += w / 2;
  }
  // the vermilion mark on the rim, resting on Đông
  g.fillStyle = C.son;
  { const [x1, y1] = at0(0, 177), [x2, y2] = at0(-1.7, 186), [x3, y3] = at0(1.7, 186); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineTo(x3, y3); g.fill(); }
  // the eight cung
  for (const h of HUONG) {
    const l = b.la[h.id];
    const [x, y] = at0(h.goc, 94);
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "#E6E9EE";
    g.font = `600 28px ${body}`;
    g.fillText(h.ten, x, y - 86);
    g.textBaseline = "alphabetic";
    card(g, l, x - 46, y - 66, 92, disp);
  }
  g.textBaseline = "alphabetic";
  // the heart: the logo, as it is
  const logo = await loadImg("/images/logo/ngoc-am-symbol-color-512.png");
  const oy = 370, cell = S / 3, ox = (W - S) / 2;
  if (logo) g.drawImage(logo, ox + S / 2 - cell * 0.28, oy + S / 2 - cell * 0.28, cell * 0.56, cell * 0.56);

  // the eight readings, two columns
  let y0 = oy + S + 70;
  const colW = (W - 2 * M - 50) / 2;
  const ys = [y0, y0];
  HUONG.forEach((h, i) => {
    const col = i % 2, x = M + col * (colW + 50);
    let y = ys[col];
    const l = b.la[h.id], n = NGHIA[l.hang], note = GHI_CHU_CHAT[laKey(l)];
    g.textAlign = "left";
    g.fillStyle = "#E6E9EE";
    g.font = `600 28px ${body}`;
    g.fillText(`${h.ten} · ${laTen(l)} · ${n.chu}`, x, y);
    y += 34;
    g.font = `400 21px ${body}`;
    g.fillStyle = C.ink;
    y = wrap(g, n.tinhChat, x, y, colW, 28);
    y = wrap(g, `Nên: ${n.nen}`, x, y, colW, 28);
    if (n.tranh) y = wrap(g, `Tránh: ${n.tranh}`, x, y, colW, 29);
    if (note) { g.fillStyle = C.son; y = wrap(g, `Riêng ${laTen(l)}: ${note}`, x, y, colW, 29); }
    ys[col] = y + 22;
  });
  y0 = Math.max(...ys);
  g.textAlign = "center";
  g.fillStyle = C.muted;
  g.font = `italic 400 28px ${disp}`;
  g.fillText(`Thầy Tịnh · lập ngày ${at.toLocaleDateString("vi-VN")}`, W / 2, Math.max(y0 + 24, H - 110)); // below the last reading, never over it
  return cv;
}
