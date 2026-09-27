import Link from "next/link";
import { verifySession } from "@/lib/auth";
import { countLeadsByStatus, getUpcomingAppointments, listLeadsForAdmin } from "@/lib/contact-leads";
import { getAllArticlesForAdmin } from "@/lib/articles";
import { toLocalVietnamesePhone } from "@/lib/phone";
import { formatAppointment, formatVietnamTime } from "@/lib/vn-time";
import LeadStatusPill from "@/components/admin/LeadStatusPill";
import LeadContactButtons from "@/components/admin/LeadContactButtons";

const sectionTitle = "tracking-label text-[12px] font-semibold uppercase text-walnut/60";

/**
 * Admin home: what needs doing today, first. New leads and upcoming
 * appointments lead; content counts come after.
 */
export default async function AdminDashboardPage() {
  const [session, counts, upcoming, recent, articles] = await Promise.all([
    verifySession(),
    countLeadsByStatus(),
    getUpcomingAppointments(14),
    listLeadsForAdmin(),
    getAllArticlesForAdmin(),
  ]);
  const drafts = articles.filter((a) => a.status !== "published").length;
  const inProgress = counts.contacted + counts.discussing;

  const stats = [
    { label: "Khách mới chưa xử lý", value: counts.new, href: "/admin/lien-he?status=new", urgent: counts.new > 0 },
    { label: "Đang liên hệ / trao đổi", value: inProgress, href: "/admin/lien-he?status=discussing", urgent: false },
    { label: "Lịch hẹn 14 ngày tới", value: upcoming.length, href: "#lich-hen", urgent: false },
    { label: "Bài viết nháp", value: drafts, href: "/admin/bai-viet", urgent: false },
  ];

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="font-heading text-2xl text-ink">Tổng quan</h1>
        <p className="mt-1 text-[14px] text-ink/60">Chào {session?.username}. Đây là những việc cần để ý hôm nay.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`flex flex-col gap-1 border px-4 py-4 transition-colors hover:border-gold ${
              s.urgent ? "border-lacquer/40 bg-lacquer/5" : "border-walnut/15"
            }`}
          >
            <span className={`font-heading text-3xl tabular-nums ${s.urgent ? "text-lacquer" : "text-ink"}`}>{s.value}</span>
            <span className="text-[13px] leading-snug text-ink/65">{s.label}</span>
          </Link>
        ))}
      </div>

      <section id="lich-hen">
        <h2 className={sectionTitle}>Lịch hẹn sắp tới</h2>
        {upcoming.length === 0 ? (
          <p className="mt-4 text-[14px] text-ink/55">Chưa có lịch hẹn nào trong 14 ngày tới. Đặt lịch ở trang chi tiết của từng khách.</p>
        ) : (
          <ul className="mt-4 divide-y divide-walnut/10 border-y border-walnut/10">
            {upcoming.map((l) => (
              <li key={l.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-sage">{formatAppointment(l.appointmentAt)}</p>
                  <Link href={`/admin/lien-he/${l.id}`} className="block truncate font-heading text-[16px] text-ink hover:text-gold">
                    {l.name} <span className="font-body text-[15px] tabular-nums text-ink/55">· {toLocalVietnamesePhone(l.phone) ?? l.phone}</span>
                  </Link>
                </div>
                <LeadContactButtons phone={l.phone} size="sm" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className={sectionTitle}>Khách gửi gần nhất</h2>
          <Link href="/admin/lien-he" className="text-[13px] text-walnut/70 hover:text-gold">
            Xem tất cả ({counts.all}) →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 text-[14px] text-ink/55">Chưa có khách nào gửi lời nhắn.</p>
        ) : (
          <ul className="mt-4 divide-y divide-walnut/10 border-y border-walnut/10">
            {recent.slice(0, 5).map((l) => (
              <li key={l.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <LeadStatusPill status={l.status} />
                    <span className="text-[12px] text-ink/50">{formatVietnamTime(l.createdAt)}</span>
                  </div>
                  <Link href={`/admin/lien-he/${l.id}`} className="mt-1 block truncate font-heading text-[16px] text-ink hover:text-gold">
                    {l.name}
                  </Link>
                  <p className="truncate text-[13px] text-ink/60">{l.interest}</p>
                </div>
                <LeadContactButtons phone={l.phone} size="sm" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className={sectionTitle}>Làm nhanh</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { href: "/admin/bai-viet/moi", label: "Viết bài mới" },
            { href: "/admin/dich-vu/moi", label: "Thêm dịch vụ" },
            { href: "/admin/dich-vu", label: "Sửa giá dịch vụ" },
            { href: "/", label: "Xem trang web" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="tracking-label inline-flex h-10 items-center border border-walnut/30 px-4 text-[12px] font-medium uppercase text-walnut hover:border-gold hover:text-gold"
            >
              {a.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
