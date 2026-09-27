import { verifySession } from "@/lib/auth";
import { getAllLeadNotes, listLeadsForAdmin } from "@/lib/contact-leads";
import { isLeadStatus } from "@/lib/contact-leads-constants";
import { leadMatchesQuery, toCsv } from "@/lib/lead-admin";
import { toLocalVietnamesePhone } from "@/lib/phone";
import { formatVietnamTime } from "@/lib/vn-time";
import { statusLabel } from "@/components/admin/LeadStatusPill";

/**
 * GET /admin/lien-he/xuat-csv[?status=&q=]: the lead list as a CSV that
 * opens correctly in Excel, honouring the same filters as the list page.
 * Checks the session itself (proxy.ts is only the outer redirect).
 */
export async function GET(request: Request) {
  const session = await verifySession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const q = (url.searchParams.get("q") || "").trim();

  const [all, notes] = await Promise.all([listLeadsForAdmin(isLeadStatus(status) ? status : undefined), getAllLeadNotes()]);
  const leads = q ? all.filter((l) => leadMatchesQuery(l, q)) : all;

  const csv = toCsv(
    ["Ngày gửi", "Tên", "Số điện thoại", "Quan tâm", "Lời nhắn", "Trạng thái", "Lịch hẹn", "Ghi chú"],
    leads.map((l) => [
      formatVietnamTime(l.createdAt),
      l.name,
      toLocalVietnamesePhone(l.phone) ?? l.phone,
      l.interest,
      l.message,
      statusLabel(l.status),
      l.appointmentAt ? formatVietnamTime(l.appointmentAt) : "",
      [
        ...(l.adminNote ? [`(trước đây) ${l.adminNote}`] : []),
        ...(notes.get(l.id) ?? []).map((n) => `${formatVietnamTime(n.createdAt)} ${n.author}: ${n.body}`),
      ].join("\n"),
    ])
  );

  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }); // YYYY-MM-DD
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="khach-lien-he-${today}.csv"`,
      "cache-control": "no-store",
    },
  });
}
