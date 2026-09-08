import { About } from "@/components/About";
import { Close } from "@/components/Close";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Packages } from "@/components/Packages";
import { Problem } from "@/components/Problem";
import { Services } from "@/components/Services";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { WhatsAppIntakeProvider } from "@/components/WhatsAppIntake";

export default function Home() {
  return (
    <WhatsAppIntakeProvider>
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
    </WhatsAppIntakeProvider>
  );
}
