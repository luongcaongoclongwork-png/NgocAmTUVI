"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ALL_NAV_ITEMS, isNavItemActive } from "./navItems";
import "./mobileNav.css";

const EXIT_MS = 200;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  // Same two-phase pattern as ExploreMenu.tsx: `rendered` keeps the portal
  // mounted through its exit fade instead of vanishing instantly; `entered`
  // flips a frame after mount so the very first paint is still the closed
  // state (backdrop transparent, drawer off-screen) for the CSS transition
  // to animate from.
  const [rendered, setRendered] = useState(false);
  const [entered, setEntered] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRendered(true);
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }

    setEntered(false);
    if (!rendered) return;
    if (prefersReducedMotion()) {
      setRendered(false);
      return;
    }
    const t = setTimeout(() => setRendered(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [open, rendered]);

  // Scroll lock + focus-into-drawer — waits on `rendered` too, since the
  // portal (and drawerRef) doesn't exist in the DOM until that flips true.
  useEffect(() => {
    if (!open || !rendered) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const focusables = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, rendered]);

  // Restore focus to the trigger whenever the drawer closes.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Đóng menu chính" : "Mở menu chính"}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center text-walnut transition-colors hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory xl:hidden"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {rendered &&
        createPortal(
          // Portaled to <body>: Header has `backdrop-blur`, and a `backdrop-filter`
          // ancestor becomes the containing block for `position:fixed` descendants
          // (same rule as `filter`/`transform`) — without this portal the drawer
          // was clipped to the header's own 76px-tall box instead of the viewport.
          <div className="fixed inset-0 z-[100] xl:hidden">
          <button
            type="button"
            aria-label="Đóng menu chính"
            onClick={() => setOpen(false)}
            data-open={entered}
            className="mobile-nav-backdrop absolute inset-0 bg-ink/50"
          />
          <div
            id="mobile-nav-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu chính"
            data-open={entered}
            className="mobile-nav-drawer absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto border-l border-walnut/15 bg-ivory p-6 shadow-[0_10px_40px_rgba(49,34,21,0.1)]"
          >
            <div className="flex items-center justify-between">
              <span className="font-heading text-base tracking-[0.2em] text-ink">NGỌC ÂM</span>
              <button
                type="button"
                aria-label="Đóng menu chính"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center text-walnut/80 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="mt-8 flex flex-col">
              {ALL_NAV_ITEMS.map((item) => {
                const active = isNavItemActive(pathname, item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`tracking-label border-b border-walnut/10 py-4 text-[13px] font-medium uppercase transition-colors first:pt-0 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      active ? "text-gold" : "text-walnut/85"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/lien-he"
              onClick={() => setOpen(false)}
              className="tracking-label mt-8 flex h-12 items-center justify-center border border-walnut text-[12px] font-medium uppercase text-walnut transition-colors hover:border-gold hover:text-gold"
            >
              Đặt lịch
            </Link>
          </div>
          </div>,
          document.body,
        )}
    </>
  );
}
