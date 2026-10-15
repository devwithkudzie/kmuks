import Image from "next/image";
import logo from "../../public/kudziemuks-logo.png";
import logoDark from "../../public/kudziemuks-logo-dark.png";

/**
 * The "kudziemuks." wordmark with a purple dot on a transparent background.
 * `tone="light"` (white letters) is for dark surfaces; `tone="dark"` for light ones.
 * Size it with a height class, e.g. `h-6`; width follows.
 */
export function Logo({
  className = "h-6",
  preload = false,
  tone = "light",
}: {
  className?: string;
  preload?: boolean;
  tone?: "light" | "dark";
}) {
  // 280×40 covers the largest use (~32px tall) at 2x screens; smaller uses scale down.
  return (
    <Image
      src={tone === "dark" ? logoDark : logo}
      alt="kudziemuks"
      width={280}
      height={40}
      preload={preload}
      className={`w-auto object-contain ${className}`}
    />
  );
}
