import { CHAT_PATH } from "./LaBai";
import { CHAT, GHI_CHU_CHAT, HUONG, laKey, laTen, NGHIA, type BanDo, type La } from "@/lib/tinh-hoa";

/** The A4 sheet of a Bản Đồ Tịnh Hoá (200 dpi), shared by the image, the PDF and the print: dó paper, bronze frame, the octagon with the logo at its heart, then the eight readings. */
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

  // the octagon
  const S = 1020, ox = (W - S) / 2, oy = 370, cell = S / 3, cut = S * 0.29;
  g.strokeStyle = C.bronze;
  g.lineWidth = 3;
  g.beginPath();
  const oct = [[cut, 0], [S - cut, 0], [S, cut], [S, S - cut], [S - cut, S], [cut, S], [0, S - cut], [0, cut]];
  oct.forEach(([x, y], i) => (i ? g.lineTo(ox + x, oy + y) : g.moveTo(ox + x, oy + y)));
  g.closePath();
  g.fillStyle = "rgba(247, 240, 228, 0.7)";
  g.fill();
  g.stroke();
  g.lineWidth = 1.2;
  g.strokeStyle = C.line;
  for (const k of [1, 2]) {
    g.beginPath(); g.moveTo(ox + cell * k, oy + 30); g.lineTo(ox + cell * k, oy + S - 30); g.stroke();
    g.beginPath(); g.moveTo(ox + 30, oy + cell * k); g.lineTo(ox + S - 30, oy + cell * k); g.stroke();
  }
  for (const h of HUONG) {
    const l = b.la[h.id];
    const n = NGHIA[l.hang];
    const cx = ox + cell * (h.o[0] - 0.5), top = oy + cell * (h.o[1] - 1);
    g.textAlign = "center";
    g.fillStyle = C.ink;
    g.font = `600 40px ${disp}`;
    g.fillText(h.ten, cx, top + 64);
    card(g, l, cx - 62, top + 88, 124, disp);
    g.fillStyle = C.ink;
    g.font = `600 32px ${disp}`;
    g.fillText(n.chu, cx, top + 88 + 124 * 1.4 + 52);
    g.fillStyle = C.muted;
    g.font = `400 22px ${body}`;
    g.fillText(laTen(l), cx, top + 88 + 124 * 1.4 + 86);
  }
  // the heart: the logo, as it is
  const logo = await loadImg("/images/logo/ngoc-am-symbol-color-512.png");
  g.fillStyle = C.paper;
  g.beginPath();
  g.arc(ox + S / 2, oy + S / 2, cell * 0.36, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = C.bronze;
  g.lineWidth = 2;
  g.stroke();
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
    g.fillStyle = C.ink;
    g.font = `600 30px ${disp}`;
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
