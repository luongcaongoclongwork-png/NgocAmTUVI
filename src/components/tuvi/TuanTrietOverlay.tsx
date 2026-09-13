import { BRANCH_GRID_POSITION } from "@/lib/tuvi/rules/palaces";
import type { EarthlyBranchVi, TuanTrietZone } from "@/lib/tuvi/types/VietnameseChart";

function midpoint(a: EarthlyBranchVi, b: EarthlyBranchVi) {
  const pa = BRANCH_GRID_POSITION[a];
  const pb = BRANCH_GRID_POSITION[b];
  return { xPct: ((pa.col - 0.5 + (pb.col - 0.5)) / 2 / 4) * 100, yPct: ((pa.row - 0.5 + (pb.row - 0.5)) / 2 / 4) * 100 };
}

/** Same 2-branch span regardless of array order (e.g. Tuan=[Than,Dau] vs Triet=[Dau,Than] still "dong cung"). */
function sameZone(a: TuanTrietZone, b: TuanTrietZone): boolean {
  const [a0, a1] = a.branches;
  const [b0, b1] = b.branches;
  return (a0 === b0 && a1 === b1) || (a0 === b1 && a1 === b0);
}

function ZoneLabel({ label, zone, className }: { label: string; zone: TuanTrietZone; className: string }) {
  const { xPct, yPct } = midpoint(zone.branches[0], zone.branches[1]);
  return (
    <span
      className={`tracking-label pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border px-1 text-[9px] font-semibold uppercase ${className}`}
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
    >
      {label}
    </span>
  );
}

export default function TuanTrietOverlay({ tuan, triet }: { tuan: TuanTrietZone; triet: TuanTrietZone }) {
  // "Tuan Triet dong cung" (e.g. a Giap Tuat year: both fall on Than-Dau) —
  // the two zone labels would sit at the exact same xPct/yPct and the DOM's
  // later element (Triet) would paint over the earlier one (Tuan), making
  // Tuan silently disappear even though chart.tuan is computed correctly.
  // Render one combined pill instead of two coincident ones so both stay
  // legible. Purely a rendering fix — tuan/triet are still whatever
  // rules/tuanTriet.ts (unchanged) computed.
  if (sameZone(tuan, triet)) {
    const { xPct, yPct } = midpoint(tuan.branches[0], tuan.branches[1]);
    return (
      <div className="pointer-events-none absolute inset-0">
        <span
          className="tracking-label pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-walnut/40 bg-ivory px-1 text-[9px] font-semibold uppercase"
          style={{ left: `${xPct}%`, top: `${yPct}%` }}
        >
          <span className="text-sage">Tuần</span>
          <span className="text-walnut/50"> · </span>
          <span className="text-lacquer">Triệt</span>
        </span>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <ZoneLabel label="Tuần" zone={tuan} className="border-sage/50 bg-ivory text-sage" />
      <ZoneLabel label="Triệt" zone={triet} className="border-lacquer/50 bg-ivory text-lacquer" />
    </div>
  );
}
