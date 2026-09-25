"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Inbox, LayoutDashboard, Link2, LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { signOutAction } from "@/app/admin/login/actions";
import { focusRing } from "@/components/client-setup/styles";
import { SIDEBAR_COOKIE } from "@/lib/admin/sidebar";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/client-setup", label: "Client Setup Links", icon: Link2 },
  { href: "/admin/responses", label: "Campaign Responses", icon: Inbox },
];

function NavLinks({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-purple/15 text-fog" : "text-mist hover:bg-white/5 hover:text-fog"
              } ${collapsed ? "justify-center" : ""} ${focusRing}`}
            >
              <Icon aria-hidden className={`size-5 shrink-0 ${active ? "text-purple" : ""}`} />
              {collapsed ? <span className="sr-only">{label}</span> : label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SignOutButton({ collapsed }: { collapsed: boolean }) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        title={collapsed ? "Sign Out" : undefined}
        className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-mist transition hover:bg-white/5 hover:text-fog ${
          collapsed ? "justify-center" : ""
        } ${focusRing}`}
      >
        <LogOut aria-hidden className="size-5 shrink-0" />
        {collapsed ? <span className="sr-only">Sign Out</span> : "Sign Out"}
      </button>
    </form>
  );
}

export function AdminSidebar({ initialCollapsed }: { initialCollapsed: boolean }) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    // A cookie (not localStorage) so the server renders the saved width without a flash.
    document.cookie = `${SIDEBAR_COOKIE}=${next ? "1" : "0"}; path=/admin; max-age=31536000; samesite=lax`;
  };

  return (
    <>
      {/* Mobile: top bar with a drawer */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-night px-4 py-3 md:hidden">
        <span className="text-sm font-semibold tracking-wide">Kudzie Muks Admin</span>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className={`rounded-md p-2 text-mist hover:text-fog ${focusRing}`}
        >
          <Menu aria-hidden className="size-5" />
        </button>
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <nav aria-label="Admin navigation" className="relative flex h-full w-64 flex-col bg-night p-4">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold tracking-wide">Kudzie Muks Admin</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className={`rounded-md p-2 text-mist hover:text-fog ${focusRing}`}
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <NavLinks collapsed={false} onNavigate={() => setMobileOpen(false)} />
            <div className="mt-auto">
              <SignOutButton collapsed={false} />
            </div>
          </nav>
        </div>
      ) : null}

      {/* Desktop: collapsible sidebar */}
      <nav
        aria-label="Admin navigation"
        className={`sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-white/10 bg-night p-3 transition-[width] md:flex ${
          collapsed ? "w-[4.5rem]" : "w-64"
        }`}
      >
        <div className={`mb-6 flex items-center ${collapsed ? "justify-center" : "justify-between pl-3"}`}>
          {collapsed ? null : <span className="text-sm font-semibold tracking-wide">Kudzie Muks Admin</span>}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className={`rounded-md p-2 text-mist hover:bg-white/5 hover:text-fog ${focusRing}`}
          >
            {collapsed ? <PanelLeftOpen aria-hidden className="size-5" /> : <PanelLeftClose aria-hidden className="size-5" />}
          </button>
        </div>
        <NavLinks collapsed={collapsed} />
        <div className="mt-auto">
          <SignOutButton collapsed={collapsed} />
        </div>
      </nav>
    </>
  );
}
