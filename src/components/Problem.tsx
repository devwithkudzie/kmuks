const constraints = [
  {
    n: "01",
    title: "Referrals are a lagging indicator",
    body: "Your best work stays invisible until someone else describes it. That means your income is tied to other people’s memory — not your market position.",
  },
  {
    n: "02",
    title: "Visibility without positioning is noise",
    body: "Posting more does not produce clients. A broad profile collects applause. A precise profile collects buyers who already feel the problem you solve.",
  },
  {
    n: "03",
    title: "Expertise without a system stays trapped in delivery",
    body: "Every billed hour is an hour you cannot spend building demand. You keep trading time for money with no engine underneath the practice.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <p className="text-[11px] font-medium tracking-[0.28em] text-gold-deep uppercase">
          02 — The constraint
        </p>
        <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight tracking-tight sm:text-5xl">
          Word-of-mouth is not a pipeline. It is a ceiling.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">
          You are already excellent at the work. That is no longer the
          bottleneck. Independent consultants, developers, and specialists across
          Southern Africa are still waiting for someone to mention their name.
        </p>
        <blockquote className="mt-10 max-w-3xl border-l-2 border-gold pl-5 font-serif text-2xl leading-snug text-ink sm:text-3xl">
          The market doesn’t pay for an archive of your past. It pays for
          clarity on how you solve problems right now.
        </blockquote>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {constraints.map((item) => (
            <article
              key={item.n}
              className="rounded-sm border border-ink/10 bg-paper-2/70 p-6"
            >
              <p className="font-serif text-2xl text-gold-deep">{item.n}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
