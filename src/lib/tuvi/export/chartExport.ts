/**
 * Client-only chart export (PNG / PDF). Renders the given DOM node with
 * html2canvas-pro, then either downloads the canvas directly (PNG) or drops
 * it into a jsPDF page (PDF). Both libs are dynamically imported so they
 * never end up in the initial bundle for pages that don't use `/lap-la-so`.
 *
 * Uses the `html2canvas-pro` fork, not the original `html2canvas`: this
 * project's Tailwind v4 theme emits modern CSS color functions
 * (`color-mix()`/`oklch()`) for every opacity-modifier utility (e.g.
 * `border-walnut/30`), which the original html2canvas cannot parse
 * ("Attempting to parse an unsupported color function") — html2canvas-pro
 * adds that support and is otherwise a drop-in replacement.
 */

async function renderNodeToCanvas(node: HTMLElement, scale: number): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas-pro");
  return html2canvas(node, {
    scale,
    backgroundColor: "#f6eedf",
    useCORS: true,
  });
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function exportChartAsImage(node: HTMLElement, filename: string) {
  const canvas = await renderNodeToCanvas(node, 2);
  const dataUrl = canvas.toDataURL("image/png");
  triggerDownload(dataUrl, filename);
}

/**
 * `node` must be a `.tuvi-print-page` element (see print/PrintChart.tsx) —
 * already laid out at the physical A4 size (210x297mm, print.css), not the
 * live web chart. Because the captured canvas is therefore ALREADY shaped
 * exactly like an A4 page, this drops it straight onto a same-size jsPDF
 * page at (0,0) with no further scaling or centering needed.
 *
 * The previous version of this function captured the (roughly square) web
 * chart and fit/centered it inside an A4 page's margins — on a page much
 * taller than it is wide, that left large empty bands above and below the
 * chart ("khoảng trắng lớn" — see docs/tuvi-engine-audit.md). Capturing the
 * print layout instead is what actually fixes that, not a scaling tweak.
 *
 * scale=300/96 (300dpi at A4, the standard print-quality threshold)
 * instead of exportChartAsImage's 2 — this is a print deliverable, not a
 * screen preview, so it gets the higher of the two budgets image quality
 * vs. file size/render time allows here.
 */
export async function exportChartAsPdf(printPageNode: HTMLElement, filename: string) {
  const canvas = await renderNodeToCanvas(printPageNode, 300 / 96);
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
  pdf.save(filename);
}
