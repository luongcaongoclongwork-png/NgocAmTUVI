import Reveal from "./Reveal";
import SectionBackdrop from "./SectionBackdrop";
import NgocAmCard, { type NgocAmCardVariant } from "./ui/NgocAmCard";

const pillars: {
  id: string;
  variant: NgocAmCardVariant;
  category: string;
  title: string;
  words: string[];
  cta: string;
  href: string;
  image: string;
  alt: string;
}[] = [
  {
    id: "tu-vi",
    variant: "tuvi",
    category: "Tử Vi",
    title: "Tử Vi Xuyên Tam Diệm",
    words: ["Khai vấn", "Định hướng", "Phát triển nội lực", "Chuyển hoá điều bất như ý"],
    cta: "Tìm hiểu Khai vấn Tử Vi",
    href: "/tu-vi",
    image: "/images/pillars/tu-vi.webp",
    alt: "Lá số Tử Vi viết tay trên bàn gỗ cổ",
  },
  {
    id: "phong-thuy",
    variant: "phongthuy",
    category: "Phong Thuỷ",
    title: "Phong Thuỷ Là Tịnh",
    words: ["Quan sát", "Tịnh hoá", "Hài hoà", "Tự chủ", "Thịnh vượng chân thật"],
    cta: "Tìm hiểu Tư vấn Phong Thuỷ",
    href: "/phong-thuy",
    image: "/images/pillars/phong-thuy.webp",
    alt: "Hành lang gỗ bên hồ nước trong sân nhà cổ",
  },
  {
    id: "tra-dao",
    variant: "tradao",
    category: "Trà Đạo",
    title: "Trà Đạo Ngọc Âm",
    words: ["Thuận trà", "Thuận thủy", "Thuận thời", "Thuận tâm"],
    cta: "Tìm hiểu Trà Đạo",
    href: "/tra-dao",
    image: "/images/pillars/tra-dao.png",
    alt: "Bàn trà gỗ giữa vườn trà trên núi, nhìn ra thung lũng sương sớm",
  },
];

export default function CoreServices() {
  return (
    <section className="relative overflow-hidden bg-ivory py-24 lg:py-32">
      <SectionBackdrop
        image="/images/29-homepage-thuy-mac-song-huong.webp"
        tint="bg-ivory/78"
      />
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold">
            Ba trụ cột triết học
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
            Kế thừa tri thức cổ — Ứng dụng vào đời sống hiện đại.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {pillars.map((p, idx) => (
            <Reveal key={p.id} delay={idx * 140}>
              <NgocAmCard
                href={p.href}
                variant={p.variant}
                eyebrow={p.category}
                title={p.title}
                ctaLabel={p.cta}
                image={{ src: p.image, alt: p.alt, sizes: "(min-width: 1024px) 33vw, 100vw" }}
              >
                <ul className="flex flex-wrap gap-x-3 gap-y-2 text-[13px] text-bronze">
                  {p.words.map((w, i) => (
                    <li key={w} className="flex items-center gap-3">
                      {i !== 0 && <span className="h-1 w-1 rounded-full bg-gold" />}
                      {w}
                    </li>
                  ))}
                </ul>
              </NgocAmCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
