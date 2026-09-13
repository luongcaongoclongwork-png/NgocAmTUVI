"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MOBILE_TUVI_CANVAS } from "./tuviMobileConstants";

/**
 * Renders `children` at the fixed MOBILE_TUVI_CANVAS size, then CSS-scales
 * the whole layer down (via transform: scale, never a redraw) to fit the
 * viewport's actual width. Scale is a runtime-only presentation value —
 * never persisted, never fed back into the chart data.
 */
export function MobileScaleViewport({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    let frameId = 0;
    const updateScale = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const availableWidth = element.clientWidth;
        setScale(Math.min(1, availableWidth / MOBILE_TUVI_CANVAS.width));
      });
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  const renderedHeight = scale === null ? undefined : MOBILE_TUVI_CANVAS.height * scale;

  return (
    <div ref={viewportRef} className="mobile-chart-viewport" style={{ height: renderedHeight }}>
      {scale === null ? (
        <div className="mobile-chart-placeholder" aria-hidden="true" />
      ) : (
        <div
          className="mobile-chart-scale-layer"
          style={{
            width: MOBILE_TUVI_CANVAS.width,
            height: MOBILE_TUVI_CANVAS.height,
            transform: `translateX(-50%) scale(${scale})`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
