import { notFound } from "next/navigation";
import Link from "next/link";
import AdminLeadStatusForm from "@/components/admin/AdminLeadStatusForm";
import { getLeadByIdForAdmin } from "@/lib/contact-leads";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadByIdForAdmin(Number(id));
  if (!lead) notFound();

  const zaloUrl = process.env.NEXT_PUBLIC_ZALO_CONTACT_URL || null;

  return (
    <div>
      <Link href="/admin/lien-he" className="text-[13px] text-walnut/60 hover:text-gold">
        ← Danh sách liên hệ
      </Link>

      <h1 className="mt-4 font-heading text-2xl text-ink">{lead.name}</h1>
      <p className="mt-1 text-[13px] text-ink/60">Gửi lúc {formatDate(lead.createdAt)}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <dl className="flex flex-col gap-4 text-[14px]">
            <div>
              <dt className="text-ink/50">Số điện thoại</dt>
              <dd className="mt-1 flex items-center gap-3 text-ink">
                {lead.phone}
                <a
                  href={`tel:${lead.phone}`}
                  className="tracking-label border border-walnut/30 px-3 py-1.5 text-[11px] font-medium uppercase text-walnut hover:border-gold hover:text-gold"
                >
                  Gọi ngay
                </a>
                {zaloUrl && (
                  <a
                    href={zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tracking-label border border-walnut/30 px-3 py-1.5 text-[11px] font-medium uppercase text-walnut hover:border-gold hover:text-gold"
                  >
                    Nhắn Zalo
                  </a>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-ink/50">Dịch vụ quan tâm</dt>
              <dd className="mt-1 text-ink">{lead.interest}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Điều muốn được làm rõ</dt>
              <dd className="mt-1 whitespace-pre-wrap text-ink">{lead.message}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Đồng ý liên hệ lại</dt>
              <dd className="mt-1 text-ink">{lead.consent ? "Có" : "Không"}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="tracking-label text-[12px] font-semibold uppercase text-walnut/60">
            Xử lý nội bộ
          </h2>
          <div className="mt-4">
            <AdminLeadStatusForm lead={lead} />
          </div>
        </div>
      </div>
    </div>
  );
}
