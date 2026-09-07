import { CtaPair } from "@/components/CtaPair";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="hero"
      className="grain relative overflow-hidden bg-night text-ivory"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-8%] font-serif text-[42vw] leading-none text-gold/[0.06] select-none sm:text-[28vw]"
      >
        KM
      </div>
      <div className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-6xl flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase sm:text-xs">
          {site.location}
        </p>
        <h1 className="mt-6 max-w-4xl font-serif text-[2.15rem] leading-[1.12] tracking-tight text-ivory sm:text-5xl lg:text-[4.15rem]">
          Expertise alone isn’t enough.
          <span className="mt-3 block text-gold">
            It’s time to stop relying on word-of-mouth.
          </span>
        </h1>
        <div className="mt-8 max-w-xl">
          <div className="hairline mb-8 max-w-40" />
          <p className="text-lg leading-relaxed text-ivory/80 sm:text-xl">
            I help independent consultants, developers, and skilled professionals
            turn their raw expertise into a{" "}
            <strong className="font-semibold text-ivory">
              predictable client-acquisition engine
            </strong>
            .
          </p>
        </div>
        <div className="mt-10 max-w-2xl">
          <CtaPair />
          <p className="mt-4 text-sm text-ivory/50">
            20 minutes. Direct conversation. No archive of your past — only
            clarity on the problem you solve right now.
          </p>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-ivory/10 pt-6 text-[11px] tracking-[0.16em] text-ivory/45 uppercase sm:text-xs">
          <li>Computer Systems Engineer</li>
          <li>Impact Entrepreneurship MBA</li>
          <li>Personal Brand Strategy</li>
        </ul>
      </div>
    </section>
  );
}
