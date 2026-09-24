import type { Metadata } from "next";
import { requireAdminOrRedirect } from "@/lib/admin/auth";
import { signOutAction } from "@/app/admin/login/actions";
import { focusRing } from "@/components/client-setup/styles";
import { AdminLinksManager } from "@/components/admin/AdminLinksManager";
import { listSetupLinkViews } from "@/lib/client-setup/links-service";
import { GoogleConfigError } from "@/lib/google/auth";
import { getSetupBaseUrl } from "@/lib/client-setup/base-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin · Client Setup",
  robots: { index: false, follow: false },
};

export default async function AdminClientSetupPage() {
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
        : "Couldn't load setup links right now. Check the server logs for details.";
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.7rem] font-medium tracking-[0.24em] text-purple uppercase">
            Admin
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-fog sm:text-3xl">
            Client Setup Links
          </h1>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className={`text-sm font-medium text-mist transition hover:text-fog ${focusRing}`}
          >
            Sign Out
          </button>
        </form>
      </div>

      {configError ? (
        <p className="mt-8 rounded-md bg-purple/10 px-4 py-3 text-sm text-fog">{configError}</p>
      ) : (
        <AdminLinksManager initialLinks={links} baseUrl={getSetupBaseUrl()} />
      )}
    </div>
  );
}
