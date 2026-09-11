"use client";

import { useState } from "react";
import BirthForm from "./BirthForm";
import TuViChart from "./TuViChart";
import { generateChart } from "@/lib/tuvi/engine/chartEngine";
import type { BirthInput, VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";

export default function LapLaSoClient() {
  const [chart, setChart] = useState<VietnameseChartDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(input: BirthInput) {
    try {
      setChart(generateChart(input, "ngoc-am"));
      setError(null);
    } catch {
      setError("Không thể lập lá số với thông tin đã nhập. Vui lòng kiểm tra lại ngày giờ sinh.");
      setChart(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-2xl border border-walnut/15 bg-ivory/70 p-6 sm:p-8">
        <BirthForm onSubmit={handleSubmit} />
        {error && <p className="mt-4 text-[13px] text-lacquer">{error}</p>}
      </div>

      {chart && (
        <div className="mt-12">
          <TuViChart chart={chart} />
        </div>
      )}
    </div>
  );
}
