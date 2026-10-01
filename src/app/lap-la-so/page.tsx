import type { Metadata } from "next";
import LapLaSoClient from "@/components/tuvi/LapLaSoClient";
import { InkClose, InkHero, InkPage } from "@/components/thuy-mac/kit";

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
        scrolls={["Lập", "Lá Số"]}
        lede={
          <>
            <p>Tử Vi Xuyên Tam Diệm</p>
            <small>Nhập ngày giờ sinh để xem tấm bản đồ 12 cung. Muốn đọc tấm bản đồ ấy cùng Xuyên giả, hãy đặt một phiên Xuyên vấn.</small>
          </>
        }
      />
      <div className="ipTool">
        <LapLaSoClient />
        <p className="ipToolNote">
          Chọn dương lịch hoặc âm lịch; công cụ hiện ngay ngày tương ứng ở lịch còn lại để bạn đối chiếu. Giờ sinh quyết định vị trí các cung, nên lá số chỉ đúng khi giờ sinh đúng. Nếu chưa chắc giờ sinh, hãy xem kết quả như bản tham khảo và nói điều đó khi đặt lịch.
        </p>
      </div>
      </div>
      <InkClose
        title="Lá số là tấm bản đồ, Xuyên vấn là cùng đọc nó."
        text="Muốn hiểu sâu Diệm Bản của mình, hãy đặt một phiên cùng Xuyên giả."
        href="/lien-he?topic=tu-vi"
        label="Đặt Phiên Xuyên Vấn"
      />
    </InkPage>
  );
}
