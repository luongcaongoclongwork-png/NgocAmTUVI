"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BirthForm from "./BirthForm";
import { loadChartInput, saveChartInput, type StoredChartInput } from "@/lib/tuvi/storage/chartInputStorage";
import type { BirthInput } from "@/lib/tuvi/types/VietnameseChart";

export type GenerationStatus = "idle" | "validating" | "error";

export default function LapLaSoClient() {
  const router = useRouter();
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetYearOverride, setTargetYearOverride] = useState<number | null>(null);
  const [savedInput, setSavedInput] = useState<StoredChartInput | null>(null);

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
      router.push("/la-so");
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
        {/* Thin scrim between the background (this card's own inner-bg,
            or — while that slot is still empty — the page-level outer-bg
            showing through) and the form, so field labels/inputs stay
            legible over a busy image instead of sitting directly on it. */}
        <div className="pointer-events-none absolute inset-0 bg-ivory/75" aria-hidden="true" />

        <div className="relative">
          <BirthForm
            key={savedInput ? "prefilled" : "empty"}
            onSubmit={handleSubmit}
            status={status}
            targetYear={targetYear}
            onTargetYearChange={setTargetYearOverride}
            initialValue={savedInput?.birthInput}
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
