import type { BirthInput } from "../types/VietnameseChart";

/**
 * Bridges the /lap-la-so (input) and /la-so (result) routes: the birth data
 * + selected "nam xem" are saved here on submit and read back on the result
 * page, which re-derives the chart itself via the existing generateChart()
 * — only primitive input fields cross this boundary, never the chart/
 * astrolabe output.
 */
const CHART_INPUT_STORAGE_KEY = "ngoc-am-chart-input";

export interface StoredChartInput {
  birthInput: BirthInput;
  targetYear: number;
}

function isStoredChartInput(value: unknown): value is StoredChartInput {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.targetYear === "number" &&
    !!v.birthInput &&
    typeof v.birthInput === "object"
  );
}

export function saveChartInput(data: StoredChartInput): void {
  sessionStorage.setItem(CHART_INPUT_STORAGE_KEY, JSON.stringify(data));
}

export function loadChartInput(): StoredChartInput | null {
  try {
    const raw = sessionStorage.getItem(CHART_INPUT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isStoredChartInput(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
