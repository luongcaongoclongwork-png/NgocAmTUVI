"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BirthForm from "./BirthForm";
import { loadChartInput, saveChartInput, type StoredChartInput } from "@/lib/tuvi/storage/chartInputStorage";
import { markReveal } from "./xtd/xtdMotion";
import type { BirthInput } from "@/lib/tuvi/types/VietnameseChart";

export type GenerationStatus = "idle" | "validating" | "error";

export default function LapLaSoClient() {
  const router = useRouter();
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetYearOverride, setTargetYearOverride] = useState<number | null>(null);
  const [savedInput, setSavedInput] = useState<StoredChartInput | null>(null);
  // How many of the form's 4 groups the user has touched (0-4): the painting behind the form wakes up with it.
  const [awake, setAwake] = useState(0);

  // Prefill when returning from /la-so via "Chinh thong tin" — see
  // chartInputStorage.ts (and LaSoResultClient.tsx's comment on why this is
  // a plain effect+setState, not useSyncExternalStore). BirthForm re-mounts
  // (via its `key` below) once this resolves so its own useState
  // initializers pick up the saved values.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedInput(loadChartInput());
  }, []);

  const targetYear = targetYearOverride ?? savedInput?.targetYear ?? new Date().getFullYear();

  function handleSubmit(input: BirthInput) {
    setStatus("validating");
    try {
      saveChartInput({ birthInput: input, targetYear });
      markReveal();
      setAwake(4);
      // Xuyen Tam Diem is the only naming layer offered (the old "hang ngay" option was removed 2026-09-21).
      router.push("/la-so/xuyen-tam-diem");
    } catch {
      setErrorMessage("Không thể lưu thông tin lá số trên trình duyệt này. Vui lòng thử lại.");
      setStatus("error");
    }
  }

  return (
    // The page-level outer background (single shared outer-bg.jpg spanning
    // this AND the PageBanner above it) now lives in app/lap-la-so/page.tsx
    // — this component only renders the form column on top of it.
    <div className="relative mx-auto max-w-[1320px] px-6 py-4 lg:px-10">
      {/* INNER background slot — scoped to just the form card's own box. */}
      <div
        className="relative mx-auto max-w-2xl overflow-hidden border border-walnut/15 bg-cover bg-center p-6 sm:p-8"
        style={{ backgroundImage: "url(/images/lap-la-so/inner-bg.jpg)" }}
      >
        {/* Scrim between the background (this card's own inner-bg, or —
            while that slot is still empty — the page-level outer-bg
            showing through) and the form, so field labels/inputs stay
            legible over a busy image instead of sitting directly on it.
            95% (not the original 75%) because on mobile the card's own top
            overlaps the tail end of outer-bg-mobile.jpg (the rendered image
            runs taller than where the card starts at narrow widths) — at
            75% that mountain/scroll art showed through strongly enough to
            visually clash with "Thông tin lá số" right where it sits. */}
        <div className="pointer-events-none absolute inset-0 bg-ivory/95" aria-hidden="true" />

        {/* "Tranh cuộn tỉnh dần": the same waterfall/lake scroll that becomes Trung Cung's backdrop wakes up
            behind the form as its groups are touched (opacity 5% -> 23%, only its lower part), so the chart's
            own painting is already there when the chart appears. Opacity only; reduced motion = no transition. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-cover bg-bottom bg-no-repeat transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{
            backgroundImage: "url(/images/thong-tin-la-so/trung-cung-web.jpg)",
            opacity: 0.05 + awake * 0.045,
            maskImage: "linear-gradient(to top, black 0%, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, black 40%, transparent 100%)",
          }}
        />

        <div className="relative">
          <BirthForm
            key={savedInput ? "prefilled" : "empty"}
            onSubmit={handleSubmit}
            status={status}
            targetYear={targetYear}
            onTargetYearChange={setTargetYearOverride}
            initialValue={savedInput?.birthInput}
            onAwake={setAwake}
          />

          {status === "error" && errorMessage && (
            <p role="alert" className="mt-4 text-[14px] font-medium text-lacquer">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
