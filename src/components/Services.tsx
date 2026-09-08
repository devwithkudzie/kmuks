import Image from "next/image";
import servicesPhoto from "../../public/how-create.jpg";

const ghostwritingIncludes = [
  "Content pillars",
  "LinkedIn ghostwriting",
  "X content",
  "Founder / executive content",
  "Repurposing",
];

const channels = ["LinkedIn", "X", "Instagram", "Facebook", "TikTok"];

const conversionIncludes = [
  "Personal brand pages",
  "Sales landing pages",
  "Campaign pages",
  "Lead capture",
  "WhatsApp journeys",
];

const services = [
  {
    number: "01",
    title: "Ghostwriting",
    headline: "Your ideas. Your voice.",
    body: "I help uncover the ideas already inside your experience, map the topics worth talking about and turn them into content that sounds like you.",
    tags: ghostwritingIncludes,
  },
  {
    number: "02",
    title: "Multi-channel content",
    headline: "Show up in the places that actually matter.",
    body: "Your strongest ideas can be adapted for the channels where your audience spends time — without forcing you to be everywhere.",
    tags: channels,
  },
  {
    number: "03",
    title: "Pages that turn attention into action",
    headline: "Give interested people somewhere useful to go next.",
    body: "Content can get attention. Landing pages and websites help turn that attention into enquiries, conversations and opportunities.",
    tags: conversionIncludes,
  },
];

function ServicesPhotoOverlays() {
  return (
    <>
      <div aria-hidden className="absolute inset-0 bg-canvas/40" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-canvas/70 via-canvas/25 to-canvas/80"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(109_40_217/0.22),transparent_58%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-canvas/50 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-canvas/70 to-transparent"
      />
    </>
  );
}

const mobilePanel =
  "-mx-3 border border-white/10 bg-canvas/90 px-4 py-6 shadow-[0_18px_50px_rgb(0_0_0/0.55)] backdrop-blur-md lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none";

export function Services() {
  return (
    <section
      id="services"
      className="relative z-20 bg-canvas text-fog lg:bg-paper lg:text-night"
    >
      <div className="pointer-events-none sticky top-0 h-svh lg:hidden">
        <Image
          src={servicesPhoto}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-center"
        />
        <ServicesPhotoOverlays />
      </div>

      <div className="relative z-10 -mt-[100svh] min-h-svh px-5 pb-24 pt-28 sm:px-8 sm:pb-32 lg:mt-0 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-[0.7rem] font-medium tracking-[0.24em] text-purple uppercase [text-shadow:0_1px_12px_rgb(0_0_0/0.55)] lg:[text-shadow:none]">
            Services
          </p>

          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-2 lg:items-start lg:gap-16">
            <figure className="relative hidden overflow-hidden border border-night/10 lg:sticky lg:top-28 lg:block">
              <div className="relative aspect-[4/5] min-h-[32rem]">
                <Image
                  src={servicesPhoto}
                  alt="Hands writing in a planner beside a laptop"
                  fill
                  placeholder="blur"
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
            </figure>

            <ol className="space-y-10 sm:space-y-16">
              {services.map((service) => (
                <li key={service.number} className={mobilePanel}>
                  <div className="flex items-end gap-5">
                    <span className="text-[clamp(2rem,4vw,3rem)] font-medium leading-none tracking-[-0.04em] text-purple">
                      {service.number}
                    </span>
                    <div className="min-w-0 flex-1 pb-1">
                      <h3 className="text-sm font-medium tracking-[0.22em] text-fog uppercase lg:text-night">
                        {service.title}
                      </h3>
                      <div className="mt-3 h-px w-full max-w-xs bg-purple/70" />
                    </div>
                  </div>
                  <p className="mt-6 text-2xl font-bold tracking-tight text-fog sm:text-3xl lg:text-night">
                    {service.headline}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist sm:text-base lg:text-night/70">
                    {service.body}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.7rem] tracking-[0.14em] text-mist/80 uppercase lg:text-night/55">
                    {service.tags.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
