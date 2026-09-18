import Image from "next/image";
import { WhatsAppButton } from "@/components/WhatsAppIntake";
import closeImage from "../../public/hero.jpg";

export function Close() {
  return (
    <section
      id="audit"
      className="relative overflow-hidden bg-canvas text-white"
    >
      <Image
        src={closeImage}
        alt=""
        aria-hidden
        fill
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-canvas/90"
      />

      <div className="relative z-10 mx-auto max-w-175 px-5 py-20 text-left sm:px-8 sm:py-28">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Ready to bring in more customers?
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-zinc-300 sm:text-base">
          Start with a Free Customer Growth Review and let&rsquo;s find out
          what your business could do to bring in more customers.
        </p>
        <WhatsAppButton
          source="customer-growth-review"
          className="mt-10 inline-flex min-h-12 items-center rounded-lg bg-purple px-7 text-sm font-medium text-white transition hover:bg-violet"
        >
          Let&rsquo;s Get Started
        </WhatsAppButton>
        <p className="mt-3 text-xs tracking-wide text-white/60 uppercase">
          Free · No obligation
        </p>
      </div>
    </section>
  );
}
