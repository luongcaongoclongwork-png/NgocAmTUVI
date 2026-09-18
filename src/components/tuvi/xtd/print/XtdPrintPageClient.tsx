"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import XtdA4TuViPrintRenderer from "./XtdA4TuViPrintRenderer";
import { loadChartInput, type StoredChartInput } from "@/lib/tuvi/storage/chartInputStorage";
import { generateChart, generateHoroscope } from "@/lib/tuvi/engine/chartEngine";
import type { VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; chart: VietnameseChartDTO; birthInput: StoredChartInput["birthInput"]; targetYear: number }
  | { status: "error" };

/**
 * Xuyen Tam Diem (川三焰) render copy of ../../print/PrintPageClient.tsx —
 * same sessionStorage input + generateChart()/generateHoroscope() pair,
 * only diff is rendering XtdA4TuViPrintRenderer instead of
 * A4TuViPrintRenderer.
 */
export default function XtdPrintPageClient() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [overflowGuardSettled, setOverflowGuardSettled] = useState(false);

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
    if (new URLSearchParams(window.location.search).get("autoprint") !== "1") return;
    if (!overflowGuardSettled) return;
    const frame = requestAnimationFrame(() => window.print());
    return () => cancelAnimationFrame(frame);
  }, [state.status, overflowGuardSettled]);

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
      <div className="print-no-print mx-auto max-w-[1320px] px-6 pt-6 text-center lg:px-10">
        <button
          type="button"
          onClick={() => window.print()}
          className="tracking-label inline-flex h-10 items-center border border-walnut/30 bg-transparent px-4 text-[13px] uppercase text-walnut hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          In / Lưu PDF
        </button>
      </div>
      <XtdA4TuViPrintRenderer
        chart={state.chart}
        birthTime={state.birthInput.time}
        horoscope={horoscope}
        onOverflowGuardSettled={() => setOverflowGuardSettled(true)}
      />
    </>
  );
}
