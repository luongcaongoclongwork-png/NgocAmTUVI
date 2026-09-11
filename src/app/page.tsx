import Hero from "@/components/Hero";
import CoreServices from "@/components/CoreServices";
import Consultants from "@/components/Consultants";
import Services from "@/components/Services";
import ConsultationProcess from "@/components/ConsultationProcess";
import About from "@/components/About";
import Knowledge from "@/components/Knowledge";
import Products from "@/components/Products";
import Philosophy from "@/components/Philosophy";
import CtaBand from "@/components/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <CoreServices />
      <Consultants />
      <Services />
      <ConsultationProcess />
      <About />
      <Knowledge />
      <Products />
      <Philosophy />
      <CtaBand />
    </>
  );
}
