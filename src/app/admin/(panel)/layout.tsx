import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SIDEBAR_COOKIE } from "@/lib/admin/sidebar";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const collapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === "1";
  return (
    <div className="md:flex">
      <AdminSidebar initialCollapsed={collapsed} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
