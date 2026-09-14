"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import A4TuViPrintRenderer from "./A4TuViPrintRenderer";
import { loadChartInput, type StoredChartInput } from "@/lib/tuvi/storage/chartInputStorage";
import { generateChart, generateHoroscope } from "@/lib/tuvi/engine/chartEngine";
import type { VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; chart: VietnameseChartDTO; birthInput: StoredChartInput["birthInput"]; targetYear: number }
  | { status: "error" };

/**
 * /la-so/print — same sessionStorage input + generateChart()/generateHoroscope()
 * pair /la-so itself uses (see LaSoResultClient.tsx), re-derived here only
 * because there is no shared chart cache between routes, not because this
 * route recomputes anything differently. A dedicated route (rather than a
 * hidden print DOM bolted onto /la-so) keeps this print-only CSS isolated
 * from the live chart's fairly complex global stylesheet stack.
 */
export default function PrintPageClient() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const saved = loadChartInput();
    if (!saved) {
      router.replace("/lap-la-so");
      return;
    }
    try {
      const chart = generateChart(saved.birthInput, "ngoc-am");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: "ready", chart, birthInput: saved.birthInput, targetYear: saved.targetYear });
    } catch {
      setState({ status: "error" });
    }
  }, [router]);

  const horoscope = useMemo(() => {
    if (state.status !== "ready") return null;
    try {
      return generateHoroscope(state.birthInput, state.targetYear, state.chart.profile);
    } catch (err) {
      console.error("Print horoscope overlay failed:", err);
      return null;
    }
  }, [state]);

  useEffect(() => {
    if (state.status !== "ready") return;
    // "In lá số" and "Xuất PDF" are two independent buttons on /la-so that
    // both land here — only the former asks for the print dialog to open
    // by itself (see TuViChart.tsx's handlePrint/handleExportPdf); "Xuất
    // PDF" just opens this page and lets the user print/save it themselves.
    if (new URLSearchParams(window.location.search).get("autoprint") !== "1") return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => window.print());
    });
    return () => {
      cancelled = true;
    };
  }, [state.status]);

  if (state.status === "loading") {
    return (
      <div className="mx-auto max-w-[1320px] px-6 py-24 text-center lg:px-10">
        <p className="tracking-label text-[13px] font-medium uppercase text-walnut/60">Đang chuẩn bị bản in…</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-[1320px] px-6 py-24 text-center lg:px-10">
        <p className="text-[15px] font-medium text-lacquer">
          Không thể chuẩn bị bản in với thông tin đã lưu. Vui lòng quay lại lập lá số.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Only reachable via "Xuất PDF" (no ?autoprint=1) — "In lá số" already
          opens the OS print dialog on its own. print-no-print removes this
          from layout entirely under @media print (see print.css) — plain
          visibility:hidden alone left it tall enough, still occupying flow
          height while invisible, to trigger a spurious blank 2nd page. */}
      <div className="print-no-print mx-auto max-w-[1320px] px-6 pt-6 text-center lg:px-10">
        <button
          type="button"
          onClick={() => window.print()}
          className="tracking-label inline-flex h-10 items-center border border-walnut/30 bg-transparent px-4 text-[13px] uppercase text-walnut hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          In / Lưu PDF
        </button>
      </div>
      <A4TuViPrintRenderer chart={state.chart} birthTime={state.birthInput.time} horoscope={horoscope} />
    </>
  );
}
