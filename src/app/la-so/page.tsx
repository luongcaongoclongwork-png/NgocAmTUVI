import type { Metadata } from "next";
import { InkClose } from "@/components/thuy-mac/kit";
import LaSoResultClient from "@/components/tuvi/LaSoResultClient";

export const metadata: Metadata = {
  title: "Lá Số Tử Vi — Ngọc Âm",
  description: "Lá số Tử Vi đã lập theo hệ Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang) — an sao, Miếu Vượng Đắc Bình Hãm, Khôi Việt, Tứ Hóa, Tuần Triệt chuẩn Việt Nam.",
};

export default function LaSoPage() {
  // paper under the fixed header; the chart, then an invitation to read it with a Xuyên giả
  return (
    <div className="ip ipResult">
      <LaSoResultClient />
      <InkClose
        title="Tấm bản đồ đã có, cùng đọc nó với Xuyên giả."
        text="Một phiên Xuyên vấn luận Diệm Bản này theo câu hỏi và hoàn cảnh của bạn."
        href="/lien-he?topic=tu-vi"
        label="Đặt Phiên Luận Diệm Bản"
      />
    </div>
  );
}
