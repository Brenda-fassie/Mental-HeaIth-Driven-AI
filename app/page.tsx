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
    <main className="relative min-h-screen bg-[#F1F9F7] md:bg-white flex flex-col md:flex-row items-center justify-center px-8 md:px-20 overflow-hidden">
      <div className="hidden md:block absolute top-10 right-10 md:top-20 md:right-40 w-32 opacity-80">
        <Image src="/Birds.svg" alt="Birds" width={150} height={100} />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center py-12 md:py-0">
        <div className="order-1 md:order-2 flex justify-center items-center md:justify-end">
          <div className="relative w-[120vw] md:w-[140vw] lg:w-[160vw] md:-mr-[40%] lg:-mr-[50%] -mb-[10%] md:mb-0 aspect-square transition-transform duration-700 hover:scale-105">
            <Image
              src="/Onboard.svg"
              alt="Mental Wellness Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="order-2 md:order-1 flex flex-col space-y-8 md:space-y-10 items-start text-left">
          <div className="relative w-55 md:w-70">
            <Image
              src="/Logo.svg"
              alt="Rooftop"
              width={300}
              height={100}
              className="object-contain"
            />
          </div>

          <div className="hidden md:block space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 leading-[1.1]">
              Mental Wellness
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-snug max-w-sm">
              The realest conversations happen on the rooftop
            </p>
            
            <ul className="pt-2 text-base md:text-lg text-gray-500 space-y-1">
              {features.map((item) => (
                <li key={item} className="flex items-center">
                  <span className="mr-3 text-gray-400">.</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 w-full md:w-auto flex justify-center md:justify-start">
            <Link 
              href="/signup" 
              className="group relative w-full max-w-70 md:w-auto px-10 py-3 md:py-2.5 border border-black text-2xl font-medium tracking-wide text-center text-black overflow-hidden transition-colors duration-300 ease-in-out"
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
