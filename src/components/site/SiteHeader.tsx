"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { focus } from "@/components/site/ui";
import { NAV_LINKS } from "@/components/site/nav";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close the menu after navigating, on Escape, and when the screen grows past mobile.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => media.matches && setOpen(false);
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus({ preventScroll: true });
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const toggle = toggleRef.current;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-[60] border-b border-line bg-canvas/90 backdrop-blur" inert={open || undefined}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" aria-label="kudziemuks — home" className={`inline-flex shrink-0 ${focus}`}>
            <Logo className="h-5 sm:h-6" preload tone="dark" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm transition ${active ? "text-fog" : "text-mist hover:text-fog"} ${focus}`}
                >
                  {link.label}
                  <span aria-hidden className={`mt-0.5 block h-px bg-purple transition-transform ${active ? "scale-x-100" : "scale-x-0"}`} />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/start-a-project"
              className={`hidden min-h-10 items-center gap-1.5 rounded-lg bg-purple px-4 text-sm font-medium text-white transition hover:bg-violet md:inline-flex ${focus}`}
            >
              Start a Project
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className={`inline-flex items-center gap-2.5 py-1 text-[0.7rem] font-medium tracking-[0.18em] text-fog uppercase md:hidden ${focus}`}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen(true)}
            >
              Menu
              <span aria-hidden className="relative h-3 w-4">
                <span className="absolute top-0.5 left-0 h-px w-full bg-fog" />
                <span className="absolute top-2.5 left-0 h-px w-full bg-fog" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div id={menuId} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[70] flex flex-col bg-canvas md:hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(109_40_217/0.1),transparent_52%)]" />
          <div className="relative flex h-16 items-center justify-between border-b border-line px-5">
            <Link href="/" className={`inline-flex ${focus}`} onClick={() => setOpen(false)}>
              <Logo className="h-5" tone="dark" />
            </Link>
            <button
              type="button"
              className={`inline-flex items-center gap-2.5 py-1 text-[0.7rem] font-medium tracking-[0.18em] text-fog uppercase ${focus}`}
              onClick={() => setOpen(false)}
            >
              Close
              <span aria-hidden className="relative h-3 w-4">
                <span className="absolute top-1.5 left-0 h-px w-full rotate-45 bg-fog" />
                <span className="absolute top-1.5 left-0 h-px w-full -rotate-45 bg-fog" />
              </span>
            </button>
          </div>
          <nav aria-label="Primary" className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-8 pb-8">
            <ul>
              {[{ href: "/", label: "Home" }, ...NAV_LINKS].map((link, index) => {
                const active = link.href === "/" ? pathname === "/" : isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex items-end gap-5 border-b border-line py-5 ${focus}`}
                    >
                      <span className="text-[1.4rem] leading-none font-medium tracking-[-0.04em] text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={`pb-0.5 text-[1.6rem] leading-none font-bold tracking-tight ${active ? "text-accent" : "text-fog"}`}>
                        {link.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto pt-10">
              <Link
                href="/start-a-project"
                onClick={() => setOpen(false)}
                className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-purple px-6 text-sm font-medium text-white transition hover:bg-violet ${focus}`}
              >
                Start a Project
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
