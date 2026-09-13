import type { VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";
import type { MobileSelection } from "./MobileTuViOverview";

const CENTER_VALUE = "center";

/** Fast alternative to tapping the (scaled-down) overview directly — every palace plus Trung Cung, one tap/select away. */
export function MobilePalaceNavigator({
  chart,
  selection,
  onSelect,
}: {
  chart: VietnameseChartDTO;
  selection: MobileSelection;
  onSelect: (selection: MobileSelection) => void;
}) {
  const value = selection.kind === "center" ? CENTER_VALUE : String(selection.index);

  return (
    <div className="mobile-palace-navigator">
      <label htmlFor="palace-mobile-select">Cung đang xem</label>
      <select
        id="palace-mobile-select"
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          onSelect(next === CENTER_VALUE ? { kind: "center" } : { kind: "palace", index: Number(next) });
        }}
      >
        <option value={CENTER_VALUE}>Trung cung · Thông tin lá số</option>
        {chart.palaces.map((palace) => (
          <option key={palace.index} value={palace.index}>
            {palace.name} · {palace.branch}
          </option>
        ))}
      </select>
    </div>
  );
}
