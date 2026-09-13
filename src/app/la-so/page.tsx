import type { Metadata } from "next";
import LaSoResultClient from "@/components/tuvi/LaSoResultClient";

export const metadata: Metadata = {
  title: "Lá Số Tử Vi — Ngọc Âm",
  description: "Lá số Tử Vi đã lập theo hệ Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang) — an sao, Miếu Vượng Đắc Bình Hãm, Khôi Việt, Tứ Hóa, Tuần Triệt chuẩn Việt Nam.",
};

export default function LaSoPage() {
  return <LaSoResultClient />;
}
