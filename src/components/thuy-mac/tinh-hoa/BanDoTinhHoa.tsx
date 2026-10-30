"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { docBanDo, GHI_CHU_CHAT, HUONG, laKey, laTen, NGHIA, type BanDo, type Huong } from "@/lib/tinh-hoa";
import { printSheet, saveBlob, sheetToPdf } from "../kinh-dich/queSheet";
import LaBai from "./LaBai";
import { QUAI, QUAI_TEN } from "./LaBan";
import { LaBanNoi } from "./LaBan3D";
import { drawBanDo } from "./banDoSheet";
import "./tinh-hoa.css";

/**
 * Bản Đồ Tịnh Hoá (owner-approved 2026-10-27; la kinh since 2026-10-28): the la bàn Tịnh Hoá with the household's
 * name engraved on its rim. On arrival the red thread turns once to Đông and the light runs round the eight cung; a cung
 * on the dial opens its reading below. Thầy Tịnh's own seal is still being made, so its frame stays empty.
 * Kept as an A4 sheet: image, PDF, print.
 */
export default function BanDoTinhHoa({ formPath = "/phong-thuy/lap-ban-do-tinh-hoa" }: { formPath?: string }) {
  const router = useRouter();
  const [b, setB] = useState<BanDo | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [doc, setDoc] = useState<Huong | null>(null);
  const [kim, setKim] = useState(0);
  const [at] = useState(() => new Date());

  useEffect(() => {
    const saved = docBanDo();
    if (!saved) {
      router.replace(formPath);
      return;
    }
    queueMicrotask(() => setB(saved));
  }, [router, formPath]);
  // one slow turn of the thread once the dial is on screen
  useEffect(() => {
    if (!b) return;
    const id = requestAnimationFrame(() => setKim(360));
    return () => cancelAnimationFrame(id);
  }, [b]);

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
  const cham = (h: Huong) => {
    setDoc(h);
    setKim(360 + HUONG.find((x) => x.id === h)!.goc);
    document.getElementById(`th-doc-${h}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
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

      <div className="lb-table">
        <LaBanNoi
          la={b.la}
          chon={doc}
          kim={kim}
          tinh
          ten={b.ten}
          onCham={cham}
          label={(h, l) => `${h.ten} (${QUAI_TEN[h.id]}): ${l ? `${laTen(l)}, ${NGHIA[l.hang].chu}` : ""}. Đọc lời của hướng này`}
        />
      </div>

      <div className="thExport" role="group" aria-label="Giữ lại bản đồ">
        <p>Giữ lại bản đồ (khổ A4):</p>
        <button type="button" className="ipBtn thBtn--ghost" onClick={() => xuat("png")} disabled={!!busy}>{busy === "png" ? "Đang vẽ…" : "Lưu Ảnh Bản Đồ"}</button>
        <button type="button" className="ipBtn thBtn--ghost" onClick={() => xuat("pdf")} disabled={!!busy}>{busy === "pdf" ? "Đang tạo…" : "Xuất PDF"}</button>
        <button type="button" className="ipBtn thBtn--ghost" onClick={() => xuat("print")} disabled={!!busy}>In Bản Đồ</button>
      </div>

      <section aria-labelledby="th-read-h">
        <h2 id="th-read-h" className="thH">Tám cung, từng cung</h2>
        <ol className="thRead">
          {HUONG.map((h) => {
            const l = b.la[h.id];
            const n = NGHIA[l.hang];
            const note = GHI_CHU_CHAT[laKey(l)];
            return (
              <li key={h.id} id={`th-doc-${h.id}`} className={`thRead-item ${doc === h.id ? "is-doc" : ""}`}>
                <LaBai la={l} size="sm" />
                <div>
                  <p className="thRead-h">
                    <b>{h.ten}</b> <span className="lb-quai">{QUAI[h.id]} {QUAI_TEN[h.id]}</span> · {laTen(l)} · {n.chu}
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
      <div className="lb-seal">
        <span className="lb-seal-mark" aria-hidden="true" />
        <p className="thSign">Thầy Tịnh · Phong Thuỷ Là Tịnh · lập ngày {at.toLocaleDateString("vi-VN")}</p>
      </div>
    </div>
  );
}
