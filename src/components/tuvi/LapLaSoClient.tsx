"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
