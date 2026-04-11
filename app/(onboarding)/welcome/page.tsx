import OnboardingHeader from "@/components/shared/onboarding-header";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F1F9F7]">
      <OnboardingHeader />

      {/* Accent strip */}
      <div className="w-full h-1.5 bg-gradient-to-r from-[#7BDFF2] via-[#B2F7EF] to-[#F2B5D4]" />

      <main className="flex-1 flex flex-col justify-center p-8 md:p-12 max-w-xl mx-auto w-full space-y-10">
        <div className="space-y-5">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-[#7BDFF2]">
            Rooftop
          </span>
          <h1 className="text-5xl font-[family-name:var(--font-overlock)] font-bold text-gray-900 leading-tight">
            Welcome
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We&apos;re glad you&apos;re here. Let&apos;s take a moment to get you settled into the rooftop.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 space-y-3">
          {[
            "Safe & private space for you",
            "AI-guided check-ins & journaling",
            "Your own support network",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-gray-700">
              <span className="w-2 h-2 rounded-full bg-[#7BDFF2] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <Link
          href="/disclaimer"
          className="inline-flex items-center justify-center w-full max-w-xs px-10 py-4 bg-gray-900 text-white rounded-2xl text-lg font-medium hover:bg-black transition-all active:scale-[0.98]"
        >
          Let&apos;s go
        </Link>
      </main>
    </div>
  );
}
