"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * A 2px gold line at the top of the viewport that starts the instant an
 * internal link is clicked and completes when the new route has rendered,
 * so a click always gets visible feedback even on a slow connection.
 *
 * No setState-in-effect: the click handler records which URL we left from,
 * and the render compares it with the current URL — same URL means still
 * loading, different URL means done. Each click remounts the bar (`key`) so
 * its CSS animation restarts from zero.
 */
export default function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const current = search ? `${pathname}?${search}` : pathname;
  const [nav, setNav] = useState<{ from: string; n: number } | null>(null);

  useEffect(() => {
    // Capture phase: next/link calls preventDefault() on its own clicks
    // (client-side navigation), so a bubbling listener would never see them.
    // If some handler cancels a click and no navigation happens, the bar
    // fades out by itself (nav-progress-timeout in globals.css).
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page / #anchor
      const from = location.pathname + location.search;
      setNav((prev) => ({ from, n: (prev?.n ?? 0) + 1 }));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!nav) return null;
  return (
    <div
      key={nav.n}
      className="nav-progress"
      data-state={nav.from === current ? "loading" : "done"}
      aria-hidden="true"
    />
  );
}
