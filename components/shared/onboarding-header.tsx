import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

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
    <header className="w-full h-16 bg-background/90 backdrop-blur-md flex items-center justify-between px-6 border-b border-border sticky top-0 z-30">
      <Link href="/" aria-label="Home" className="flex items-center">
        <Image src="/Logo.svg" alt="Rooftop" width={110} height={34} className="object-contain dark:invert" priority />
      </Link>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Link href="/menu" aria-label="Open menu" className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <MenuIcon className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
