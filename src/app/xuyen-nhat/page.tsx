import type { Metadata } from "next";
import { InkClose, InkHero, InkPage, InkSection } from "@/components/thuy-mac/kit";
import { nen } from "@/components/thuy-mac/Painting";
import XuyenNhatTool from "@/components/thuy-mac/xuyen-nhat/XuyenNhatTool";

/* Xuyên Nhật · Vách Khám: choosing a day by Tam Diệm, from the owner's "Bảng kiến thức Trạch nhật" (2026-10-19). */
export const metadata: Metadata = {
  title: "Xuyên Nhật · Chọn Ngày Giờ Theo Tam Diệm — Ngọc Âm",
  description: "Chọn ngày giờ cho nhập trạch, ký kết, cưới hỏi, khai trương, động thổ theo Trạch nhật truyền thống: tháng tiết khí, mười hai trực, hai mươi tám tú, Minh Khám, xung hợp với tuổi. Mỗi ngày kèm lý do và tên gốc để đối chiếu.",
  alternates: { canonical: "/xuyen-nhat" },
};

export default async function XuyenNhatPage({ searchParams }: { searchParams: Promise<{ v?: string; n?: string; tu?: string; den?: string }> }) {
  const initial = await searchParams;
  return (
    <InkPage>
      <InkHero
        {...nen("H11")}
        alt="Khúc sông vắng trong sương sớm"
        scrolls={["Xuyên Nhật"]}
        lede={
          <>
            <p>Chọn ngày giờ theo Tam Diệm</p>
            <small>Một ngày là một khám trên vách. Cùng một việc, làm ở ngày này thì thấm, ở ngày khác thì nghẹn. Chọn ngày là chọn khám để đặt việc vào, không phải đoán số phận của việc.</small>
          </>
        }
      />
      <InkSection id="chon-ngay">
        <XuyenNhatTool initial={initial} />
      </InkSection>
      <InkClose />
    </InkPage>
  );
}
