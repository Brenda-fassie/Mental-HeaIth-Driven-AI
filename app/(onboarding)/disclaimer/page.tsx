import OnboardingHeader from "@/components/shared/onboarding-header";
import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <OnboardingHeader />

      <div className="w-full h-1.5 bg-gradient-to-r from-[#F2B5D4] via-[#7BDFF2] to-[#B2F7EF]" />

      <main className="flex-1 flex flex-col justify-center p-8 md:p-12 max-w-xl mx-auto w-full space-y-10">
        <div className="space-y-5">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-[#F2B5D4]">
            Before we begin
          </span>
          <h1 className="text-4xl font-[family-name:var(--font-overlock)] font-bold text-foreground">
            Important Disclaimer
          </h1>
        </div>

        <div className="rounded-3xl bg-card border border-border shadow-sm p-6 md:p-8 space-y-5 text-card-foreground leading-relaxed">
          <p>
            Rooftop is a mental wellness support tool, not a clinical replacement for professional therapy, medical diagnosis, or emergency services.
          </p>
          <hr className="border-border" />
          <p>
            If you are in immediate danger or experiencing a crisis, please contact your local emergency services or a crisis hotline immediately.
          </p>
        </div>

        <Link
          href="/profile"
          className="inline-flex items-center justify-center w-full max-w-xs px-10 py-4 bg-foreground text-background rounded-2xl text-lg font-medium hover:opacity-90 transition-all active:scale-[0.98]"
        >
          I understand
        </Link>
      </main>
    </div>
  );
}
