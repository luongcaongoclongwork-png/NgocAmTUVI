"use client";

import type { CSSProperties } from "react";
import { BRANCH_GRID_POSITION, CENTER_GRID_AREA } from "@/lib/tuvi/rules/palaces";
import { giapCungIndices, tamHopIndices, xungChieuIndex } from "@/lib/tuvi/rules/aspects";
import { getOwnerChartViewModel } from "@/lib/tuvi/presentation/ownerViewModel";
import { getXtdStarName, getXtdPalaceName, getXtdCucName, XTD_VO_CHINH_DIEU, XTD_THAN_TAG } from "@/data/tuvi/xuyen-tam-diem";
import { starColorVar } from "../../starElementColor";
import type { VietnameseChartDTO, VietnameseHoroscopeDTO } from "@/lib/tuvi/types/VietnameseChart";
import type { MobileSelection } from "./XtdMobileTuViOverview";

/**
 * The phone's map of the chart (under 700px wide). The full grid scaled down to
 * a phone leaves 3-6px text nobody can read, so this is drawn for the phone
 * instead: each khám shows only its name, its main stars and its branch, all at
 * 12px or more, and every other star lives in the detail panel under it. Same
 * selection contract as the scaled overview; display-only, no engine access.
 */
export function XtdMobileCompactOverview({
  chart,
  birthTime,
  horoscope,
  selection,
  onSelect,
}: {
  chart: VietnameseChartDTO;
  birthTime?: string;
  horoscope: VietnameseHoroscopeDTO | null;
  selection: MobileSelection;
  onSelect: (selection: MobileSelection) => void;
}) {
  const selectedIndex = selection.kind === "palace" ? selection.index : null;
  const tamHop: number[] = selectedIndex === null ? [] : tamHopIndices(selectedIndex);
  const giap: number[] = selectedIndex === null ? [] : giapCungIndices(selectedIndex);
  const xung = selectedIndex === null ? -1 : xungChieuIndex(selectedIndex);
  const vm = getOwnerChartViewModel(chart, birthTime, horoscope ?? undefined);
  const centerSelected = selection.kind === "center";

  function emphasisFor(index: number) {
    if (selectedIndex === null || index === selectedIndex) return undefined;
    if (index === xung) return "xung-chieu";
    if (tamHop.includes(index)) return "tam-hop";
    if (giap.includes(index)) return "giap-cung";
    return undefined;
  }

  return (
    <div className="xtd-compact">
      {chart.palaces.map((p) => {
        const pos = BRANCH_GRID_POSITION[p.branch];
        const name = getXtdPalaceName(p.name);
        const selected = selectedIndex === p.index;
        return (
          <button
            key={p.index}
            type="button"
            onClick={() => onSelect({ kind: "palace", index: p.index })}
            aria-pressed={selected}
            aria-label={`Khám ${name}, ${p.heavenlyStem} ${p.branch}${selected ? ", đang chọn" : ""}. Chạm để xem chi tiết.`}
            data-selected={selected || undefined}
            data-emphasis={emphasisFor(p.index)}
            className={`xtd-compact-cell${p.isSoulPalace ? " xtd-compact-cell--soul" : ""}${p.isBodyPalace ? " xtd-compact-cell--body" : ""}`}
            style={{ gridArea: `${pos.row} / ${pos.col} / span 1 / span 1` }}
          >
            <span className="xtd-compact-name">{name}</span>
            {p.isBodyPalace && <span className="xtd-compact-than">{XTD_THAN_TAG}</span>}
            <span className="xtd-compact-stars">
              {p.majorStars.length === 0 ? (
                <span className="xtd-compact-star xtd-compact-star--empty">{XTD_VO_CHINH_DIEU}</span>
              ) : (
                p.majorStars.map((s) => (
                  <span key={s.id} className="xtd-compact-star" style={starColorVar(s) as CSSProperties | undefined}>
                    {getXtdStarName(s.id, s.name)}
                  </span>
                ))
              )}
            </span>
            <span className="xtd-compact-branch">{p.branch}</span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onSelect({ kind: "center" })}
        aria-pressed={centerSelected}
        aria-label="Trung cung — thông tin lá số. Chạm để xem chi tiết."
        data-selected={centerSelected || undefined}
        className="xtd-compact-center"
        style={{ gridArea: CENTER_GRID_AREA }}
      >
        <span className="xtd-compact-brand">Xuyên Tam Diệm</span>
        {vm.name && <span className="xtd-compact-owner">{vm.name}</span>}
        {vm.solarDay !== undefined && (
          <span className="xtd-compact-line">
            {vm.solarDay}/{vm.solarMonth}/{vm.solarYear}
          </span>
        )}
        {vm.lunarDay !== undefined && (
          <span className="xtd-compact-line">
            Âm lịch {vm.lunarDay}/{vm.lunarMonth}
            {vm.lunarIsLeap ? " nhuận" : ""}
          </span>
        )}
        {vm.birthTime && <span className="xtd-compact-line">Giờ {vm.birthTime}</span>}
        <span className="xtd-compact-cuc">{getXtdCucName(vm.bureau)}</span>
      </button>
    </div>
  );
}
