import Image from "next/image";
import portrait from "../../public/potrait.jpeg";

export function About() {
  return (
    <section id="about" className="relative z-20 bg-night text-fog">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <p className="text-[0.7rem] font-medium tracking-[0.24em] text-purple uppercase">
          About
        </p>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-2 lg:items-start lg:gap-16">
          <figure className="relative -mx-5 overflow-hidden border-y border-white/10 sm:-mx-8 lg:sticky lg:top-28 lg:mx-0 lg:border lg:border-white/10">
            <div className="relative aspect-[4/5] min-h-[22rem] lg:min-h-[32rem]">
              <Image
                src={portrait}
                alt="Prosper Mukungurutse"
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top grayscale"
              />
            </div>
            <figcaption className="border-t border-white/10 px-4 py-3 text-[0.7rem] tracking-[0.18em] text-mist uppercase">
              Kudzie Mukungurutse
            </figcaption>
          </figure>

          <div>
            <h2 className="max-w-xl text-[clamp(1.85rem,4.4vw,3.2rem)] font-bold leading-[1.12] tracking-tight text-pretty text-fog">
              Marketing should bring you customers.
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-loose text-mist">
              I&rsquo;m Prosper Mukungurutse. I help SMEs figure out
              what&rsquo;s actually stopping their marketing from bringing in
              more customers — before deciding what to fix.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-loose text-mist">
              My background in technology, product development and marketing
              means I look beyond ads and content. I look at the whole
              journey — from how customers find your business to what
              happens after they enquire.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-loose text-mist">
              I start with your business, not a service menu.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-loose text-mist">
              What you sell. Who buys from you. How they currently find you.
              Then we work out what needs to change.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-loose text-mist">
              <strong className="font-semibold text-purple">
                The goal is simple:
              </strong>{" "}
              find what can help you bring in more customers, put it into
              action, and measure whether it works.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
