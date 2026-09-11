import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import LapLaSoClient from "@/components/tuvi/LapLaSoClient";

export const metadata: Metadata = {
  title: "Lập Lá Số Tử Vi — Ngọc Âm",
  description:
    "Lập lá số Tử Vi theo hệ Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang) — an sao, Miếu Vượng Đắc Bình Hãm, Khôi Việt, Tứ Hóa, Tuần Triệt chuẩn Việt Nam.",
};

export default function LapLaSoPage() {
  return (
    <>
      <PageBanner
        eyebrow="Lập Lá Số"
        heading="Lá số Tử Vi theo đúng hệ Việt Nam."
        description="An sao, độ sáng Miếu Vượng Đắc Bình Hãm, Khôi Việt, Tứ Hóa và Tuần Triệt được tính theo Tử Vi Đẩu Số Tân Biên — không dùng nguyên bảng mặc định của engine gốc."
        image="/images/21-homepage-tu-vi-manuscript.webp"
        imageAlt="Lá số Tử Vi viết tay trên bàn gỗ cổ"
      />
      <LapLaSoClient />
    </>
  );
}
