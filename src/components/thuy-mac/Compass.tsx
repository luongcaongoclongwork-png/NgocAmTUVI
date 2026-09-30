"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { MORE_LINKS, PATH_LINKS } from "./nav";

/** The full menu as a la bàn, with a word beside it ("Khám phá", or "Menu" on a phone) so nobody has to guess. */
export default function Compass() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const current = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined);

  return (
    <div ref={root} className={`tmCompass ${open ? "is-open" : ""}`}>
      <button ref={btn} type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="tmCompass-btn">
        <svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="32" cy="32" r="29" />
          <circle cx="32" cy="32" r="21" strokeDasharray="1.5 3.2" />
          <circle cx="32" cy="32" r="13" />
          <path d="M32 3v6M32 55v6M3 32h6M55 32h6" />
          <path className="tmNeedle" d="M32 14 L36 32 L32 50 L28 32 Z" fill="currentColor" fillOpacity="0.18" />
          <circle cx="32" cy="32" r="2" fill="currentColor" />
        </svg>
        <span className="tmCompass-word tmCompass-word--wide">{open ? "Đóng" : "Khám phá"}</span>
        <span className="tmCompass-word tmCompass-word--narrow">{open ? "Đóng" : "Menu"}</span>
      </button>
      <nav id={id} aria-label="Tất cả các trang" className="tmCompass-menu" hidden={!open}>
        <ul>
          {PATH_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={current(l.href)} onClick={() => setOpen(false)}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <p className="tmCompass-more">
          {MORE_LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={current(l.href)} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
        </p>
      </nav>
    </div>
  );
}
