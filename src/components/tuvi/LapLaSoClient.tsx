"use client";

import { useState } from "react";
import Image from "next/image";
import BirthForm from "./BirthForm";
import TuViChart from "./TuViChart";
import { generateChart } from "@/lib/tuvi/engine/chartEngine";
import type { BirthInput, VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";

export default function LapLaSoClient() {
  const [chart, setChart] = useState<VietnameseChartDTO | null>(null);
  const [birthInput, setBirthInput] = useState<BirthInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [targetYear, setTargetYear] = useState(() => new Date().getFullYear());

  function handleSubmit(input: BirthInput) {
    try {
      setChart(generateChart(input, "ngoc-am"));
      setBirthInput(input);
      setError(null);
    } catch {
      setError("Không thể lập lá số với thông tin đã nhập. Vui lòng kiểm tra lại ngày giờ sinh.");
      setChart(null);
      setBirthInput(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10">
      <div className="relative mx-auto max-w-2xl overflow-hidden border border-walnut/15 p-6 sm:p-8">
        {/* Parchment texture: single blend layer (see SectionBackdrop's own note) —
            the photo renders at full opacity, `bg-ivory/80` alone controls how much shows through. */}
        <Image src="/images/parchment-bg.png" alt="" fill sizes="672px" className="pointer-events-none object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-ivory/80" aria-hidden="true" />

        {/* Corner flourishes at all 4 corners — same source sprite already used for the Trung
            Cung side of the chart, now reused here so the input card matches the output card's
            imperial-motif framing. `corner-ornament.png` is a single sprite holding a
            left-facing and a right-facing motif side by side with a plain gap between them
            (and a faint seam line right at that gap) — each small box below crops out just
            ONE motif via object-position, rather than showing the whole sprite shrunk into the
            card's center (which pulled both corners together and put that seam through the
            heading text). Bottom corners reuse the same crops, flipped vertically. */}
        <div className="pointer-events-none absolute left-0 top-0 h-16 w-20 overflow-hidden">
          <Image
            src="/images/corner-ornament.png"
            alt=""
            fill
            sizes="400px"
            className="object-cover mix-blend-multiply"
            style={{ objectPosition: "left top" }}
          />
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-16 w-20 overflow-hidden">
          <Image
            src="/images/corner-ornament.png"
            alt=""
            fill
            sizes="400px"
            className="object-cover mix-blend-multiply"
            style={{ objectPosition: "right top" }}
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-20 -scale-y-100 overflow-hidden">
          <Image
            src="/images/corner-ornament.png"
            alt=""
            fill
            sizes="400px"
            className="object-cover mix-blend-multiply"
            style={{ objectPosition: "left top" }}
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-20 -scale-y-100 overflow-hidden">
          <Image
            src="/images/corner-ornament.png"
            alt=""
            fill
            sizes="400px"
            className="object-cover mix-blend-multiply"
            style={{ objectPosition: "right top" }}
          />
        </div>

        <div className="relative">
          <BirthForm onSubmit={handleSubmit} targetYear={targetYear} onTargetYearChange={setTargetYear} />
          {error && <p className="mt-4 text-[13px] text-lacquer">{error}</p>}
        </div>
      </div>

      {chart && birthInput && (
        <div className="mt-12">
          <TuViChart chart={chart} birthTime={birthInput.time} birthInput={birthInput} targetYear={targetYear} />
        </div>
      )}
    </div>
  );
}
