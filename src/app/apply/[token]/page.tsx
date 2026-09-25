import type { Metadata } from "next";

// Public campaigns share the setup-link page; this is just a friendlier URL to post.
export { default } from "@/app/client/setup/[token]/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Apply",
  robots: { index: false, follow: false },
};
