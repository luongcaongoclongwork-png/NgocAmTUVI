import type { VietnameseChartDTO } from "@/lib/tuvi/types/VietnameseChart";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-walnut/10 py-1 last:border-0">
      <span className="tracking-label text-[9px] font-medium uppercase text-walnut/45">{label}</span>
      <span className="text-right text-[12px] text-ink">{value}</span>
    </div>
  );
}

export default function CenterPalace({ chart }: { chart: VietnameseChartDTO }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-1 border border-walnut/20 bg-parchment/40 p-3 sm:p-4">
      <div className="mb-1 text-center">
        <p className="font-heading text-lg text-ink sm:text-xl">{chart.name || "Lá số Tử Vi"}</p>
        <p className="tracking-label text-[10px] uppercase text-gold">{chart.gender}</p>
      </div>

      <Row label="Dương lịch" value={chart.solarDate} />
      <Row label="Âm lịch" value={chart.lunarDate} />
      <Row
        label="Tứ trụ"
        value={`${chart.yearStem} ${chart.yearBranch}  ${chart.monthStem} ${chart.monthBranch}  ${chart.dayStem} ${chart.dayBranch}  ${chart.hourStem} ${chart.hourBranch}`}
      />
      <Row label="Ngũ Hành Cục" value={chart.fiveElementsClass} />
      <Row label="Mệnh Chủ" value={chart.menhChu} />
      <Row label="Thân Chủ" value={chart.thanChu} />
      <Row label="Cung Mệnh" value={chart.soulPalaceBranch} />
      <Row label="Cung Thân" value={chart.bodyPalaceBranch} />
      {chart.laiNhanCung && <Row label="Lai Nhân Cung" value={chart.laiNhanCung} />}
      <Row label="Tuần" value={`${chart.tuan.branches[0]} – ${chart.tuan.branches[1]}`} />
      <Row label="Triệt" value={`${chart.triet.branches[0]} – ${chart.triet.branches[1]}`} />
    </div>
  );
}
