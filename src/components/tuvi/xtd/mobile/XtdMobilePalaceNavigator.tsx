import type { VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";
import type { MobileSelection } from "./XtdMobileTuViOverview";
import { getXtdPalaceName } from "@/data/tuvi/xuyen-tam-diem";

/**
 * Xuyen Tam Diem (川三焰) render copy of ../../mobile/MobilePalaceNavigator.tsx
 * — same select-based nav, only diff is the option label going through
 * getXtdPalaceName.
 */
const CENTER_VALUE = "center";

export function XtdMobilePalaceNavigator({
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
      <label htmlFor="xtd-palace-mobile-select">Khám đang xem</label>
      <select
        id="xtd-palace-mobile-select"
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          onSelect(next === CENTER_VALUE ? { kind: "center" } : { kind: "palace", index: Number(next) });
        }}
      >
        <option value={CENTER_VALUE}>Trung cung · Thông tin lá số</option>
        {chart.palaces.map((palace) => (
          <option key={palace.index} value={palace.index}>
            {getXtdPalaceName(palace.name)} · {palace.branch}
          </option>
        ))}
      </select>
    </div>
  );
}
