/**
 * Client-only chart export (PNG / PDF). Renders the given DOM node with
 * html2canvas-pro, then either downloads the canvas directly (PNG) or drops
 * it into a jsPDF page sized to the canvas's own aspect ratio (PDF). Both
 * libs are dynamically imported so they never end up in the initial bundle
 * for pages that don't use `/lap-la-so`.
 *
 * Uses the `html2canvas-pro` fork, not the original `html2canvas`: this
 * project's Tailwind v4 theme emits modern CSS color functions
 * (`color-mix()`/`oklch()`) for every opacity-modifier utility (e.g.
 * `border-walnut/30`), which the original html2canvas cannot parse
 * ("Attempting to parse an unsupported color function") — html2canvas-pro
 * adds that support and is otherwise a drop-in replacement.
 */

async function renderNodeToCanvas(node: HTMLElement): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas-pro");
  return html2canvas(node, {
    scale: 2,
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
  const canvas = await renderNodeToCanvas(node);
  const dataUrl = canvas.toDataURL("image/png");
  triggerDownload(dataUrl, filename);
}

export async function exportChartAsPdf(node: HTMLElement, filename: string) {
  const canvas = await renderNodeToCanvas(node);
  const { jsPDF } = await import("jspdf");

  const isLandscape = canvas.width >= canvas.height;
  const pdf = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;
  const scale = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
  const renderWidth = canvas.width * scale;
  const renderHeight = canvas.height * scale;
  const x = (pageWidth - renderWidth) / 2;
  const y = (pageHeight - renderHeight) / 2;

  pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, y, renderWidth, renderHeight);
  pdf.save(filename);
}
