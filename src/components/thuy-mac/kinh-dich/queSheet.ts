import type { Cast, Hexagram, Kham, Reading } from "@/lib/kinh-dich";

/**
 * The printable "tờ quẻ": one A4 sheet drawn on a canvas (200 dpi), used for all three exports
 * (PNG image, PDF, print) so the three always look the same. Dó paper, ink lines, bronze frame, the vermilion Xuyên Tam Diệm seal.
 */
const W = 1654, H = 2339; // A4 at 200 dpi
const C = { paper: "#efe5d5", ink: "#2b1f17", muted: "#6e5a49", line: "#cdb99c", bronze: "#94733a", son: "#a8231f" };
const DIEM: Record<string, string> = { BOI_QUANG: "Bối quang", NHIEN_DANG: "Nhiên đăng", DO_TY: "Đồ tỳ" };

export type SheetInput = { r: Reading; casts: Cast[]; kham: Kham | undefined; code: string; at: Date; link: string };

const cssVar = (name: string, fallback: string) => {
  const v = getComputedStyle(document.body).getPropertyValue(name).trim();
  return v ? `${v}, ${fallback}` : fallback;
};
const loadImg = (src: string) =>
  new Promise<HTMLImageElement | null>((ok) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = () => ok(null);
    i.src = src;
  });

function wrap(g: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  let line = "";
  for (const word of text.split(" ")) {
    const t = line ? `${line} ${word}` : word;
    if (g.measureText(t).width > maxW && line) {
      g.fillText(line, x, y);
      y += lh;
      line = word;
    } else line = t;
  }
  if (line) g.fillText(line, x, y);
  return y + lh;
}

function hexLines(g: CanvasRenderingContext2D, lines: number[], moving: number[], x: number, y: number, w: number) {
  const h = 26, gap = 20;
  for (let r = 0; r < 6; r++) {
    const i = 5 - r, yy = y + r * (h + gap);
    g.fillStyle = C.ink;
    if (lines[i]) g.fillRect(x, yy, w, h);
    else {
      g.fillRect(x, yy, w * 0.43, h);
      g.fillRect(x + w * 0.57, yy, w * 0.43, h);
    }
    if (moving.includes(i + 1)) {
      g.fillStyle = C.son;
      g.beginPath();
      g.arc(x + w + 26, yy + h / 2, 9, 0, Math.PI * 2);
      g.fill();
    }
  }
  return y + 6 * h + 5 * gap;
}

export async function drawSheet({ r, casts, kham, code, at, link }: SheetInput): Promise<HTMLCanvasElement> {
  await document.fonts.ready;
  const disp = cssVar("--de-display", "'Cormorant Garamond', Georgia, serif");
  const body = cssVar("--font-body", "'Be Vietnam Pro', system-ui, sans-serif");
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  const M = 150; // text margin

  // paper and the double bronze frame
  g.fillStyle = C.paper;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = C.bronze;
  g.lineWidth = 4;
  g.strokeRect(64, 64, W - 128, H - 128);
  g.lineWidth = 1.5;
  g.strokeRect(82, 82, W - 164, H - 164);

  // heading
  const logo = await loadImg("/images/logo/ngoc-am-stacked-color-print.png");
  let y = 140;
  if (logo) {
    const lh = 150, lw = (logo.width / logo.height) * lh;
    g.drawImage(logo, (W - lw) / 2, y, lw, lh);
    y += lh + 70;
  }
  g.textAlign = "center";
  g.fillStyle = C.ink;
  g.font = `600 92px ${disp}`;
  g.fillText("Kinh Dịch Xuyên Tam Diệm", W / 2, y);
  y += 62;
  g.fillStyle = C.muted;
  g.font = `400 30px ${body}`;
  const d = at.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const t = at.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  g.fillText(`Ngày gieo ${d}, ${t}`, W / 2, y);
  if (kham) {
    y += 46;
    g.fillText(`Khám ${kham.ten_xtd} (${kham.ten_goc}): ${kham.chu_de}`, W / 2, y);
  }
  y += 60;
  g.strokeStyle = C.bronze;
  g.lineWidth = 1.5;
  g.beginPath();
  g.moveTo(M, y);
  g.lineTo(W / 2 - 18, y);
  g.moveTo(W / 2 + 18, y);
  g.lineTo(W - M, y);
  g.stroke();
  g.save();
  g.translate(W / 2, y);
  g.rotate(Math.PI / 4);
  g.fillStyle = C.bronze;
  g.fillRect(-7, -7, 14, 14);
  g.restore();
  y += 90;

  // the three hexagrams
  const cols: [Hexagram, string, number[]][] = [[r.hien, "Hiện Bích · quẻ chủ", r.moving]];
  if (r.hoa) cols.push([r.hoa, "Hóa Bích · quẻ biến", []]);
  cols.push([r.noi, "Nội Bích · quẻ hỗ", []]);
  const colW = (W - 2 * M - 60 * (cols.length - 1)) / cols.length;
  let low = y;
  cols.forEach(([q, role, mv], i) => {
    const x = M + i * (colW + 60);
    g.textAlign = "left";
    g.fillStyle = C.muted;
    g.font = `400 26px ${body}`;
    g.fillText(role, x, y);
    let yy = hexLines(g, q.hao, mv, x, y + 36, Math.min(250, colW - 60)) + 84;
    g.fillStyle = C.ink;
    g.font = `600 64px ${disp}`;
    g.fillText(q.ten_xtd, x, yy);
    yy += 46;
    g.fillStyle = C.muted;
    g.font = `400 25px ${body}`;
    yy = wrap(g, `Quẻ ${q.so}, ${q.ten_goc}. Chữ khóa ${q.chu_khoa}, diệm ${q.diem}.`, x, yy, colW, 36) + 8;
    g.fillStyle = C.ink;
    g.font = `400 27px ${body}`;
    yy = wrap(g, q.hinh_tuong, x, yy, colW, 42);
    low = Math.max(low, yy);
  });
  // arrow from Hiện to Hóa: the change
  if (r.hoa) {
    g.fillStyle = C.bronze;
    g.font = `400 44px ${disp}`;
    g.textAlign = "center";
    g.fillText("→", M + colW + 30, y + 36 + 160);
  }
  y = low + 50;

  // the six nấc, top first, as Chinese 排盘 sheets list them
  const facts: [string, string][] = [
    ["Sáu nấc", casts.map((c, i) => `${i + 1}: ${c.tong}${c.dong ? " động" : ""}`).reverse().join("   ")],
    ["Động Diệm", r.moving.length ? `${r.moving.length} nấc động: nấc ${r.moving.join(", ")} (tính từ dưới lên).` : "Không có nấc nào động: quẻ đứng yên."],
    ["Lời cần đọc", `${r.read.que === "hien" ? "Theo Hiện Bích" : r.read.que === "hoa" ? "Theo Hóa Bích" : "Theo cả hai quẻ, lấy Hiện Bích làm chính"}: ${r.read.loi}${r.read.nac.length ? ` (nấc ${r.read.nac.join(", ")})` : ""}.`],
  ];
  if (r.hoa && r.chuyenDiem) facts.push(["Chuyển diệm", `${DIEM[r.hien.diem_ma]} → ${DIEM[r.hoa.diem_ma]}: ${r.chuyenDiem}`]);
  if (r.theDung) facts.push(["Thể – Dụng", `Thể ${r.theDung.the.ten_xtd} (${r.theDung.the.ngu_hanh}), Dụng ${r.theDung.dung.ten_xtd} (${r.theDung.dung.ngu_hanh}). ${r.theDung.y}`]);
  g.textAlign = "left";
  for (const [dt, dd] of facts) {
    g.strokeStyle = C.line;
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(M, y - 44);
    g.lineTo(W - M, y - 44);
    g.stroke();
    g.fillStyle = C.ink;
    g.font = `600 36px ${disp}`;
    g.fillText(dt, M, y);
    g.font = `400 27px ${body}`;
    y = wrap(g, dd, M + 300, y, W - 2 * M - 300, 42) + 40;
  }

  // the rest of the page is ruled for the Chủ Sự's own notes (and the Xuyên giả's, at a Xuyên vấn)
  const foot = H - 300;
  g.fillStyle = C.ink;
  g.font = `600 36px ${disp}`;
  g.fillText('Ghi chép', M, y + 20);
  g.fillStyle = C.muted;
  g.font = `400 24px ${body}`;
  g.fillText('Lời quẻ và lời hào đang được Ngọc Âm biên soạn.', M + 300, y + 20);
  g.strokeStyle = C.line;
  g.lineWidth = 1.2;
  for (let ly = y + 100; ly < foot - 80; ly += 70) {
    g.beginPath();
    g.moveTo(M, ly);
    g.lineTo(W - M, ly);
    g.stroke();
  }

  // closing words, the seal and the link back
  g.fillStyle = C.muted;
  g.font = `italic 400 34px ${disp}`;
  g.textAlign = "center";
  g.fillText("Một quẻ là tấm gương soi việc đang hỏi, không phải lời phán.", W / 2, foot);
  g.font = `400 24px ${body}`;
  g.fillText(`Mã quẻ ${code}. Mở lại quẻ này: ${link}`, W / 2, foot + 56);
  // the Xuyên Tam Diệm seal (the same ấn triện as the Khám Phá icon), stamped in vermilion beside the title
  const parts = await Promise.all(['khung', 'am', 'duong', 'giua'].map((n) => loadImg('/images/an-trien/' + n + '.png')));
  if (parts.every(Boolean)) {
    const sw = 104, sh = Math.round((sw * parts[0]!.height) / parts[0]!.width);
    const off = document.createElement('canvas');
    off.width = sw;
    off.height = sh;
    const o = off.getContext('2d')!;
    for (const p of parts) o.drawImage(p!, 0, 0, sw, sh);
    o.globalCompositeOperation = 'source-in';
    o.fillStyle = C.son;
    o.fillRect(0, 0, sw, sh);
    g.drawImage(off, W - M - sw, 130);
  }
  return cv;
}

/** A one-page PDF that holds the sheet as a JPEG (no library needed). */
export async function sheetToPdf(cv: HTMLCanvasElement): Promise<Blob> {
  const jpg = new Uint8Array(await (await new Promise<Blob>((ok) => cv.toBlob((b) => ok(b!), "image/jpeg", 0.92))).arrayBuffer());
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let len = 0;
  const push = (p: Uint8Array | string) => {
    const b = typeof p === "string" ? enc.encode(p) : p;
    parts.push(b);
    len += b.length;
  };
  const obj = (n: number, s: string) => {
    offsets[n] = len;
    push(`${n} 0 obj\n${s}\nendobj\n`);
  };
  const pw = 595.28, ph = 841.89, draw = `q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`;
  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  obj(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  obj(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`);
  obj(4, `<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`);
  offsets[5] = len;
  push(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${cv.width} /Height ${cv.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
  push(jpg);
  push("\nendstream\nendobj\n");
  const xref = len;
  push(`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts as BlobPart[], { type: "application/pdf" });
}

export function saveBlob(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/** Prints the sheet alone, full A4, through a hidden frame. */
export function printSheet(cv: HTMLCanvasElement) {
  const f = document.createElement("iframe");
  f.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0";
  document.body.appendChild(f);
  const doc = f.contentDocument!;
  doc.open();
  doc.write(`<!doctype html><title>Quẻ Kinh Dịch</title><style>@page{size:A4;margin:0}html,body{margin:0}img{width:210mm;height:297mm;display:block}</style><img src="${cv.toDataURL("image/png")}">`);
  doc.close();
  const img = doc.querySelector("img")!;
  const go = () => {
    f.contentWindow!.focus();
    f.contentWindow!.print();
    setTimeout(() => f.remove(), 1000);
  };
  if (img.complete) go();
  else img.onload = go;
}
