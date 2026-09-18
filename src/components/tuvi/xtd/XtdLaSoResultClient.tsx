"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import XtdTuViChart from "./XtdTuViChart";
import TargetYearStepper from "../TargetYearStepper";
import { loadChartInput, type StoredChartInput } from "@/lib/tuvi/storage/chartInputStorage";
import { generateChart } from "@/lib/tuvi/engine/chartEngine";
import type { VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; chart: VietnameseChartDTO; birthInput: StoredChartInput["birthInput"] }
  | { status: "error" };

/**
 * Xuyen Tam Diem (川三焰) render copy of ../LaSoResultClient.tsx — reads the
 * SAME sessionStorage chart input and calls the SAME generateChart(input,
 * "ngoc-am") the traditional /la-so route uses (no separate engine, no
 * separate profile). Only diff: renders XtdTuViChart instead of TuViChart,
 * and "Chỉnh thông tin" returns to /lap-la-so (which itself re-offers both
 * naming-mode options, same as the traditional route's back button).
 */
export default function XtdLaSoResultClient() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [targetYear, setTargetYear] = useState<number | null>(null);

  useEffect(() => {
    const saved = loadChartInput();
    if (!saved) {
      router.replace("/lap-la-so");
      return;
    }
    try {
      const chart = generateChart(saved.birthInput, "ngoc-am");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: "ready", chart, birthInput: saved.birthInput });
      setTargetYear(saved.targetYear);
    } catch {
      setState({ status: "error" });
    }
  }, [router]);

  if (state.status === "loading") {
    return (
      <div className="mx-auto max-w-[1320px] px-6 py-24 text-center lg:px-10">
        <p className="tracking-label text-[13px] font-medium uppercase text-walnut/60">Đang lập lá số…</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-[1320px] px-6 py-24 text-center lg:px-10">
        <p className="text-[15px] font-medium text-lacquer">
          Không thể lập lá số với thông tin đã lưu. Vui lòng kiểm tra lại ngày giờ sinh và thử lại.
        </p>
        <button
          type="button"
          onClick={() => router.push("/lap-la-so")}
          className="tracking-label mt-6 inline-flex h-11 items-center border border-walnut/30 px-4 text-[13px] uppercase text-walnut hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          ← Quay lại nhập thông tin
        </button>
      </div>
    );
  }

  const { chart, birthInput } = state;

  return (
    <div className="la-so-result-page mx-auto max-w-[1320px] px-6 py-16 lg:px-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => router.push("/lap-la-so")}
            className="tracking-label mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase text-walnut/60 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            <span aria-hidden="true">←</span> Chỉnh thông tin
          </button>
          <h1 className="font-heading text-[28px] font-semibold text-walnut">
            Lá số Tử Vi
            {chart.name && <span className="ml-2 text-[18px] font-normal text-walnut/70">— {chart.name}</span>}
          </h1>
        </div>

        {targetYear !== null && <TargetYearStepper targetYear={targetYear} onTargetYearChange={setTargetYear} />}
      </div>

      <XtdTuViChart chart={chart} birthTime={birthInput.time} birthInput={birthInput} targetYear={targetYear ?? undefined} />
    </div>
  );
}
