import Link from "next/link";

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function OnboardingHeader() {
  return (
    <header className="w-full h-16 bg-[#D9D9D9] flex items-center justify-end px-6 border-b border-gray-300">
      <Link href="/menu" aria-label="Open menu">
        <MenuIcon className="w-9 h-9 text-black hover:scale-110 transition-transform cursor-pointer" />
      </Link>
    </header>
  );
}
