import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
} from "@/components/hero/BrandIcons";

const channels = [
  { name: "LinkedIn", Icon: LinkedInIcon },
  { name: "X", Icon: XIcon },
  { name: "Instagram", Icon: InstagramIcon },
  { name: "Facebook", Icon: FacebookIcon },
  { name: "TikTok", Icon: TikTokIcon },
] as const;

export function HeroChannels() {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 text-sm text-mist">
      {channels.map(({ name, Icon }) => (
        <span key={name} className="inline-flex items-center gap-2">
          <Icon className="size-4 shrink-0" />
          <span>{name}</span>
        </span>
      ))}
      <span className="inline-flex items-center text-mist">
        <span className="mr-1.5 text-purple" aria-hidden>
          +
        </span>
        Landing pages &amp; conversion journeys
      </span>
    </div>
  );
}
