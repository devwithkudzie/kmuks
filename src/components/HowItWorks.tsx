import Image from "next/image";
import audiencePhoto from "../../public/how-create.jpg";

const steps = [
  {
    number: "01",
    title: "Understand",
    headline: "First, I understand your business.",
    body: "We look at what you sell, who normally buys from you, how you're currently getting customers, and where there may be opportunities to get more.",
    tags: "Your Business · Your Customers · What's Working",
  },
  {
    number: "02",
    title: "Plan",
    headline: "Then we figure out the best way to reach them.",
    body: "I work out what to say, what to offer, and where we are most likely to reach the people you want as customers.",
    tags: "Message · Offer · Where to Reach Them",
  },
  {
    number: "03",
    title: "Execute",
    headline: "I put the plan into action.",
    body: "I create and run what we need to reach those customers — whether that's advertising, content, a simple web page, outreach, or a combination that makes sense.",
    tags: "Ads · Content · Web Pages · Outreach",
  },
  {
    number: "04",
    title: "Win Customers",
    headline: "Getting attention is only the beginning.",
    body: "We make it easy for interested people to contact your business and improve what happens after they enquire, helping turn more enquiries into customers.",
    tags: "Enquiries · WhatsApp · Follow-up",
  },
  {
    number: "05",
    title: "Measure & Improve",
    headline: "We find out what's actually working.",
    body: "We look at what's bringing enquiries and customers, improve what works, and stop wasting time or money on what doesn't.",
    tags: "Results · Customers · Improvement",
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
          <figure className="relative -mx-5 overflow-hidden border-y border-white/10 sm:-mx-8 lg:sticky lg:top-28 lg:mx-0 lg:border lg:border-white/10">
            <div className="relative aspect-[16/10] lg:aspect-[4/5] lg:min-h-[32rem]">
              <Image
                src={audiencePhoto}
                alt="Prosper Mukungurutse"
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

          <ol className="space-y-4 sm:space-y-6">
            {steps.map((step, index) => (
              <li
                key={step.number}
                className={`-mx-5 p-5 sm:-mx-8 sm:p-8 lg:mx-0 lg:px-8 ${
                  index % 2 === 0 ? "bg-white/4" : "bg-transparent"
                }`}
              >
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
                <p className="mt-4 text-[0.7rem] font-medium tracking-[0.18em] text-purple uppercase">
                  {step.tags}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
