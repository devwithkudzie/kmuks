import { About } from "@/components/About";
import { Close } from "@/components/Close";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Packages } from "@/components/Packages";
import { Pricing } from "@/components/Pricing";
import { Problem } from "@/components/Problem";
import { Services } from "@/components/Services";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Services />
        <Packages />
        
        <About />
        <Close />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
