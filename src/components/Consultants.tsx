import Reveal from "./Reveal";
import { BaguaMark } from "./illustrations";

const ROLE_TAGLINE = "Kế thừa tri thức cổ — Ứng dụng vào đời sống hiện đại";

const consultants = [
  {
    id: "co-minh-trang",
    name: "Cô Nguyễn Minh Trang",
    field: "Khai vấn Tử Vi",
    initials: "MT",
    bio:
      "Là truyền nhân của Khâm Thiên Giám dưới triều vua Minh Mạng, cô Nguyễn Minh Trang có cơ duyên tiếp cận và kế thừa những tri thức phương Đông được lưu truyền qua nhiều thế hệ. Với hơn 10 năm nghiên cứu và thực hành Tử Vi – Phong Thuỷ, cô đồng hành cùng nhiều quý hữu tìm ra con đường phát triển phù hợp với bản thân, chuyển hoá những điều bất như ý trong lá số thành cơ hội để trưởng thành và an nhiên hơn.",
  },
  {
    id: "thay-tinh",
    name: "Thầy Tịnh",
    field: "Tư vấn Phong Thuỷ",
    initials: "T",
    bio:
      "Là hậu nhân của một vị Thượng thư Bộ Hộ, từng kiêm quản Khâm Thiên Giám dưới triều vua Minh Mạng, Thầy Tịnh sinh trưởng trong một gia đình có truyền thống gắn với địa lý và Phong Thuỷ. Thầy dành nhiều tâm sức nghiên cứu Phong Thuỷ Dương Trạch và Âm Trạch — nhà ở, đất đai, không gian sống và việc lựa chọn vị trí an táng — như một nghệ thuật quan sát mối quan hệ giữa con người, không gian và môi trường sống.",
  },
];

export default function Consultants() {
  return (
    <section className="bg-parchment/60 py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold">
            Đội ngũ khai vấn
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 max-w-2xl font-heading text-3xl leading-tight text-ink sm:text-4xl">
            Người đồng hành cùng bạn trên hành trình hiểu mình.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-12">
          {consultants.map((c, idx) => (
            <Reveal key={c.id} delay={idx * 140}>
              <article className="flex h-full flex-col border-t border-walnut/20 pt-8">
                <div className="flex items-center gap-5">
                  <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold">
                    <span className="font-heading text-lg">{c.initials}</span>
                    <BaguaMark className="absolute -bottom-1.5 -right-1.5 h-5 w-5 text-gold opacity-70" />
                  </span>
                  <div>
                    <p className="tracking-label text-[11px] font-semibold uppercase text-walnut">
                      {c.name}
                    </p>
                    <p className="mt-1 text-sm italic text-bronze">{c.field}</p>
                  </div>
                </div>

                <p className="tracking-label mt-6 text-[11px] font-semibold uppercase text-gold">
                  {ROLE_TAGLINE}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
                  {c.bio}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
