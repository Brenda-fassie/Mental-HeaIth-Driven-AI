import OnboardingHeader from "@/components/shared/onboarding-header";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <OnboardingHeader />

      <div className="w-full h-1.5 bg-gradient-to-r from-[#7BDFF2] via-[#B2F7EF] to-[#F2B5D4]" />

      <main className="flex-1 flex flex-col justify-center p-8 md:p-12 max-w-xl mx-auto w-full space-y-10">
        <div className="space-y-4">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-[#7BDFF2]">
            Step 1 of 1
          </span>
          <h1 className="text-4xl font-[family-name:var(--font-overlock)] font-bold text-foreground">
            Create your profile
          </h1>
          <p className="text-lg text-muted-foreground">
            How should we address you on the rooftop?
          </p>
        </div>

        <div className="rounded-3xl bg-card border border-border shadow-sm p-6 space-y-4">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Username
          </label>
          <input
            type="text"
            placeholder="Choose a display name"
            className="w-full bg-muted rounded-2xl px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground border border-transparent focus:outline-none focus:ring-2 focus:ring-[#7BDFF2] transition-all"
          />
        </div>

        <Link
          href="/contacts"
          className="inline-flex items-center justify-center w-full max-w-xs px-10 py-4 bg-foreground text-background rounded-2xl text-lg font-medium hover:opacity-90 transition-all active:scale-[0.98]"
        >
          Next
        </Link>
      </main>
    </div>
  );
}
