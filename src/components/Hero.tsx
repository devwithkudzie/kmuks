import Image from "next/image";
import { ArrowRight } from "lucide-react";
import heroImage from "../../public/hero.jpg";
import { HeroChannels } from "@/components/hero/HeroChannels";
import { WhatsAppButton } from "@/components/WhatsAppIntake";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-canvas text-fog">
      <Image
        src={heroImage}
        alt="Night view of a modern office building"
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        quality={75}
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(15_15_17/0.8),rgb(15_15_17/0.93)_0%,rgb(15_15_17/0.98))]"
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-5 sm:px-8 lg:min-h-[calc(100svh-8.25rem)]">
        <div className="flex flex-1 flex-col items-start justify-center py-20 text-left lg:py-16">
          <p className="animate-fade-up text-[0.7rem] font-medium tracking-[0.22em] text-mist uppercase">
            Authority, built with intent
          </p>

          <h1
            className="animate-fade-up mt-6 max-w-4xl text-[clamp(2.85rem,8vw,5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-fog"
            style={{ animationDelay: "0.12s" }}
          >
            Making Brands{" "}
            <br className="hidden sm:block" />
            <span className="relative inline-block pb-[0.06em]">
              Easy To Remember
              <span
                aria-hidden
                className="hero-accent-line absolute inset-x-0 bottom-0 h-px bg-purple"
              />
            </span>
          </h1>

          <p
            className="animate-fade-up mt-8 max-w-2xl text-base leading-relaxed text-mist sm:text-lg lg:max-w-3xl"
            style={{ animationDelay: "0.24s" }}
          >
            I help SMEs turn attention into customers by finding the right
            message, reaching the right people,
            and creating a clear path from interest to enquiry to sale
          </p>

          <div className="mt-10 flex w-full flex-col items-start gap-8">
            <div
              className="animate-fade-up hidden w-full sm:block"
              style={{ animationDelay: "0.52s" }}
            >
              <HeroChannels />
            </div>

            <div
              className="animate-fade-up flex flex-col items-start gap-3 sm:flex-row sm:justify-start"
              style={{ animationDelay: "0.42s" }}
            >
              <WhatsAppButton
                source="work-with-me"
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-purple px-6 text-sm font-medium text-white transition hover:bg-violet ${focus}`}
              >
                Work with me
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
