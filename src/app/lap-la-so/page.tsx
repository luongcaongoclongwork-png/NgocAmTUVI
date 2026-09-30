import type { Metadata } from "next";
import LapLaSoClient from "@/components/tuvi/LapLaSoClient";
import { InkHero, InkPage } from "@/components/thuy-mac/kit";

export const metadata: Metadata = {
  title: "Lập Lá Số Tử Vi — Ngọc Âm",
  description:
    "Lập lá số Tử Vi theo hệ Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang): an sao, Miếu Vượng Đắc Bình Hãm, Khôi Việt, Tứ Hóa, Tuần Triệt chuẩn Việt Nam.",
};

export default function LapLaSoPage() {
  return (
    <InkPage>
      {/* v1's single outer-bg.jpg behind both the title and the form (see .lap-la-so-outer in globals.css) */}
      <div className="lap-la-so-outer relative w-full">
      <InkHero
        compact
        scrolls={["Lập", "lá số"]}
        lede={
          <>
            <p>Tử Vi Xuyên Tam Diệm</p>
            <small>Nhập ngày giờ sinh để xem tấm bản đồ 12 cung. Muốn đọc tấm bản đồ ấy cùng Xuyên giả, hãy đặt một phiên Xuyên vấn.</small>
          </>
        }
      />
      <div className="ipTool">
        <LapLaSoClient />
      </div>
      </div>
    </InkPage>
  );
}
