import Link from "next/link";
import Image from "next/image";
import { HeroAnimation } from "@/components/HeroAnimation";

type HomeProps = {
  searchParams: Promise<{
    error?: string;
    error_description?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const error = params.error;
  const errorDescription = params.error_description;

  return (
    <div className="flex min-h-screen flex-col bg-black font-sans text-zinc-900 antialiased dark:text-zinc-50">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.svg"
              alt="Rooftop Logo"
              width={48}
              height={48}
              className="dark:invert"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/chat"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-zinc-200 transition-all shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content (Animation only) */}
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroAnimation />
        </div>
        
        {/* Error overlay if auth fails */}
        {error && (
          <div className="relative z-20 mt-32 w-full max-w-lg rounded-2xl border border-red-900/50 bg-red-950/40 p-6 text-left text-sm text-red-200 backdrop-blur-md">
            <p className="text-lg font-bold">Authentication issue</p>
            <p className="mt-2 text-red-300/80">{decodeURIComponent(errorDescription || error)}</p>
            <Link href="/login" className="mt-4 inline-block font-bold text-white underline underline-offset-4">
              Try logging in again
            </Link>
          </div>
        )}

        {/* Floating CTA to keep the focus on the cat */}
        <div className="absolute bottom-12 z-20">
           <Link
              href="/chat"
              className="group flex h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-10 text-lg font-black text-white shadow-2xl shadow-blue-900/40 transition-all hover:scale-105 hover:bg-blue-700 active:scale-95"
            >
              Join the Circle
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer className="relative z-10 bg-transparent py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center opacity-40 hover:opacity-100 transition-opacity">
            <Image
              src="/Logo.svg"
              alt="Rooftop Logo"
              width={28}
              height={28}
              className="dark:invert"
            />
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
            © {new Date().getFullYear()} Rooftop. Private & Secure.
          </p>
        </div>
      </footer>
    </div>
  );
}
