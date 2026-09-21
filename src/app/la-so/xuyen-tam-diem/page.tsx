import type { Metadata } from "next";
import XtdLaSoResultClient from "@/components/tuvi/xtd/XtdLaSoResultClient";

export const metadata: Metadata = {
  title: "Lá Số Xuyên Tam Diệm — Ngọc Âm",
  description: "Lá số Tử Vi hiển thị theo hệ danh xưng Xuyên Tam Diệm (川三焰), lấy hình tượng bích họa Đôn Hoàng làm thân — cùng một lá số, cùng một thuật toán an sao, chỉ khác tên hiển thị.",
};

export default function LaSoXuyenTamDiemPage() {
  return <XtdLaSoResultClient />;
}
