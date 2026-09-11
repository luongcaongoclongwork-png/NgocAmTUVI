import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CoreServices from "@/components/CoreServices";
import Services from "@/components/Services";
import ConsultationProcess from "@/components/ConsultationProcess";
import About from "@/components/About";
import Knowledge from "@/components/Knowledge";
import Products from "@/components/Products";
import Philosophy from "@/components/Philosophy";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-ivory">
      <Header />
      <main className="flex-1">
        <Hero />
        <CoreServices />
        <Services />
        <ConsultationProcess />
        <About />
        <Knowledge />
        <Products />
        <Philosophy />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
