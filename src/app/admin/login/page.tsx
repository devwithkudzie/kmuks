import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

function isSafeNextPath(value?: string): value is string {
  return typeof value === "string" && value.startsWith("/admin") && !value.startsWith("//");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = isSafeNextPath(next) ? next : "/admin";

  return (
    <div className="mx-auto flex min-h-full max-w-sm flex-col justify-center px-5 py-24">
      <Logo className="h-7 self-start" preload />
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-fog">Admin Access</h1>
      <LoginForm next={safeNext} />
    </div>
  );
}
