"use client";

import { useEffect, useId, useRef, useState, type MouseEvent, type RefObject } from "react";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { WhatsAppButton } from "@/components/WhatsAppIntake";

const links = [
  { href: "#methodology", label: "How it works" },
  { href: "#about", label: "About" },
];

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple";

type MobileMenuProps = {
  id: string;
  active: string;
  firstLinkRef: RefObject<HTMLAnchorElement | null>;
  onClose: () => void;
  onGoTo: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
};

function MobileMenu({
  id,
  active,
  firstLinkRef,
  onClose,
  onGoTo,
}: MobileMenuProps) {
  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[70] flex flex-col bg-canvas md:hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(109_40_217/0.22),transparent_52%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.28)_100%)]"
      />

      <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <a
          href="#home"
          onClick={(event) => onGoTo("#home", event)}
          className={`font-script text-[1.7rem] leading-none text-fog ${focus}`}
        >
          Kudzie Muks
        </a>
        <button
          type="button"
          className={`inline-flex items-center gap-2.5 py-1 text-[0.7rem] font-medium tracking-[0.18em] text-fog uppercase ${focus}`}
          onClick={onClose}
        >
          Close
          <span aria-hidden className="relative h-3 w-4">
            <span className="absolute top-1.5 left-0 h-px w-full rotate-45 bg-fog" />
            <span className="absolute top-1.5 left-0 h-px w-full -rotate-45 bg-fog" />
          </span>
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col px-5 pt-10 pb-8">
        <p className="text-[0.7rem] font-medium tracking-[0.24em] text-purple uppercase">
          Navigate
        </p>

        <ul className="mt-6">
          {links.map((link, index) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => onGoTo(link.href, event)}
                  className={`flex items-end gap-5 border-b border-white/10 py-5 ${focus}`}
                >
                  <span className="text-[1.65rem] font-medium leading-none tracking-[-0.04em] text-purple">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="pb-0.5 text-[1.65rem] font-bold leading-none tracking-tight text-fog">
                    {link.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-10">
          <WhatsAppButton
            source="work-with-me"
            onOpen={onClose}
            className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-purple px-6 text-sm font-medium text-white transition hover:bg-violet ${focus}`}
          >
            Work with me
            <ArrowRight className="size-4" />
          </WhatsAppButton>
          <div className="mt-8 flex gap-6 text-sm text-mist">
            <a
              href={site.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition hover:text-fog ${focus}`}
            >
              LinkedIn
            </a>
            <WhatsAppButton
              source="menu"
              onOpen={onClose}
              className={`transition hover:text-fog ${focus}`}
            >
              Contact
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [heroInView, setHeroInView] = useState(true);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const wasOpen = useRef(false);
  const skipFocusRestore = useRef(false);

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.28 },
    );
    heroObserver.observe(hero);

    const sectionIds = ["home", ...links.map((link) => link.href.slice(1))];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = visible.target.id;
        setActive(id === "home" ? "" : `#${id}`);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.2, 0.45, 0.7] },
    );

    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    }

    const syncHash = () => {
      const hash = window.location.hash;
      if (links.some((link) => link.href === hash)) setActive(hash);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => {
      heroObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current && !skipFocusRestore.current) {
        toggleRef.current?.focus({ preventScroll: true });
      }
      skipFocusRestore.current = false;
      return;
    }

    wasOpen.current = true;
    firstLinkRef.current?.focus({ preventScroll: true });

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      html.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const goTo = (
    href: string,
    event?: MouseEvent<HTMLAnchorElement>,
  ) => {
    event?.preventDefault();
    skipFocusRestore.current = true;
    setActive(href === "#home" ? "" : href);

    const html = document.documentElement;
    html.style.overflow = "";
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    document.getElementById(href.slice(1))?.scrollIntoView({ block: "start" });
    html.style.scrollBehavior = previousBehavior;
    window.history.pushState(null, "", href);

    setOpen(false);
  };

  return (
    <>
      <div className="relative overflow-hidden bg-[#0F0F11]" inert={open || undefined}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_38%,rgba(0,0,0,0.35)_100%)]"
        />
        <div className="relative flex items-center justify-center px-5 py-3.5 sm:py-4">
          <a
            href="#home"
            className={`font-script text-[2.45rem] leading-none text-fog sm:text-[2.85rem] ${focus}`}
          >
            Kudzie Muks
          </a>
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="sticky top-0 z-[60] flex items-center gap-3 border-b border-white/10 bg-[#0F0F11] px-4 py-3 sm:gap-4 sm:px-5 sm:py-3.5"
        inert={open || undefined}
      >
        <div className="flex min-w-0 flex-1 items-center justify-start md:w-[7.5rem] md:flex-none lg:w-[10rem]">
          {heroInView ? null : (
            <a
              href="#home"
              onClick={close}
              className={`font-script text-[1.55rem] leading-none text-fog sm:text-[1.75rem] ${focus}`}
            >
              Kudzie Muks
            </a>
          )}
        </div>

        <div className="mx-auto hidden min-w-0 flex-1 justify-center md:flex">
            <div className="flex w-full max-w-lg">
            {links.map((link, index) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActive(link.href)}
                  className={`flex flex-1 items-center justify-center px-2 py-2 text-center text-[0.6rem] font-medium uppercase tracking-[0.14em] transition sm:px-3 sm:text-[0.7rem] ${
                    index > 0 ? "border-l border-white/15" : ""
                  } ${isActive ? "bg-white/5 text-fog" : "text-mist hover:text-fog"} ${focus}`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end md:w-[7.5rem] lg:w-[10rem]">
          <button
            ref={toggleRef}
            type="button"
            className={`inline-flex items-center gap-2.5 py-1 text-[0.7rem] font-medium tracking-[0.18em] text-fog uppercase md:hidden ${focus}`}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            Menu
            <span aria-hidden className="relative h-3 w-4">
              <span className="absolute top-0.5 left-0 h-px w-full bg-fog" />
              <span className="absolute top-2.5 left-0 h-px w-full bg-fog" />
            </span>
          </button>

          {heroInView ? null : (
            <WhatsAppButton
              source="work-with-me"
              className={`hidden min-h-9 items-center rounded-lg bg-purple px-3 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-white transition hover:bg-violet md:inline-flex sm:min-h-10 sm:px-4 sm:text-xs ${focus}`}
            >
              Work with me
            </WhatsAppButton>
          )}
        </div>
      </nav>

      {open ? (
        <MobileMenu
          id={menuId}
          active={active}
          firstLinkRef={firstLinkRef}
          onClose={close}
          onGoTo={goTo}
        />
      ) : null}
    </>
  );
}
