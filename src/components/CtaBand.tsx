import Image from "next/image";
import { Suspense } from "react";
import Reveal from "./Reveal";
import CtaBandActions from "./CtaBandActions";

export default function CtaBand() {
  return (
    <section id="lien-he" className="relative overflow-hidden bg-walnut py-24 lg:py-28">
      <Image
        src="/images/06-dat-lich-mac-tram.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover"
        style={{ objectPosition: "bottom" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-walnut/20" />

      <div className="relative mx-auto max-w-[1000px] px-6 text-center lg:px-10">
        <Reveal>
          <h2 className="font-heading text-3xl leading-snug text-ivory sm:text-4xl">
            Một góc nhìn rõ ràng có thể thay đổi cách bạn bước tiếp.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10">
            <Suspense fallback={null}>
              <CtaBandActions />
            </Suspense>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
