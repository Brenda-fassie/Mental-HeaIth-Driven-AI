import OnboardingHeader from "@/components/shared/onboarding-header";
import Link from "next/link";

const nudges = [
  {
    title: "Sarah noticed a 3-day gap",
    body: "Want a 60-second reset check-in?",
    time: "2h ago",
    tone: "bg-[#B2F7EF]",
  },
  {
    title: "Glimmer reminder",
    body: "Capture one good moment from today.",
    time: "Yesterday",
    tone: "bg-[#7BDFF2]",
  },
  {
    title: "Reflection streak",
    body: "You logged 5 check-ins this week. Keep the rhythm.",
    time: "2 days ago",
    tone: "bg-[#F2B5D4]",
  },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OnboardingHeader />

      <main className="flex-1 p-4 md:p-8">
        <section className="mx-auto w-full max-w-4xl rounded-3xl bg-card border border-border p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7BDFF2]">Notifications</p>
            <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-overlock)] font-bold text-card-foreground mt-2">Sarah&apos;s nudges</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">A timeline of gentle check-ins and reminders.</p>
          </div>

          <div className="space-y-3">
            {nudges.map((nudge) => (
              <article key={nudge.title} className="rounded-2xl border border-border p-4 md:p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <p className="font-medium text-card-foreground">{nudge.title}</p>
                    <p className="text-sm text-muted-foreground">{nudge.body}</p>
                  </div>
                  <span className={`h-3 w-3 rounded-full mt-1 shrink-0 ${nudge.tone}`} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{nudge.time}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/settings"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#7BDFF2] text-gray-900 rounded-2xl text-lg font-semibold hover:bg-[#5ED4E8] transition-colors active:scale-[0.98]"
            >
              Next
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
