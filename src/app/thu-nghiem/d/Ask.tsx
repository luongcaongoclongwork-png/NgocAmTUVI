"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { formatPrice, type Service } from "@/lib/service-constants";

type Person = { name: string; role: string; photo: string };
export type AskItem = { id: string; label: string; hint: string; reply: string; services: Service[]; who: Person | null };

/**
 * The page's H1 is a question. Picking an answer folds the list away and
 * shows the packages that fit, the Xuyên giả, and a booking link that
 * carries the exact package to /lien-he.
 */
export default function Ask({ items, zalo }: { items: AskItem[]; zalo: { url: string; phone: string } }) {
  const [picked, setPicked] = useState<AskItem | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const pick = (item: AskItem) => {
    setPicked(item);
    requestAnimationFrame(() => {
      const el = resultRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      if (el.getBoundingClientRect().top > window.innerHeight * 0.6) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="dD-ask">
      <h1 className="dD-question">Điều gì đang khiến bạn cân nhắc?</h1>

      {!picked && (
        <ul className="dD-options">
          {items.map((it, i) => (
            <li key={it.id} style={{ "--i": i } as CSSProperties}>
              <button type="button" onClick={() => pick(it)}>
                <span className="dD-opt-label">{it.label}</span>
                <span className="dD-opt-hint">{it.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="dD-result-wrap">
        {picked && (
          <div className="dD-result">
            <p className="dD-picked">
              {picked.label}
              <button type="button" onClick={() => setPicked(null)} className="dD-change">Chọn điều khác</button>
            </p>
            <p className="dD-reply">{picked.reply}</p>

            <ul className="dD-offers">
              {picked.services.map((s) => (
                <li key={s.id}>
                  <div>
                    <h2>{s.title}</h2>
                    <p>{s.desc}</p>
                    {s.note && <p className="dD-offer-note">{s.note}</p>}
                  </div>
                  <div className="dD-offer-buy">
                    <b>{formatPrice(s.price)}</b>
                    {s.duration && <span>{s.duration}</span>}
                    <Link href={`/lien-he?topic=${s.group}&service=${s.id}`} className="dD-btn">Đặt phiên này</Link>
                  </div>
                </li>
              ))}
            </ul>

            <div className="dD-by">
              {picked.who && (
                <p className="dD-who">
                  {picked.who.photo && <Image src={picked.who.photo} alt={`Chân dung ${picked.who.name}`} width={48} height={60} />}
                  <span>
                    <b>{picked.who.name}</b>
                    {picked.who.role}
                  </span>
                </p>
              )}
              {zalo.url && (
                <a href={zalo.url} className="dD-link">Còn phân vân? Nhắn Zalo {zalo.phone}</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
