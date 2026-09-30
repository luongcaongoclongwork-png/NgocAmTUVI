import type { CalendarLeaf } from "./calendar";
import NowHour from "./NowHour";

/** One calendar leaf (tờ lịch): lunar day, can chi, solar term, hoàng đạo hours, the day's line. */
export default function Leaf({ leaf, line, className = "", hidden = false }: { leaf: CalendarLeaf; line?: string; className?: string; hidden?: boolean }) {
  const { solar, lunar, term } = leaf;
  const cc: [string, { vi: string; han: string }][] = [
    ["Năm", lunar.year],
    ["Tháng", lunar.monthCC],
    ["Ngày", lunar.dayCC],
  ];
  return (
    <div className={`dD-leaf ${className}`} aria-hidden={hidden || undefined}>
      <div className="dD-rings" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => <span key={i} />)}
      </div>
      <p className="dD-solar">
        {solar.weekday}, ngày {solar.d} tháng {solar.m} năm {solar.y}
      </p>
      <p className="dD-bigday">
        <span className="dD-bigday-num">{lunar.day}</span>
        <span className="dD-bigday-month">{lunar.month}, năm {lunar.year.vi}</span>
      </p>
      <dl className="dD-cc">
        {cc.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>
              <span className="dD-han" lang="zh-Hant">{v.han}</span>
              {v.vi}
            </dd>
          </div>
        ))}
      </dl>
      <p className="dD-term">
        <b>Tiết {term.name}</b>, ngày thứ {term.day}. {term.note} <span>Tiết {term.next} bắt đầu ngày {term.nextDate}.</span>
      </p>
      {!hidden && <NowHour hours={leaf.hours} />}
      {line && <p className="dD-line">{line}</p>}
    </div>
  );
}
