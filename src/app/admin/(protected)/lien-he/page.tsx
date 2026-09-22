import Link from "next/link";
import { getAllLeadsForAdmin } from "@/lib/contact-leads";
import { LEAD_STATUSES } from "@/lib/contact-leads-constants";

function statusLabel(value: string): string {
  return LEAD_STATUSES.find((s) => s.value === value)?.label ?? value;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminLeadsPage() {
  const leads = await getAllLeadsForAdmin();

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Liên hệ</h1>
      <p className="mt-2 text-[13px] text-ink/60">
        Yêu cầu tư vấn gửi từ /lien-he — mới nhất ở trên.
      </p>

      {leads.length === 0 ? (
        <p className="mt-8 text-sm text-ink/60">Chưa có yêu cầu nào.</p>
      ) : (
        <div className="mt-8 divide-y divide-walnut/10 border-y border-walnut/10">
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/admin/lien-he/${lead.id}`}
              className="flex flex-wrap items-center justify-between gap-3 py-4 hover:bg-parchment/40"
            >
              <div className="min-w-0">
                <p className="truncate font-heading text-[16px] text-ink">
                  {lead.name} · <span className="text-ink/60">{lead.phone}</span>
                </p>
                <p className="mt-1 truncate text-[13px] text-ink/60">{lead.interest}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-[12px] text-ink/50">
                <span>{formatDate(lead.createdAt)}</span>
                <span className="tracking-label border border-walnut/25 px-2.5 py-1 uppercase text-walnut/70">
                  {statusLabel(lead.status)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
