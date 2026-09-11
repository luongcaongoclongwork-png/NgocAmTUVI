import Reveal from "./Reveal";

const articles = [
  {
    category: "Tử vi",
    title: "Mệnh Chủ và Thân Chủ nói gì về bạn?",
    excerpt:
      "Hai ngôi sao ít được nhắc đến nhưng định hình cách bạn phản ứng trước biến động của cuộc đời.",
    time: "6 phút đọc",
  },
  {
    category: "Phong thuỷ",
    title: "Tịnh không gian trước khi tịnh tâm",
    excerpt:
      "Vì sao Phong Thuỷ bắt đầu từ việc quan sát, không phải từ việc sắp đặt vật phẩm.",
    time: "5 phút đọc",
  },
  {
    category: "Phật học",
    title: "Vô thường trong cách nhìn về vận hạn",
    excerpt:
      "Một góc nhìn Phật học giúp việc xem vận trở nên nhẹ nhàng và chủ động hơn.",
    time: "7 phút đọc",
  },
  {
    category: "Phát triển nội lực",
    title: "Biết mình, biết thời: hai điều kiện của quyết định đúng",
    excerpt:
      "Nội lực không đến từ việc biết trước tương lai, mà từ việc hiểu rõ chu kỳ của chính mình.",
    time: "4 phút đọc",
  },
];

export default function Knowledge() {
  return (
    <section id="kien-thuc" className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="tracking-label text-[12px] font-medium uppercase text-gold">
                Ngọc Âm Kiến Thức
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 max-w-xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
                Tri thức phương Đông, đọc theo nhịp sống hiện đại.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <a
              href="#kien-thuc"
              className="tracking-label border-b border-gold pb-1 text-[11px] font-semibold uppercase text-walnut transition-colors hover:text-gold"
            >
              Xem tất cả
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((a, idx) => (
            <Reveal key={a.title} delay={idx * 100}>
              <a href="#kien-thuc" className="group block">
                <div className="aspect-[4/5] w-full overflow-hidden border border-walnut/10 bg-gradient-to-br from-beige to-parchment" />
                <p className="tracking-label mt-5 text-[10px] font-semibold uppercase text-gold">
                  {a.category}
                </p>
                <h3 className="mt-2 font-heading text-lg leading-snug text-ink group-hover:text-bronze">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {a.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-[11px] text-bronze">
                  <span>{a.time}</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
