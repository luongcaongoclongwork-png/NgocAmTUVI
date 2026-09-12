"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import BirthForm from "./BirthForm";
import TuViChart from "./TuViChart";
import { generateChart } from "@/lib/tuvi/engine/chartEngine";
import type { BirthInput, VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";

export type GenerationStatus = "idle" | "validating" | "generating" | "success" | "error";

/** Header is `sticky top-0`; its rendered height (logo row) is ~76px — keep the focus/scroll target clear of it. */
const HEADER_SCROLL_OFFSET = 88;

export default function LapLaSoClient() {
  const [chart, setChart] = useState<VietnameseChartDTO | null>(null);
  const [birthInput, setBirthInput] = useState<BirthInput | null>(null);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetYear, setTargetYear] = useState(() => new Date().getFullYear());
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  function handleSubmit(input: BirthInput) {
    setStatus("validating");

    // Synchronous today, but still routed through a "generating" tick (not an
    // artificial delay — see brief) so the disabled/"Đang an sao…" state
    // actually paints for at least one frame before flipping to success.
    // `setTimeout`, not `requestAnimationFrame`: rAF callbacks are paused (not
    // just throttled) in a backgrounded/hidden tab, which would leave the
    // button stuck on "Đang an sao…" forever if the user switches away mid-submit.
    setTimeout(() => {
      setStatus("generating");
      setTimeout(() => {
        try {
          const nextChart = generateChart(input, "ngoc-am");
          setChart(nextChart);
          setBirthInput(input);
          setErrorMessage(null);
          setStatus("success");
          setTimeout(() => {
            resultHeadingRef.current?.scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
              block: "start",
            });
            resultHeadingRef.current?.focus();
          }, 0);
        } catch {
          setErrorMessage("Không thể lập lá số với thông tin đã nhập. Vui lòng kiểm tra lại ngày giờ sinh và thử lại.");
          setChart(null);
          setBirthInput(null);
          setStatus("error");
        }
      }, 0);
    }, 0);
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
          <BirthForm
            onSubmit={handleSubmit}
            status={status}
            targetYear={targetYear}
            onTargetYearChange={setTargetYear}
          />

          {/* Generation feedback: role="alert" interrupts for the error case; the
              success line is a quieter aria-live="polite" announcement (the real
              "you're done" signal is the scroll + focus move below). */}
          {status === "error" && errorMessage && (
            <p role="alert" className="mt-4 text-[14px] font-medium text-lacquer">
              {errorMessage}
            </p>
          )}
          <p aria-live="polite" className="sr-only">
            {status === "success" ? "Lá số đã được lập." : ""}
          </p>
        </div>
      </div>

      {chart && birthInput && (
        <div className="mt-12">
          <h2
            ref={resultHeadingRef}
            tabIndex={-1}
            style={{ scrollMarginTop: HEADER_SCROLL_OFFSET }}
            className="tracking-label text-center text-[13px] font-medium uppercase text-gold outline-none"
          >
            Lá số Tử Vi
          </h2>
          <div className="mt-6">
            <TuViChart chart={chart} birthTime={birthInput.time} birthInput={birthInput} targetYear={targetYear} />
          </div>
        </div>
      )}
    </div>
  );
}
