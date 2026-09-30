"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { Branch } from "./InkHome";

/** The menu as a la bàn: tap it and the three paths open around it like compass points. */
export default function Compass({ branches }: { branches: Branch[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={`eCompass ${open ? "is-open" : ""}`}>
      <button ref={btn} type="button" aria-expanded={open} aria-controls={id} aria-label={open ? "Đóng la bàn" : "Mở la bàn: các con đường"} onClick={() => setOpen((o) => !o)} className="eCompass-btn">
        <svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="32" cy="32" r="29" />
          <circle cx="32" cy="32" r="21" strokeDasharray="1.5 3.2" />
          <circle cx="32" cy="32" r="13" />
          <path d="M32 3v6M32 55v6M3 32h6M55 32h6" />
          <path className="eNeedle" d="M32 14 L36 32 L32 50 L28 32 Z" fill="currentColor" fillOpacity="0.18" />
          <circle cx="32" cy="32" r="2" fill="currentColor" />
        </svg>
      </button>
      <nav id={id} aria-label="Các con đường" className="eCompass-menu" hidden={!open}>
        <ul>
          {branches.map((b) => (
            <li key={b.id}>
              <Link href={b.href} onClick={() => setOpen(false)}>{b.name}</Link>
            </li>
          ))}
        </ul>
        <p className="eCompass-more">
          <Link href="/kien-thuc">Sổ tay</Link>
          <Link href="/ve-ngoc-am">Về Ngọc Âm</Link>
          <Link href="/lien-he">Liên hệ</Link>
        </p>
      </nav>
    </div>
  );
}
