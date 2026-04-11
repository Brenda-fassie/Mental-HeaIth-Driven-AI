import Image from "next/image";
import Link from "next/link";

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function MenuPage() {
  const menuItems = [
    { name: "Profile", href: "/profile" },
    { name: "Gallery", href: "/gallery" },
    { name: "Conversations", href: "/chat" },
    { name: "Dailies", href: "/dailies" },
    { name: "Calendar", href: "/calendar" },
    { name: "Contacts", href: "/contacts" },
    { name: "Notifications", href: "/notifications" },
    { name: "Customizations", href: "/settings" },
  ];

  return (
    <main className="min-h-screen bg-[#F1F9F7] flex flex-col">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-6 pt-6 pb-4">
        <Link href="/" aria-label="Home">
          <Image src="/Logo.svg" alt="Rooftop" width={110} height={34} className="object-contain" />
        </Link>
        <Link href="/chat" aria-label="Close menu" className="p-2 rounded-xl hover:bg-white/60 transition-colors">
          <CloseIcon className="w-7 h-7 text-gray-800" />
        </Link>
      </div>

      {/* Menu card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-8">
        <div className="w-full max-w-sm bg-[#7BDFF2] rounded-3xl shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-teal-800/60">Menu</p>
            <h2 className="text-3xl font-[family-name:var(--font-overlock)] font-bold text-gray-900 mt-1">
              Sarah&apos;s
            </h2>
          </div>

          <nav className="px-8 pb-8 flex flex-col">
            {menuItems.map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between py-3.5 text-xl font-medium text-gray-900 hover:text-white hover:translate-x-1 transition-all duration-200 ${i < menuItems.length - 1 ? "border-b border-teal-400/40" : ""}`}
              >
                {item.name}
                <span className="text-teal-700/50 text-lg">›</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
