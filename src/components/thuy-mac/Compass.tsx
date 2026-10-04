"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { MORE_LINKS, PATH_LINKS } from "./nav";

/**
 * The full menu, opened by Ngọc Âm's seal with a word beside it ("Khám phá", or "Menu" on a phone) so nobody has to
 * guess. The seal's frame and middle stroke stay; its two yin-yang halves turn back into depth and change places.
 */
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
        <span className="tmSeal" aria-hidden="true">
          <span className="tmSeal-frame" />
          <span className="tmSeal-window">
            <span className="tmSeal-half tmSeal-am" />
            <span className="tmSeal-half tmSeal-duong" />
            <span className="tmSeal-mid" />
          </span>
        </span>
        <span className="tmCompass-word tmCompass-word--wide">{open ? "Đóng" : "Khám Phá"}</span>
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
