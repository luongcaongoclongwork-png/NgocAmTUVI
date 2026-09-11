import Reveal from "./Reveal";

const steps = [
  { n: "01", label: "Lắng nghe", desc: "Thấu hiểu hoàn cảnh, mối bận tâm và câu hỏi thật sự của bạn." },
  { n: "02", label: "Quan sát", desc: "Đọc lá số hoặc không gian sống bằng góc nhìn tổng thể, không vội kết luận." },
  { n: "03", label: "Khai vấn", desc: "Đối thoại trực tiếp, làm rõ những điểm mấu chốt đang ảnh hưởng đến bạn." },
  { n: "04", label: "Định hướng", desc: "Gợi mở các hướng đi khả dĩ, cùng bạn cân nhắc được — mất của từng lựa chọn." },
  { n: "05", label: "Hành động", desc: "Chuyển định hướng thành những bước đi cụ thể, phù hợp với hoàn cảnh thực tế." },
  { n: "06", label: "Chuyển hoá", desc: "Nhìn lại và điều chỉnh theo thời gian, để điều bất như ý trở thành bài học." },
];

export default function ConsultationProcess() {
  return (
    <section className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold">
            Trải nghiệm khai vấn
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
            Không chỉ xem vận, mà hiểu đường đi.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-6">
          {steps.map((s, idx) => (
            <Reveal key={s.n} delay={idx * 90}>
              <div className="relative border-t border-walnut/20 pt-6">
                <span className="font-heading text-sm text-gold">{s.n}</span>
                <h3 className="tracking-label mt-3 text-[13px] font-semibold uppercase text-ink">
                  {s.label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
