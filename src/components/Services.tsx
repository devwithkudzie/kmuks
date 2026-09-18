import { WhatsAppButton } from "@/components/WhatsAppIntake";

export function Services() {
  return (
    <section id="services" className="bg-purple text-white">
      <div className="mx-auto max-w-175 px-5 py-20 text-left sm:px-8 sm:py-28">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Need more customers?
        </h2>
        <p className="mt-4 text-lg font-medium text-white sm:text-xl">
          Let&rsquo;s find out how to bring in more customers.
        </p>
        <WhatsAppButton
          source="customer-growth-review"
          className="mt-10 inline-flex min-h-12 items-center rounded-lg bg-white px-7 text-sm font-medium text-purple transition-colors duration-200 hover:bg-violet hover:text-white"
        >
          Get Your Free Customer Growth Review
        </WhatsAppButton>
        <p className="mt-3 text-xs tracking-wide text-white/60 uppercase">
          Free · No obligation
        </p>
      </div>
    </section>
  );
}
