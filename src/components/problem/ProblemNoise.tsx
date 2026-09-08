const pillars = [
  {
    id: "clarity",
    label: "Clarity",
    title: "What should I say?",
    place: "lg:col-start-1 lg:row-start-1",
  },
  {
    id: "audience",
    label: "Audience",
    title: "Who am I reaching?",
    place: "lg:col-start-3 lg:row-start-1 lg:justify-self-end",
  },
  {
    id: "channels",
    label: "Channels",
    title: "Where should I show up?",
    place: "lg:col-start-1 lg:row-start-2 lg:self-center",
  },
  {
    id: "voice",
    label: "Voice",
    title: "How do I sound like me?",
    place: "lg:col-start-3 lg:row-start-2 lg:justify-self-end lg:self-center",
  },
  {
    id: "results",
    label: "Results",
    title: "Is this actually working?",
    place:
      "col-span-2 justify-self-center lg:col-span-1 lg:col-start-2 lg:row-start-3 lg:justify-self-center",
  },
];

function PillarCard({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <div className="w-full max-w-sm border-t border-night/15 pt-3 text-left sm:min-w-[14rem]">
      <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-purple uppercase">
        {label}
      </p>
      <p className="mt-1.5 text-[0.95rem] font-semibold tracking-tight text-night sm:text-lg">
        {title}
      </p>
    </div>
  );
}

export function ProblemNoise() {
  return (
    <figure className="flex min-h-[calc(100svh-4.75rem)] flex-col justify-center bg-paper px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 items-stretch gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-x-10 lg:gap-y-8">
        <div className="order-first col-span-2 lg:order-none lg:col-span-1 lg:col-start-2 lg:row-start-2 lg:flex lg:items-center lg:justify-center">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-purple uppercase">
              The real problem
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.85rem,4.6vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.02em] text-pretty text-night">
              I don&rsquo;t have time for this.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-night/65 sm:text-base">
              I know I should be showing up, but running the business already
              takes all of it.
            </p>
          </div>
        </div>

        {pillars.map((pillar) => (
          <div key={pillar.id} className={pillar.place}>
            <PillarCard label={pillar.label} title={pillar.title} />
          </div>
        ))}
      </div>

      <figcaption className="sr-only">
        The work usually stalls on five fronts at once: what to say, who to
        reach, where to show up, how to sound like yourself, and whether any
        of it is turning into real business — while time is already gone.
      </figcaption>
    </figure>
  );
}
