import { notFound } from "next/navigation";
import Link from "next/link";
import { getLeadDetailForAdmin } from "@/lib/contact-leads";
import { toLocalVietnamesePhone } from "@/lib/phone";
import { formatAppointment, formatVietnamTime, toVietnamInputValue } from "@/lib/vn-time";
import LeadStatusPill from "@/components/admin/LeadStatusPill";
import LeadContactButtons from "@/components/admin/LeadContactButtons";
import { DeleteLeadButton, LeadAppointmentControl, LeadNoteForm, LeadStatusControl } from "@/components/admin/LeadManage";

const sectionTitle = "tracking-label text-[12px] font-semibold uppercase text-walnut/60";

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadDetailForAdmin(Number(id));
  if (!lead) notFound();

  const phone = toLocalVietnamesePhone(lead.phone) ?? lead.phone;
  const hasAppointment = lead.appointmentAt !== "";

  return (
    <div>
      <Link href="/admin/lien-he" className="text-[13px] text-walnut/60 hover:text-gold">
        ← Danh sách khách
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl text-ink">{lead.name}</h1>
        <LeadStatusPill status={lead.status} />
      </div>
      <p className="mt-1 text-[13px] text-ink/60">Gửi lúc {formatVietnamTime(lead.createdAt)} (giờ Việt Nam)</p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <span className="font-body text-xl font-medium tabular-nums tracking-wide text-ink">{phone}</span>
        <LeadContactButtons phone={lead.phone} />
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-8">
          <dl className="flex flex-col gap-5 text-[15px]">
            <div>
              <dt className="text-[13px] text-ink/50">Quan tâm</dt>
              <dd className="mt-1 text-ink">{lead.interest}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-ink/50">Lời nhắn của khách</dt>
              <dd className="mt-1 whitespace-pre-wrap leading-relaxed text-ink">{lead.message}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-ink/50">Đồng ý được liên hệ lại</dt>
              <dd className="mt-1 text-ink">{lead.consent ? "Có" : "Không"}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-10">
          <section>
            <h2 className={sectionTitle}>Trạng thái</h2>
            <div className="mt-4">
              <LeadStatusControl id={lead.id} status={lead.status} />
            </div>
          </section>

          <section>
            <h2 className={sectionTitle}>Lịch hẹn</h2>
            <div className="mt-4">
              <LeadAppointmentControl
                id={lead.id}
                inputValue={toVietnamInputValue(lead.appointmentAt)}
                label={hasAppointment ? formatAppointment(lead.appointmentAt) : null}
              />
            </div>
          </section>

          <section>
            <h2 className={sectionTitle}>Ghi chú ({lead.notes.length + (lead.adminNote ? 1 : 0)})</h2>
            <div className="mt-4">
              <LeadNoteForm id={lead.id} />
            </div>
            <ol className="mt-6 flex flex-col divide-y divide-walnut/10 border-y border-walnut/10">
              {lead.notes.map((n) => (
                <li key={n.id} className="py-3">
                  <p className="text-[12px] text-ink/50">
                    {formatVietnamTime(n.createdAt)} · {n.author}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{n.body}</p>
                </li>
              ))}
              {lead.adminNote && (
                // Note from before the history existed (the old single field).
                <li className="py-3">
                  <p className="text-[12px] text-ink/50">Ghi chú trước đây</p>
                  <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{lead.adminNote}</p>
                </li>
              )}
              {lead.notes.length === 0 && !lead.adminNote && <li className="py-3 text-[14px] text-ink/50">Chưa có ghi chú.</li>}
            </ol>
          </section>
        </div>
      </div>

      <div className="mt-16 border-t border-walnut/10 pt-6">
        <DeleteLeadButton id={lead.id} name={lead.name} />
      </div>
    </div>
  );
}
