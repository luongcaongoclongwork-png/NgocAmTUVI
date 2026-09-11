import { CourtyardScene, StudyDeskScene } from "./illustrations";
import Reveal from "./Reveal";

const pillars = [
  {
    id: "tu-vi",
    eyebrow: "Tử Vi Xuyên Tam Diệm",
    words: ["Khai vấn", "Định hướng", "Phát triển nội lực", "Chuyển hoá điều bất như ý"],
    name: "Cô Nguyễn Minh Trang",
    role: "Kế thừa tri thức cổ — Ứng dụng vào đời sống hiện đại",
    bio:
      "Là truyền nhân của Khâm Thiên Giám dưới triều vua Minh Mạng, cô Nguyễn Minh Trang có cơ duyên tiếp cận và kế thừa những tri thức phương Đông được lưu truyền qua nhiều thế hệ. Với hơn 10 năm nghiên cứu và thực hành Tử Vi – Phong Thuỷ, cô đồng hành cùng nhiều quý hữu tìm ra con đường phát triển phù hợp với bản thân, chuyển hoá những điều bất như ý trong lá số thành cơ hội để trưởng thành và an nhiên hơn.",
    cta: "Tìm hiểu Khai vấn Tử Vi",
    Art: StudyDeskScene,
  },
  {
    id: "phong-thuy",
    eyebrow: "Phong Thuỷ Là Tịnh",
    words: ["Quan sát", "Tịnh hoá", "Hài hoà", "Tự chủ", "Thịnh vượng chân thật"],
    name: "Thầy Tịnh",
    role: "Kế thừa tri thức phong thuỷ xưa — Ứng dụng trong đời sống hôm nay",
    bio:
      "Là hậu nhân của một vị Thượng thư Bộ Hộ, từng kiêm quản Khâm Thiên Giám dưới triều vua Minh Mạng, Thầy Tịnh sinh trưởng trong một gia đình có truyền thống gắn với địa lý và Phong Thuỷ. Thầy dành nhiều tâm sức nghiên cứu Phong Thuỷ Dương Trạch và Âm Trạch — nhà ở, đất đai, không gian sống và việc lựa chọn vị trí an táng — như một nghệ thuật quan sát mối quan hệ giữa con người, không gian và môi trường sống.",
    cta: "Tìm hiểu Tư vấn Phong Thuỷ",
    Art: CourtyardScene,
  },
];

export default function CoreServices() {
  return (
    <section className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold">
            Hai trụ cột triết học
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
            Không chỉ xem vận, mà hiểu đường đi.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-12">
          {pillars.map((p, idx) => (
            <Reveal key={p.id} delay={idx * 140}>
              <article id={p.id} className="flex h-full flex-col">
                <div className="overflow-hidden border border-walnut/10">
                  <p.Art className="h-64 w-full object-cover" />
                </div>
                <h3 className="mt-8 font-heading text-2xl text-ink">
                  {p.eyebrow}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm text-bronze">
                  {p.words.map((w, i) => (
                    <li key={w} className="flex items-center gap-3">
                      {i !== 0 && <span className="h-1 w-1 rounded-full bg-gold" />}
                      {w}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border-t border-walnut/10 pt-8">
                  <p className="tracking-label text-[11px] font-semibold uppercase text-walnut">
                    {p.name}
                  </p>
                  <p className="mt-1 text-sm italic text-bronze">{p.role}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
                    {p.bio}
                  </p>
                </div>

                <a
                  href="#dich-vu"
                  className="tracking-label mt-8 inline-flex w-fit items-center gap-2 border-b border-gold pb-1 text-[11px] font-semibold uppercase text-walnut transition-colors hover:text-gold"
                >
                  {p.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
