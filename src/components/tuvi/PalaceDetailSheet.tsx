"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { VietnamesePalace } from "@/lib/tuvi/types/VietnameseChart";
import type { PalaceHoroscopeView } from "./PalaceCell";
import PalaceDetailContent from "./PalaceDetailContent";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3.5 3.5l11 11M14.5 3.5l-11 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Bottom sheet opened by tapping a palace in the mobile "Tổng quan" grid.
 * Portaled to <body> (same reasoning as MobileNav's drawer — an ancestor
 * with backdrop-filter/filter/transform would otherwise reclip a
 * position:fixed sheet to its own box).
 */
export default function PalaceDetailSheet({
  palace,
  horoscope,
  onClose,
}: {
  palace: VietnamesePalace;
  horoscope?: PalaceHoroscopeView;
  onClose: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    headingRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[100] lg:hidden">
      <button type="button" aria-label="Đóng chi tiết cung" onClick={onClose} className="absolute inset-0 bg-ink/50" />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="palace-sheet-heading"
        className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-2xl border-t border-walnut/15 bg-ivory p-5 pb-8 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="palace-sheet-heading"
            ref={headingRef}
            tabIndex={-1}
            className="tracking-label text-[11px] font-medium uppercase text-walnut/60 outline-none"
          >
            Chi tiết cung
          </h2>
          <button
            type="button"
            aria-label="Đóng chi tiết cung"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-walnut/70 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <CloseIcon />
          </button>
        </div>

        <PalaceDetailContent palace={palace} horoscope={horoscope} />
      </div>
    </div>,
    document.body,
  );
}
