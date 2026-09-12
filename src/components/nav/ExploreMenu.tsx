"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EXPLORE_NAV_ITEMS, isNavItemActive } from "./navItems";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-150 ${open ? "-rotate-180" : ""}`}
    >
      <path d="M1.5 3.5L5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Desktop-only disclosure dropdown for the secondary nav items. Click/Enter/Space
 * toggles (never hover-only, per accessibility requirement) — closes on Escape,
 * outside click, or choosing a link. Anchors inside stay in normal Tab order
 * (a standard disclosure pattern), no roving-tabindex menu semantics needed.
 */
export default function ExploreMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const menuId = useId();
  const active = EXPLORE_NAV_ITEMS.some((item) => isNavItemActive(pathname, item.href));

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={buttonId}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={`tracking-label flex items-center gap-1 text-[11px] font-medium uppercase transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${
          active ? "text-gold" : "text-walnut/80"
        }`}
      >
        Khám phá
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          id={menuId}
          role="group"
          aria-labelledby={buttonId}
          className="absolute left-1/2 top-full z-50 mt-3 w-52 -translate-x-1/2 border border-walnut/15 bg-ivory py-2 shadow-lg"
        >
          {EXPLORE_NAV_ITEMS.map((item) => {
            const itemActive = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={itemActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-[13px] transition-colors hover:bg-parchment/50 hover:text-gold focus-visible:outline-none focus-visible:bg-parchment/60 ${
                  itemActive ? "text-gold" : "text-walnut/85"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
