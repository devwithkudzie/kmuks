function GateMark() {
  return (
    <svg
      viewBox="0 0 320 400"
      className="h-full w-full"
      role="img"
      aria-label="Night gate post illustration"
    >
      <rect width="320" height="400" fill="#12110e" />
      <rect x="0" y="250" width="320" height="150" fill="#1a1814" />
      <path d="M0 252h320" stroke="#c4963a" strokeWidth="1" opacity="0.35" />
      <rect x="118" y="70" width="18" height="230" fill="#2a261f" />
      <rect x="108" y="48" width="38" height="28" fill="#3a342a" />
      <circle cx="127" cy="78" r="10" fill="#c4963a" opacity="0.9" />
      <circle cx="127" cy="78" r="22" fill="#c4963a" opacity="0.12" />
      <path d="M40 250 V140 h24 V250" fill="none" stroke="#6d675c" strokeWidth="3" />
      <path d="M256 250 V128 h24 V250" fill="none" stroke="#6d675c" strokeWidth="3" />
      <path d="M52 168h216M52 196h216M52 224h216" stroke="#6d675c" strokeWidth="2" />
      <text
        x="24"
        y="372"
        fill="#f7f2e8"
        fontSize="11"
        letterSpacing="3"
        opacity="0.55"
      >
        THE NIGHT SHIFT
      </text>
    </svg>
  );
}

export function Story() {
  return (
    <section id="story" className="bg-night text-ivory">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-12">
        <div className="relative">
          <div className="overflow-hidden rounded-sm border border-gold/25">
            <div className="aspect-[4/5]">
              <GateMark />
            </div>
            <div className="flex items-center gap-4 border-t border-ivory/10 bg-night-2 px-5 py-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border border-gold/40 bg-night font-serif text-2xl text-gold">
                KM
              </div>
              <div>
                <p className="font-medium text-ivory">Kudzaishe Mukungurutse</p>
                <p className="text-sm text-ivory/55">
                  Software engineer. Strategist. MBA candidate.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs tracking-[0.18em] text-ivory/40 uppercase">
            [ Portrait ] Drop a professional headshot at /public/kudzaishe.jpg
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase">
            03 — The narrative hook
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-5xl">
            From the Gate Post to the Boardroom
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-ivory/80">
            In 2012 I enrolled in agricultural engineering — a degree I would
            spend three years trying to make work. I failed at every level.
            I left in 2015.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ivory/80">
            The nights after that were not branded. They were practical. I
            worked as a security guard so I could fund a Computer Systems
            Engineering degree. I taught myself software with no money for
            courses. I built things that failed. In 2022, I graduated.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ivory/80">
            That path did not stop at a job title. In 2026 I completed the
            Google Digital Marketing & E-commerce Certification, then enrolled
            in the E4Impact MBA in Impact Entrepreneurship — a dual degree
            between the Catholic University of Zimbabwe and Università Cattolica
            del Sacro Cuore in Milan.
          </p>
          <blockquote className="mt-8 border-l-2 border-gold pl-5 font-serif text-2xl leading-snug text-gold">
            None of it happened because I had a plan. It happened because I
            kept choosing to become slightly more capable than I was the year
            before.
          </blockquote>
          <p className="mt-8 text-lg leading-relaxed text-ivory/80">
            The technical side was never my hard part. The missing half was
            how decisions get made when there is no obvious right answer — how
            to read a market, how to lead when the outcome is not guaranteed.
            That is the work I now do with independent experts: engineer a
            position the market can actually buy.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ivory/80">
            If you are an African professional still waiting to feel “ready”
            before you become visible — I already know that delay. Ready is a
            feeling that shows up after you have begun.
          </p>
        </div>
      </div>
    </section>
  );
}
