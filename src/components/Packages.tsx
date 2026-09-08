"use client";

import { trackCta } from "@/lib/track";
import { whatsappHref } from "@/lib/site";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple";

const packages = [
  {
    id: "thought-leader",
    number: "01",
    name: "Thought Leader",
    scope: "Focused",
    who: "For founders, CEOs, MDs, executives and consultants who want to become more visible around what they know.",
    includes: [
      "Research & profile audit",
      "Positioning",
      "Content pillars",
      "LinkedIn ghostwriting",
      "X content / repurposing",
      "Profile optimisation",
      "Personal-brand landing page",
    ],
    bestWhen:
      "Your reputation and experience are closely connected to the opportunities you want.",
    cta: "Explore Thought Leader",
    href: "#audit",
    featured: false,
  },
  {
    id: "growth-engine",
    number: "02",
    name: "Growth Engine",
    scope: "Broader",
    who: "For service business owners, solopreneurs, creators and growing brands that need to reach people beyond one platform.",
    includes: [
      "Research & audience audit",
      "Content strategy",
      "Recommended channel mix",
      "LinkedIn / X where relevant",
      "Instagram / Facebook / TikTok where relevant",
      "Written and visual content",
      "Content repurposing",
      "Sales / conversion landing page",
    ],
    bestWhen:
      "Your customers discover and evaluate you across several places online.",
    cta: "Explore Growth Engine",
    href: "#audit",
    featured: false,
  },
  {
    id: "pan-african",
    number: "03",
    name: "Pan-African Authority",
    scope: "Full service",
    who: "For established founders, executives and businesses building a visible presence across markets.",
    includes: [
      "Deep market and audience research",
      "Positioning strategy",
      "Executive ghostwriting",
      "Full multi-channel management",
      "Premium content and repurposing",
      "Hub website",
      "Conversion journeys",
      "WhatsApp CRM",
      "Performance insights",
      "Ongoing strategic support",
    ],
    bestWhen:
      "You need someone to manage the whole system rather than simply help you create posts.",
    cta: "Discuss Pan-African Authority",
    href: whatsappHref("pan-african"),
    external: true,
    featured: true,
  },
];

export function Packages() {
  return (
    <section id="packages" className="relative z-20 bg-canvas text-fog">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <p className="text-[0.7rem] font-medium tracking-[0.24em] text-purple uppercase">
          Packages
        </p>
        <h2 className="mt-6 max-w-2xl text-[clamp(1.85rem,4.4vw,3.2rem)] font-bold leading-[1.12] tracking-tight text-pretty">
          Choose the support that fits where you are.
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-mist">
          Not everyone needs the same channels or level of support. The initial
          audit helps determine what makes sense for you.
        </p>

        <div className="mt-12 border-y border-white/10">
          {packages.map((item) => (
            <details
              key={item.id}
              id={item.id}
              name="packages"
              className={`group border-b border-white/10 last:border-b-0 ${
                item.featured ? "bg-purple/5" : ""
              }`}
            >
              <summary
                className={`flex cursor-pointer list-none items-start gap-4 py-5 sm:gap-6 sm:py-6 [&::-webkit-details-marker]:hidden ${focus}`}
              >
                <span className="w-12 shrink-0 pt-0.5 text-2xl font-medium leading-none tracking-[-0.04em] text-purple sm:w-16 sm:text-3xl">
                  {item.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold tracking-tight text-fog sm:text-xl">
                    {item.name}
                  </span>
                  <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-mist sm:text-base">
                    {item.who}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 pt-1 text-xl leading-none text-purple transition-transform group-open:rotate-180"
                >
                  ↓
                </span>
              </summary>

              <div className="pb-8 pl-16 sm:pb-10 sm:pl-[5.5rem]">
                <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {item.includes.map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 text-sm leading-relaxed text-fog/85"
                    >
                      <span
                        className="mt-[0.55em] h-px w-3 shrink-0 bg-purple"
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 text-[0.65rem] tracking-[0.18em] text-purple uppercase">
                  Best when
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist">
                  {item.bestWhen}
                </p>
                <a
                  href={item.href}
                  {...(item.external
                    ? {
                        target: "_blank",
                        rel: "noopener noreferrer",
                        onClick: () => trackCta("whatsapp"),
                      }
                    : {})}
                  className={`mt-6 inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm font-medium tracking-[0.12em] uppercase transition ${
                    item.featured
                      ? "bg-purple text-white hover:bg-violet"
                      : "border border-white/20 text-fog hover:border-purple hover:text-white"
                  } ${focus}`}
                >
                  {item.cta}
                </a>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-20 border-t border-white/10 pt-12 sm:mt-24 sm:pt-16">
          <p className="text-[0.7rem] tracking-[0.2em] text-mist uppercase">
            Working with a team?
          </p>
          <p className="mt-5 max-w-2xl text-xl font-bold tracking-tight sm:text-2xl">
            B2B sales teams, marketing teams and agencies often need a
            different setup.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist sm:text-base">
            Whether you&rsquo;re building the visibility of several
            salespeople, supporting multiple executives or looking for
            execution support for client work, we can shape the engagement
            around your team.
          </p>
          <a
            href={whatsappHref("team")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCta("whatsapp")}
            className={`mt-8 inline-flex min-h-12 items-center text-sm font-medium tracking-[0.14em] text-purple uppercase transition hover:text-fog ${focus}`}
          >
            Talk about your team
            <span aria-hidden className="ml-2">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
