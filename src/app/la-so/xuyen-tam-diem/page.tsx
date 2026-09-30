import type { Metadata } from "next";
import { InkClose } from "@/components/thuy-mac/kit";
import XtdLaSoResultClient from "@/components/tuvi/xtd/XtdLaSoResultClient";

export const metadata: Metadata = {
  title: "Lá Số Xuyên Tam Diệm — Ngọc Âm",
  description: "Lá số Tử Vi hiển thị theo hệ danh xưng Xuyên Tam Diệm (川三焰), lấy hình tượng bích họa Đôn Hoàng làm thân — cùng một lá số, cùng một thuật toán an sao, chỉ khác tên hiển thị.",
};

export default function LaSoXuyenTamDiemPage() {
  // paper under the fixed header; the chart, then an invitation to read it with a Xuyên giả
  return (
    <div className="ip ipResult">
      <XtdLaSoResultClient />
      <InkClose
        title="Tấm bản đồ đã có, cùng đọc nó với Xuyên giả."
        text="Một phiên Xuyên vấn luận Diệm Bản này theo câu hỏi và hoàn cảnh của bạn."
        href="/lien-he?topic=tu-vi"
        label="Đặt phiên luận Diệm Bản"
      />
    </div>
  );
}
