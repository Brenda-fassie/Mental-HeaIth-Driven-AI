import Link from "next/link";

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
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
    <main className="min-h-screen bg-white flex flex-col items-center justify-start p-4 md:p-12">
      <div className="w-full max-w-4xl flex justify-end mb-4">
        <Link href="/profile" aria-label="Close menu">
          <CloseIcon className="w-12 h-12 text-black hover:rotate-90 transition-transform duration-300" />
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#86E3F0] p-10 md:p-16 shadow-lg">
        <h2 className="text-3xl font-medium text-gray-800 mb-10">Sarah&apos;s</h2>

        <nav className="flex flex-col gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-2xl font-normal text-gray-900 hover:pl-4 hover:text-white transition-all duration-200 border-b border-black/10 pb-2 last:border-0"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
