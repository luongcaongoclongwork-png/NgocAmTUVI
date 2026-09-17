import type { ReactNode } from "react";

/** Pure presentation — renders nothing and computes nothing beyond "is this value empty". */
export function InfoRow({
  label,
  value,
  secondary,
  emphasized = false,
  className = "",
}: {
  label: string;
  value?: ReactNode;
  secondary?: ReactNode;
  emphasized?: boolean;
  /** Extra class on the row wrapper — e.g. to opt into the frosted-chip
   * treatment (see ngocAmChart.css's ".center-info-row--frosted" rule). */
  className?: string;
}) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className={`center-info-row${emphasized ? " center-info-row--important" : ""}${className ? ` ${className}` : ""}`}>
      <div className="center-info-label">{label}</div>
      <div className="center-info-value">{value}</div>
      {secondary ? <div className="center-info-secondary">{secondary}</div> : <div />}
    </div>
  );
}
