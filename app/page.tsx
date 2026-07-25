import { Cta } from "@/components/sections/Cta";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HomeFaq } from "@/components/sections/HomeFaq";
import { HomeIntro } from "@/components/sections/HomeIntro";
import { Navbar } from "@/components/sections/Navbar";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { TrustStrip } from "@/components/sections/TrustStrip";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        {/* La prosa va antes de las tarjetas: quien llega desde buscador
            necesita saber qué es esto antes de ver un catálogo de servicios. */}
        <HomeIntro />
        <Services />
        <Process />
        <Portfolio />
        <HomeFaq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
