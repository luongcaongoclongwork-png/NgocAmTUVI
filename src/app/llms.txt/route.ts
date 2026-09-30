import { formatPrice } from "@/lib/service-constants";
import { getServicesByGroup } from "@/lib/services";
import { getSiteSettings } from "@/lib/site-settings";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const GROUPS = [
  { id: "tu-vi", name: "Tử Vi Xuyên Tam Diệm", path: "/tu-vi" },
  { id: "phong-thuy", name: "Phong Thuỷ Là Tịnh", path: "/phong-thuy" },
  { id: "dai-chu-su", name: "Xuyên Vấn Đại Chủ Sự", path: "/dai-chu-su" },
] as const;

/**
 * /llms.txt — a plain description of Ngọc Âm for AI assistants, built from
 * the same data as the site (services and prices from admin, contact from
 * Cài đặt), so it never drifts from what visitors see.
 */
export async function GET() {
  const [settings, lists] = await Promise.all([getSiteSettings(), Promise.all(GROUPS.map((g) => getServicesByGroup(g.id)))]);

  const lines: string[] = [
    "# Ngọc Âm",
    "",
    "> Ngọc Âm: Tử Vi và Phong Thuỷ của hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn. Tử Vi và phong thuỷ được dùng như công cụ để hiểu mình và định hướng, không phải để dự đoán hay hứa hẹn vận may.",
    "",
    "## Thuật ngữ",
    "- Xuyên vấn: cách Ngọc Âm gọi một phiên luận giải (\"Xuyên\" là dòng sông, \"Vấn\" là tìm hiểu, xem xét).",
    "- Diệm Bản: cách Ngọc Âm gọi lá số Tử Vi.",
    "- Xuyên giả: người thực hiện phiên Xuyên vấn. Chủ Sự: người đến Xuyên vấn. Đại Chủ Sự: người cầm lái doanh nghiệp.",
    "",
  ];

  GROUPS.forEach((g, i) => {
    lines.push(`## ${g.name}`, `Trang: ${absoluteUrl(g.path)}`, "");
    for (const s of lists[i]) {
      const meta = [formatPrice(s.price), s.duration, s.note].filter(Boolean).join(", ");
      lines.push(`- ${s.title} (${meta}): ${s.desc}`);
    }
    lines.push("");
  });

  lines.push(
    "## Các trang khác",
    `- Bảng giá: ${absoluteUrl("/dich-vu")}`,
    `- Lập lá số miễn phí: ${absoluteUrl("/lap-la-so")}`,
    `- Sổ tay (bài viết): ${absoluteUrl("/kien-thuc")}`,
    `- Trà Đạo: ${absoluteUrl("/tra-dao")}`,
    `- Về Ngọc Âm: ${absoluteUrl("/ve-ngoc-am")}`,
    `- Đặt lịch: ${absoluteUrl("/lien-he")}`,
    "",
    "## Liên hệ",
  );
  if (settings.phone) lines.push(`- Điện thoại: ${settings.phone}`);
  if (settings.email) lines.push(`- Email: ${settings.email}`);
  if (settings.address) lines.push(`- Địa chỉ: ${settings.address}`);
  if (settings.workingHours) lines.push(`- Giờ làm việc: ${settings.workingHours}`);
  if (settings.zaloUrl) lines.push(`- Zalo: ${settings.zaloUrl}`);

  return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
