"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { docBanDo, GHI_CHU_CHAT, HUONG, laKey, laTen, NGHIA, type BanDo } from "@/lib/tinh-hoa";
import { printSheet, saveBlob, sheetToPdf } from "../kinh-dich/queSheet";
import LaBai from "./LaBai";
import { drawBanDo } from "./banDoSheet";
import "./tinh-hoa.css";

/**
 * Bản Đồ Tịnh Hoá (owner-approved 2026-10-27): an octagon like a bát quái, the Ngọc Âm logo at its heart (the original file,
 * never moved or recoloured), the eight directions around it the owner's way. The petals open once, clockwise from
 * Đông; below, each direction's reading in full. Kept as an A4 sheet: image, PDF, print.
 */
export default function BanDoTinhHoa({ formPath = "/phong-thuy/lap-ban-do-tinh-hoa" }: { formPath?: string }) {
  const router = useRouter();
  const [b, setB] = useState<BanDo | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [at] = useState(() => new Date());

  useEffect(() => {
    const saved = docBanDo();
    if (!saved) {
      router.replace(formPath);
      return;
    }
    queueMicrotask(() => setB(saved));
  }, [router, formPath]);

  if (!b) return <p className="thWait">Đang dựng bản đồ…</p>;

  const ngay = b.ngaySinh ? b.ngaySinh.split("-").reverse().join("/") : "";
  const xuat = async (what: "png" | "pdf" | "print") => {
    setBusy(what);
    try {
      const cv = await drawBanDo(b, at);
      const name = `ban-do-tinh-hoa-${(b.ten || "gia-chu").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").replace(/\W+/g, "-").toLowerCase()}`;
      if (what === "print") printSheet(cv);
      else if (what === "pdf") saveBlob(await sheetToPdf(cv), `${name}.pdf`);
      else saveBlob(await new Promise<Blob>((ok) => cv.toBlob((x) => ok(x!), "image/png")), `${name}.png`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="th thMap">
      <header className="thMap-head">
        <button type="button" className="ipLink thLinkBtn" onClick={() => router.push(formPath)}>Sửa bản đồ</button>
        <p className="thMap-kicker">Phong Thuỷ Là Tịnh · Bản Đồ Tịnh Hoá</p>
        <h1 className="thMap-name">{b.ten}</h1>
        <p className="thMap-meta">
          {ngay && <span>Sinh ngày {ngay}</span>}
          {b.diaChi && <span>{b.diaChi}</span>}
        </p>
      </header>

      {/* the octagon: eight petals around the logo, opening clockwise from Đông */}
      <div className="thOct" role="list" aria-label="Tám hướng của ngôi nhà">
        <svg className="thOct-frame" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="88,4 212,4 296,88 296,212 212,296 88,296 4,212 4,88" />
          <polygon className="thOct-inner" points="118,96 182,96 204,118 204,182 182,204 118,204 96,182 96,118" />
          {[[150, 4, 150, 96], [296, 150, 204, 150], [150, 296, 150, 204], [4, 150, 96, 150], [254, 46, 193, 107], [254, 254, 193, 193], [46, 254, 107, 193], [46, 46, 107, 107]].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </svg>
        {HUONG.map((h, i) => {
          const l = b.la[h.id];
          const n = NGHIA[l.hang];
          return (
            <div key={h.id} role="listitem" className="thPetal" style={{ gridColumn: h.o[0], gridRow: h.o[1], ["--k" as string]: i }}>
              <p className="thPetal-dir">{h.ten}</p>
              <LaBai la={l} size="md" />
              <p className="thPetal-chu">{n.chu}</p>
            </div>
          );
        })}
        <div className="thOct-heart" style={{ gridColumn: 2, gridRow: 2 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the logo's own SVG file, shown as it is */}
          <img src="/images/logo/ngoc-am-symbol-color.svg" alt="Ngọc Âm" width={120} height={120} />
        </div>
      </div>

      <div className="thExport" role="group" aria-label="Giữ lại bản đồ">
        <p>Giữ lại bản đồ (khổ A4):</p>
        <button type="button" className="ipBtn thBtn--ghost" onClick={() => xuat("png")} disabled={!!busy}>{busy === "png" ? "Đang vẽ…" : "Lưu Ảnh Bản Đồ"}</button>
        <button type="button" className="ipBtn thBtn--ghost" onClick={() => xuat("pdf")} disabled={!!busy}>{busy === "pdf" ? "Đang tạo…" : "Xuất PDF"}</button>
        <button type="button" className="ipBtn thBtn--ghost" onClick={() => xuat("print")} disabled={!!busy}>In Bản Đồ</button>
      </div>

      <section aria-labelledby="th-read-h">
        <h2 id="th-read-h" className="thH">Tám hướng, từng hướng</h2>
        <ol className="thRead">
          {HUONG.map((h) => {
            const l = b.la[h.id];
            const n = NGHIA[l.hang];
            const note = GHI_CHU_CHAT[laKey(l)];
            return (
              <li key={h.id} className="thRead-item">
                <LaBai la={l} size="sm" />
                <div>
                  <p className="thRead-h">
                    <b>{h.ten}</b> · {laTen(l)} · {n.chu}
                  </p>
                  <p>{n.tinhChat}</p>
                  <p><span className="thTag">Nên</span> {n.nen}</p>
                  {n.tranh && <p><span className="thTag thTag--tranh">Tránh</span> {n.tranh}</p>}
                  {note && <p><span className="thTag thTag--son">Riêng {laTen(l)}</span> {note}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
      <p className="thSign">Thầy Tịnh · Phong Thuỷ Là Tịnh · lập ngày {at.toLocaleDateString("vi-VN")}</p>
    </div>
  );
}
