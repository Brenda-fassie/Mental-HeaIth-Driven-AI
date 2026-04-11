import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function Home() {
  const features = [
    "Journaling",
    "Conversations",
    "Personalization",
    "Memory",
    "Collaboration",
  ];

  return (
    <main className="relative min-h-screen bg-[#F1F9F7] dark:bg-background flex flex-col md:flex-row items-center justify-center px-6 md:px-20 overflow-hidden">
      {/* Theme toggle — top right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Birds decoration — desktop only */}
      <div className="hidden md:block absolute top-10 right-10 md:top-20 md:right-40 w-32 opacity-80">
        <Image src="/Birds.svg" alt="Birds" width={150} height={100} />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-16 items-center py-10 md:py-0">

        {/* Illustration — sits between text and CTA on mobile */}
        <div className="order-2 md:order-2 flex justify-center items-center md:justify-end mt-2 md:mt-0">
          <div className="relative w-[95vw] max-w-md md:w-[150vw] lg:w-[170vw] md:-mr-[40%] lg:-mr-[50%] aspect-square transition-transform duration-700 hover:scale-105">
            <Image
              src="/Onboard.svg"
              alt="Mental Wellness Illustration"
              fill
              className="object-contain dark:opacity-90"
              priority
            />
          </div>
        </div>

        {/* Text + CTA */}
        <div className="order-1 md:order-1 flex flex-col space-y-6 md:space-y-10 items-start text-left">
          {/* Logo */}
          <div className="relative w-44 md:w-60">
            <Image
              src="/Logo.svg"
              alt="Rooftop"
              width={300}
              height={100}
              className="object-contain dark:invert"
            />
          </div>

          {/* Heading + tagline — visible on ALL breakpoints */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-foreground leading-[1.1] font-[family-name:var(--font-overlock)]">
              Mental Wellness
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground leading-snug max-w-sm">
              The realest conversations happen on the rooftop
            </p>

            <ul className="text-sm md:text-base text-muted-foreground space-y-1.5">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7BDFF2] inline-block" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="w-full md:w-auto">
            <Link
              href="/signup"
              className="inline-flex w-full max-w-xs md:w-auto items-center justify-center px-10 py-3.5 bg-[#7BDFF2] text-gray-900 rounded-2xl text-xl font-semibold hover:bg-[#5ED4E8] transition-colors duration-200 active:scale-[0.98]"
            >
              Start today
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
