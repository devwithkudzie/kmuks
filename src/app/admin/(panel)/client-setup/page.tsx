import { BUILT_IN_TEMPLATES } from "@/lib/client-setup/templates";
import type { Metadata } from "next";
import { requireAdminOrRedirect } from "@/lib/admin/auth";
import { AdminLinksManager } from "@/components/admin/AdminLinksManager";
import { listSetupLinkViews } from "@/lib/client-setup/links-service";
import { GoogleConfigError } from "@/lib/google/auth";
import { getSetupBaseUrl } from "@/lib/client-setup/base-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin · Client Setup",
  robots: { index: false, follow: false },
};

export default async function AdminClientSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ create?: string }>;
}) {
  const { create } = await searchParams;
  // Independently verified here even though proxy.ts already protects this
  // route — sensitive admin pages should never rely on the gate alone.
  await requireAdminOrRedirect("/admin/client-setup");

  let links: Awaited<ReturnType<typeof listSetupLinkViews>> = [];
  let configError: string | undefined;

  try {
    links = await listSetupLinkViews();
  } catch (error) {
    console.error("[admin/client-setup] could not load setup links:", error);
    configError =
      error instanceof GoogleConfigError
        ? `Google Cloud isn't fully configured yet — ${error.message}.`
        : "Couldn't load your setup links from Google Sheets right now. This is usually a short Google rate limit; wait a minute and retry.";
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs font-medium tracking-[0.24em] text-purple uppercase">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Client Setup Links
          </h1>
          <p className="mt-3 text-sm text-mist">Create and manage client setup links.</p>
        </div>
      </header>

      {configError ? (
        <div role="alert" className="mt-8 rounded-md bg-purple/10 px-4 py-3 text-sm text-fog">
          <p>{configError}</p>
          <a href={`/admin/client-setup${create ? `?create=${encodeURIComponent(create)}` : ""}`} className="mt-3 inline-block font-medium text-purple">
            Retry
          </a>
        </div>
      ) : (
        <AdminLinksManager
          templates={BUILT_IN_TEMPLATES}
          initialLinks={links}
          baseUrl={getSetupBaseUrl()}
          createTemplateId={BUILT_IN_TEMPLATES.some((template) => template.id === create) ? create : undefined}
        />
      )}
    </main>
  );
}
