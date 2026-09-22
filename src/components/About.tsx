import Image from "next/image";
import Reveal from "./Reveal";
import SectionBackdrop from "./SectionBackdrop";

export default function About({ backdrop = false }: { backdrop?: boolean }) {
  return (
    <section id="ve-ngoc-am" className="relative overflow-hidden bg-ivory py-24 lg:py-32">
      {backdrop && (
        <SectionBackdrop
          image="/images/07-hau-nhan-kham-thien-giam.png"
          tint="bg-ivory/92"
          position="top"
        />
      )}
      <div className="relative z-10 mx-auto grid max-w-[1280px] gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
        <Reveal>
          <div className="relative h-[420px] w-full overflow-hidden border border-walnut/15">
            <Image
              src="/images/23-homepage-heritage-study.webp"
              alt="Thư phòng cổ Việt Nam nhìn ra sân nhà"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold-deep">
            Hậu nhân Khâm Thiên Giám
          </p>
          <h2 className="mt-3 font-heading text-3xl leading-tight text-ink sm:text-4xl">
            Từ truyền thống của triều Nguyễn đến đời sống hiện đại.
          </h2>
          <p className="mt-6 text-[15px] italic leading-relaxed text-bronze">
            &ldquo;Kế thừa tri thức chiêm tinh, lịch pháp và phong thuỷ cung
            đình từ Khâm Thiên Giám thời vua Minh Mạng, triều Nguyễn.&rdquo;
          </p>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink/80">
            <p>
              Ngọc Âm được hình thành từ một mạch truyền thừa tri thức phương
              Đông — chiêm tinh, lịch pháp, địa lý và phong thuỷ — vốn được
              lưu giữ và nghiên cứu qua nhiều thế hệ trong dòng họ có liên hệ
              với Khâm Thiên Giám dưới triều Nguyễn.
            </p>
            <p>
              Chúng tôi tiếp cận tri thức ấy không phải để dự đoán, mà để
              cùng bạn quan sát rõ hơn bản thân và hoàn cảnh, từ đó đưa ra
              những lựa chọn có cân nhắc và vững vàng hơn trên hành trình
              phát triển của chính mình.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
