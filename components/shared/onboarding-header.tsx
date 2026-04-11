import Image from "next/image";
import Link from "next/link";

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function OnboardingHeader() {
  return (
    <header className="w-full h-16 bg-white/90 backdrop-blur-md flex items-center justify-between px-6 border-b border-gray-100 sticky top-0 z-30">
      <Link href="/" aria-label="Home" className="flex items-center">
        <Image src="/Logo.svg" alt="Rooftop" width={110} height={34} className="object-contain" priority />
      </Link>
      <Link href="/menu" aria-label="Open menu" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
        <MenuIcon className="w-6 h-6 text-gray-700" />
      </Link>
    </header>
  );
}
