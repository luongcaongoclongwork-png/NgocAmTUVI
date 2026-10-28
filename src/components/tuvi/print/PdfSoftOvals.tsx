"use client";

import { useEffect, useRef } from "react";

/**
 * The two soft ovals behind the page header and the Xuyên giả's name, drawn
 * on <canvas> for the PDF export only.
 *
 * On the printed page they are two CSS radial gradients on
 * `.tuvi-print-page::before` (print.css) and the browser paints them
 * correctly. "Xuất PDF" goes through html2canvas-pro instead, which does not
 * paint an explicitly sized, mm-based elliptical gradient: it came out as a
 * flat block with hard edges (found 2026-10-02 by capturing the export and
 * comparing it with /la-so/print). A canvas element is copied by that library
 * pixel for pixel, so the same two ovals are drawn here with the browser's
 * own 2D gradient, and `.tuvi-print-page--pdf` turns the CSS pair off.
 *
 * Geometry and colour are the print.css ones, kept in sync by hand. The
 * canvases sit in a box with the CSS layer's own 2.5mm inset and clipping, so
 * "50% 15.3mm" means the same point and an oval is cut off at the same edge;
 * each canvas is twice the radii.
 * Stops: 85% solid to 55% of the radius, then fading to nothing.
 */
const OVALS = [
  { id: "header", rx: 57.9, ry: 27, cy: 15.3 },
  { id: "name", rx: 63.1, ry: 15.2, cy: 275.1 },
] as const;

const TONE = "243, 226, 203";
/** Canvas pixels per mm: 300dpi, the resolution exportChartAsPdf captures at. */
const PX_PER_MM = 300 / 25.4;

function paint(canvas: HTMLCanvasElement, rx: number, ry: number) {
  const w = Math.round(rx * 2 * PX_PER_MM);
  const h = Math.round(ry * 2 * PX_PER_MM);
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  // a unit circle stretched to the box: the same shape as `ellipse <rx> <ry>`
  ctx.translate(w / 2, h / 2);
  ctx.scale(w / 2, h / 2);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, `rgba(${TONE}, 0.85)`);
  g.addColorStop(0.55, `rgba(${TONE}, 0.85)`);
  g.addColorStop(1, `rgba(${TONE}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(-1, -1, 2, 2);
}

export default function PdfSoftOvals() {
  const refs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    OVALS.forEach((o, i) => {
      const c = refs.current[i];
      if (c) paint(c, o.rx, o.ry);
    });
  }, []);

  return (
    <div className="print-pdf-ovals" aria-hidden="true">
      {OVALS.map((o, i) => (
        <canvas
          key={o.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="print-pdf-oval"
          style={{
            left: `calc(50% - ${o.rx}mm)`,
            top: `${o.cy - o.ry}mm`,
            width: `${o.rx * 2}mm`,
            height: `${o.ry * 2}mm`,
          }}
        />
      ))}
    </div>
  );
}
