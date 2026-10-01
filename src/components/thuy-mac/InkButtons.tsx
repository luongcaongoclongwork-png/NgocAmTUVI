"use client";

import { useEffect } from "react";

/** The outlined buttons whose ink wash opens where the pointer comes in and closes where it leaves (see kit.css). */
const OUTLINED = ".hBtn--ghost, .hBtn--small, .mBtn--line";

/**
 * One listener for the whole page: it only writes the pointer's position on the
 * button into --x / --y. The wash itself is CSS, so with no script the buttons
 * still work and the wash opens from the centre.
 */
export default function InkButtons() {
  useEffect(() => {
    const place = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;
      const btn = e.target.closest<HTMLElement>(OUTLINED);
      if (!btn) return;
      // moving between the button and its own children is not an entry or an exit
      if (e.relatedTarget instanceof Node && btn.contains(e.relatedTarget)) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--x", `${e.clientX - r.left}px`);
      btn.style.setProperty("--y", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointerover", place);
    document.addEventListener("pointerout", place);
    return () => {
      document.removeEventListener("pointerover", place);
      document.removeEventListener("pointerout", place);
    };
  }, []);
  return null;
}
