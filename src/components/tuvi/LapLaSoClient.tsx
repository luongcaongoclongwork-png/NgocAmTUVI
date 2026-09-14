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
    // OUTER background slot — the whole section, edge-to-edge. Empty until an
    // image is dropped in; see docs/background-image-slots.md for exact specs.
    // Kept full-bleed (not inside the 1320px column below) on purpose so the
    // image can run the entire page width, matching SectionBackdrop's pattern
    // elsewhere on the site.
    <div
      className="relative w-full bg-cover bg-center"
      style={{ backgroundImage: "url(/images/lap-la-so/outer-bg.jpg)" }}
    >
      <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10">
        {/* INNER background slot — scoped to just the form card's own box. */}
        <div
          className="relative mx-auto max-w-2xl overflow-hidden border border-walnut/15 bg-cover bg-center p-6 sm:p-8"
          style={{ backgroundImage: "url(/images/lap-la-so/inner-bg.jpg)" }}
        >
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
