import Image from "next/image";
import audiencePhoto from "../../public/how-audience.jpg";

const steps = [
  {
    number: "01",
    title: "Research & Audit",
    headline: "First, I understand where you are.",
    body: "I look at your goals, audience, industry, competitors and current online presence to understand what's working, what's missing and where the opportunity may be.",
  },
  {
    number: "02",
    title: "Recommendation",
    headline: "You need to be in the right places.",
    body: "Based on what we learn, I recommend what you should talk about, who you need to reach and which channels make the most sense for you.",
  },
  {
    number: "03",
    title: "Execution",
    headline: "Then, I help you show up consistently.",
    body: "Once the direction is clear, I handle the work — from ghostwriting and repurposing to multi-channel content and the pages that give interested people somewhere useful to go next.",
  },
];

export function HowItWorks() {
  return (
    <section id="methodology" className="relative z-20 bg-canvas text-fog">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <h2 className="text-[0.7rem] font-medium tracking-[0.24em] text-purple uppercase">
          How it works
        </h2>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-2 lg:items-start lg:gap-16">
          <figure className="relative overflow-hidden border border-white/10 lg:sticky lg:top-28">
            <div className="relative aspect-[16/10] lg:aspect-[4/5] lg:min-h-[32rem]">
              <Image
                src={audiencePhoto}
                alt="A microphone in front of a seated audience"
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-canvas/70 via-transparent to-transparent"
              />
            </div>
          </figure>

          <ol className="space-y-12 sm:space-y-16">
            {steps.map((step) => (
              <li key={step.number}>
                <div className="flex items-end gap-5">
                  <span className="text-[clamp(2rem,4vw,3rem)] font-medium leading-none tracking-[-0.04em] text-purple">
                    {step.number}
                  </span>
                  <div className="min-w-0 flex-1 pb-1">
                    <h3 className="text-sm font-medium tracking-[0.22em] text-fog uppercase">
                      {step.title}
                    </h3>
                    <div className="mt-3 h-px w-full max-w-xs bg-purple/40" />
                  </div>
                </div>
                <p className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
                  {step.headline}
                </p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
