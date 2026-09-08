import { whatsappHref } from "@/lib/site";

export function Close() {
  return (
    <section id="audit" className="bg-canvas text-white">
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Ready to get known for what you do best?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Don't let your digital presence drop the ball while your ground
          execution is flawless. Let's build your multi-channel acquisition
          pipeline this week.
        </p>
        <a
          href={whatsappHref("profile-audit")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex min-h-12 items-center rounded-lg bg-purple px-7 text-sm font-medium text-white transition hover:bg-violet"
        >
          secure your profile audit today
        </a>
      </div>
    </section>
  );
}
