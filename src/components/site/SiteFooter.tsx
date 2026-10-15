import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NAV_LINKS } from "@/components/site/nav";
import { solutions } from "@/lib/content";
import { site } from "@/lib/site";

const linkClass = "text-sm text-mist transition hover:text-fog";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-night">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo className="h-6" tone="dark" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
            AI-powered software engineering for customer acquisition and lead generation.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-fog uppercase">Solutions</p>
          <ul className="mt-4 space-y-3">
            {solutions.map((solution) => (
              <li key={solution.slug}>
                <Link href={`/solutions/${solution.slug}`} className={linkClass}>
                  {solution.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-fog uppercase">Explore</p>
          <ul className="mt-4 space-y-3">
            {[...NAV_LINKS.filter((link) => link.href !== "/solutions"), { href: "/about#how-i-work", label: "How I Work" }, { href: "/start-a-project", label: "Start a Project" }].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-fog uppercase">Connect</p>
          <ul className="mt-4 space-y-3">
            {[
              { href: site.linkedinUrl, label: "LinkedIn" },
              { href: site.calendlyUrl, label: "Book a call" },
              { href: site.facebookUrl, label: "Facebook" },
              { href: site.instagramUrl, label: "Instagram" },
              { href: site.xUrl, label: "X" },
            ].map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-mist/70 sm:px-8">
          © {new Date().getFullYear()} {site.handle} · {site.fullName}
        </p>
      </div>
    </footer>
  );
}
