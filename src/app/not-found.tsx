import type { Metadata } from "next";
import Link from "next/link";
import { InkHero, InkPage, InkSection } from "@/components/thuy-mac/kit";

export const metadata: Metadata = { title: "Không tìm thấy trang — Ngọc Âm" };

const WAYS = [
  { href: "/", label: "Trang chủ" },
  { href: "/dich-vu", label: "Bảng giá" },
  { href: "/lap-la-so", label: "Lập lá số" },
  { href: "/kien-thuc", label: "Sổ tay" },
  { href: "/lien-he", label: "Gửi đôi dòng" },
];

/** A wrong address still lands on paper, with the way back in view. */
export default function NotFound() {
  return (
    <InkPage>
      <InkHero
        compact
        image="/images/18-tuyen-lam-tinh-suong-3d.webp"
        alt="Hồ Tuyền Lâm tĩnh lặng trong sương"
        scrolls={["Lạc", "lối"]}
        lede={
          <>
            <p>Trang bạn tìm không còn ở đây.</p>
            <small>Có thể đường dẫn đã đổi, hoặc bài viết đã được cất đi. Mời bạn đi tiếp theo một trong những lối dưới đây.</small>
          </>
        }
      />
      <InkSection narrow>
        <p className="ipWays">
          {WAYS.map((w) => (
            <Link key={w.href} href={w.href} className="ipBtn">{w.label}</Link>
          ))}
        </p>
      </InkSection>
    </InkPage>
  );
}
