import Reveal from "./Reveal";

const tuViServices = [
  {
    title: "Phiên khai vấn chuyên sâu một vấn đề",
    desc: "Đào sâu một chủ đề cụ thể trong lá số — sự nghiệp, tình duyên, sức khoẻ hoặc một quyết định bạn đang cân nhắc.",
    price: "1.000.000",
  },
  {
    title: "Phiên khai vấn tổng hợp toàn lá số",
    desc: "Nhìn toàn cảnh 12 cung trên lá số, các giai đoạn vận trình và những điểm cần lưu tâm trong hành trình sắp tới.",
    price: "2.000.000",
  },
  {
    title: "Phiên khai vấn tổng hợp hai lá số cùng thời điểm",
    desc: "Đối chiếu hai lá số trong cùng một giai đoạn — phù hợp cho vợ chồng, đối tác hoặc các quyết định chung.",
    price: "3.500.000",
  },
  {
    title: "Khai vấn Ngày / Giờ Hoàng Đạo",
    desc: "Chọn ngày và giờ tốt cho các việc hệ trọng — khai trương, cưới hỏi, nhập trạch, xuất hành hoặc ký kết.",
    price: "500.000",
  },
];

const phongThuyServices = [
  {
    title: "Tư vấn Phong Thuỷ văn phòng / thương mại",
    desc: "Quan sát và điều chỉnh không gian làm việc, kinh doanh để hài hoà dòng khí và nhịp vận hành.",
    price: "2.000.000",
  },
  {
    title: "Tư vấn Phong Thuỷ cục bộ cả nhà",
    desc: "Đánh giá tổng thể không gian sống, bố cục và hướng nhà theo nguyên lý hài hoà với môi trường.",
    price: "2.000.000",
  },
  {
    title: "Tư vấn Phong Thuỷ một không gian",
    desc: "Tập trung vào một khu vực cụ thể — phòng ngủ, phòng thờ, bếp hoặc góc làm việc.",
    price: "500.000",
  },
  {
    title: "Phong Thuỷ tối giản kết hợp với lối sống",
    desc: "Ứng dụng nguyên lý Phong Thuỷ theo hướng tối giản, phù hợp nhịp sống và không gian hiện đại.",
    price: "2.000.000",
  },
  {
    title: "Tư vấn Phong Thuỷ Âm Trạch",
    desc: "Tham vấn về vị trí và hướng an táng theo nguyên lý địa lý truyền thống.",
    price: "Liên hệ",
  },
];

function ServiceCard({
  title,
  desc,
  price,
  delay,
}: {
  title: string;
  desc: string;
  price: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="flex flex-col justify-between border-t border-walnut/15 py-7 first:border-t-0 sm:flex-row sm:items-start sm:gap-10">
        <div className="sm:max-w-sm">
          <h3 className="font-heading text-lg leading-snug text-ink">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">{desc}</p>
        </div>
        <div className="mt-6 flex items-end justify-between gap-6 sm:mt-0 sm:flex-col sm:items-end sm:text-right">
          <div>
            <p className="tracking-label text-[10px] uppercase text-bronze">
              Từ
            </p>
            <p className="font-heading text-lg text-walnut">
              {price}
              {price !== "Liên hệ" && (
                <span className="ml-1 text-xs text-bronze"> đ</span>
              )}
            </p>
          </div>
          <a
            href="#lien-he"
            className="tracking-label border-b border-gold pb-0.5 text-[10px] font-semibold uppercase text-walnut transition-colors hover:text-gold"
          >
            Đặt lịch
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export default function Services() {
  return (
    <section id="dich-vu" className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold">
            Dịch vụ tư vấn
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
            Mỗi phiên khai vấn là một góc nhìn được chuẩn bị riêng cho bạn.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-16 gap-y-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="tracking-label border-b border-walnut/20 pb-4 text-[13px] font-semibold uppercase text-walnut">
                Khai vấn Tử Vi
              </p>
            </Reveal>
            <div>
              {tuViServices.map((s, idx) => (
                <ServiceCard key={s.title} {...s} delay={idx * 90} />
              ))}
            </div>
          </div>

          <div>
            <Reveal delay={60}>
              <p className="tracking-label border-b border-walnut/20 pb-4 text-[13px] font-semibold uppercase text-walnut">
                Tư vấn Phong Thuỷ
              </p>
            </Reveal>
            <div>
              {phongThuyServices.map((s, idx) => (
                <ServiceCard key={s.title} {...s} delay={idx * 90} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
