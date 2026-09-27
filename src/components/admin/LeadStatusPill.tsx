import { LEAD_STATUSES, type LeadStatus } from "@/lib/contact-leads-constants";

/** One colour per stage so the list can be scanned at a glance; "Mới" is the loudest. */
export const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "border-lacquer/40 bg-lacquer/10 text-lacquer",
  contacted: "border-gold/40 bg-gold/10 text-gold-deep",
  discussing: "border-bronze/40 bg-bronze/10 text-bronze",
  booked: "border-sage/50 bg-sage/15 text-sage",
  closed: "border-walnut/20 bg-transparent text-ink/45",
};

export function statusLabel(status: LeadStatus): string {
  return LEAD_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export default function LeadStatusPill({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-block whitespace-nowrap border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${STATUS_STYLE[status]}`}>
      {statusLabel(status)}
    </span>
  );
}
