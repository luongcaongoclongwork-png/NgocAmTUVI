import Link from "next/link";
import { countLeadsByStatus, listLeadsForAdmin } from "@/lib/contact-leads";
import { LEAD_STATUSES, isLeadStatus } from "@/lib/contact-leads-constants";
import { leadMatchesQuery } from "@/lib/lead-admin";
import { toLocalVietnamesePhone } from "@/lib/phone";
import { formatAppointment, formatVietnamTime } from "@/lib/vn-time";
import LeadStatusPill from "@/components/admin/LeadStatusPill";
import LeadContactButtons from "@/components/admin/LeadContactButtons";

function href(status: string | null, q: string) {
  const p = new URLSearchParams();
  if (status) p.set("status", status);
  if (q) p.set("q", q);
  const s = p.toString();
  return s ? `/admin/lien-he?${s}` : "/admin/lien-he";
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = isLeadStatus(params.status) ? params.status : null;
  const q = (params.q || "").trim().slice(0, 100);
  const [all, counts] = await Promise.all([listLeadsForAdmin(status ?? undefined), countLeadsByStatus()]);
  const leads = q ? all.filter((l) => leadMatchesQuery(l, q)) : all;
  const exportParams = new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}) }).toString();

  const tabs = [{ value: null as string | null, label: "Tất cả", count: counts.all }, ...LEAD_STATUSES.map((s) => ({ value: s.value, label: s.label, count: counts[s.value] }))];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-ink">Khách liên hệ</h1>
          <p className="mt-1 text-[13px] text-ink/60">Lời nhắn gửi từ trang Liên hệ, mới nhất ở trên. Giờ Việt Nam.</p>
        </div>
        <a
          href={`/admin/lien-he/xuat-csv${exportParams ? `?${exportParams}` : ""}`}
          className="tracking-label inline-flex h-10 items-center border border-walnut/30 px-4 text-[12px] font-medium uppercase text-walnut hover:border-gold hover:text-gold"
        >
          Xuất Excel (CSV)
        </a>
      </div>

      <nav aria-label="Lọc theo trạng thái" className="-mx-4 mt-6 flex gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {tabs.map((t) => {
          const active = t.value === status;
          return (
            <Link
              key={t.label}
              href={href(t.value, q)}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap border px-3 py-2 text-[13px] ${
                active ? "border-walnut bg-walnut text-ivory" : "border-walnut/15 text-walnut/75 hover:border-gold hover:text-gold"
              } ${t.value === "new" && t.count > 0 && !active ? "border-lacquer/40 text-lacquer" : ""}`}
            >
              {t.label} <span className="tabular-nums opacity-70">({t.count})</span>
            </Link>
          );
        })}
      </nav>

      <form action="/admin/lien-he" method="get" role="search" className="mt-4 flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <label htmlFor="lead-q" className="sr-only">
          Tìm khách
        </label>
        <input
          id="lead-q"
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tên, số điện thoại, lời nhắn… (không cần gõ dấu)"
          className="min-h-10 w-full max-w-md border border-walnut/30 bg-transparent px-3 text-[15px] text-ink focus:border-gold focus:outline-none"
        />
        <button type="submit" className="tracking-label h-10 shrink-0 border border-walnut/30 px-4 text-[12px] font-medium uppercase text-walnut hover:border-gold hover:text-gold">
          Tìm
        </button>
        {q && (
          <Link href={href(status, "")} className="inline-flex h-10 shrink-0 items-center px-2 text-[13px] text-walnut/60 hover:text-gold">
            Xoá tìm
          </Link>
        )}
      </form>

      {leads.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60">
          {counts.all === 0 ? "Chưa có khách nào gửi lời nhắn." : "Không có khách nào khớp bộ lọc này."}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-walnut/10 border-y border-walnut/10">
          {leads.map((lead) => (
            <li key={lead.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <LeadStatusPill status={lead.status} />
                  <span className="text-[12px] text-ink/50">{formatVietnamTime(lead.createdAt)}</span>
                  {lead.noteCount > 0 && <span className="text-[12px] text-ink/45">· {lead.noteCount} ghi chú</span>}
                </div>
                <Link href={`/admin/lien-he/${lead.id}`} className="mt-1 block truncate font-heading text-[17px] text-ink hover:text-gold">
                  {lead.name} <span className="font-body text-[15px] tabular-nums text-ink/55">· {toLocalVietnamesePhone(lead.phone) ?? lead.phone}</span>
                </Link>
                <p className="mt-0.5 truncate text-[13px] text-ink/60">{lead.interest}</p>
                {lead.appointmentAt && lead.status !== "closed" && (
                  <p className="mt-1 text-[13px] font-medium text-sage">Hẹn: {formatAppointment(lead.appointmentAt)}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <LeadContactButtons phone={lead.phone} size="sm" />
                <Link
                  href={`/admin/lien-he/${lead.id}`}
                  className="inline-flex min-h-9 items-center border border-walnut/25 px-3 text-[12px] text-walnut hover:border-gold hover:text-gold"
                >
                  Chi tiết →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
