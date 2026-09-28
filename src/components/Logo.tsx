import Image from "next/image";
import logo from "../../public/kudziemuks-logo.png";

/**
 * The "kudziemuks." wordmark (white with a purple dot, transparent background),
 * for dark surfaces. Size it with a height class, e.g. `h-6`; width follows.
 */
export function Logo({ className = "h-6", preload = false }: { className?: string; preload?: boolean }) {
  // 280×40 covers the largest use (~32px tall) at 2x screens; smaller uses scale down.
  return <Image src={logo} alt="kudziemuks" width={280} height={40} preload={preload} className={`w-auto object-contain ${className}`} />;
}
