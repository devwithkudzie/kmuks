import { site } from "@/lib/site";
import { WhatsAppButton } from "@/components/WhatsAppIntake";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-canvas pb-24 text-mist sm:pb-0">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <p className="font-script text-2xl text-fog">Kudzie Muks</p>
        <div className="flex flex-wrap gap-6 text-sm">
          <a
            href={site.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-fog"
          >
            LinkedIn
          </a>
          <a
            href={site.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-fog"
          >
            Audit
          </a>
          <WhatsAppButton
            source="footer"
            className="bg-transparent p-0 text-inherit transition hover:text-fog"
          >
            WhatsApp
          </WhatsAppButton>
        </div>
        <p className="text-xs text-mist/60">
          © {new Date().getFullYear()} kudziemuks
        </p>
      </div>
    </footer>
  );
}