import { CtaPair } from "@/components/CtaPair";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ivory/10 bg-night/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-12">
        <a href="#top" className="min-w-0">
          <p className="font-serif text-xl tracking-tight text-ivory italic sm:text-2xl">
            {site.handle}
          </p>
          <p className="hidden truncate text-[11px] tracking-[0.18em] text-ivory/55 uppercase sm:block">
            {site.role}
          </p>
        </a>
        <div className="hidden lg:block">
          <CtaPair size="sm" />
        </div>
        <a
          href={site.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-sm bg-gold px-3 text-sm font-semibold text-night lg:hidden"
        >
          Book a Call
        </a>
      </div>
    </header>
  );
}
