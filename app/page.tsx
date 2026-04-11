import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const features = [
    "Journaling",
    "Conversations",
    "Personalization",
    "Memory",
    "Collaboration",
  ];

  return (
    <main className="relative min-h-screen bg-[#F1F9F7] md:bg-white flex flex-col md:flex-row items-center justify-center px-6 md:px-20 overflow-hidden">
      {/* Birds decoration — desktop only */}
      <div className="hidden md:block absolute top-10 right-10 md:top-20 md:right-40 w-32 opacity-80">
        <Image src="/Birds.svg" alt="Birds" width={150} height={100} />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-16 items-center py-10 md:py-0">

        {/* Illustration — sits between text and CTA on mobile */}
        <div className="order-2 md:order-2 flex justify-center items-center md:justify-end mt-2 md:mt-0">
          <div className="relative w-[90vw] max-w-sm md:w-[140vw] lg:w-[160vw] md:-mr-[40%] lg:-mr-[50%] aspect-square transition-transform duration-700 hover:scale-105">
            <Image
              src="/Onboard.svg"
              alt="Mental Wellness Illustration"
              fill
              className="object-contain"
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
              className="object-contain"
            />
          </div>

          {/* Heading + tagline — visible on ALL breakpoints */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-gray-900 leading-[1.1] font-[family-name:var(--font-overlock)]">
              Mental Wellness
            </h1>
            <p className="text-lg md:text-2xl text-gray-600 leading-snug max-w-sm">
              The realest conversations happen on the rooftop
            </p>

            <ul className="text-sm md:text-base text-gray-400 space-y-1.5">
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
              className="group relative inline-flex w-full max-w-xs md:w-auto items-center justify-center px-10 py-3.5 border border-black text-xl font-medium tracking-wide text-black overflow-hidden transition-colors duration-300 ease-in-out"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Start today
              </span>
              <div className="absolute inset-0 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
