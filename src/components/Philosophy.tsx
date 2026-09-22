import Reveal from "./Reveal";
import SectionBackdrop from "./SectionBackdrop";

const spirit = [
  { word: "Khương", desc: "Vững vàng để nuôi dưỡng chí hướng dài lâu." },
  { word: "Lạc", desc: "Chuyển động để quan sát sự hài hoà của người và cảnh vật." },
  { word: "Tịnh", desc: "Tĩnh lặng đến từ hiểu biết, thanh lọc với sự chân thật của thân tâm." },
];

export default function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-ivory py-24 lg:py-32">
      <SectionBackdrop
        image="/images/05-tinh-than-ngoc-am.png"
        tint="bg-ivory/78"
        position="bottom"
      />
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center lg:px-10">
        <Reveal>
          <p className="tracking-label text-[12px] font-medium uppercase text-gold-deep">
            Tinh thần Ngọc Âm
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-4xl gap-16 sm:grid-cols-3">
          {spirit.map((s, idx) => (
            <Reveal key={s.word} delay={idx * 130}>
              <div>
                <h3 className="font-heading text-4xl text-walnut">{s.word}</h3>
                <div className="mx-auto mt-5 h-px w-10 bg-gold" />
                <p className="mt-5 text-[15px] leading-relaxed text-ink/70">
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
