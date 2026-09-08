import Image from "next/image";
import portrait from "../../public/how-learn.jpg";

export function About() {
  return (
    <section id="about" className="relative z-20 bg-paper text-night">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <p className="text-[0.7rem] font-medium tracking-[0.24em] text-purple uppercase">
          About
        </p>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-2 lg:items-start lg:gap-16">
          <figure className="relative overflow-hidden border border-night/10 lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] min-h-[22rem] lg:min-h-[32rem]">
              <Image
                src={portrait}
                alt="Kudzie Muks"
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="border-t border-night/10 px-4 py-3 text-[0.7rem] tracking-[0.18em] text-night/55 uppercase">
              Kudzie Muks
            </figcaption>
          </figure>

          <div>
            <h2 className="max-w-xl text-[clamp(1.85rem,4.4vw,3.2rem)] font-bold leading-[1.12] tracking-tight text-pretty">
            I'm Kudzie. I build the system behind how you show up online.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-night/70">
              I started in software engineering, but somewhere along the way 
              I became just as interested in what happens after something is built — 
              how people find it, understand it, trust it and take action. 
              So I left the code behind and became a content strategist.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-night/70">
            Today, I combine technology, digital marketing, product thinking and 
            business to help founders, executives, consultants and service 
            business owners figure out what to say, who to reach and where to show up.
            </p>

            <ul className="mt-10 space-y-6 border-t border-night/10 pt-10">
              <li>
                <p className="text-[0.7rem] font-medium tracking-[0.2em] text-purple uppercase">
                  Direction before volume
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-night/70 sm:text-base">
                  I do not start with a posting calendar. I start with what you
                  do, who needs to hear it, and where those people already
                  spend time.
                </p>
              </li>
              <li>
                <p className="text-[0.7rem] font-medium tracking-[0.2em] text-purple uppercase">
                  One practice, not a content mill
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-night/70 sm:text-base">
                  Ghostwriting, multi-channel content and conversion pages sit
                  in the same system, so the public story matches the work
                  behind it.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
