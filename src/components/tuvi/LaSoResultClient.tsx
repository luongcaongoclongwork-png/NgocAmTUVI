"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TuViChart from "./TuViChart";
import TargetYearStepper from "./TargetYearStepper";
import { loadChartInput, saveChartInput, type StoredChartInput } from "@/lib/tuvi/storage/chartInputStorage";
import { generateChart } from "@/lib/tuvi/engine/chartEngine";
import type { VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; chart: VietnameseChartDTO; birthInput: StoredChartInput["birthInput"] }
  | { status: "error" };

/**
 * Result-only route (/la-so). Reads the input saved by LapLaSoClient's
 * submit (see chartInputStorage.ts), then calls the SAME generateChart()
 * the old inline flow used — no new engine/an-sao logic, no second chart
 * component. TuViChart below is the exact component /lap-la-so used to
 * render inline; its own JSX/CSS is untouched by this route split.
 */
export default function LaSoResultClient() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [targetYear, setTargetYear] = useState<number | null>(null);

  // sessionStorage is a one-time, browser-only read at mount — the
  // documented useEffect use case ("synchronize with an external system").
  // A useSyncExternalStore-based version was tried instead (to satisfy
  // react-hooks/set-state-in-effect without an eslint-disable) but proved
  // genuinely racy here: on the first post-hydration render its snapshot
  // still reported null (matching getServerSnapshot) and this effect's own
  // redirect fired on THAT render, before useSyncExternalStore's resync
  // pass could land the real value — reproduced consistently via console
  // logging (2x null renders, then 2x correct). Plain effect+setState does
  // not have that race, since the redirect and the load happen in the same
  // effect body, in order.
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

  function handleTargetYearChange(year: number) {
    setTargetYear(year);
    // Keep sessionStorage in sync so a fresh page load — including the
    // print route, which reads chart input independently in its own tab —
    // picks up the year adjusted here, not the one from the original form.
    saveChartInput({ birthInput, targetYear: year });
  }

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

        {targetYear !== null && <TargetYearStepper targetYear={targetYear} onTargetYearChange={handleTargetYearChange} />}
      </div>

      <TuViChart chart={chart} birthTime={birthInput.time} birthInput={birthInput} targetYear={targetYear ?? undefined} />
    </div>
  );
}
