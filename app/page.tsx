import Link from "next/link";
import Image from "next/image";
import { HeartAnimation } from "@/components/HeartAnimation";

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
    <div className="flex min-h-screen flex-col bg-white font-comfortaa text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      {/* Background Animation */}
      <HeartAnimation />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white/10 backdrop-blur-md dark:bg-zinc-950/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.svg"
              alt="Rooftop Logo"
              width={64}
              height={64}
              className="dark:invert"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/chat"
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-black hover:opacity-90 transition-all shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-24 text-center lg:py-32">
        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Safe spaces for <br />
            <span className="text-accent">real conversations.</span>
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl max-w-2xl mx-auto font-medium">
            Join secure, peer-led support groups facilitated by our 24/7 AI Assistant. 
            Connect with others who understand your journey, share your story, and heal together on your own terms.
          </p>
          
          {error && (
            <div className="mt-8 w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-left text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 backdrop-blur-sm">
              <p className="text-lg font-bold">Authentication issue</p>
              <p className="mt-2 text-red-600 dark:text-red-300/80">{decodeURIComponent(errorDescription || error)}</p>
              <Link href="/login" className="mt-4 inline-block font-bold underline underline-offset-4">
                Try logging in again
              </Link>
            </div>
          )}

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Link
              href="/chat"
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-brand px-10 text-lg font-black text-black shadow-xl shadow-brand/20 transition-all hover:scale-105 hover:opacity-90 dark:shadow-brand/10 sm:w-auto"
            >
              Start Chatting
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/login"
              className="flex h-14 w-full items-center justify-center rounded-full border border-zinc-200 bg-white/50 backdrop-blur-sm px-10 text-lg font-bold transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 sm:w-auto"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-100 bg-white/50 py-12 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center">
            <Image
              src="/Logo.svg"
              alt="Rooftop Logo"
              width={32}
              height={32}
              className="dark:invert"
            />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            © {new Date().getFullYear()} Rooftop. Private & Secure.
          </p>
        </div>
      </footer>
    </div>
  );
}
}
